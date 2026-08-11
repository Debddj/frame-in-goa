/**
 * The brief requires that link-shares show the real generated graphic as
 * the OG preview, not a static default. Rather than standing up a database
 * to map share ids -> images, we exploit the fact that the id only needs
 * to round-trip the blob's own public URL: base64url-encode the full URL
 * into the id, decode it back out in the share page. No DB, no KV, no
 * extra moving part — just Vercel Blob (public, no login) plus a pure
 * encode/decode function. The id is longer than a typical short-link, but
 * it's going inside an X share intent, not something someone types by hand.
 */

export function encodeShareId(blobUrl: string): string {
  return Buffer.from(blobUrl, "utf8").toString("base64url");
}

export function decodeShareId(id: string): string {
  return Buffer.from(id, "base64url").toString("utf8");
}
