"use client";

import { useCallback, useRef, useState } from "react";
import { PalettePreviewStrip } from "./PalettePreviewStrip";
import { ANIME_PRESETS, loadPresetMascot, type AnimePreset } from "@/lib/anime-presets";
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
  coPilotSpeech?: string;
  onCoPilotSpeechChange?: (speech: string) => void;
  passengerPhoto?: ImageBitmap | null;
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
  coPilotSpeech = "Ready for takeoff! 🚀",
  onCoPilotSpeechChange,
  passengerPhoto,
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



  const stickerOptions: Array<{ id: StickerPreset; label: string }> = [
    { id: "none", label: "None" },
    { id: "pirate", label: "🏴‍☠️ Pirate Crew" },
    { id: "cyber", label: "⚡ Cyber Hacker" },
    { id: "anime", label: "🎌 Anime Mode" },
    { id: "rocket", label: "🚀 Shipping 3AM" },
    { id: "palm", label: "🌴 Goa Chill" },
  ];

  const handlePresetSelect = useCallback(
    async (preset: AnimePreset) => {
      setBusy(true);
      try {
        const { bitmap, objectUrl } = await loadPresetMascot(preset.svg);
        onCharacterPhoto(bitmap, objectUrl);
        if (onCoPilotSpeechChange) {
          onCoPilotSpeechChange(preset.defaultSpeech);
        }
      } catch {
        // error handling
      } finally {
        setBusy(false);
      }
    },
    [onCharacterPhoto, onCoPilotSpeechChange]
  );

  return (
    <div className="flex flex-col gap-5 glass p-5 rounded-2xl border-2 border-[#FFEB00]/40 shadow-xl">
      <div className="flex items-center justify-between border-b border-[#FFEB00]/20 pb-3 font-mono">
        <h3 className="text-sm font-extrabold text-[#FFEB00] uppercase tracking-wider flex items-center gap-2">
          <span>🎨</span>
          <span>CREATIVE CUSTOMIZER</span>
        </h3>
        <span className="text-[10px] text-[#FFFDF2]/60 uppercase font-bold">Total Freedom</span>
      </div>

      {/* 🎨 Live Theme Palette Previews */}
      <PalettePreviewStrip
        themePreset={themePreset}
        onSelectTheme={onSelectTheme}
        photo={passengerPhoto}
      />

      {/* 🎭 Anime / Character Mascot Companion Upload & Preset Gallery */}
      <div className="flex flex-col gap-2 font-mono">
        <label className="text-xs font-bold text-[#FFFDF2]/90 flex items-center justify-between">
          <span>2. ANIME / CHARACTER MASCOT CO-PILOT</span>
          <span className="text-[10px] text-[#FFEB00] font-semibold">1-Click Gallery or Upload</span>
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

        <div className="flex flex-col gap-3">
          {characterPhotoUrl ? (
            <div className="flex flex-col gap-2.5 w-full bg-[#02381A]/60 border-2 border-[#FFEB00]/40 p-3 rounded-xl font-mono text-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#FF007A] flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={characterPhotoUrl} alt="Character Mascot" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 font-mono text-xs">
                  <div className="text-[#FFEB00] font-bold truncate">Co-Pilot Mascot Attached ✓</div>
                  <div className="text-[10px] text-[#FFFDF2]/60">Airplane Window Viewport & Speech Bubble</div>
                </div>
                <button
                  type="button"
                  onClick={() => onCharacterPhoto(null, null)}
                  className="text-xs font-bold text-[#FF007A] hover:underline px-2"
                >
                  Remove / Change
                </button>
              </div>

              {/* Co-pilot speech input */}
              <div className="flex flex-col gap-1 pt-1 border-t border-[#FFEB00]/15">
                <label className="text-[10px] font-bold text-[#FFEB00]">CO-PILOT SPEECH BUBBLE:</label>
                <input
                  value={coPilotSpeech}
                  onChange={(e) => onCoPilotSpeechChange?.(e.target.value)}
                  placeholder="e.g. Ready for takeoff! 🚀"
                  className="w-full rounded-lg bg-[#02381A] border border-[#FFEB00]/30 px-3 py-1.5 text-xs text-[#FFFDF2] placeholder:text-[#FFFDF2]/40 focus:outline-none focus:border-[#FFEB00]"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              <div className="text-[11px] text-[#FFEB00] font-bold">INSTANT ANIME & CO-PILOT GALLERY (1-CLICK):</div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {ANIME_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handlePresetSelect(p)}
                    disabled={busy}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl border border-[#FFEB00]/30 bg-[#02381A]/60 hover:border-[#FFEB00] hover:bg-[#02381A] hover:scale-[1.04] transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-[#FFEB00]/40 group-hover:border-[#FFEB00]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`data:image/svg+xml;utf8,${encodeURIComponent(p.svg)}`}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-[#FFFDF2]/80 group-hover:text-[#FFEB00] truncate w-full text-center">
                      {p.name.split(" ")[0]}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 my-0.5">
                <div className="flex-1 h-px bg-[#FFEB00]/20" />
                <span className="text-[9px] font-bold text-[#FFFDF2]/40 uppercase">or upload your own file</span>
                <div className="flex-1 h-px bg-[#FFEB00]/20" />
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#FFEB00]/50 rounded-xl p-2.5 bg-[#02381A]/30 hover:border-[#FFEB00] hover:bg-[#02381A]/60 font-mono text-xs font-bold text-[#FFEB00] transition-all"
              >
                <span>{busy ? "Loading mascot image…" : "📁 Upload Custom Anime / Mascot Image"}</span>
              </button>
            </div>
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
