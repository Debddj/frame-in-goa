import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { decodeShareId } from "@/lib/share";

interface Props {
  params: Promise<{ id: string }>;
}

function safeDecodeImageUrl(id: string): string | null {
  try {
    const url = decodeShareId(id);
    if (!/^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//.test(url)) {
      return null;
    }
    return url;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const imageUrl = safeDecodeImageUrl(id);

  const title = "I'm building at HH Goa 2026 🌴 | 2:47 PM Studio";
  const description = "Frame yourself in for Hacker House Goa 2026 — #FrameInGoa";

  if (!imageUrl) {
    return { title, description };
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl, width: 1600, height: 1000 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function SharePage({ params }: Props) {
  const { id } = await params;
  const imageUrl = safeDecodeImageUrl(id);

  return (
    <main className="min-h-screen bg-[#055C2E] text-[#FFFDF2] flex flex-col items-center justify-center gap-8 p-6 relative overflow-hidden">
      {/* Background Palm & Sun Accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#FFEB00]/[0.08] blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-64 h-64 rounded-full bg-[#FF007A]/[0.08] blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-xl w-full">
        {/* Studio Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-[#FFEB00] bg-[#02381A] font-mono text-xs font-bold text-[#FFEB00]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF007A] animate-pulse" />
          <span>HH GOA 2026 · 2:47 PM STUDIO</span>
        </div>

        <div className="relative text-center">
          <h1 className="font-serif text-3xl font-black text-[#FFEB00]">
            HACKER HOUSE
          </h1>
          <span className="goa-badge text-sm absolute -top-2 right-[-10px]">
            गोवा
          </span>
        </div>

        {imageUrl ? (
          <div className="rounded-2xl overflow-hidden border-2 border-[#FFEB00]/40 p-3 glass w-full shadow-2xl shadow-[#02381A]">
            <Image
              src={imageUrl}
              alt="HH Goa 2026 boarding pass"
              width={800}
              height={500}
              className="w-full h-auto rounded-xl"
              unoptimized
            />
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-[#FFEB00]/30 p-8 glass text-center">
            <p className="text-[#FFEB00] font-mono text-sm font-bold">
              This pass link isn&apos;t valid anymore.
            </p>
          </div>
        )}

        <div className="flex gap-3 w-full max-w-xs">
          {imageUrl && (
            <a
              href={imageUrl}
              download="hhgoa-boarding-pass.png"
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-[#FFEB00] py-3.5 font-mono text-sm font-extrabold text-[#FFEB00] bg-[#02381A] hover:bg-[#FFEB00] hover:text-[#02381A] transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              DOWNLOAD
            </a>
          )}
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#FF007A] border-2 border-[#FFEB00] py-3.5 font-mono text-sm font-black text-[#FFFDF2] hover:bg-[#C7005F] shadow-lg shadow-[#FF007A]/30 transition-all"
          >
            MAKE YOUR OWN →
          </Link>
        </div>

        <p className="font-mono text-xs font-bold text-[#FFEB00]/80 tracking-widest uppercase">
          #FrameInGoa · 2:47 PM STUDIO
        </p>
      </div>
    </main>
  );
}
