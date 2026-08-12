"use client";

export function PalmTreesLeft() {
  return (
    <div className="hidden xl:block fixed bottom-0 left-0 w-96 h-[90vh] pointer-events-none z-0 opacity-95 transition-all duration-300">
      <svg
        viewBox="0 0 380 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xl"
      >
        {/* Seagulls in Sky */}
        <path d="M 40 60 Q 55 45 70 60 Q 85 45 100 60" stroke="#FFEB00" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 120 90 Q 132 78 144 90 Q 156 78 168 90" stroke="#FFFDF2" strokeWidth="2" strokeLinecap="round" opacity="0.8" />

        {/* Tropical Cloud */}
        <path d="M 20 130 Q 30 110 50 115 Q 70 100 95 115 Q 115 110 125 130 Z" fill="#FFFDF2" opacity="0.15" />

        {/* --- Outer Trunk Outline 1 --- */}
        <path d="M 80 900 Q 100 550 150 240" stroke="#111111" strokeWidth="42" strokeLinecap="round" />
        {/* --- Palm Trunk 1 --- */}
        <path d="M 80 900 Q 100 550 150 240" stroke="#FFFFFF" strokeWidth="34" strokeLinecap="round" />

        {/* --- Palm Fronds 1 --- */}
        <g transform="translate(150, 240)">
          <path d="M 0 0 Q -110 -90 -160 -20 Q -100 0 0 0" fill="#055C2E" stroke="#FFEB00" strokeWidth="4" />
          <path d="M 0 0 Q -90 -160 -20 -180 Q 10 -90 0 0" fill="#0D723B" stroke="#FFEB00" strokeWidth="4" />
          <path d="M 0 0 Q 70 -160 140 -110 Q 70 -30 0 0" fill="#055C2E" stroke="#FFEB00" strokeWidth="4" />
          <path d="M 0 0 Q 110 -30 160 40 Q 60 50 0 0" fill="#0D723B" stroke="#FFEB00" strokeWidth="4" />
          <path d="M 0 0 Q -50 70 -90 90 Q -50 20 0 0" fill="#055C2E" stroke="#FFEB00" strokeWidth="4" />
        </g>

        {/* --- Outer Trunk Outline 2 --- */}
        <path d="M 10 900 Q 40 650 90 460" stroke="#111111" strokeWidth="32" strokeLinecap="round" />
        {/* --- Palm Trunk 2 --- */}
        <path d="M 10 900 Q 40 650 90 460" stroke="#FFFFFF" strokeWidth="26" strokeLinecap="round" />

        {/* --- Palm Fronds 2 --- */}
        <g transform="translate(90, 460)">
          <path d="M 0 0 Q -90 -70 -120 -10 Q -80 10 0 0" fill="#0D723B" stroke="#FFEB00" strokeWidth="3.5" />
          <path d="M 0 0 Q -60 -120 0 -140 Q 30 -70 0 0" fill="#055C2E" stroke="#FFEB00" strokeWidth="3.5" />
          <path d="M 0 0 Q 60 -110 100 -70 Q 40 -20 0 0" fill="#0D723B" stroke="#FFEB00" strokeWidth="3.5" />
          <path d="M 0 0 Q 80 -10 110 40 Q 40 30 0 0" fill="#055C2E" stroke="#FFEB00" strokeWidth="3.5" />
        </g>

        {/* --- Goa Beach Shack / Hut --- */}
        <g transform="translate(10, 720)">
          {/* Thatched Roof */}
          <path d="M -10 40 L 60 0 L 130 40 Z" fill="#FFEB00" stroke="#111111" strokeWidth="4" strokeLinejoin="round" />
          {/* Bamboo Hut Body */}
          <rect x="10" y="40" width="100" height="70" fill="#E5D9B6" stroke="#111111" strokeWidth="4" rx="4" />
          {/* Door */}
          <rect x="45" y="65" width="30" height="45" fill="#055C2E" stroke="#111111" strokeWidth="3" />
          {/* Shack Flag */}
          <path d="M 60 0 L 60 -25 L 85 -15 Z" fill="#FF007A" stroke="#111111" strokeWidth="2" />
        </g>

        {/* --- Surfboard leaning against Palm Tree --- */}
        <g transform="translate(160, 640) rotate(14)">
          {/* Surfboard Outline */}
          <path
            d="M 0 -130 Q 35 -40 30 110 Q 0 140 -30 110 Q -35 -40 0 -130 Z"
            fill="#FFEB00"
            stroke="#111111"
            strokeWidth="5"
          />
          {/* Stripe Accent */}
          <path d="M 0 -130 L 0 125" stroke="#FF007A" strokeWidth="10" />
          <path d="M 0 -130 L 0 125" stroke="#055C2E" strokeWidth="3" />
          {/* HH GOA Text on Surfboard */}
          <text x="0" y="10" fill="#111111" fontSize="11" fontWeight="900" fontFamily="monospace" textAnchor="middle">
            HH-GOA 26
          </text>
        </g>

        {/* --- Coconut Drink & Starfish on Beach Sand --- */}
        <g transform="translate(240, 810)">
          {/* Coconut */}
          <circle cx="0" cy="0" r="18" fill="#3B2F2F" stroke="#111111" strokeWidth="3" />
          {/* Coconut Straw */}
          <path d="M 0 -10 L 12 -30 L 20 -25" stroke="#FF007A" strokeWidth="4" strokeLinecap="round" />
          {/* Little Umbrella */}
          <path d="M -10 -15 Q 0 -28 10 -15 Z" fill="#FFEB00" stroke="#111111" strokeWidth="2" />

          {/* Starfish */}
          <g transform="translate(45, 10)">
            <path
              d="M 0 -10 L 3 -3 L 10 -3 L 5 2 L 7 9 L 0 5 L -7 9 L -5 2 L -10 -3 L -3 -3 Z"
              fill="#FF007A"
              stroke="#111111"
              strokeWidth="2"
            />
          </g>
        </g>

        {/* Sand Hill Dune Base */}
        <path
          d="M 0 900 Q 150 820 380 900 Z"
          fill="#02381A"
          stroke="#FFEB00"
          strokeWidth="3"
          opacity="0.8"
        />
      </svg>
    </div>
  );
}

export function PalmTreesRight() {
  return (
    <div className="hidden xl:block fixed bottom-0 right-0 w-96 h-[90vh] pointer-events-none z-0 opacity-95 transition-all duration-300">
      <svg
        viewBox="0 0 380 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xl"
      >
        {/* Sky Seagull */}
        <path d="M 260 70 Q 275 55 290 70 Q 305 55 320 70" stroke="#FFEB00" strokeWidth="2.5" strokeLinecap="round" />

        {/* --- Outer Trunk Outline Right 1 --- */}
        <path d="M 300 900 Q 280 550 230 240" stroke="#111111" strokeWidth="42" strokeLinecap="round" />
        {/* --- Palm Trunk Right 1 --- */}
        <path d="M 300 900 Q 280 550 230 240" stroke="#FFFFFF" strokeWidth="34" strokeLinecap="round" />

        {/* --- Palm Fronds Right 1 --- */}
        <g transform="translate(230, 240)">
          <path d="M 0 0 Q 110 -90 160 -20 Q 100 0 0 0" fill="#055C2E" stroke="#FFEB00" strokeWidth="4" />
          <path d="M 0 0 Q 90 -160 20 -180 Q -10 -90 0 0" fill="#0D723B" stroke="#FFEB00" strokeWidth="4" />
          <path d="M 0 0 Q -70 -160 -140 -110 Q -70 -30 0 0" fill="#055C2E" stroke="#FFEB00" strokeWidth="4" />
          <path d="M 0 0 Q -110 -30 -160 40 Q -60 50 0 0" fill="#0D723B" stroke="#FFEB00" strokeWidth="4" />
          <path d="M 0 0 Q 50 70 90 90 Q 50 20 0 0" fill="#055C2E" stroke="#FFEB00" strokeWidth="4" />
        </g>

        {/* --- Outer Trunk Outline Right 2 --- */}
        <path d="M 370 900 Q 340 650 290 460" stroke="#111111" strokeWidth="32" strokeLinecap="round" />
        {/* --- Palm Trunk Right 2 --- */}
        <path d="M 370 900 Q 340 650 290 460" stroke="#FFFFFF" strokeWidth="26" strokeLinecap="round" />

        {/* --- Palm Fronds Right 2 --- */}
        <g transform="translate(290, 460)">
          <path d="M 0 0 Q 90 -70 120 -10 Q 80 10 0 0" fill="#0D723B" stroke="#FFEB00" strokeWidth="3.5" />
          <path d="M 0 0 Q 60 -120 0 -140 Q -30 -70 0 0" fill="#055C2E" stroke="#FFEB00" strokeWidth="3.5" />
          <path d="M 0 0 Q -60 -110 -100 -70 Q -40 -20 0 0" fill="#0D723B" stroke="#FFEB00" strokeWidth="3.5" />
          <path d="M 0 0 Q -80 -10 -110 40 Q -40 30 0 0" fill="#055C2E" stroke="#FFEB00" strokeWidth="3.5" />
        </g>

        {/* --- Goa Retro Vespa Scooter parked by the Beach --- */}
        <g transform="translate(140, 720)">
          {/* Wheels */}
          <circle cx="20" cy="55" r="18" fill="#111111" stroke="#FFEB00" strokeWidth="4" />
          <circle cx="95" cy="55" r="18" fill="#111111" stroke="#FFEB00" strokeWidth="4" />
          <circle cx="20" cy="55" r="6" fill="#FFFDF2" />
          <circle cx="95" cy="55" r="6" fill="#FFFDF2" />

          {/* Scooter Body Chassis */}
          <path
            d="M 10 45 Q 30 20 60 25 L 85 20 Q 110 25 110 45 Q 100 58 60 55 Q 30 55 10 45 Z"
            fill="#FF007A"
            stroke="#111111"
            strokeWidth="4"
          />

          {/* Seat Cushion */}
          <rect x="40" y="12" width="45" height="12" rx="6" fill="#FFEB00" stroke="#111111" strokeWidth="3" />

          {/* Handlebars & Headlight */}
          <path d="M 90 20 L 95 -10" stroke="#111111" strokeWidth="4" strokeLinecap="round" />
          <circle cx="95" cy="-12" r="9" fill="#FFEB00" stroke="#111111" strokeWidth="3" />
        </g>

        {/* --- Beach Umbrella & Sunbed Chair --- */}
        <g transform="translate(30, 760)">
          {/* Sunbed */}
          <path d="M 0 25 L 45 15 L 60 25 L 0 25 Z" fill="#E5D9B6" stroke="#111111" strokeWidth="3" />
          <line x1="10" y1="25" x2="10" y2="35" stroke="#111111" strokeWidth="3" />
          <line x1="50" y1="25" x2="50" y2="35" stroke="#111111" strokeWidth="3" />

          {/* Umbrella Pole */}
          <line x1="30" y1="25" x2="20" y2="-30" stroke="#111111" strokeWidth="4" />

          {/* Umbrella Canopy */}
          <path d="M -15 -30 Q 20 -60 55 -30 Z" fill="#FFEB00" stroke="#111111" strokeWidth="4" />
          <path d="M 5 -30 Q 20 -60 35 -30 Z" fill="#FF007A" />
        </g>

        {/* Sand Hill Dune Base Right */}
        <path
          d="M 0 900 Q 200 820 380 900 Z"
          fill="#02381A"
          stroke="#FFEB00"
          strokeWidth="3"
          opacity="0.8"
        />
      </svg>
    </div>
  );
}

export function OceanWavesHorizon() {
  return (
    <div className="fixed bottom-0 left-0 w-full h-16 pointer-events-none z-0 opacity-80">
      <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full preserve-3d">
        {/* Wave Layer 1 (Dark Emerald) */}
        <path
          d="M 0 30 Q 360 0 720 30 Q 1080 60 1440 30 L 1440 80 L 0 80 Z"
          fill="#02381A"
          stroke="#FFEB00"
          strokeWidth="2"
        />
        {/* Wave Layer 2 (Hot Magenta Crest) */}
        <path
          d="M 0 45 Q 360 65 720 45 Q 1080 25 1440 45 L 1440 80 L 0 80 Z"
          fill="#055C2E"
          stroke="#FF007A"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
