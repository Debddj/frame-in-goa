"use client";

import { useState } from "react";

interface Props {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  fileNamePrefix: string;
  caption: string;
  hasPhoto: boolean;
}

async function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
      "image/png",
      1
    );
  });
}

export default function ShareActions({ canvasRef, fileNamePrefix, caption, hasPhoto }: Props) {
  const [status, setStatus] = useState<"idle" | "working">("idle");
  const [error, setError] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState(false);

  async function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const blob = await canvasToPngBlob(canvas);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileNamePrefix}-${Date.now()}.png`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  }

  async function handleShare() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setError(null);
    setStatus("working");

    try {
      const blob = await canvasToPngBlob(canvas);
      const file = new File([blob], "frame-in-goa.png", { type: "image/png" });

      if (
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          text: caption,
        });
        return;
      }

      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/share", { method: "POST", body: formData });
      if (!res.ok) throw new Error("upload failed");
      const { id } = (await res.json()) as { id: string };

      const shareUrl = `${window.location.origin}/p/${id}`;
      const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        caption
      )}&url=${encodeURIComponent(shareUrl)}`;
      window.open(intent, "_blank", "noopener,noreferrer");
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") return;
      setError("Couldn't share automatically — download and post it manually.");
    } finally {
      setStatus("idle");
    }
  }

  const disabled = !hasPhoto || status === "working";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <button
          onClick={handleDownload}
          disabled={!hasPhoto}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl border-2 py-3.5 font-mono text-sm font-extrabold transition-all duration-200 ${
            !hasPhoto
              ? "border-[#FFEB00]/20 text-[#FFFDF2]/30 cursor-not-allowed bg-[#02381A]/40"
              : downloaded
              ? "border-[#FFEB00] text-[#02381A] bg-[#FFEB00]"
              : "border-[#FFEB00] text-[#FFEB00] bg-[#02381A] hover:bg-[#FFEB00] hover:text-[#02381A]"
          }`}
        >
          {downloaded ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              SAVED!
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              DOWNLOAD
            </>
          )}
        </button>
        <button
          onClick={handleShare}
          disabled={disabled}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3.5 font-mono text-sm font-black transition-all duration-200 ${
            disabled
              ? "bg-[#FF007A]/30 text-[#FFFDF2]/40 cursor-not-allowed border-2 border-[#FF007A]/20"
              : "bg-[#FF007A] text-[#FFFDF2] border-2 border-[#FFEB00] hover:bg-[#C7005F] shadow-lg shadow-[#FF007A]/30 active:scale-[0.98]"
          } ${hasPhoto && status === "idle" ? "animate-pulse-glow-brand" : ""}`}
        >
          {status === "working" ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
                <line x1="12" y1="2" x2="12" y2="6" />
                <line x1="12" y1="18" x2="12" y2="22" />
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                <line x1="2" y1="12" x2="6" y2="12" />
                <line x1="18" y1="12" x2="22" y2="12" />
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
              </svg>
              PREPARING…
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              SHARE TO X
            </>
          )}
        </button>
      </div>
      {!hasPhoto && (
        <p className="text-[11px] text-[#FFEB00]/60 font-mono font-bold text-center">
          Upload a photo to enable download and sharing
        </p>
      )}
      {error && <p className="text-xs text-[#FF007A] font-mono font-bold text-center">{error}</p>}
    </div>
  );
}
