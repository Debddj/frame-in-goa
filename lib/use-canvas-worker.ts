/**
 * React hook that manages the OffscreenCanvas Web Worker lifecycle.
 *
 * Renders boarding pass / porthole frames off the main thread using
 * transferable ImageBitmaps (zero-copy). Falls back to main-thread
 * rendering when OffscreenCanvas isn't supported (Safari < 16.4,
 * or environments where workers can't be constructed).
 *
 * Usage:
 *   const render = useCanvasWorker(canvasRef);
 *   render({ format: "porthole", ... });
 */

"use client";

import { useCallback, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { theme } from "./theme";
import { drawBoardingPass, drawPortholeFrame } from "./canvas-engine";
import type { BoardingPassData, CardFormat } from "./types";
import type { RenderRequest, RenderResponse } from "../workers/canvas-worker";

interface RenderOptions {
  format: CardFormat;
  boardingPassData: BoardingPassData;
  builderNumber: string;
}

/**
 * Generates a QR code as an ImageBitmap on the main thread.
 * The worker can't use the `qrcode` library (relies on DOM canvas),
 * so we pre-render it and transfer the bitmap.
 */
async function generateQrBitmap(payload: string, size: number): Promise<ImageBitmap> {
  const T = theme.color;
  const dataUrl = await QRCode.toDataURL(payload, {
    margin: 0,
    width: size,
    color: { dark: T.navy, light: "#00000000" },
  });
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return createImageBitmap(blob);
}

export function useCanvasWorker(
  canvasRef: React.RefObject<HTMLCanvasElement | null>
) {
  const workerRef = useRef<Worker | null>(null);
  const supportsOffscreen = useRef<boolean>(false);
  const renderGen = useRef(0);

  useEffect(() => {
    // Feature-detect OffscreenCanvas + Worker support
    try {
      if (typeof OffscreenCanvas !== "undefined" && typeof Worker !== "undefined") {
        const worker = new Worker(
          new URL("../workers/canvas-worker.ts", import.meta.url)
        );
        workerRef.current = worker;
        supportsOffscreen.current = true;
      }
    } catch {
      // Worker construction failed — fall back to main thread
      supportsOffscreen.current = false;
    }

    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  const render = useCallback(
    async (opts: RenderOptions) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const gen = ++renderGen.current;
      const { format, boardingPassData, builderNumber } = opts;

      // ─── Worker path ───────────────────────────────────────────
      if (supportsOffscreen.current && workerRef.current) {
        const worker = workerRef.current;

        let msg: RenderRequest;

        if (format === "porthole") {
          const p = boardingPassData.passengers[0];
          msg = {
            type: "render",
            format: "porthole",
            photo: p?.photo ?? undefined,
            builderNumber,
            faceCenter: p?.faceCenter,
          };
        } else {
          // Pre-render QR on main thread (qrcode uses DOM canvas)
          const stubW = (theme.export.boardingPass.w - 80) * 0.26;
          const qrSize = Math.min(stubW - 60, 260);
          let qrBitmap: ImageBitmap | undefined;
          try {
            qrBitmap = await generateQrBitmap(
              boardingPassData.qrPayload,
              qrSize
            );
          } catch {
            // QR is progressive enhancement
          }

          msg = {
            type: "render",
            format: "boardingPass",
            boardingPass: {
              passengers: boardingPassData.passengers.map((p) => ({
                name: p.name,
                stackOrRole: p.stackOrRole,
                builderTitle: p.builderTitle,
                photo: p.photo ?? undefined,
                faceCenter: p.faceCenter,
              })),
              seat: boardingPassData.seat,
              gate: boardingPassData.gate,
              flightCode: boardingPassData.flightCode,
              qrBitmap,
              isTeam: boardingPassData.passengers.length > 1,
            },
          };
        }

        // Collect transferable ImageBitmaps (zero-copy transfer)
        const transferables: Transferable[] = [];
        if (msg.photo) transferables.push(msg.photo);
        if (msg.boardingPass?.qrBitmap) transferables.push(msg.boardingPass.qrBitmap);
        msg.boardingPass?.passengers.forEach((p) => {
          if (p.photo) transferables.push(p.photo);
        });

        // Since we transfer the bitmaps, we need to re-create them
        // after the worker is done. Store a promise for the response.
        return new Promise<void>((resolve) => {
          const handler = (e: MessageEvent<RenderResponse>) => {
            if (gen !== renderGen.current) {
              resolve();
              return;
            }

            const ctx = canvas.getContext("2d");
            if (!ctx) {
              resolve();
              return;
            }

            const { bitmap } = e.data;
            canvas.width = bitmap.width;
            canvas.height = bitmap.height;
            ctx.drawImage(bitmap, 0, 0);
            bitmap.close();
            resolve();
          };

          worker.onmessage = handler;
          worker.postMessage(msg, transferables);
        });
      }

      // ─── Fallback: main-thread rendering ────────────────────────
      if (format === "porthole") {
        drawPortholeFrame(
          canvas,
          boardingPassData.passengers[0]?.photo ?? null,
          builderNumber,
          boardingPassData.passengers[0]?.faceCenter
        );
        return;
      }

      await drawBoardingPass(canvas, boardingPassData);
    },
    [canvasRef]
  );

  return render;
}
