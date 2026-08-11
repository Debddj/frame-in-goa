"use client";

import { useCallback, useRef, useState } from "react";
import { ensureDecodable } from "@/lib/heic";
import { detectFaceCenter, type FaceCenter } from "@/lib/face-detector";

interface Props {
  label: string;
  photoObjectUrl: string | null;
  onPhoto: (bitmap: ImageBitmap, objectUrl: string, faceCenter: FaceCenter | null) => void;
}

export default function UploadZone({ label, photoObjectUrl, onPhoto }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [justUploaded, setJustUploaded] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setBusy(true);
      setJustUploaded(false);
      try {
        const decodable = await ensureDecodable(file);
        const objectUrl = URL.createObjectURL(decodable);
        const bitmap = await createImageBitmap(decodable);

        const faceCenter = await detectFaceCenter(bitmap);

        onPhoto(bitmap, objectUrl, faceCenter);
        setJustUploaded(true);
        setTimeout(() => setJustUploaded(false), 1500);
      } catch {
        setError("Couldn't read that photo — try a different JPG, PNG, or HEIC.");
      } finally {
        setBusy(false);
      }
    },
    [onPhoto]
  );

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.heic,.heif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        className={`w-full flex items-center gap-4 rounded-xl border-2 p-3.5 text-left transition-all duration-200 ${
          isDragOver
            ? "border-[#FFEB00] bg-[#FFEB00]/20 scale-[1.02]"
            : justUploaded
            ? "border-[#FFEB00] bg-[#FFEB00]/10"
            : "border-[#FFEB00]/30 hover:border-[#FFEB00] bg-[#02381A]/60"
        }`}
      >
        <div className={`w-14 h-14 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center relative border-2 ${
          photoObjectUrl ? "border-[#FFEB00]" : "border-[#FFEB00]/40 bg-[#02381A]"
        }`}>
          {photoObjectUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoObjectUrl} alt="" className="w-full h-full object-cover" />
              {justUploaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#FF007A]/80 rounded-full animate-check-pop">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </>
          ) : busy ? (
            <div className="w-7 h-7 rounded-full border-2 border-[#FFEB00]/20 border-t-[#FF007A] animate-spin" />
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFEB00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          )}
        </div>
        <div className="font-mono text-sm min-w-0">
          <div className="text-[#FFFDF2] font-bold truncate">{label}</div>
          <div className={`text-xs font-semibold transition-colors duration-200 ${
            busy
              ? "text-[#FF007A]"
              : justUploaded
              ? "text-[#FFEB00]"
              : "text-[#FFEB00]/70"
          }`}>
            {busy
              ? "Processing photo & detecting face…"
              : justUploaded
              ? "Photo ready ✓"
              : "Upload JPG, PNG, or HEIC (iPhone)"}
          </div>
        </div>
      </button>
      {error && <p className="text-xs text-[#FF007A] font-bold mt-1 font-mono">{error}</p>}
    </div>
  );
}
