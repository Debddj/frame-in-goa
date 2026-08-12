"use client";

import { useCallback, useRef, useState } from "react";
import type { StickerPreset, ThemePreset } from "@/lib/types";

interface Props {
  themePreset: ThemePreset;
  onSelectTheme: (theme: ThemePreset) => void;
  stickerPreset: StickerPreset;
  onSelectSticker: (sticker: StickerPreset) => void;
  characterPhotoUrl: string | null;
  onCharacterPhoto: (bitmap: ImageBitmap | null, url: string | null) => void;
  customMotto: string;
  onMottoChange: (motto: string) => void;
}

export function CustomizerPanel({
  themePreset,
  onSelectTheme,
  stickerPreset,
  onSelectSticker,
  characterPhotoUrl,
  onCharacterPhoto,
  customMotto,
  onMottoChange,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleCharacterFile = useCallback(
    async (file: File) => {
      setBusy(true);
      try {
        const objectUrl = URL.createObjectURL(file);
        const bitmap = await createImageBitmap(file);
        onCharacterPhoto(bitmap, objectUrl);
      } catch {
        // error handling
      } finally {
        setBusy(false);
      }
    },
    [onCharacterPhoto]
  );

  const themeOptions: Array<{ id: ThemePreset; name: string; bg: string; accent: string }> = [
    { id: "palmEmerald", name: "Palm Emerald", bg: "#055C2E", accent: "#FFEB00" },
    { id: "sunsetVaporwave", name: "Sunset Vaporwave", bg: "#2A0845", accent: "#FF007A" },
    { id: "cyberMidnight", name: "Cyber Midnight", bg: "#0D1117", accent: "#39FF14" },
    { id: "vintageTicket", name: "Vintage Ticket", bg: "#3B2F2F", accent: "#D4A373" },
  ];

  const stickerOptions: Array<{ id: StickerPreset; label: string }> = [
    { id: "none", label: "None" },
    { id: "pirate", label: "🏴‍☠️ Pirate Crew" },
    { id: "cyber", label: "⚡ Cyber Hacker" },
    { id: "anime", label: "🎌 Anime Mode" },
    { id: "rocket", label: "🚀 Shipping 3AM" },
    { id: "palm", label: "🌴 Goa Chill" },
  ];

  return (
    <div className="flex flex-col gap-5 glass p-5 rounded-2xl border-2 border-[#FFEB00]/40 shadow-xl">
      <div className="flex items-center justify-between border-b border-[#FFEB00]/20 pb-3 font-mono">
        <h3 className="text-sm font-extrabold text-[#FFEB00] uppercase tracking-wider flex items-center gap-2">
          <span>🎨</span>
          <span>CREATIVE CUSTOMIZER</span>
        </h3>
        <span className="text-[10px] text-[#FFFDF2]/60 uppercase font-bold">Total Freedom</span>
      </div>

      {/* 🎨 Theme Palettes */}
      <div className="flex flex-col gap-2 font-mono">
        <label className="text-xs font-bold text-[#FFFDF2]/90">1. PASS COLOR PALETTE</label>
        <div className="grid grid-cols-2 gap-2.5">
          {themeOptions.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelectTheme(t.id)}
              className={`flex items-center gap-3 p-2.5 rounded-xl border-2 transition-all text-xs font-bold text-left ${
                themePreset === t.id
                  ? "border-[#FFEB00] bg-[#02381A] shadow-md shadow-[#FFEB00]/30"
                  : "border-[#FFEB00]/20 bg-[#02381A]/40 hover:border-[#FFEB00]/60"
              }`}
            >
              <div
                className="w-6 h-6 rounded-full border-2 border-white flex-shrink-0 flex items-center justify-center"
                style={{ backgroundColor: t.bg }}
              >
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.accent }} />
              </div>
              <span className="truncate">{t.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 🎭 Anime / Character Mascot Companion Upload */}
      <div className="flex flex-col gap-2 font-mono">
        <label className="text-xs font-bold text-[#FFFDF2]/90">
          2. ANIME / CHARACTER MASCOT CO-PILOT (OPTIONAL)
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleCharacterFile(f);
          }}
        />

        <div className="flex items-center gap-3">
          {characterPhotoUrl ? (
            <div className="flex items-center gap-3 w-full bg-[#02381A]/60 border-2 border-[#FFEB00]/40 p-2.5 rounded-xl">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#FF007A] flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={characterPhotoUrl} alt="Character Mascot" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 font-mono text-xs">
                <div className="text-[#FFEB00] font-bold truncate">Co-Pilot Mascot Attached ✓</div>
                <div className="text-[10px] text-[#FFFDF2]/60">Appears on Pass & Frame</div>
              </div>
              <button
                type="button"
                onClick={() => onCharacterPhoto(null, null)}
                className="text-xs font-bold text-[#FF007A] hover:underline px-2"
              >
                Remove
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#FFEB00]/50 rounded-xl p-3 bg-[#02381A]/30 hover:border-[#FFEB00] hover:bg-[#02381A]/60 font-mono text-xs font-bold text-[#FFEB00] transition-all"
            >
              <span>{busy ? "Reading mascot image…" : "🖼 Upload Anime / Character / Mascot PNG"}</span>
            </button>
          )}
        </div>
      </div>

      {/* 🏷️ Sticker Stamp Presets */}
      <div className="flex flex-col gap-2 font-mono">
        <label className="text-xs font-bold text-[#FFFDF2]/90">3. PASS STICKER BADGE</label>
        <div className="flex flex-wrap gap-2">
          {stickerOptions.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelectSticker(s.id)}
              className={`px-3 py-2 rounded-lg border-2 text-xs font-bold transition-all ${
                stickerPreset === s.id
                  ? "border-[#FFEB00] bg-[#FF007A] text-[#FFFDF2]"
                  : "border-[#FFEB00]/20 bg-[#02381A]/50 text-[#FFFDF2]/80 hover:border-[#FFEB00]/60"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ✍️ Custom Motto / Status Line */}
      <div className="flex flex-col gap-2 font-mono">
        <label className="text-xs font-bold text-[#FFFDF2]/90">4. CUSTOM MOTTO / STATUS</label>
        <input
          value={customMotto}
          onChange={(e) => onMottoChange(e.target.value)}
          placeholder="e.g. Shipping AI at 3 AM 🚀"
          className="w-full rounded-xl bg-[#02381A]/80 border-2 border-[#FFEB00]/30 px-4 py-2.5 text-xs font-mono text-[#FFFDF2] placeholder:text-[#FFFDF2]/40 focus:outline-none focus:border-[#FFEB00] transition-all"
        />
      </div>
    </div>
  );
}
