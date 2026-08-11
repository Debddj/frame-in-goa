/**
 * Web Worker that composites boarding pass / porthole frames on an
 * OffscreenCanvas, keeping the UI thread free. The worker receives
 * ImageBitmaps (zero-copy transferable objects) and all the scalar data
 * needed to render, then sends back the rendered result as an ImageBitmap.
 *
 * Falls back gracefully — if OffscreenCanvas isn't available, the hook
 * that manages this worker simply runs the drawing functions on the main
 * thread instead. See `use-canvas-worker.ts`.
 */

import { theme } from "../lib/theme";
import { getCropStrategy } from "../lib/smart-crop";
import { generateNoiseTexture } from "../lib/noise-texture";
import type { FaceCenter } from "../lib/face-detector";

// We can't import qrcode in the worker (it uses DOM APIs for canvas).
// The QR is drawn from pre-generated pixel data passed in from main thread.

const T = theme.color;

// ─── Message Protocol ────────────────────────────────────────────────────

export interface RenderRequest {
  type: "render";
  format: "boardingPass" | "porthole";
  // Porthole data
  photo?: ImageBitmap;
  builderNumber?: string;
  faceCenter?: FaceCenter | null;
  // Boarding pass scalar data
  boardingPass?: {
    passengers: Array<{
      name: string;
      stackOrRole: string;
      builderTitle: string;
      photo?: ImageBitmap;
      faceCenter?: FaceCenter | null;
    }>;
    seat: string;
    gate: string;
    flightCode: string;
    qrBitmap?: ImageBitmap; // Pre-rendered QR from the main thread
    isTeam: boolean;
  };
}

export interface RenderResponse {
  type: "rendered";
  bitmap: ImageBitmap;
}

// ─── Shared Helpers (duplicated from canvas-engine for worker isolation) ──

function roundRectPath(
  ctx: OffscreenCanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawCropped(
  ctx: OffscreenCanvasRenderingContext2D,
  bitmap: ImageBitmap,
  dx: number, dy: number, dw: number, dh: number,
  faceCenter?: FaceCenter | null
) {
  const crop = getCropStrategy(faceCenter)(bitmap.width, bitmap.height, dw / dh);
  ctx.drawImage(bitmap, crop.sx, crop.sy, crop.sWidth, crop.sHeight, dx, dy, dw, dh);
}

function drawCircularPhoto(
  ctx: OffscreenCanvasRenderingContext2D,
  bitmap: ImageBitmap | undefined,
  cx: number, cy: number, radius: number,
  faceCenter?: FaceCenter | null
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();
  if (bitmap) {
    drawCropped(ctx, bitmap, cx - radius, cy - radius, radius * 2, radius * 2, faceCenter);
  } else {
    ctx.fillStyle = T.sand;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
  }
  ctx.restore();
}

function drawPerforation(
  ctx: OffscreenCanvasRenderingContext2D,
  x: number, yTop: number, yBottom: number
) {
  ctx.save();
  ctx.strokeStyle = T.sandDark;
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 8]);
  ctx.beginPath();
  ctx.moveTo(x, yTop + 14);
  ctx.lineTo(x, yBottom - 14);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.fillStyle = T.ink;
  ctx.beginPath();
  ctx.arc(x, yTop, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, yBottom, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function applyNoiseOverlayWorker(
  ctx: OffscreenCanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, alpha = 18
) {
  const noise = generateNoiseTexture(w, h, alpha);
  const tempCanvas = new OffscreenCanvas(w, h);
  const tempCtx = tempCanvas.getContext("2d")!;
  tempCtx.putImageData(noise, 0, 0);
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.globalAlpha = 0.4;
  ctx.drawImage(tempCanvas, x, y);
  ctx.restore();
}

function wrapOrFit(
  ctx: OffscreenCanvasRenderingContext2D,
  text: string, x: number, y: number, maxWidth: number, startSize: number
) {
  let size = startSize;
  const family = theme.font.display;
  while (size > 16) {
    ctx.font = `600 ${size}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 2;
  }
  ctx.font = `600 ${size}px ${family}`;
  ctx.fillText(text, x, y);
}

// ─── Render functions ────────────────────────────────────────────────────

function renderPorthole(
  canvas: OffscreenCanvas,
  photo: ImageBitmap | undefined,
  builderNumber: string,
  faceCenter?: FaceCenter | null
): ImageBitmap {
  const { w, h } = theme.export.porthole;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = T.ink;
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2 - 20;
  const photoRadius = w * 0.36;

  drawCircularPhoto(ctx, photo, cx, cy, photoRadius, faceCenter);

  // Gradient ring
  ctx.save();
  const ringGrad = ctx.createConicGradient(0, cx, cy);
  ringGrad.addColorStop(0, T.teal);
  ringGrad.addColorStop(0.25, "#167A62");
  ringGrad.addColorStop(0.5, T.teal);
  ringGrad.addColorStop(0.75, "#24A080");
  ringGrad.addColorStop(1, T.teal);
  ctx.strokeStyle = ringGrad;
  ctx.lineWidth = 22;
  ctx.beginPath();
  ctx.arc(cx, cy, photoRadius + 11, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = T.coral;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(cx, cy, photoRadius + 26, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Circular text
  ctx.save();
  ctx.fillStyle = T.sand;
  ctx.font = `600 18px ${theme.font.mono}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const textRadius = photoRadius + 48;
  const chars = "· HH GOA 2026 · BUILDER RESIDENCY ".split("");
  const angleStep = (Math.PI * 2) / chars.length;
  chars.forEach((char, i) => {
    const angle = -Math.PI / 2 + i * angleStep;
    ctx.save();
    ctx.translate(cx + Math.cos(angle) * textRadius, cy + Math.sin(angle) * textRadius);
    ctx.rotate(angle + Math.PI / 2);
    ctx.fillText(char, 0, 0);
    ctx.restore();
  });
  ctx.restore();

  // Badge
  const badgeR = 64;
  const badgeCx = cx + photoRadius * 0.72;
  const badgeCy = cy + photoRadius * 0.72;
  ctx.save();
  ctx.fillStyle = T.teal;
  ctx.beginPath();
  ctx.arc(badgeCx, badgeCy, badgeR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = T.ink;
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.fillStyle = T.cardStock;
  ctx.font = `600 ${badgeR * 0.62}px ${theme.font.mono}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(builderNumber, badgeCx, badgeCy + 2);
  ctx.restore();

  // Bottom tag
  ctx.save();
  ctx.fillStyle = T.sand;
  ctx.font = `500 30px ${theme.font.mono}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("HH GOA · 2026", cx, h - 60);
  ctx.restore();

  return canvas.transferToImageBitmap();
}

function renderBoardingPass(
  canvas: OffscreenCanvas,
  data: RenderRequest["boardingPass"]
): ImageBitmap {
  if (!data) throw new Error("No boarding pass data");

  const { w, h } = theme.export.boardingPass;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = T.ink;
  ctx.fillRect(0, 0, w, h);

  const margin = 40;
  const cardX = margin;
  const cardY = margin;
  const cardW = w - margin * 2;
  const cardH = h - margin * 2;
  const stubSplitX = cardX + cardW * 0.74;

  // Card body
  roundRectPath(ctx, cardX, cardY, cardW, cardH, 28);
  ctx.fillStyle = T.cardStock;
  ctx.fill();

  // Paper grain
  ctx.save();
  roundRectPath(ctx, cardX, cardY, cardW, cardH, 28);
  ctx.clip();
  applyNoiseOverlayWorker(ctx, cardX, cardY, cardW, cardH, 18);
  ctx.restore();

  // Main stub
  const padX = 56;
  const contentX = cardX + padX;
  const contentW = stubSplitX - cardX - padX * 1.4;

  ctx.save();
  roundRectPath(ctx, cardX, cardY, cardW, cardH, 28);
  ctx.clip();

  // Eyebrow
  ctx.fillStyle = T.sandDark;
  ctx.font = `600 20px ${theme.font.mono}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("HH GOA · BUILDER RESIDENCY", contentX, cardY + 56);
  ctx.textAlign = "right";
  ctx.fillText("28–31 OCT", contentX + contentW, cardY + 56);
  ctx.textAlign = "left";

  ctx.strokeStyle = T.coral;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(contentX, cardY + 74);
  ctx.lineTo(contentX + contentW, cardY + 74);
  ctx.stroke();

  const isTeam = data.isTeam;

  if (!isTeam) {
    const p = data.passengers[0];
    const photoR = 90;
    const photoCx = contentX + photoR;
    const photoCy = cardY + 74 + 40 + photoR;
    drawCircularPhoto(ctx, p?.photo, photoCx, photoCy, photoR, p?.faceCenter);
    ctx.strokeStyle = T.teal;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(photoCx, photoCy, photoR + 5, 0, Math.PI * 2);
    ctx.stroke();
    const textX = photoCx + photoR + 32;
    ctx.fillStyle = T.navy;
    ctx.font = `600 42px ${theme.font.display}`;
    ctx.textAlign = "left";
    ctx.fillText(p?.name || "Builder name", textX, photoCy - 6);
    ctx.fillStyle = T.sandDark;
    ctx.font = `500 22px ${theme.font.mono}`;
    ctx.fillText(p?.stackOrRole || "stack / role", textX, photoCy + 30);
  } else {
    const shown = data.passengers.slice(0, 4);
    const overflow = data.passengers.length - shown.length;
    const rowY = cardY + 74 + 46;
    const thumbR = 52;
    const gap = (contentW - shown.length * thumbR * 2) / Math.max(shown.length - 1, 1);
    shown.forEach((p, i) => {
      const pcx = contentX + thumbR + i * (thumbR * 2 + gap);
      drawCircularPhoto(ctx, p.photo, pcx, rowY, thumbR, p.faceCenter);
      ctx.strokeStyle = T.teal;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(pcx, rowY, thumbR + 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = T.navy;
      ctx.font = `600 18px ${theme.font.display}`;
      ctx.textAlign = "center";
      ctx.fillText((p.name || "Builder").split(" ")[0], pcx, rowY + thumbR + 30);
    });
    if (overflow > 0) {
      ctx.fillStyle = T.sandDark;
      ctx.font = `500 18px ${theme.font.mono}`;
      ctx.textAlign = "left";
      ctx.fillText(`+${overflow} more`, contentX + contentW - 110, rowY + thumbR + 30);
    }
    ctx.textAlign = "left";
    ctx.fillStyle = T.navy;
    ctx.font = `600 40px ${theme.font.display}`;
    ctx.fillText("Team crew", contentX, rowY + thumbR + 90);
  }

  // Data fields
  const fieldY = cardY + cardH - 190;
  const fields: [string, string][] = isTeam
    ? [["ROW", data.seat], ["GATE", data.gate], ["SQUAD", `${data.passengers.length} BUILDERS`]]
    : [["SEAT", data.seat], ["GATE", data.gate], ["CLASS", data.passengers[0]?.builderTitle ?? ""]];

  const fieldColW = contentW / 3;
  fields.forEach(([label, value], i) => {
    const fx = contentX + i * fieldColW;
    ctx.fillStyle = T.sandDark;
    ctx.font = `600 18px ${theme.font.mono}`;
    ctx.fillText(label, fx, fieldY);
    ctx.fillStyle = T.navy;
    ctx.font = `600 34px ${theme.font.display}`;
    wrapOrFit(ctx, value.toUpperCase(), fx, fieldY + 42, fieldColW - 20, 36);
  });

  // Bottom meta
  ctx.strokeStyle = T.sand;
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 6]);
  ctx.beginPath();
  ctx.moveTo(contentX, cardY + cardH - 70);
  ctx.lineTo(contentX + contentW, cardY + cardH - 70);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = T.sandDark;
  ctx.font = `500 18px ${theme.font.mono}`;
  ctx.fillText(
    `FLIGHT ${data.flightCode} · ${isTeam ? "TEAM MANIFEST" : "SOLO PASS"}`,
    contentX, cardY + cardH - 38
  );
  ctx.restore();

  // Perforation
  drawPerforation(ctx, stubSplitX, cardY, cardY + cardH);

  // QR stub
  ctx.save();
  roundRectPath(ctx, cardX, cardY, cardW, cardH, 28);
  ctx.clip();
  const stubW = cardX + cardW - stubSplitX;
  const stubCx = stubSplitX + stubW / 2;
  ctx.fillStyle = "#EFE6D2";
  ctx.fillRect(stubSplitX, cardY, stubW, cardH);
  const qrSize = Math.min(stubW - 60, 260);

  if (data.qrBitmap) {
    ctx.drawImage(data.qrBitmap, stubCx - qrSize / 2, cardY + 70, qrSize, qrSize);
  }

  ctx.fillStyle = T.navy;
  ctx.font = `600 22px ${theme.font.mono}`;
  ctx.textAlign = "center";
  ctx.fillText(data.seat, stubCx, cardY + 70 + qrSize + 46);

  ctx.save();
  ctx.translate(stubCx, cardY + cardH - 60);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = T.coral;
  ctx.font = `600 20px ${theme.font.mono}`;
  ctx.textAlign = "center";
  ctx.fillText("#FrameInGoa", 0, 0);
  ctx.restore();
  ctx.restore();

  return canvas.transferToImageBitmap();
}

// ─── Message Handler ─────────────────────────────────────────────────────

const offscreen = new OffscreenCanvas(1, 1);

self.onmessage = (e: MessageEvent<RenderRequest>) => {
  const req = e.data;

  let bitmap: ImageBitmap;

  if (req.format === "porthole") {
    bitmap = renderPorthole(offscreen, req.photo, req.builderNumber ?? "", req.faceCenter);
  } else {
    bitmap = renderBoardingPass(offscreen, req.boardingPass);
  }

  (self as unknown as Worker).postMessage(
    { type: "rendered", bitmap } satisfies RenderResponse,
    [bitmap] as unknown as Transferable[]
  );
};
