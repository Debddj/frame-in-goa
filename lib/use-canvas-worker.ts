"use client";

import { useCallback, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { theme, themePalettes } from "./theme";
import { drawBoardingPass, drawPortholeFrame } from "./canvas-engine";
import type { BoardingPassData, CardFormat } from "./types";
import type { RenderRequest, RenderResponse } from "../workers/canvas-worker";

interface RenderOptions {
  format: CardFormat;
  boardingPassData: BoardingPassData;
  builderNumber: string;
}

async function generateQrBitmap(payload: string, size: number, darkColor = "#0A2416"): Promise<ImageBitmap> {
  const dataUrl = await QRCode.toDataURL(payload, {
    margin: 0,
    width: size,
    color: { dark: darkColor, light: "#00000000" },
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
    try {
      if (typeof OffscreenCanvas !== "undefined" && typeof Worker !== "undefined") {
        const worker = new Worker(
          new URL("../workers/canvas-worker.ts", import.meta.url)
        );
        workerRef.current = worker;
        supportsOffscreen.current = true;
      }
    } catch {
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
      const themePreset = boardingPassData.themePreset || "palmEmerald";
      const pal = themePalettes[themePreset] || themePalettes.palmEmerald;

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
            themePreset,
            characterPhoto: p?.characterPhoto ?? undefined,
          };
        } else {
          const stubW = (theme.export.boardingPass.w - 80) * 0.26;
          const qrSize = Math.min(stubW - 60, 240);
          let qrBitmap: ImageBitmap | undefined;
          try {
            qrBitmap = await generateQrBitmap(
              boardingPassData.qrPayload,
              qrSize,
              pal.navy
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
                characterPhoto: p.characterPhoto ?? undefined,
                customMotto: p.customMotto,
              })),
              seat: boardingPassData.seat,
              gate: boardingPassData.gate,
              flightCode: boardingPassData.flightCode,
              qrBitmap,
              isTeam: boardingPassData.passengers.length > 1,
              themePreset,
              stickerPreset: boardingPassData.stickerPreset,
            },
          };
        }

        const transferables: Transferable[] = [];
        if (msg.photo) transferables.push(msg.photo);
        if (msg.characterPhoto) transferables.push(msg.characterPhoto);
        if (msg.boardingPass?.qrBitmap) transferables.push(msg.boardingPass.qrBitmap);
        msg.boardingPass?.passengers.forEach((p) => {
          if (p.photo) transferables.push(p.photo);
          if (p.characterPhoto) transferables.push(p.characterPhoto);
        });

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

      // Main-thread fallback
      if (format === "porthole") {
        drawPortholeFrame(
          canvas,
          boardingPassData.passengers[0]?.photo ?? null,
          builderNumber,
          boardingPassData.passengers[0]?.faceCenter,
          themePreset,
          boardingPassData.passengers[0]?.characterPhoto ?? null
        );
        return;
      }

      await drawBoardingPass(canvas, boardingPassData);
    },
    [canvasRef]
  );

  return render;
}
