import { theme, themePalettes, type ThemeColors } from "./theme";
import type { ThemePreset } from "./types";

/**
 * Super-fast synchronous mini boarding pass renderer for live palette previews.
 * Executes in ~0.5ms so 4 live previews render synchronously with 0 lag/delay.
 */
export function drawMiniPreview(
  canvas: HTMLCanvasElement,
  preset: ThemePreset,
  photo?: ImageBitmap | null
) {
  const pal: ThemeColors = themePalettes[preset] || themePalettes.palmEmerald;
  const w = 200;
  const h = 125;

  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Background ground
  ctx.fillStyle = pal.bg;
  ctx.fillRect(0, 0, w, h);

  // Card body
  const pad = 6;
  const cardX = pad;
  const cardY = pad;
  const cardW = w - pad * 2;
  const cardH = h - pad * 2;
  const stubX = cardX + cardW * 0.72;

  // Main Card Stock
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 8);
  ctx.fillStyle = pal.cardStock;
  ctx.fill();
  ctx.strokeStyle = pal.accentYellow;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Clip to card stock for inner elements
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 8);
  ctx.clip();

  // Header Banner
  const headerH = 34;
  ctx.fillStyle = pal.headerBg;
  ctx.fillRect(cardX, cardY, stubX - cardX, headerH);

  // Title "HACKER HOUSE"
  ctx.fillStyle = pal.titleColor;
  ctx.font = `800 11px ${theme.font.display}`;
  ctx.fillText("HACKER HOUSE", cardX + 8, cardY + 18);

  // Devanagari Goa Badge Dot
  ctx.fillStyle = pal.accentMagenta;
  ctx.beginPath();
  ctx.arc(stubX - 14, cardY + 16, 6, 0, Math.PI * 2);
  ctx.fill();

  // Photo / Circle Avatar
  const photoCx = cardX + 22;
  const photoCy = cardY + headerH + 24;
  const photoR = 14;

  ctx.save();
  ctx.beginPath();
  ctx.arc(photoCx, photoCy, photoR, 0, Math.PI * 2);
  ctx.clip();
  if (photo) {
    ctx.drawImage(photo, photoCx - photoR, photoCy - photoR, photoR * 2, photoR * 2);
  } else {
    ctx.fillStyle = pal.sand;
    ctx.fillRect(photoCx - photoR, photoCy - photoR, photoR * 2, photoR * 2);
  }
  ctx.restore();

  ctx.strokeStyle = pal.accentYellow;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(photoCx, photoCy, photoR + 1, 0, Math.PI * 2);
  ctx.stroke();

  // Text Lines
  ctx.fillStyle = pal.navy;
  ctx.font = `700 9px ${theme.font.display}`;
  ctx.fillText("BUILDER", photoCx + photoR + 8, photoCy - 2);

  ctx.fillStyle = pal.accentMagenta;
  ctx.font = `600 7px ${theme.font.mono}`;
  ctx.fillText("HH GOA 2026", photoCx + photoR + 8, photoCy + 8);

  // Stub Section
  ctx.fillStyle = pal.accentYellow;
  ctx.fillRect(stubX, cardY, cardW - (stubX - cardX), cardH);

  ctx.fillStyle = pal.headerBg;
  ctx.fillRect(stubX, cardY, cardW - (stubX - cardX), headerH);

  // Stub QR Icon Box
  const qrBoxS = 22;
  const qrX = stubX + (cardX + cardW - stubX) / 2 - qrBoxS / 2;
  const qrY = cardY + headerH + 10;
  ctx.fillStyle = pal.navy;
  ctx.fillRect(qrX, qrY, qrBoxS, qrBoxS);

  // Perforation Seam
  ctx.restore(); // Exit clip

  ctx.strokeStyle = pal.sand;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(stubX, cardY);
  ctx.lineTo(stubX, cardY + cardH);
  ctx.stroke();
  ctx.setLineDash([]);
}
