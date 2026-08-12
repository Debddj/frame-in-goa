/**
 * OffscreenCanvas Web Worker aligned with HH Goa 26 Brand Kit + Customizations.
 */

import { theme, themePalettes } from "../lib/theme";
import { getCropStrategy } from "../lib/smart-crop";
import { generateNoiseTexture } from "../lib/noise-texture";
import type { FaceCenter } from "../lib/face-detector";
import type { StickerPreset, ThemePreset } from "../lib/types";

const T = theme.color;

export interface RenderRequest {
  type: "render";
  format: "boardingPass" | "porthole";
  photo?: ImageBitmap;
  builderNumber?: string;
  faceCenter?: FaceCenter | null;
  themePreset?: ThemePreset;
  stickerPreset?: StickerPreset;
  characterPhoto?: ImageBitmap;
  boardingPass?: {
    passengers: Array<{
      name: string;
      stackOrRole: string;
      builderTitle: string;
      photo?: ImageBitmap;
      faceCenter?: FaceCenter | null;
      characterPhoto?: ImageBitmap;
      customMotto?: string;
      coPilotSpeech?: string;
    }>;
    seat: string;
    gate: string;
    flightCode: string;
    qrBitmap?: ImageBitmap;
    isTeam: boolean;
    themePreset?: ThemePreset;
    stickerPreset?: StickerPreset;
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

function drawPerforation(
  ctx: OffscreenCanvasRenderingContext2D,
  x: number, yTop: number, yBottom: number, bgColor: string,
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

function drawStickerBadgeWorker(
  ctx: OffscreenCanvasRenderingContext2D,
  x: number,
  y: number,
  sticker: StickerPreset,
  accentColor: string
) {
  if (sticker === "none") return;

  const labels: Record<Exclude<StickerPreset, "none">, { text: string }> = {
    pirate: { text: "PIRATE CREW 🏴‍☠️" },
    cyber: { text: "CYBER HACKER ⚡" },
    anime: { text: "ANIME MODE 🎌" },
    rocket: { text: "SHIPPING 3AM 🚀" },
    palm: { text: "GOA CHILL 🌴" },
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

function drawCoPilotWindow(
  ctx: OffscreenCanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  bitmap: ImageBitmap,
  speechText: string,
  pal: (typeof themePalettes)[keyof typeof themePalettes]
) {
  ctx.save();

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

  const pad = 10;
  const ix = x + pad;
  const iy = y + pad;
  const iw = w - pad * 2;
  const ih = h - pad * 2 - 18;
  const ir = r - 6;

  ctx.save();
  roundRectPath(ctx, ix, iy, iw, ih, ir);
  ctx.clip();
  drawCropped(ctx, bitmap, ix, iy, iw, ih);
  ctx.restore();

  roundRectPath(ctx, ix, iy, iw, ih, ir);
  ctx.strokeStyle = pal.navy;
  ctx.lineWidth = 3;
  ctx.stroke();

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
  faceCenter?: FaceCenter | null,
  themePreset: ThemePreset = "palmEmerald",
  characterPhoto?: ImageBitmap
): ImageBitmap {
  const pal = themePalettes[themePreset] || themePalettes.palmEmerald;
  const { w, h } = theme.export.porthole;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = pal.bg;
  ctx.fillRect(0, 0, w, h);

  drawPalmTreeAccentWorker(ctx, 40, h - 180, 2.2, pal.headerBg);
  drawPalmTreeAccentWorker(ctx, w - 120, h - 220, 2.5, pal.headerBg);

  const cx = w / 2;
  const cy = h / 2 - 20;
  const photoRadius = w * 0.35;

  drawCircularPhoto(ctx, photo, cx, cy, photoRadius, faceCenter, pal.sand);

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

  const badgeCx = cx + photoRadius * 0.72;
  const badgeCy = cy + photoRadius * 0.72;
  drawGoaBadgeWorker(ctx, badgeCx, badgeCy, 1.4, pal.accentMagenta, pal.accentYellow);

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

  ctx.save();
  ctx.fillStyle = pal.cardStock;
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

  const themePreset = data.themePreset || "palmEmerald";
  const pal = themePalettes[themePreset] || themePalettes.palmEmerald;

  const { w, h } = theme.export.boardingPass;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = pal.bg;
  ctx.fillRect(0, 0, w, h);

  drawPalmTreeAccentWorker(ctx, 20, 20, 2, pal.headerBg);
  drawPalmTreeAccentWorker(ctx, w - 80, h - 160, 2.2, pal.headerBg);

  const margin = 40;
  const cardX = margin;
  const cardY = margin;
  const cardW = w - margin * 2;
  const cardH = h - margin * 2;
  const stubSplitX = cardX + cardW * 0.74;

  roundRectPath(ctx, cardX, cardY, cardW, cardH, 28);
  ctx.fillStyle = pal.cardStock;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = pal.accentYellow;
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
  ctx.fillStyle = pal.headerBg;
  ctx.fillRect(cardX, cardY, stubSplitX - cardX, headerH);

  ctx.fillStyle = pal.accentYellow;
  ctx.font = `800 18px ${theme.font.mono}`;
  ctx.fillText("2:47 PM STUDIO", contentX, cardY + 36);

  ctx.textAlign = "right";
  ctx.fillText("GOA, INDIA · 28-31 OCT 2026", contentX + contentW, cardY + 36);
  ctx.textAlign = "left";

  ctx.fillStyle = pal.titleColor;
  ctx.font = `900 58px ${theme.font.serif}`;
  ctx.fillText("HACKER HOUSE", contentX, cardY + 104);

  const titleWidth = ctx.measureText("HACKER HOUSE").width;
  drawGoaBadgeWorker(ctx, contentX + titleWidth + 70, cardY + 80, 1.1, pal.accentMagenta, pal.accentYellow);

  ctx.strokeStyle = pal.accentMagenta;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(contentX, cardY + headerH);
  ctx.lineTo(contentX + contentW, cardY + headerH);
  ctx.stroke();

  const isTeam = data.isTeam;
  const p0 = data.passengers[0];

  if (!isTeam) {
    const photoR = 85;
    const photoCx = contentX + photoR;
    const photoCy = cardY + headerH + 30 + photoR;
    drawCircularPhoto(ctx, p0?.photo, photoCx, photoCy, photoR, p0?.faceCenter, pal.sand);
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
    ctx.fillText(p0?.name || "Builder Name", textX, photoCy - 18);
    ctx.fillStyle = pal.accentMagenta;
    ctx.font = `600 24px ${theme.font.mono}`;
    ctx.fillText(p0?.stackOrRole || "Stack / Role", textX, photoCy + 20);

    const motto = p0?.customMotto || "Shipping at HH Goa 2026 🚀";
    ctx.fillStyle = pal.navy;
    ctx.font = `500 18px ${theme.font.mono}`;
    ctx.fillText(`"${motto}"`, textX, photoCy + 52);
  } else {
    const shown = data.passengers.slice(0, 4);
    const overflow = data.passengers.length - shown.length;
    const rowY = cardY + headerH + 54;
    const thumbR = 54;
    const gap = (contentW - shown.length * thumbR * 2) / Math.max(shown.length - 1, 1);
    shown.forEach((p, i) => {
      const pcx = contentX + thumbR + i * (thumbR * 2 + gap);
      drawCircularPhoto(ctx, p.photo, pcx, rowY, thumbR, p.faceCenter, pal.sand);
      ctx.strokeStyle = pal.accentYellow;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(pcx, rowY, thumbR + 3, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = pal.navy;
      ctx.font = `700 18px ${theme.font.display}`;
      ctx.textAlign = "center";
      const firstName = (p.name || `Builder ${i + 1}`).split(" ")[0];
      ctx.fillText(firstName, pcx, rowY + thumbR + 26);

      if (p.stackOrRole) {
        ctx.fillStyle = pal.accentMagenta;
        ctx.font = `600 13px ${theme.font.mono}`;
        wrapOrFit(ctx, p.stackOrRole, pcx, rowY + thumbR + 46, thumbR * 2 + 10, 13);
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

  if (data.stickerPreset && data.stickerPreset !== "none") {
    drawStickerBadgeWorker(ctx, contentX + contentW - 110, cardY + headerH + 20, data.stickerPreset, pal.accentYellow);
  }

  if (p0?.characterPhoto) {
    const winW = 130;
    const winH = 150;
    const winX = contentX + contentW - winW - 10;
    const winY = cardY + headerH + 45;
    const speech = p0.coPilotSpeech || "Ready for takeoff! 🚀";

    drawCoPilotWindow(ctx, winX, winY, winW, winH, p0.characterPhoto, speech, pal);
  }

  const fieldY = cardY + cardH - 195;
  const fields: [string, string, string][] = isTeam
    ? [["ROW", data.seat, pal.accentYellow], ["GATE", data.gate, pal.accentMagenta], ["SQUAD", `${data.passengers.length} BUILDERS`, pal.accentYellow]]
    : [["SEAT", data.seat, pal.accentYellow], ["GATE", data.gate, pal.accentMagenta], ["CLASS", p0?.builderTitle ?? "", pal.accentYellow]];

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
    contentX, cardY + cardH - 36
  );
  ctx.restore();

  drawPerforation(ctx, stubSplitX, cardY, cardY + cardH, pal.bg, pal.sand);

  ctx.save();
  roundRectPath(ctx, cardX, cardY, cardW, cardH, 28);
  ctx.clip();

  const stubW = cardX + cardW - stubSplitX;
  const stubCx = stubSplitX + stubW / 2;

  ctx.fillStyle = pal.accentYellow;
  ctx.fillRect(stubSplitX, cardY, stubW, cardH);

  ctx.fillStyle = pal.headerBg;
  ctx.fillRect(stubSplitX, cardY, stubW, 60);

  ctx.fillStyle = pal.accentYellow;
  ctx.font = `800 18px ${theme.font.mono}`;
  ctx.textAlign = "center";
  ctx.fillText("HH GOA 26", stubCx, cardY + 36);

  const qrSize = Math.min(stubW - 60, 240);

  if (data.qrBitmap) {
    ctx.drawImage(data.qrBitmap, stubCx - qrSize / 2, cardY + 84, qrSize, qrSize);
  }

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

  ctx.save();
  ctx.translate(stubCx, cardY + cardH - 50);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = pal.navy;
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
    bitmap = renderPorthole(offscreen, req.photo, req.builderNumber ?? "", req.faceCenter, req.themePreset, req.characterPhoto);
  } else {
    bitmap = renderBoardingPass(offscreen, req.boardingPass);
  }

  (self as unknown as Worker).postMessage(
    { type: "rendered", bitmap } satisfies RenderResponse,
    [bitmap] as unknown as Transferable[]
  );
};
