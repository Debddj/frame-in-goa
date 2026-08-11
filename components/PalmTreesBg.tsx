"use client";

export function PalmTreesLeft() {
  return (
    <div className="hidden xl:block fixed bottom-0 left-0 w-80 h-[85vh] pointer-events-none z-0 opacity-90 transition-all duration-300">
      <svg
        viewBox="0 0 320 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
      >
        {/* Outer Trunk Outline 1 */}
        <path
          d="M 60 800 Q 80 500 120 220"
          stroke="#111111"
          strokeWidth="38"
          strokeLinecap="round"
        />
        {/* Palm Trunk 1 */}
        <path
          d="M 60 800 Q 80 500 120 220"
          stroke="#FFFFFF"
          strokeWidth="32"
          strokeLinecap="round"
        />

        {/* Palm Fronds 1 */}
        <g transform="translate(120, 220)">
          {/* Frond 1 */}
          <path
            d="M 0 0 Q -100 -80 -140 -20 Q -90 0 0 0"
            fill="#055C2E"
            stroke="#FFEB00"
            strokeWidth="4"
          />
          {/* Frond 2 */}
          <path
            d="M 0 0 Q -80 -140 -20 -160 Q 10 -80 0 0"
            fill="#0D723B"
            stroke="#FFEB00"
            strokeWidth="4"
          />
          {/* Frond 3 */}
          <path
            d="M 0 0 Q 60 -140 120 -100 Q 60 -30 0 0"
            fill="#055C2E"
            stroke="#FFEB00"
            strokeWidth="4"
          />
          {/* Frond 4 */}
          <path
            d="M 0 0 Q 100 -30 140 30 Q 50 40 0 0"
            fill="#0D723B"
            stroke="#FFEB00"
            strokeWidth="4"
          />
          {/* Frond 5 */}
          <path
            d="M 0 0 Q -40 60 -80 80 Q -40 20 0 0"
            fill="#055C2E"
            stroke="#FFEB00"
            strokeWidth="4"
          />
        </g>

        {/* Outer Trunk Outline 2 */}
        <path
          d="M 0 800 Q 30 600 70 420"
          stroke="#111111"
          strokeWidth="30"
          strokeLinecap="round"
        />
        {/* Smaller Palm Trunk 2 */}
        <path
          d="M 0 800 Q 30 600 70 420"
          stroke="#FFFFFF"
          strokeWidth="24"
          strokeLinecap="round"
        />

        {/* Palm Fronds 2 */}
        <g transform="translate(70, 420)">
          <path
            d="M 0 0 Q -80 -60 -110 -10 Q -70 10 0 0"
            fill="#0D723B"
            stroke="#FFEB00"
            strokeWidth="3"
          />
          <path
            d="M 0 0 Q -50 -110 0 -130 Q 30 -60 0 0"
            fill="#055C2E"
            stroke="#FFEB00"
            strokeWidth="3"
          />
          <path
            d="M 0 0 Q 50 -100 90 -60 Q 40 -20 0 0"
            fill="#0D723B"
            stroke="#FFEB00"
            strokeWidth="3"
          />
          <path
            d="M 0 0 Q 70 -10 100 40 Q 40 30 0 0"
            fill="#055C2E"
            stroke="#FFEB00"
            strokeWidth="3"
          />
        </g>
      </svg>
    </div>
  );
}

export function PalmTreesRight() {
  return (
    <div className="hidden xl:block fixed bottom-0 right-0 w-80 h-[85vh] pointer-events-none z-0 opacity-90 transition-all duration-300">
      <svg
        viewBox="0 0 320 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
      >
        {/* Outer Trunk Outline Right 1 */}
        <path
          d="M 260 800 Q 240 500 200 220"
          stroke="#111111"
          strokeWidth="38"
          strokeLinecap="round"
        />
        {/* Palm Trunk Right 1 */}
        <path
          d="M 260 800 Q 240 500 200 220"
          stroke="#FFFFFF"
          strokeWidth="32"
          strokeLinecap="round"
        />

        {/* Palm Fronds Right 1 */}
        <g transform="translate(200, 220)">
          <path
            d="M 0 0 Q 100 -80 140 -20 Q 90 0 0 0"
            fill="#055C2E"
            stroke="#FFEB00"
            strokeWidth="4"
          />
          <path
            d="M 0 0 Q 80 -140 20 -160 Q -10 -80 0 0"
            fill="#0D723B"
            stroke="#FFEB00"
            strokeWidth="4"
          />
          <path
            d="M 0 0 Q -60 -140 -120 -100 Q -60 -30 0 0"
            fill="#055C2E"
            stroke="#FFEB00"
            strokeWidth="4"
          />
          <path
            d="M 0 0 Q -100 -30 -140 30 Q -50 40 0 0"
            fill="#0D723B"
            stroke="#FFEB00"
            strokeWidth="4"
          />
          <path
            d="M 0 0 Q 40 60 80 80 Q 40 20 0 0"
            fill="#055C2E"
            stroke="#FFEB00"
            strokeWidth="4"
          />
        </g>

        {/* Outer Trunk Outline Right 2 */}
        <path
          d="M 320 800 Q 290 600 250 420"
          stroke="#111111"
          strokeWidth="30"
          strokeLinecap="round"
        />
        {/* Smaller Palm Trunk Right 2 */}
        <path
          d="M 320 800 Q 290 600 250 420"
          stroke="#FFFFFF"
          strokeWidth="24"
          strokeLinecap="round"
        />

        {/* Palm Fronds Right 2 */}
        <g transform="translate(250, 420)">
          <path
            d="M 0 0 Q 80 -60 110 -10 Q 70 10 0 0"
            fill="#0D723B"
            stroke="#FFEB00"
            strokeWidth="3"
          />
          <path
            d="M 0 0 Q 50 -110 0 -130 Q -30 -60 0 0"
            fill="#055C2E"
            stroke="#FFEB00"
            strokeWidth="3"
          />
          <path
            d="M 0 0 Q -50 -100 -90 -60 Q -40 -20 0 0"
            fill="#0D723B"
            stroke="#FFEB00"
            strokeWidth="3"
          />
          <path
            d="M 0 0 Q -70 -10 -100 40 Q -40 30 0 0"
            fill="#055C2E"
            stroke="#FFEB00"
            strokeWidth="3"
          />
        </g>
      </svg>
    </div>
  );
}
