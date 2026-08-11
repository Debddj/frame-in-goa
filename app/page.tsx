"use client";

import { useMemo, useRef, useState } from "react";
import UploadZone from "@/components/UploadZone";
import CardPreview from "@/components/CardPreview";
import ShareActions from "@/components/ShareActions";
import { generateBuilderTitle, rerollBuilderTitle } from "@/lib/builder-titles";
import { generateSeat, FLIGHT_CODE } from "@/lib/ids";
import { GATES } from "@/lib/types";
import type { CardFormat, Passenger } from "@/lib/types";

let uid = 0;
function nextId() {
  uid += 1;
  return `passenger-${uid}`;
}

function emptyPassenger(): Passenger {
  return {
    id: nextId(),
    name: "",
    stackOrRole: "",
    builderTitle: generateBuilderTitle(""),
    photo: null,
    photoObjectUrl: null,
    faceCenter: null,
  };
}

// Step tracker — shows where the user is in the flow
function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = ["Upload", "Customize", "Share"];
  return (
    <div className="flex items-center justify-center gap-2 animate-fade-in-up stagger-2">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all duration-300 ${
              i <= currentStep
                ? "bg-[#FF6B4A]/15 text-[#FF6B4A] border border-[#FF6B4A]/30"
                : "text-[#D8C9A3]/40 border border-[#D8C9A3]/10"
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                i < currentStep
                  ? "bg-[#FF6B4A] text-[#12181F]"
                  : i === currentStep
                  ? "bg-[#FF6B4A]/20 text-[#FF6B4A]"
                  : "bg-[#D8C9A3]/10 text-[#D8C9A3]/40"
              }`}
            >
              {i < currentStep ? "✓" : i + 1}
            </span>
            {label}
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-6 h-px transition-colors duration-300 ${
                i < currentStep ? "bg-[#FF6B4A]/40" : "bg-[#D8C9A3]/15"
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
  const [seat] = useState(generateSeat);
  const [gate] = useState(() => GATES[Math.floor(Math.random() * GATES.length)]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const builderNumber = seat.replace(/[A-Z]/g, "");

  // Determine current step
  const hasPhoto = passengers.some((p) => p.photo !== null);
  const hasName = passengers[0]?.name.trim().length > 0;
  const currentStep = hasPhoto && hasName ? 2 : hasPhoto ? 1 : 0;

  function updatePassenger(id: string, patch: Partial<Passenger>) {
    setPassengers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
    );
  }

  function addTeammate() {
    setPassengers((prev) => (prev.length >= 5 ? prev : [...prev, emptyPassenger()]));
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
    <main className="min-h-screen bg-[#12181F] text-[#F6EFE1] pb-16 relative overflow-hidden">
      {/* Ambient background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-[#FF6B4A]/[0.04] blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-60 h-60 rounded-full bg-[#1F8A70]/[0.05] blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-40 h-40 rounded-full bg-[#D8C9A3]/[0.03] blur-3xl" />
      </div>

      <div className="max-w-md mx-auto px-5 pt-8 flex flex-col gap-7 relative z-10">
        {/* ─── Header ─── */}
        <header className="text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF6B4A]/20 bg-[#FF6B4A]/5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A] animate-pulse" />
            <span className="font-mono text-[10px] tracking-widest text-[#FF6B4A] uppercase">
              Live · HH Goa 2026
            </span>
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight bg-gradient-to-r from-[#F6EFE1] via-[#D8C9A3] to-[#F6EFE1] bg-clip-text text-transparent animate-gradient">
            Your boarding pass to Goa
          </h1>
          <p className="text-sm text-[#D8C9A3]/70 mt-2 font-mono">
            Upload a photo, get a branded pass, share it in one tap.
          </p>
        </header>

        {/* ─── Step Indicator ─── */}
        <StepIndicator currentStep={currentStep} />

        {/* ─── Format Toggle ─── */}
        <div className="flex rounded-full border border-[#D8C9A3]/20 p-1 font-mono text-sm glass animate-fade-in-up stagger-2">
          {(
            [
              ["boardingPass", "✈ Boarding pass"],
              ["porthole", "◉ PFP frame"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setFormat(value)}
              className={`flex-1 rounded-full py-2.5 transition-all duration-300 text-xs tracking-wide ${
                format === value
                  ? "bg-[#FF6B4A] text-[#12181F] font-semibold shadow-lg shadow-[#FF6B4A]/20"
                  : "text-[#D8C9A3] hover:text-[#F6EFE1]"
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
            <div key={p.id} className="flex flex-col gap-2.5">
              {passengers.length > 1 && (
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#D8C9A3]">
                    Passenger {i + 1}
                  </span>
                  {i > 0 && (
                    <button
                      onClick={() => removePassenger(p.id)}
                      className="font-mono text-xs text-[#FF6B4A] hover:text-[#FF6B4A]/80 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              )}
              <UploadZone
                label={i === 0 ? "Your photo" : `Teammate ${i + 1} photo`}
                photoObjectUrl={p.photoObjectUrl}
                onPhoto={(bitmap, objectUrl, faceCenter) =>
                  updatePassenger(p.id, { photo: bitmap, photoObjectUrl: objectUrl, faceCenter })
                }
              />
              <input
                value={p.name}
                onChange={(e) => updatePassenger(p.id, { name: e.target.value })}
                placeholder="Name"
                className="w-full rounded-xl bg-[#1B2430]/60 border border-[#D8C9A3]/15 px-4 py-2.5 text-sm font-mono placeholder:text-[#D8C9A3]/30 focus:outline-none focus:border-[#FF6B4A]/60 focus:bg-[#1B2430]/80 transition-all duration-200"
              />
              {i === 0 && (
                <>
                  <input
                    value={p.stackOrRole}
                    onChange={(e) =>
                      updatePassenger(p.id, { stackOrRole: e.target.value })
                    }
                    placeholder="Stack / role (e.g. ML systems)"
                    className="w-full rounded-xl bg-[#1B2430]/60 border border-[#D8C9A3]/15 px-4 py-2.5 text-sm font-mono placeholder:text-[#D8C9A3]/30 focus:outline-none focus:border-[#FF6B4A]/60 focus:bg-[#1B2430]/80 transition-all duration-200"
                  />
                  <div className="flex items-center justify-between rounded-xl border border-[#D8C9A3]/15 px-4 py-2.5 bg-[#1B2430]/40">
                    <span className="font-mono text-xs text-[#D8C9A3]">
                      Class: <span className="text-[#F6EFE1] font-medium">{p.builderTitle}</span>
                    </span>
                    <button
                      onClick={() =>
                        updatePassenger(p.id, {
                          builderTitle: rerollBuilderTitle(p.stackOrRole, p.builderTitle),
                        })
                      }
                      className="font-mono text-xs text-[#FF6B4A] hover:text-[#FF6B4A]/80 transition-colors flex items-center gap-1"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 4 23 10 17 10" />
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                      </svg>
                      Reroll
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}

          {format === "boardingPass" && passengers.length < 5 && (
            <button
              onClick={addTeammate}
              className="font-mono text-xs text-[#D8C9A3]/60 border border-dashed border-[#D8C9A3]/20 rounded-xl py-2.5 hover:border-[#D8C9A3]/40 hover:text-[#D8C9A3] hover:bg-[#1B2430]/30 transition-all duration-200"
            >
              + Add a teammate to the manifest
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

        {/* ─── Footer ─── */}
        <footer className="text-center pt-4 pb-2 border-t border-[#D8C9A3]/8">
          <p className="font-mono text-[10px] text-[#D8C9A3]/30 tracking-widest uppercase">
            Built for HH Goa 2026 · #FrameInGoa
          </p>
        </footer>
      </div>
    </main>
  );
}
