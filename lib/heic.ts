/**
 * iPhone photos land as image/heic or image/heif, which Chrome, Firefox,
 * and most non-Safari browsers cannot decode — an <img> or canvas draw
 * just silently fails or renders blank. This is one of the most common
 * ways these "upload any photo" tools break in practice.
 *
 * We detect HEIC/HEIF by MIME type AND by file extension (iOS sometimes
 * hands the browser a blob with an empty/generic MIME type), and convert
 * to a JPEG blob client-side before anything touches the canvas.
 */

const HEIC_EXTENSIONS = [".heic", ".heif"];
const HEIC_MIME_TYPES = ["image/heic", "image/heif", "image/heic-sequence", "image/heif-sequence"];

export function looksLikeHeic(file: File): boolean {
  if (HEIC_MIME_TYPES.includes(file.type.toLowerCase())) return true;
  const name = file.name.toLowerCase();
  return HEIC_EXTENSIONS.some((ext) => name.endsWith(ext));
}

/**
 * Returns a browser-decodable image File. Passes non-HEIC files through
 * untouched. Converts HEIC/HEIF to JPEG using heic2any (WASM, client-side,
 * no upload required — keeps the "no server round trip" requirement intact).
 */
export async function ensureDecodable(file: File): Promise<File> {
  if (!looksLikeHeic(file)) return file;

  // Dynamic import: heic2any is a sizeable WASM payload we only want to
  // pay for when someone actually uploads a HEIC file.
  const heic2any = (await import("heic2any")).default;

  const converted = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 0.92,
  });

  // heic2any can return an array for multi-image HEIC containers (bursts);
  // we only care about the first frame.
  const blob = Array.isArray(converted) ? converted[0] : converted;

  return new File([blob], file.name.replace(/\.(heic|heif)$/i, ".jpg"), {
    type: "image/jpeg",
  });
}
