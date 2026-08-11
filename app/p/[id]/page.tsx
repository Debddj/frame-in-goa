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
    // Only ever trust our own blob store — never let an arbitrary id
    // turn this into an open image-proxy / OG redirector.
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

  const title = "I'm building at HH Goa 2026 🌴";
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
    <main className="min-h-screen bg-[#12181F] flex flex-col items-center justify-center gap-8 p-6 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-[#FF6B4A]/[0.04] blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-48 h-48 rounded-full bg-[#1F8A70]/[0.05] blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-xl w-full">
        {/* Live badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF6B4A]/20 bg-[#FF6B4A]/5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A] animate-pulse" />
          <span className="font-mono text-[10px] tracking-widest text-[#FF6B4A] uppercase">
            HH Goa 2026
          </span>
        </div>

        <h1 className="font-display text-2xl font-semibold text-center text-[#F6EFE1]">
          I&apos;m building at HH Goa 2026 🌴
        </h1>

        {imageUrl ? (
          <div className="rounded-2xl overflow-hidden border border-[#D8C9A3]/10 p-3 glass w-full">
            <Image
              src={imageUrl}
              alt="HH Goa 2026 boarding pass"
              width={800}
              height={500}
              className="w-full h-auto rounded-lg"
              unoptimized
            />
          </div>
        ) : (
          <div className="rounded-2xl border border-[#D8C9A3]/15 p-8 glass text-center">
            <p className="text-[#D8C9A3] font-mono text-sm">
              This pass link isn&apos;t valid anymore.
            </p>
          </div>
        )}

        <div className="flex gap-3 w-full max-w-xs">
          {imageUrl && (
            <a
              href={imageUrl}
              download="hhgoa-boarding-pass.png"
              className="flex-1 flex items-center justify-center gap-2 rounded-full border border-[#D8C9A3]/25 py-3 font-mono text-sm text-[#F6EFE1] hover:border-[#D8C9A3]/50 hover:bg-[#1B2430]/50 transition-all duration-200"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download
            </a>
          )}
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 rounded-full bg-[#FF6B4A] py-3 font-mono text-sm text-[#12181F] font-medium hover:bg-[#FF6B4A]/90 shadow-lg shadow-[#FF6B4A]/20 transition-all duration-200"
          >
            Make your own →
          </Link>
        </div>

        <p className="font-mono text-[10px] text-[#D8C9A3]/30 tracking-widest uppercase">
          #FrameInGoa · Built for HH Goa 2026
        </p>
      </div>
    </main>
  );
}
