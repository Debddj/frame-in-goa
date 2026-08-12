import QRCode from "qrcode";
import { theme, themePalettes, type ThemeColors } from "./theme";
import { getCropStrategy } from "./smart-crop";
import { applyNoiseOverlay } from "./noise-texture";
import type { FaceCenter } from "./face-detector";
import type { BoardingPassData, Passenger, StickerPreset, ThemePreset } from "./types";

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
  faceCenter?: FaceCenter | null,
  fallbackBg = "#E5D9B6"
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();
  if (bitmap) {
    drawCropped(ctx, bitmap, cx - radius, cy - radius, radius * 2, radius * 2, faceCenter);
  } else {
    ctx.fillStyle = fallbackBg;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
  }
  ctx.restore();
}

/** Perforation seam with torn-notch semicircles */
function drawPerforation(
  ctx: CanvasRenderingContext2D,
  x: number,
  yTop: number,
  yBottom: number,
  bgColor: string,
  sandColor: string = T.sand
) {
  ctx.save();
  ctx.strokeStyle = sandColor;
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 10]);
  ctx.beginPath();
  ctx.moveTo(x, yTop + 16);
  ctx.lineTo(x, yBottom - 16);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.fillStyle = bgColor;
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

/** Draws Devanagari गोवा Script Badge */
function drawGoaBadge(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale = 1,
  badgeBg: string = T.magenta,
  badgeText: string = T.yellow
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.rotate(-0.08);

  const w = 110;
  const h = 48;

  roundRectPath(ctx, -w / 2, -h / 2, w, h, 24);
  ctx.fillStyle = badgeBg;
  ctx.fill();
  ctx.strokeStyle = badgeText;
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = T.white;
  ctx.font = "900 28px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("गोवा", 0, 2);

  ctx.restore();
}

/** Draws custom sticker badge */
function drawStickerBadge(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  sticker: StickerPreset,
  accentColor: string
) {
  if (sticker === "none") return;

  const labels: Record<Exclude<StickerPreset, "none">, { text: string; icon: string }> = {
    pirate: { text: "PIRATE CREW 🏴‍☠️", icon: "🏴‍☠️" },
    cyber: { text: "CYBER HACKER ⚡", icon: "⚡" },
    anime: { text: "ANIME MODE 🎌", icon: "🎌" },
    rocket: { text: "SHIPPING 3AM 🚀", icon: "🚀" },
    palm: { text: "GOA CHILL 🌴", icon: "🌴" },
  };

  const item = labels[sticker as keyof typeof labels];
  if (!item) return;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.05);

  const w = 180;
  const h = 40;

  roundRectPath(ctx, -w / 2, -h / 2, w, h, 12);
  ctx.fillStyle = accentColor;
  ctx.fill();
  ctx.strokeStyle = "#111111";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = "#111111";
  ctx.font = `800 16px ${theme.font.mono}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(item.text, 0, 1);

  ctx.restore();
}

/** Draws thematic airplane-window viewport for mascot co-pilot + speech bubble */
function drawCoPilotWindow(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  bitmap: ImageBitmap,
  speechText: string,
  pal: ThemeColors
) {
  ctx.save();

  // 1. Speech bubble pointing from window to the left
  if (speechText) {
    ctx.save();
    const bubbleW = 160;
    const bubbleH = 44;
    const bubbleX = x - bubbleW - 14;
    const bubbleY = y + 15;

    roundRectPath(ctx, bubbleX, bubbleY, bubbleW, bubbleH, 12);
    ctx.fillStyle = pal.cardStock;
    ctx.fill();
    ctx.strokeStyle = pal.navy;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Pointer tail
    ctx.beginPath();
    ctx.moveTo(bubbleX + bubbleW, bubbleY + 16);
    ctx.lineTo(bubbleX + bubbleW + 12, bubbleY + 22);
    ctx.lineTo(bubbleX + bubbleW, bubbleY + 28);
    ctx.closePath();
    ctx.fillStyle = pal.cardStock;
    ctx.fill();
    ctx.strokeStyle = pal.navy;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = pal.navy;
    ctx.font = `700 13px ${theme.font.mono}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    wrapOrFit(ctx, speechText, bubbleX + bubbleW / 2, bubbleY + bubbleH / 2, bubbleW - 16, 13);
    ctx.restore();
  }

  // 2. Airplane Window Frame (Rounded Rect Bezel + Rivets)
  const r = 26;
  roundRectPath(ctx, x - 5, y - 5, w + 10, h + 10, r + 4);
  ctx.fillStyle = pal.navy;
  ctx.fill();

  roundRectPath(ctx, x, y, w, h, r);
  ctx.fillStyle = pal.accentYellow;
  ctx.fill();
  ctx.strokeStyle = pal.accentMagenta;
  ctx.lineWidth = 4;
  ctx.stroke();

  // Corner rivets
  const roff = 10;
  const rivets = [
    [x + roff, y + roff],
    [x + w - roff, y + roff],
    [x + roff, y + h - roff],
    [x + w - roff, y + h - roff],
  ];
  rivets.forEach(([rx, ry]) => {
    ctx.beginPath();
    ctx.arc(rx, ry, 3, 0, Math.PI * 2);
    ctx.fillStyle = pal.navy;
    ctx.fill();
  });

  // Inner Window Glass Viewport (Clipped Mascot Photo)
  const pad = 10;
  const ix = x + pad;
  const iy = y + pad;
  const iw = w - pad * 2;
  const ih = h - pad * 2 - 18;
  const ir = r - 6;

  ctx.save();
  roundRectPath(ctx, ix, iy, iw, ih, ir);
  ctx.clip();
  drawCropped(ctx as CanvasRenderingContext2D, bitmap, ix, iy, iw, ih);
  ctx.restore();

  roundRectPath(ctx, ix, iy, iw, ih, ir);
  ctx.strokeStyle = pal.navy;
  ctx.lineWidth = 3;
  ctx.stroke();

  // 3. Bottom Stamped Badge "CO-PILOT ✈️"
  const bw = w - 20;
  const bh = 22;
  const bx = x + 10;
  const by = y + h - 22;

  roundRectPath(ctx, bx, by, bw, bh, 6);
  ctx.fillStyle = pal.accentMagenta;
  ctx.fill();
  ctx.strokeStyle = pal.navy;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#FFFFFF";
  ctx.font = `800 11px ${theme.font.mono}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("CO-PILOT ✈️", bx + bw / 2, by + bh / 2 + 1);

  ctx.restore();
}

async function qrToImageBitmap(payload: string, size: number, darkColor: string = T.navy): Promise<ImageBitmap> {
  const dataUrl = await QRCode.toDataURL(payload, {
    margin: 0,
    width: size,
    color: { dark: darkColor, light: "#00000000" },
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
  faceCenter?: FaceCenter | null,
  themePreset: ThemePreset = "palmEmerald",
  characterPhoto?: ImageBitmap | null
) {
  const pal = themePalettes[themePreset] || themePalettes.palmEmerald;
  const { w, h } = theme.export.porthole;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  // Background
  ctx.fillStyle = pal.bg;
  ctx.fillRect(0, 0, w, h);

  // Background palm tree silhouettes
  drawPalmTreeAccent(ctx, 40, h - 180, 2.2, pal.headerBg);
  drawPalmTreeAccent(ctx, w - 120, h - 220, 2.5, pal.headerBg);

  const cx = w / 2;
  const cy = h / 2 - 20;
  const photoRadius = w * 0.35;

  // Photo
  drawCircularPhoto(ctx, photo, cx, cy, photoRadius, faceCenter, pal.sand);

  // Dual Brandkit Ring: Yellow + Magenta
  ctx.save();
  ctx.strokeStyle = pal.accentYellow;
  ctx.lineWidth = 24;
  ctx.beginPath();
  ctx.arc(cx, cy, photoRadius + 12, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = pal.accentMagenta;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(cx, cy, photoRadius + 28, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Circular Text
  ctx.save();
  ctx.fillStyle = pal.accentYellow;
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

  // Devanagari "गोवा" Badge
  const badgeCx = cx + photoRadius * 0.72;
  const badgeCy = cy + photoRadius * 0.72;
  drawGoaBadge(ctx, badgeCx, badgeCy, 1.4, pal.accentMagenta, pal.accentYellow);

  // Character Mascot Co-Pilot Avatar Badge if uploaded!
  if (characterPhoto) {
    const mascotR = 68;
    const mascotCx = cx - photoRadius * 0.72;
    const mascotCy = cy + photoRadius * 0.72;
    drawCircularPhoto(ctx, characterPhoto, mascotCx, mascotCy, mascotR);
    ctx.strokeStyle = pal.accentYellow;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(mascotCx, mascotCy, mascotR + 2, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Builder Number Stamp Top
  ctx.save();
  ctx.fillStyle = pal.accentYellow;
  ctx.fillRect(cx - 140, 50, 280, 48);
  ctx.strokeStyle = pal.accentMagenta;
  ctx.lineWidth = 4;
  ctx.strokeRect(cx - 140, 50, 280, 48);

  ctx.fillStyle = "#111111";
  ctx.font = `800 24px ${theme.font.mono}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`BUILDER #${builderNumber}`, cx, 74);
  ctx.restore();

  // Bottom Tagline
  ctx.save();
  ctx.fillStyle = pal.cardStock;
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
  const themePreset = data.themePreset || "palmEmerald";
  const pal = themePalettes[themePreset] || themePalettes.palmEmerald;

  const { w, h } = theme.export.boardingPass;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  // Background
  ctx.fillStyle = pal.bg;
  ctx.fillRect(0, 0, w, h);

  // Background Palm Accent
  drawPalmTreeAccent(ctx, 20, 20, 2, pal.headerBg);
  drawPalmTreeAccent(ctx, w - 80, h - 160, 2.2, pal.headerBg);

  const margin = 40;
  const cardX = margin;
  const cardY = margin;
  const cardW = w - margin * 2;
  const cardH = h - margin * 2;
  const stubSplitX = cardX + cardW * 0.74;

  // Ticket Body Fill
  roundRectPath(ctx, cardX, cardY, cardW, cardH, 28);
  ctx.fillStyle = pal.cardStock;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = pal.accentYellow;
  ctx.stroke();

  // Paper Grain Texture Overlay
  ctx.save();
  roundRectPath(ctx, cardX, cardY, cardW, cardH, 28);
  ctx.clip();
  applyNoiseOverlay(ctx, cardX, cardY, cardW, cardH, 14);
  ctx.restore();

  // --- Main Stub Header Banner (Header + Sun Yellow Title + Goa Badge) ----
  const padX = 56;
  const contentX = cardX + padX;
  const contentW = stubSplitX - cardX - padX * 1.4;

  ctx.save();
  roundRectPath(ctx, cardX, cardY, cardW, cardH, 28);
  ctx.clip();

  // Header Bar Background
  const headerH = 140;
  ctx.fillStyle = pal.headerBg;
  ctx.fillRect(cardX, cardY, stubSplitX - cardX, headerH);

  // Studio Stamp Top Left
  ctx.fillStyle = pal.accentYellow;
  ctx.font = `800 18px ${theme.font.mono}`;
  ctx.fillText("2:47 PM STUDIO", contentX, cardY + 36);

  // Date Top Right
  ctx.textAlign = "right";
  ctx.fillText("GOA, INDIA · 28-31 OCT 2026", contentX + contentW, cardY + 36);
  ctx.textAlign = "left";

  // Main Banner "HACKER HOUSE"
  ctx.fillStyle = pal.titleColor;
  ctx.font = `900 58px ${theme.font.serif}`;
  ctx.fillText("HACKER HOUSE", contentX, cardY + 104);

  // Devanagari "गोवा" Badge positioned to the right of the title
  const titleWidth = ctx.measureText("HACKER HOUSE").width;
  drawGoaBadge(ctx, contentX + titleWidth + 70, cardY + 80, 1.1, pal.accentMagenta, pal.accentYellow);

  // Header Divider Line
  ctx.strokeStyle = pal.accentMagenta;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(contentX, cardY + headerH);
  ctx.lineTo(contentX + contentW, cardY + headerH);
  ctx.stroke();

  // --- Passenger Body Section ---------------------------------------------
  const isTeam = data.passengers.length > 1;
  const p0 = data.passengers[0];

  if (!isTeam) {
    drawSoloBody(ctx, p0, contentX, cardY, headerH, pal);
  } else {
    drawTeamBody(ctx, data.passengers, contentX, cardY, contentW, headerH, pal);
  }

  // Draw Sticker Badge if selected
  if (data.stickerPreset && data.stickerPreset !== "none") {
    drawStickerBadge(ctx, contentX + contentW - 110, cardY + headerH + 20, data.stickerPreset, pal.accentYellow);
  }

  // Draw Integrated Airplane-Window Co-Pilot Mascot if uploaded!
  if (p0?.characterPhoto) {
    const winW = 130;
    const winH = 150;
    const winX = contentX + contentW - winW - 10;
    const winY = cardY + headerH + 45;
    const speech = p0.coPilotSpeech || "Ready for takeoff! 🚀";

    drawCoPilotWindow(ctx, winX, winY, winW, winH, p0.characterPhoto, speech, pal);
  }

  // --- Signpost Field Badges (SEAT / GATE / CLASS) -------------------------
  const fieldY = cardY + cardH - 195;
  const fields: [string, string, string][] = isTeam
    ? [
        ["ROW", data.seat, pal.accentYellow],
        ["GATE", data.gate, pal.accentMagenta],
        ["SQUAD", `${data.passengers.length} BUILDERS`, pal.accentYellow],
      ]
    : [
        ["SEAT", data.seat, pal.accentYellow],
        ["GATE", data.gate, pal.accentMagenta],
        ["CLASS", p0?.builderTitle ?? "", pal.accentYellow],
      ];

  const fieldColW = contentW / 3;
  fields.forEach(([label, value, badgeColor], i) => {
    const fx = contentX + i * fieldColW;

    ctx.fillStyle = pal.navy;
    ctx.font = `700 18px ${theme.font.mono}`;
    ctx.fillText(label, fx, fieldY);

    const bw = fieldColW - 24;
    const bh = 54;
    const by = fieldY + 12;

    roundRectPath(ctx, fx, by, bw, bh, 12);
    ctx.fillStyle = badgeColor;
    ctx.fill();
    ctx.strokeStyle = pal.navy;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = badgeColor === pal.accentYellow ? pal.navy : "#FFFFFF";
    ctx.font = `700 24px ${theme.font.mono}`;
    wrapOrFit(ctx, value.toUpperCase(), fx + 12, by + 34, bw - 24, 24);
  });

  // Footer Meta Line
  ctx.strokeStyle = pal.sand;
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(contentX, cardY + cardH - 68);
  ctx.lineTo(contentX + contentW, cardY + cardH - 68);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = pal.navy;
  ctx.font = `600 18px ${theme.font.mono}`;
  ctx.fillText(
    `FLIGHT ${data.flightCode} · ${isTeam ? "TEAM MANIFEST" : "SOLO BUILDER PASS"} · 2:47 PM STUDIO`,
    contentX,
    cardY + cardH - 36
  );

  ctx.restore(); // end main stub clip

  // --- Perforation Seam --------------------------------------------------
  drawPerforation(ctx, stubSplitX, cardY, cardY + cardH, pal.bg, pal.sand);

  // --- QR Right Stub -----------------------------------------------------
  ctx.save();
  roundRectPath(ctx, cardX, cardY, cardW, cardH, 28);
  ctx.clip();

  const stubW = cardX + cardW - stubSplitX;
  const stubCx = stubSplitX + stubW / 2;

  // Stub Background
  ctx.fillStyle = pal.accentYellow;
  ctx.fillRect(stubSplitX, cardY, stubW, cardH);

  // Stub Header Banner
  ctx.fillStyle = pal.headerBg;
  ctx.fillRect(stubSplitX, cardY, stubW, 60);

  ctx.fillStyle = pal.accentYellow;
  ctx.font = `800 18px ${theme.font.mono}`;
  ctx.textAlign = "center";
  ctx.fillText("HH GOA 26", stubCx, cardY + 36);

  // QR Code
  const qrSize = Math.min(stubW - 60, 240);
  try {
    const qrBitmap = await qrToImageBitmap(data.qrPayload, qrSize, pal.navy);
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
  ctx.fillStyle = pal.accentMagenta;
  ctx.fill();
  ctx.strokeStyle = pal.navy;
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = "#FFFFFF";
  ctx.font = `800 24px ${theme.font.mono}`;
  ctx.textAlign = "center";
  ctx.fillText(data.seat, stubCx, cardY + 84 + qrSize + 56);

  // Vertical Text #FrameInGoa
  ctx.save();
  ctx.translate(stubCx, cardY + cardH - 50);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = pal.navy;
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
  headerH: number,
  pal: ThemeColors
) {
  const photoR = 85;
  const photoCx = contentX + photoR;
  const photoCy = cardY + headerH + 30 + photoR;

  // Photo
  drawCircularPhoto(ctx, passenger?.photo ?? null, photoCx, photoCy, photoR, passenger?.faceCenter);
  ctx.strokeStyle = pal.accentYellow;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(photoCx, photoCy, photoR + 4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = pal.headerBg;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(photoCx, photoCy, photoR + 9, 0, Math.PI * 2);
  ctx.stroke();

  const textX = photoCx + photoR + 32;
  ctx.fillStyle = pal.navy;
  ctx.font = `700 44px ${theme.font.display}`;
  ctx.textAlign = "left";
  ctx.fillText(passenger?.name || "Builder Name", textX, photoCy - 18);

  ctx.fillStyle = pal.accentMagenta;
  ctx.font = `600 24px ${theme.font.mono}`;
  ctx.fillText(passenger?.stackOrRole || "Stack / Role", textX, photoCy + 20);

  // Customized Motto / Status Tagline!
  const motto = passenger?.customMotto || "Shipping at HH Goa 2026 🚀";
  ctx.fillStyle = pal.navy;
  ctx.font = `500 18px ${theme.font.mono}`;
  ctx.fillText(`"${motto}"`, textX, photoCy + 52);
}

function drawTeamBody(
  ctx: CanvasRenderingContext2D,
  passengers: Passenger[],
  contentX: number,
  cardY: number,
  contentW: number,
  headerH: number,
  pal: ThemeColors
) {
  const shown = passengers.slice(0, 4);
  const overflow = passengers.length - shown.length;
  const rowY = cardY + headerH + 54;
  const thumbR = 54;
  const gap = (contentW - shown.length * thumbR * 2) / Math.max(shown.length - 1, 1);

  shown.forEach((p, i) => {
    const cx = contentX + thumbR + i * (thumbR * 2 + gap);
    drawCircularPhoto(ctx, p.photo, cx, rowY, thumbR, p.faceCenter);
    ctx.strokeStyle = pal.accentYellow;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(cx, rowY, thumbR + 3, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = pal.navy;
    ctx.font = `700 18px ${theme.font.display}`;
    ctx.textAlign = "center";
    const firstName = (p.name || `Builder ${i + 1}`).split(" ")[0];
    ctx.fillText(firstName, cx, rowY + thumbR + 26);

    if (p.stackOrRole) {
      ctx.fillStyle = pal.accentMagenta;
      ctx.font = `600 13px ${theme.font.mono}`;
      wrapOrFit(ctx, p.stackOrRole, cx, rowY + thumbR + 46, thumbR * 2 + 10, 13);
    }
  });

  if (overflow > 0) {
    ctx.fillStyle = pal.accentMagenta;
    ctx.font = `700 18px ${theme.font.mono}`;
    ctx.textAlign = "left";
    ctx.fillText(`+${overflow} more`, contentX + contentW - 110, rowY + thumbR + 26);
  }

  ctx.textAlign = "left";
  ctx.fillStyle = pal.navy;
  ctx.font = `700 36px ${theme.font.display}`;
  ctx.fillText("Team Builder Crew 🚀", contentX, rowY + thumbR + 90);
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
