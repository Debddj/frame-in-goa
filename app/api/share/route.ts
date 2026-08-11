import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { encodeShareId } from "@/lib/share";

// This route is the ONLY server-side piece the whole app needs, and it's
// only hit when someone picks "share via link" instead of the mobile
// native share sheet (which attaches the file directly and never touches
// a server at all). Requires a Blob store attached to the Vercel project
// (sets BLOB_READ_WRITE_TOKEN automatically) — see README for setup.

export const runtime = "nodejs";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("image");

  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: "Missing image" }, { status: 400 });
  }

  const filename = `frame-in-goa/${crypto.randomUUID()}.png`;

  const blob = await put(filename, file, {
    access: "public",
    contentType: "image/png",
    // Auto-cleanup: shortlisting closes Aug 13, no reason to keep these
    // around indefinitely on a free tier.
    addRandomSuffix: false,
  });

  const id = encodeShareId(blob.url);

  return NextResponse.json({ id, url: blob.url });
}
