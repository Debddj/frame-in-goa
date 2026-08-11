"use client";

import { useMemo, useRef, useState } from "react";
import UploadZone from "@/components/UploadZone";
import CardPreview from "@/components/CardPreview";
import ShareActions from "@/components/ShareActions";
import { PalmTreesLeft, PalmTreesRight } from "@/components/PalmTreesBg";
import { BeachSignpost } from "@/components/BeachSignpost";
import { RightFlankPanel } from "@/components/RightFlankPanel";
import { generateBuilderTitle, rerollBuilderTitle } from "@/lib/builder-titles";
import { generateSeat, FLIGHT_CODE } from "@/lib/ids";
import { GATES } from "@/lib/types";
import type { CardFormat, Passenger } from "@/lib/types";

let uid = 0;
function nextId() {
  uid += 1;
  return `passenger-${uid}`;
}

function emptyPassenger(title = "Genesis Day Builder"): Passenger {
  return {
    id: nextId(),
    name: "",
    stackOrRole: "",
    builderTitle: title,
    photo: null,
    photoObjectUrl: null,
    faceCenter: null,
  };
}

function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = ["Upload", "Customize", "Share"];
  return (
    <div className="flex items-center justify-center gap-2 animate-fade-in-up stagger-2">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all duration-300 ${
              i <= currentStep
                ? "bg-[#FFEB00] text-[#02381A] shadow-md shadow-[#FFEB00]/20"
                : "text-[#FFFDF2]/40 bg-[#02381A]/40 border border-[#FFEB00]/15"
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                i < currentStep
                  ? "bg-[#FF007A] text-[#FFFDF2]"
                  : i === currentStep
                  ? "bg-[#055C2E] text-[#FFEB00]"
                  : "bg-[#02381A] text-[#FFFDF2]/40"
              }`}
            >
              {i < currentStep ? "✓" : i + 1}
            </span>
            {label}
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-6 h-0.5 transition-colors duration-300 ${
                i < currentStep ? "bg-[#FFEB00]" : "bg-[#FFEB00]/20"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [format, setFormat] = useState<CardFormat>("boardingPass");
  const [passengers, setPassengers] = useState<Passenger[]>([emptyPassenger()]);
  const [seat] = useState(() => generateSeat());
  const [gate] = useState<string>(() => GATES[Math.floor(Math.random() * GATES.length)]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const builderNumber = seat.replace(/[A-Z]/g, "");

  const hasPhoto = passengers.some((p) => p.photo !== null);
  const hasName = passengers[0]?.name.trim().length > 0;
  const currentStep = hasPhoto && hasName ? 2 : hasPhoto ? 1 : 0;

  function updatePassenger(id: string, patch: Partial<Passenger>) {
    setPassengers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
    );
  }

  function addTeammate() {
    setPassengers((prev) => (prev.length >= 5 ? prev : [...prev, emptyPassenger(generateBuilderTitle(""))]));
  }

  function removePassenger(id: string) {
    setPassengers((prev) => (prev.length <= 1 ? prev : prev.filter((p) => p.id !== id)));
  }

  const shareUrl = typeof window !== "undefined" ? window.location.origin : "";

  const boardingPassData = useMemo(
    () => ({
      passengers,
      seat,
      gate,
      flightCode: FLIGHT_CODE,
      qrPayload: shareUrl || "https://hhgoa.com",
    }),
    [passengers, seat, gate, shareUrl]
  );

  const primaryName = passengers[0]?.name || "a builder";
  const caption =
    passengers.length > 1
      ? `Boarding for HH Goa 2026 with the crew ✈️ #FrameInGoa @247pmstudio`
      : `${primaryName} is boarding for HH Goa 2026 ✈️ #FrameInGoa @247pmstudio`;

  return (
    <main className="min-h-screen bg-[#055C2E] text-[#FFFDF2] pb-16 relative overflow-x-hidden">
      {/* Background Palm Trees & Beach Accents */}
      <PalmTreesLeft />
      <PalmTreesRight />
      <BeachSignpost />
      <RightFlankPanel />

      {/* Ambient Radial Sun Glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-[#FFEB00]/[0.06] blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-[#FF007A]/[0.07] blur-3xl" />
      </div>

      <div className="max-w-xl mx-auto px-5 pt-8 flex flex-col gap-7 relative z-20">
        {/* ─── Studio Top Bar ─── */}
        <div className="flex items-center justify-between font-mono text-xs text-[#FFEB00] font-bold border-b border-[#FFEB00]/20 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF007A] animate-pulse" />
            <span>2:47 PM STUDIO</span>
          </div>
          <span>GOA, INDIA · 28-31 OCT</span>
        </div>

        {/* ─── Brandkit Hero Header ─── */}
        <header className="text-center animate-fade-in-up">
          <div className="relative inline-block mb-2">
            <h1 className="font-serif text-4xl sm:text-5xl font-black text-[#FFEB00] tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              HACKER HOUSE
            </h1>
            {/* Official Devanagari Goa Badge */}
            <span className="goa-badge absolute -top-3 right-[-14px] text-lg">
              गोवा
            </span>
          </div>
          <p className="text-xs font-mono text-[#FFFDF2]/90 mt-1 uppercase tracking-widest font-bold">
            Official Builder ID & Boarding Pass Generator
          </p>
        </header>

        {/* ─── Step Indicator ─── */}
        <StepIndicator currentStep={currentStep} />

        {/* ─── Format Signpost Toggle ─── */}
        <div className="flex rounded-xl bg-[#02381A] p-1.5 border-2 border-[#FFEB00]/40 font-mono text-xs font-bold glass animate-fade-in-up stagger-2">
          {(
            [
              ["boardingPass", "✈ BOARDING PASS"],
              ["porthole", "◉ PFP FRAME"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setFormat(value)}
              className={`flex-1 rounded-lg py-3 transition-all duration-300 tracking-wider font-extrabold ${
                format === value
                  ? "bg-[#FFEB00] text-[#02381A] shadow-md shadow-[#FFEB00]/30 border-2 border-[#02381A]"
                  : "text-[#FFFDF2]/70 hover:text-[#FFEB00]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ─── Preview ─── */}
        <div className="animate-fade-in-up stagger-3">
          <CardPreview
            format={format}
            boardingPassData={boardingPassData}
            builderNumber={builderNumber}
            canvasRef={canvasRef}
          />
        </div>

        {/* ─── Input Fields ─── */}
        <section className="flex flex-col gap-4 animate-fade-in-up stagger-4">
          {passengers.map((p, i) => (
            <div key={p.id} className="flex flex-col gap-3 glass p-4.5 rounded-2xl border-2 border-[#FFEB00]/30">
              {passengers.length > 1 && (
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#FFEB00]">
                    PASSENGER {i + 1}
                  </span>
                  {i > 0 && (
                    <button
                      onClick={() => removePassenger(p.id)}
                      className="font-mono text-xs font-bold text-[#FF007A] hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              )}
              <UploadZone
                label={i === 0 ? "Your Photo" : `Teammate ${i + 1} Photo`}
                photoObjectUrl={p.photoObjectUrl}
                onPhoto={(bitmap, objectUrl, faceCenter) =>
                  updatePassenger(p.id, { photo: bitmap, photoObjectUrl: objectUrl, faceCenter })
                }
              />
              <input
                value={p.name}
                onChange={(e) => updatePassenger(p.id, { name: e.target.value })}
                placeholder="Full Name"
                className="w-full rounded-xl bg-[#02381A]/80 border-2 border-[#FFEB00]/25 px-4 py-3 text-sm font-mono text-[#FFFDF2] placeholder:text-[#FFFDF2]/40 focus:outline-none focus:border-[#FFEB00] transition-all"
              />
              {i === 0 && (
                <>
                  <input
                    value={p.stackOrRole}
                    onChange={(e) =>
                      updatePassenger(p.id, { stackOrRole: e.target.value })
                    }
                    placeholder="Stack / Role (e.g. ML systems)"
                    className="w-full rounded-xl bg-[#02381A]/80 border-2 border-[#FFEB00]/25 px-4 py-3 text-sm font-mono text-[#FFFDF2] placeholder:text-[#FFFDF2]/40 focus:outline-none focus:border-[#FFEB00] transition-all"
                  />
                  <div className="flex items-center justify-between rounded-xl border-2 border-[#FFEB00]/25 px-4 py-3 bg-[#02381A]/60">
                    <span className="font-mono text-xs text-[#FFFDF2]/80">
                      Class: <span suppressHydrationWarning className="text-[#FFEB00] font-bold">{p.builderTitle}</span>
                    </span>
                    <button
                      onClick={() =>
                        updatePassenger(p.id, {
                          builderTitle: rerollBuilderTitle(p.stackOrRole, p.builderTitle),
                        })
                      }
                      className="font-mono text-xs font-extrabold text-[#FF007A] hover:text-[#FFEB00] transition-colors flex items-center gap-1.5"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 4 23 10 17 10" />
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                      </svg>
                      REROLL
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}

          {format === "boardingPass" && passengers.length < 5 && (
            <button
              onClick={addTeammate}
              className="font-mono text-xs font-bold text-[#FFEB00] border-2 border-dashed border-[#FFEB00]/40 rounded-xl py-3 hover:border-[#FFEB00] hover:bg-[#02381A]/50 transition-all"
            >
              + ADD TEAMMATE TO MANIFEST
            </button>
          )}
        </section>

        {/* ─── Share Actions ─── */}
        <div className="animate-fade-in-up stagger-4">
          <ShareActions
            canvasRef={canvasRef}
            fileNamePrefix={format === "boardingPass" ? "hhgoa-boarding-pass" : "hhgoa-pfp"}
            caption={caption}
            hasPhoto={hasPhoto}
          />
        </div>

        {/* ─── Mobile Footer / Social Links ─── */}
        <footer className="text-center pt-6 pb-2 border-t border-[#FFEB00]/20 flex flex-col gap-2 items-center">
          <p className="font-mono text-xs font-bold text-[#FFEB00] tracking-widest uppercase">
            HH-GOA 2026 · 2:47 PM STUDIO
          </p>

          <div className="lg:hidden flex gap-4 text-xs font-mono font-bold text-[#FFEB00] my-1">
            <a href="https://x.com/247pmstudio" target="_blank" rel="noreferrer">𝕏 @247PMSTUDIO</a>
            <a href="https://t.me/twofourtysevenpm" target="_blank" rel="noreferrer">✈ TELEGRAM</a>
          </div>

          <p className="font-mono text-[10px] text-[#FFFDF2]/50 tracking-wider">
            #FrameInGoa · Official Shortlisting Task
          </p>
        </footer>
      </div>
    </main>
  );
}
