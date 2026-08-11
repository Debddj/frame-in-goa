/**
 * Generates a subtle paper/grain noise texture as ImageData. The texture
 * is cached after first generation and applied as a multiply-blend overlay
 * on the boarding pass card body to sell "real ticket paper." This is a
 * purely client-side effect — no image assets to load.
 *
 * The noise pattern is deterministic for a given size, using a simple
 * LCG PRNG so results are consistent across renders.
 */

const cachedNoise: Map<string, ImageData> = new Map();

/** Simple LCG PRNG for deterministic noise. */
function lcg(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

/**
 * Returns an ImageData containing monochrome noise. Each pixel gets a
 * random brightness between `lo` and `hi` (0–255), applied to all
 * RGB channels equally with a fixed alpha.
 */
export function generateNoiseTexture(
  width: number,
  height: number,
  alpha = 12,
  lo = 0,
  hi = 255,
  seed = 42
): ImageData {
  const key = `${width}x${height}@${alpha}-${lo}-${hi}-${seed}`;
  const cached = cachedNoise.get(key);
  if (cached) return cached;

  const imageData = new ImageData(width, height);
  const data = imageData.data;
  const rand = lcg(seed);

  for (let i = 0; i < data.length; i += 4) {
    const v = lo + Math.floor(rand() * (hi - lo));
    data[i] = v;
    data[i + 1] = v;
    data[i + 2] = v;
    data[i + 3] = alpha;
  }

  cachedNoise.set(key, imageData);
  return imageData;
}

/**
 * Applies a subtle noise overlay to a region of the canvas using
 * a temporary canvas and globalCompositeOperation = "multiply".
 * This gives the card a physical paper-grain feel.
 */
export function applyNoiseOverlay(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  alpha = 15
) {
  const noise = generateNoiseTexture(w, h, alpha);
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = w;
  tempCanvas.height = h;
  const tempCtx = tempCanvas.getContext("2d")!;
  tempCtx.putImageData(noise, 0, 0);

  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.globalAlpha = 0.4;
  ctx.drawImage(tempCanvas, x, y);
  ctx.restore();
}
