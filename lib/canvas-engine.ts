import QRCode from "qrcode";
import { theme } from "./theme";
import { getCropStrategy } from "./smart-crop";
import { applyNoiseOverlay } from "./noise-texture";
import type { FaceCenter } from "./face-detector";
import type { BoardingPassData, Passenger } from "./types";

const T = theme.color;

// ---------------------------------------------------------------------------
// Shared drawing helpers
// ---------------------------------------------------------------------------

function roundRectPath(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
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
  ctx: CanvasRenderingContext2D,
  bitmap: ImageBitmap,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  faceCenter?: FaceCenter | null
) {
  const crop = getCropStrategy(faceCenter)(bitmap.width, bitmap.height, dw / dh);
  ctx.drawImage(
    bitmap,
    crop.sx,
    crop.sy,
    crop.sWidth,
    crop.sHeight,
    dx,
    dy,
    dw,
    dh
  );
}

function drawCircularPhoto(
  ctx: CanvasRenderingContext2D,
  bitmap: ImageBitmap | null,
  cx: number,
  cy: number,
  radius: number,
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

/** Perforation seam with torn-notch semicircles */
function drawPerforation(
  ctx: CanvasRenderingContext2D,
  x: number,
  yTop: number,
  yBottom: number
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

/** Draws palm tree silhouette accent */
function drawPalmTreeAccent(
  ctx: CanvasRenderingContext2D,
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

  // Trunk
  ctx.beginPath();
  ctx.moveTo(0, 50);
  ctx.quadraticCurveTo(8, 25, 12, 0);
  ctx.lineWidth = 5;
  ctx.stroke();

  // Fronds
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

/** Draws Devanagari गोवा Script Badge */
function drawGoaBadge(
  ctx: CanvasRenderingContext2D,
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

  // Background Badge
  roundRectPath(ctx, -w / 2, -h / 2, w, h, 24);
  ctx.fillStyle = T.magenta;
  ctx.fill();
  ctx.strokeStyle = T.yellow;
  ctx.lineWidth = 4;
  ctx.stroke();

  // Devanagari text
  ctx.fillStyle = T.white;
  ctx.font = "900 28px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("गोवा", 0, 2);

  ctx.restore();
}

async function qrToImageBitmap(payload: string, size: number): Promise<ImageBitmap> {
  const dataUrl = await QRCode.toDataURL(payload, {
    margin: 0,
    width: size,
    color: { dark: T.navy, light: "#00000000" },
  });
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return createImageBitmap(blob);
}

// ---------------------------------------------------------------------------
// Format A — Brandkit PFP Frame / Overlay
// ---------------------------------------------------------------------------

export function drawPortholeFrame(
  canvas: HTMLCanvasElement,
  photo: ImageBitmap | null,
  builderNumber: string,
  faceCenter?: FaceCenter | null
) {
  const { w, h } = theme.export.porthole;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  // Palm Emerald Background
  ctx.fillStyle = T.emerald;
  ctx.fillRect(0, 0, w, h);

  // Background palm tree silhouettes
  drawPalmTreeAccent(ctx, 40, h - 180, 2.2, "#034823");
  drawPalmTreeAccent(ctx, w - 120, h - 220, 2.5, "#034823");

  const cx = w / 2;
  const cy = h / 2 - 20;
  const photoRadius = w * 0.35;

  // Photo
  drawCircularPhoto(ctx, photo, cx, cy, photoRadius, faceCenter);

  // Dual Brandkit Ring: Sun Yellow + Hot Magenta + Palm Emerald
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

  // Circular Text "HACKER HOUSE · GOA 2026 · 2:47 PM STUDIO"
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

  // Devanagari "गोवा" Badge attached to bottom-right of avatar
  const badgeCx = cx + photoRadius * 0.72;
  const badgeCy = cy + photoRadius * 0.72;
  drawGoaBadge(ctx, badgeCx, badgeCy, 1.4);

  // Builder Number Stamp Top Right
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

  // Bottom Tagline
  ctx.save();
  ctx.fillStyle = T.white;
  ctx.font = `600 28px ${theme.font.mono}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("#FrameInGoa · 2:47 PM STUDIO", cx, h - 50);
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Format B — Brandkit Builder Boarding Pass / Badge
// ---------------------------------------------------------------------------

export async function drawBoardingPass(
  canvas: HTMLCanvasElement,
  data: BoardingPassData
) {
  const { w, h } = theme.export.boardingPass;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  // Palm Emerald Background
  ctx.fillStyle = T.emerald;
  ctx.fillRect(0, 0, w, h);

  // Background Palm Accent
  drawPalmTreeAccent(ctx, 20, 20, 2, "#034823");
  drawPalmTreeAccent(ctx, w - 80, h - 160, 2.2, "#034823");

  const margin = 40;
  const cardX = margin;
  const cardY = margin;
  const cardW = w - margin * 2;
  const cardH = h - margin * 2;
  const stubSplitX = cardX + cardW * 0.74;

  // Ticket Body Fill
  roundRectPath(ctx, cardX, cardY, cardW, cardH, 28);
  ctx.fillStyle = T.cardStock;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = T.yellow;
  ctx.stroke();

  // Paper Grain Texture Overlay
  ctx.save();
  roundRectPath(ctx, cardX, cardY, cardW, cardH, 28);
  ctx.clip();
  applyNoiseOverlay(ctx, cardX, cardY, cardW, cardH, 14);
  ctx.restore();

  // --- Main Stub Header Banner (Emerald + Sun Yellow Title + Goa Badge) ----
  const padX = 56;
  const contentX = cardX + padX;
  const contentW = stubSplitX - cardX - padX * 1.4;

  ctx.save();
  roundRectPath(ctx, cardX, cardY, cardW, cardH, 28);
  ctx.clip();

  // Header Bar Background (Emerald)
  const headerH = 140;
  ctx.fillStyle = T.emerald;
  ctx.fillRect(cardX, cardY, stubSplitX - cardX, headerH);

  // Studio Stamp Top Left
  ctx.fillStyle = T.yellow;
  ctx.font = `800 18px ${theme.font.mono}`;
  ctx.fillText("2:47 PM STUDIO", contentX, cardY + 36);

  // Date Top Right
  ctx.textAlign = "right";
  ctx.fillText("GOA, INDIA · 28-31 OCT 2026", contentX + contentW, cardY + 36);
  ctx.textAlign = "left";

  // Main Banner "HACKER HOUSE" (Sun Yellow Serif)
  ctx.fillStyle = T.yellow;
  ctx.font = `900 58px ${theme.font.serif}`;
  ctx.fillText("HACKER HOUSE", contentX, cardY + 104);

  // Devanagari "गोवा" Badge Overlaid on Banner
  const titleWidth = ctx.measureText("HACKER HOUSE").width;
  drawGoaBadge(ctx, contentX + titleWidth / 2 + 10, cardY + 76, 1.1);

  // Header Divider Line (Hot Magenta)
  ctx.strokeStyle = T.magenta;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(contentX, cardY + headerH);
  ctx.lineTo(contentX + contentW, cardY + headerH);
  ctx.stroke();

  // --- Passenger Body Section ---------------------------------------------
  const isTeam = data.passengers.length > 1;

  if (!isTeam) {
    drawSoloBody(ctx, data.passengers[0], contentX, cardY, headerH);
  } else {
    drawTeamBody(ctx, data.passengers, contentX, cardY, contentW, headerH);
  }

  // --- Signpost Field Badges (SEAT / GATE / CLASS) -------------------------
  const fieldY = cardY + cardH - 195;
  const fields: [string, string, string][] = isTeam
    ? [
        ["ROW", data.seat, T.yellow],
        ["GATE", data.gate, T.magenta],
        ["SQUAD", `${data.passengers.length} BUILDERS`, T.yellow],
      ]
    : [
        ["SEAT", data.seat, T.yellow],
        ["GATE", data.gate, T.magenta],
        ["CLASS", data.passengers[0]?.builderTitle ?? "", T.yellow],
      ];

  const fieldColW = contentW / 3;
  fields.forEach(([label, value, badgeColor], i) => {
    const fx = contentX + i * fieldColW;

    // Label
    ctx.fillStyle = T.navy;
    ctx.font = `700 18px ${theme.font.mono}`;
    ctx.fillText(label, fx, fieldY);

    // Signpost Badge Box
    const bw = fieldColW - 24;
    const bh = 54;
    const by = fieldY + 12;

    roundRectPath(ctx, fx, by, bw, bh, 12);
    ctx.fillStyle = badgeColor;
    ctx.fill();
    ctx.strokeStyle = T.navy;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Text inside signpost badge
    ctx.fillStyle = badgeColor === T.yellow ? T.navy : T.white;
    ctx.font = `700 24px ${theme.font.mono}`;
    wrapOrFit(ctx, value.toUpperCase(), fx + 12, by + 34, bw - 24, 24);
  });

  // Footer Meta Line
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
    contentX,
    cardY + cardH - 36
  );

  ctx.restore(); // end main stub clip

  // --- Perforation Seam --------------------------------------------------
  drawPerforation(ctx, stubSplitX, cardY, cardY + cardH);

  // --- QR Right Stub -----------------------------------------------------
  ctx.save();
  roundRectPath(ctx, cardX, cardY, cardW, cardH, 28);
  ctx.clip();

  const stubW = cardX + cardW - stubSplitX;
  const stubCx = stubSplitX + stubW / 2;

  // Stub Background (Sun Yellow Panel)
  ctx.fillStyle = T.yellow;
  ctx.fillRect(stubSplitX, cardY, stubW, cardH);

  // Stub Header Banner (Emerald)
  ctx.fillStyle = T.emerald;
  ctx.fillRect(stubSplitX, cardY, stubW, 60);

  ctx.fillStyle = T.yellow;
  ctx.font = `800 18px ${theme.font.mono}`;
  ctx.textAlign = "center";
  ctx.fillText("HH GOA 26", stubCx, cardY + 36);

  // QR Code
  const qrSize = Math.min(stubW - 60, 240);
  try {
    const qrBitmap = await qrToImageBitmap(data.qrPayload, qrSize);
    ctx.drawImage(
      qrBitmap,
      stubCx - qrSize / 2,
      cardY + 84,
      qrSize,
      qrSize
    );
  } catch {
    // QR fallback
  }

  // Seat Badge below QR
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

  // Vertical Text #FrameInGoa
  ctx.save();
  ctx.translate(stubCx, cardY + cardH - 50);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = T.emeraldDark;
  ctx.font = `800 20px ${theme.font.mono}`;
  ctx.textAlign = "center";
  ctx.fillText("#FrameInGoa", 0, 0);
  ctx.restore();

  ctx.restore(); // end QR stub clip
}

function drawSoloBody(
  ctx: CanvasRenderingContext2D,
  passenger: Passenger | undefined,
  contentX: number,
  cardY: number,
  headerH: number
) {
  const photoR = 85;
  const photoCx = contentX + photoR;
  const photoCy = cardY + headerH + 30 + photoR;

  // Photo with Sun Yellow + Emerald outline
  drawCircularPhoto(ctx, passenger?.photo ?? null, photoCx, photoCy, photoR, passenger?.faceCenter);
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
  ctx.fillText(passenger?.name || "Builder Name", textX, photoCy - 10);

  ctx.fillStyle = T.magenta;
  ctx.font = `600 24px ${theme.font.mono}`;
  ctx.fillText(passenger?.stackOrRole || "Stack / Role", textX, photoCy + 32);
}

function drawTeamBody(
  ctx: CanvasRenderingContext2D,
  passengers: Passenger[],
  contentX: number,
  cardY: number,
  contentW: number,
  headerH: number
) {
  const shown = passengers.slice(0, 4);
  const overflow = passengers.length - shown.length;
  const rowY = cardY + headerH + 50;
  const thumbR = 50;
  const gap = (contentW - shown.length * thumbR * 2) / Math.max(shown.length - 1, 1);

  shown.forEach((p, i) => {
    const cx = contentX + thumbR + i * (thumbR * 2 + gap);
    drawCircularPhoto(ctx, p.photo, cx, rowY, thumbR, p.faceCenter);
    ctx.strokeStyle = T.yellow;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(cx, rowY, thumbR + 3, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = T.navy;
    ctx.font = `700 18px ${theme.font.display}`;
    ctx.textAlign = "center";
    const firstName = (p.name || "Builder").split(" ")[0];
    ctx.fillText(firstName, cx, rowY + thumbR + 30);
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

function wrapOrFit(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  startSize: number
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
