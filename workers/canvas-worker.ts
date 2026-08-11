/**
 * OffscreenCanvas Web Worker aligned with official HH Goa 26 Brand Kit.
 */

import { theme } from "../lib/theme";
import { getCropStrategy } from "../lib/smart-crop";
import { generateNoiseTexture } from "../lib/noise-texture";
import type { FaceCenter } from "../lib/face-detector";

const T = theme.color;

export interface RenderRequest {
  type: "render";
  format: "boardingPass" | "porthole";
  photo?: ImageBitmap;
  builderNumber?: string;
  faceCenter?: FaceCenter | null;
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
    qrBitmap?: ImageBitmap;
    isTeam: boolean;
  };
}

export interface RenderResponse {
  type: "rendered";
  bitmap: ImageBitmap;
}

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
    ctx.fillStyle = "#E5D9B6";
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
  }
  ctx.restore();
}

function drawPerforation(
  ctx: OffscreenCanvasRenderingContext2D,
  x: number, yTop: number, yBottom: number
) {
  ctx.save();
  ctx.strokeStyle = T.sand;
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 10]);
  ctx.beginPath();
  ctx.moveTo(x, yTop + 16);
  ctx.lineTo(x, yBottom - 16);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.fillStyle = T.emerald;
  ctx.beginPath();
  ctx.arc(x, yTop, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, yBottom, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawPalmTreeAccentWorker(
  ctx: OffscreenCanvasRenderingContext2D,
  x: number,
  y: number,
  scale = 1,
  color: string = T.emeraldDark
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(0, 50);
  ctx.quadraticCurveTo(8, 25, 12, 0);
  ctx.lineWidth = 5;
  ctx.stroke();

  const angles = [-0.8, -0.4, 0, 0.4, 0.8];
  angles.forEach((a) => {
    ctx.save();
    ctx.translate(12, 0);
    ctx.rotate(a);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(15, -12, 30, -5);
    ctx.quadraticCurveTo(15, 0, 0, 0);
    ctx.fill();
    ctx.restore();
  });

  ctx.restore();
}

function drawGoaBadgeWorker(
  ctx: OffscreenCanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale = 1
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.rotate(-0.08);

  const w = 110;
  const h = 48;

  roundRectPath(ctx, -w / 2, -h / 2, w, h, 24);
  ctx.fillStyle = T.magenta;
  ctx.fill();
  ctx.strokeStyle = T.yellow;
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = T.white;
  ctx.font = "900 28px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("गोवा", 0, 2);

  ctx.restore();
}

function applyNoiseOverlayWorker(
  ctx: OffscreenCanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, alpha = 14
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
  const family = theme.font.mono;
  while (size > 14) {
    ctx.font = `700 ${size}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 2;
  }
  ctx.font = `700 ${size}px ${family}`;
  ctx.fillText(text, x, y);
}

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

  ctx.fillStyle = T.emerald;
  ctx.fillRect(0, 0, w, h);

  drawPalmTreeAccentWorker(ctx, 40, h - 180, 2.2, "#034823");
  drawPalmTreeAccentWorker(ctx, w - 120, h - 220, 2.5, "#034823");

  const cx = w / 2;
  const cy = h / 2 - 20;
  const photoRadius = w * 0.35;

  drawCircularPhoto(ctx, photo, cx, cy, photoRadius, faceCenter);

  ctx.save();
  ctx.strokeStyle = T.yellow;
  ctx.lineWidth = 24;
  ctx.beginPath();
  ctx.arc(cx, cy, photoRadius + 12, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = T.magenta;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(cx, cy, photoRadius + 28, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.fillStyle = T.yellow;
  ctx.font = `700 20px ${theme.font.mono}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const textRadius = photoRadius + 48;
  const chars = "★ HACKER HOUSE ★ GOA 28-31 OCT 2026 ★ 2:47 PM STUDIO ".split("");
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

  const badgeCx = cx + photoRadius * 0.72;
  const badgeCy = cy + photoRadius * 0.72;
  drawGoaBadgeWorker(ctx, badgeCx, badgeCy, 1.4);

  ctx.save();
  ctx.fillStyle = T.yellow;
  ctx.fillRect(cx - 140, 50, 280, 48);
  ctx.strokeStyle = T.magenta;
  ctx.lineWidth = 4;
  ctx.strokeRect(cx - 140, 50, 280, 48);

  ctx.fillStyle = T.emeraldDark;
  ctx.font = `800 24px ${theme.font.mono}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`BUILDER #${builderNumber}`, cx, 74);
  ctx.restore();

  ctx.save();
  ctx.fillStyle = T.white;
  ctx.font = `600 28px ${theme.font.mono}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("#FrameInGoa · 2:47 PM STUDIO", cx, h - 50);
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

  ctx.fillStyle = T.emerald;
  ctx.fillRect(0, 0, w, h);

  drawPalmTreeAccentWorker(ctx, 20, 20, 2, "#034823");
  drawPalmTreeAccentWorker(ctx, w - 80, h - 160, 2.2, "#034823");

  const margin = 40;
  const cardX = margin;
  const cardY = margin;
  const cardW = w - margin * 2;
  const cardH = h - margin * 2;
  const stubSplitX = cardX + cardW * 0.74;

  roundRectPath(ctx, cardX, cardY, cardW, cardH, 28);
  ctx.fillStyle = T.cardStock;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = T.yellow;
  ctx.stroke();

  ctx.save();
  roundRectPath(ctx, cardX, cardY, cardW, cardH, 28);
  ctx.clip();
  applyNoiseOverlayWorker(ctx, cardX, cardY, cardW, cardH, 14);
  ctx.restore();

  const padX = 56;
  const contentX = cardX + padX;
  const contentW = stubSplitX - cardX - padX * 1.4;

  ctx.save();
  roundRectPath(ctx, cardX, cardY, cardW, cardH, 28);
  ctx.clip();

  const headerH = 140;
  ctx.fillStyle = T.emerald;
  ctx.fillRect(cardX, cardY, stubSplitX - cardX, headerH);

  ctx.fillStyle = T.yellow;
  ctx.font = `800 18px ${theme.font.mono}`;
  ctx.fillText("2:47 PM STUDIO", contentX, cardY + 36);

  ctx.textAlign = "right";
  ctx.fillText("GOA, INDIA · 28-31 OCT 2026", contentX + contentW, cardY + 36);
  ctx.textAlign = "left";

  ctx.fillStyle = T.yellow;
  ctx.font = `900 58px ${theme.font.serif}`;
  ctx.fillText("HACKER HOUSE", contentX, cardY + 104);

  const titleWidth = ctx.measureText("HACKER HOUSE").width;
  drawGoaBadgeWorker(ctx, contentX + titleWidth / 2 + 10, cardY + 76, 1.1);

  ctx.strokeStyle = T.magenta;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(contentX, cardY + headerH);
  ctx.lineTo(contentX + contentW, cardY + headerH);
  ctx.stroke();

  const isTeam = data.isTeam;

  if (!isTeam) {
    const p = data.passengers[0];
    const photoR = 85;
    const photoCx = contentX + photoR;
    const photoCy = cardY + headerH + 30 + photoR;
    drawCircularPhoto(ctx, p?.photo, photoCx, photoCy, photoR, p?.faceCenter);
    ctx.strokeStyle = T.yellow;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(photoCx, photoCy, photoR + 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = T.emerald;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(photoCx, photoCy, photoR + 9, 0, Math.PI * 2);
    ctx.stroke();

    const textX = photoCx + photoR + 32;
    ctx.fillStyle = T.navy;
    ctx.font = `700 44px ${theme.font.display}`;
    ctx.textAlign = "left";
    ctx.fillText(p?.name || "Builder Name", textX, photoCy - 10);
    ctx.fillStyle = T.magenta;
    ctx.font = `600 24px ${theme.font.mono}`;
    ctx.fillText(p?.stackOrRole || "Stack / Role", textX, photoCy + 32);
  } else {
    const shown = data.passengers.slice(0, 4);
    const overflow = data.passengers.length - shown.length;
    const rowY = cardY + headerH + 50;
    const thumbR = 50;
    const gap = (contentW - shown.length * thumbR * 2) / Math.max(shown.length - 1, 1);
    shown.forEach((p, i) => {
      const pcx = contentX + thumbR + i * (thumbR * 2 + gap);
      drawCircularPhoto(ctx, p.photo, pcx, rowY, thumbR, p.faceCenter);
      ctx.strokeStyle = T.yellow;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(pcx, rowY, thumbR + 3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = T.navy;
      ctx.font = `700 18px ${theme.font.display}`;
      ctx.textAlign = "center";
      ctx.fillText((p.name || "Builder").split(" ")[0], pcx, rowY + thumbR + 30);
    });
    if (overflow > 0) {
      ctx.fillStyle = T.magenta;
      ctx.font = `700 18px ${theme.font.mono}`;
      ctx.textAlign = "left";
      ctx.fillText(`+${overflow} more`, contentX + contentW - 110, rowY + thumbR + 30);
    }
    ctx.textAlign = "left";
    ctx.fillStyle = T.navy;
    ctx.font = `700 38px ${theme.font.display}`;
    ctx.fillText("Team Builder Crew", contentX, rowY + thumbR + 90);
  }

  const fieldY = cardY + cardH - 195;
  const fields: [string, string, string][] = isTeam
    ? [["ROW", data.seat, T.yellow], ["GATE", data.gate, T.magenta], ["SQUAD", `${data.passengers.length} BUILDERS`, T.yellow]]
    : [["SEAT", data.seat, T.yellow], ["GATE", data.gate, T.magenta], ["CLASS", data.passengers[0]?.builderTitle ?? "", T.yellow]];

  const fieldColW = contentW / 3;
  fields.forEach(([label, value, badgeColor], i) => {
    const fx = contentX + i * fieldColW;
    ctx.fillStyle = T.navy;
    ctx.font = `700 18px ${theme.font.mono}`;
    ctx.fillText(label, fx, fieldY);

    const bw = fieldColW - 24;
    const bh = 54;
    const by = fieldY + 12;

    roundRectPath(ctx, fx, by, bw, bh, 12);
    ctx.fillStyle = badgeColor;
    ctx.fill();
    ctx.strokeStyle = T.navy;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = badgeColor === T.yellow ? T.navy : T.white;
    ctx.font = `700 24px ${theme.font.mono}`;
    wrapOrFit(ctx, value.toUpperCase(), fx + 12, by + 34, bw - 24, 24);
  });

  ctx.strokeStyle = T.sand;
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(contentX, cardY + cardH - 68);
  ctx.lineTo(contentX + contentW, cardY + cardH - 68);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = T.navy;
  ctx.font = `600 18px ${theme.font.mono}`;
  ctx.fillText(
    `FLIGHT ${data.flightCode} · ${isTeam ? "TEAM MANIFEST" : "SOLO BUILDER PASS"} · 2:47 PM STUDIO`,
    contentX, cardY + cardH - 36
  );
  ctx.restore();

  drawPerforation(ctx, stubSplitX, cardY, cardY + cardH);

  ctx.save();
  roundRectPath(ctx, cardX, cardY, cardW, cardH, 28);
  ctx.clip();

  const stubW = cardX + cardW - stubSplitX;
  const stubCx = stubSplitX + stubW / 2;

  ctx.fillStyle = T.yellow;
  ctx.fillRect(stubSplitX, cardY, stubW, cardH);

  ctx.fillStyle = T.emerald;
  ctx.fillRect(stubSplitX, cardY, stubW, 60);

  ctx.fillStyle = T.yellow;
  ctx.font = `800 18px ${theme.font.mono}`;
  ctx.textAlign = "center";
  ctx.fillText("HH GOA 26", stubCx, cardY + 36);

  const qrSize = Math.min(stubW - 60, 240);

  if (data.qrBitmap) {
    ctx.drawImage(data.qrBitmap, stubCx - qrSize / 2, cardY + 84, qrSize, qrSize);
  }

  roundRectPath(ctx, stubCx - 70, cardY + 84 + qrSize + 24, 140, 48, 12);
  ctx.fillStyle = T.magenta;
  ctx.fill();
  ctx.strokeStyle = T.navy;
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = T.white;
  ctx.font = `800 24px ${theme.font.mono}`;
  ctx.textAlign = "center";
  ctx.fillText(data.seat, stubCx, cardY + 84 + qrSize + 56);

  ctx.save();
  ctx.translate(stubCx, cardY + cardH - 50);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = T.emeraldDark;
  ctx.font = `800 20px ${theme.font.mono}`;
  ctx.textAlign = "center";
  ctx.fillText("#FrameInGoa", 0, 0);
  ctx.restore();

  ctx.restore();

  return canvas.transferToImageBitmap();
}

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
