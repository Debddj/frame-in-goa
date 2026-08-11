"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useCanvasWorker } from "@/lib/use-canvas-worker";
import type { BoardingPassData, CardFormat } from "@/lib/types";

interface Props {
  format: CardFormat;
  boardingPassData: BoardingPassData;
  builderNumber: string;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export default function CardPreview({
  format,
  boardingPassData,
  builderNumber,
  canvasRef,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasRendered, setHasRendered] = useState(false);
  const render = useCanvasWorker(canvasRef);

  useEffect(() => {
    render({ format, boardingPassData, builderNumber }).then(() => {
      setHasRendered(true);
    });
  }, [format, boardingPassData, builderNumber, render]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const inner = container.querySelector(".card-tilt-inner") as HTMLElement;
    if (inner) {
      inner.style.transform = `rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const inner = container.querySelector(".card-tilt-inner") as HTMLElement;
    if (inner) {
      inner.style.transform = "rotateY(0deg) rotateX(0deg)";
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="card-tilt"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`card-tilt-inner rounded-2xl overflow-hidden border-2 border-[#FFEB00]/40 p-3 glass shadow-2xl shadow-[#02381A] transition-all duration-300 ${
          hasRendered ? "animate-scale-in" : ""
        }`}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-auto rounded-xl"
          aria-label="Live preview of your HH Goa 2026 card"
        />
      </div>
    </div>
  );
}
