"use client";

import { useEffect, useRef } from "react";
import { drawMiniPreview } from "@/lib/mini-preview";
import type { ThemePreset } from "@/lib/types";

interface Props {
  themePreset: ThemePreset;
  onSelectTheme: (theme: ThemePreset) => void;
  photo?: ImageBitmap | null;
}

const themeOptions: Array<{ id: ThemePreset; name: string }> = [
  { id: "palmEmerald", name: "Palm Emerald" },
  { id: "sunsetVaporwave", name: "Sunset Vaporwave" },
  { id: "cyberMidnight", name: "Cyber Midnight" },
  { id: "vintageTicket", name: "Vintage Ticket" },
];

export function PalettePreviewStrip({ themePreset, onSelectTheme, photo }: Props) {
  const canvasRefs = useRef<Record<ThemePreset, HTMLCanvasElement | null>>({
    palmEmerald: null,
    sunsetVaporwave: null,
    cyberMidnight: null,
    vintageTicket: null,
  });

  // Render all 4 live previews synchronously on mount & props update with ZERO delay
  useEffect(() => {
    themeOptions.forEach(({ id }) => {
      const canvas = canvasRefs.current[id];
      if (canvas) {
        drawMiniPreview(canvas, id, photo);
      }
    });
  }, [photo]);

  return (
    <div className="flex flex-col gap-2 font-mono">
      <label className="text-xs font-bold text-[#FFFDF2]/90 flex items-center justify-between">
        <span>1. PASS COLOR PALETTE (LIVE PREVIEW)</span>
        <span className="text-[10px] text-[#FFEB00] font-semibold">Instant Render ✓</span>
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {themeOptions.map((t) => {
          const isActive = themePreset === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelectTheme(t.id)}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all text-left relative overflow-hidden group ${
                isActive
                  ? "border-[#FFEB00] bg-[#02381A] shadow-lg shadow-[#FFEB00]/30 scale-[1.03]"
                  : "border-[#FFEB00]/20 bg-[#02381A]/40 hover:border-[#FFEB00]/60 hover:scale-[1.01]"
              }`}
            >
              {isActive && (
                <span className="absolute top-1 right-1 bg-[#FF007A] text-[#FFFDF2] text-[8px] font-extrabold px-1.5 py-0.5 rounded-full z-10 animate-fade-in-up">
                  ACTIVE
                </span>
              )}
              <div className="w-full aspect-[200/125] rounded-lg overflow-hidden border border-[#FFEB00]/30 shadow-inner">
                <canvas
                  ref={(el) => {
                    canvasRefs.current[t.id] = el;
                    if (el) drawMiniPreview(el, t.id, photo);
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className={`text-[11px] font-bold truncate w-full text-center ${
                isActive ? "text-[#FFEB00]" : "text-[#FFFDF2]/80 group-hover:text-[#FFFDF2]"
              }`}>
                {t.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
