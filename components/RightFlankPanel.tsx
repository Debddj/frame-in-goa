"use client";

export function RightFlankPanel() {
  return (
    <div className="hidden lg:flex flex-col gap-6 fixed right-6 xl:right-12 top-28 z-10 w-72 pointer-events-auto transition-all duration-300">
      {/* Setting Sun Graphic */}
      <div className="relative w-full h-36 rounded-2xl bg-gradient-to-b from-[#055C2E] to-[#02381A] border-2 border-[#FFEB00]/40 overflow-hidden flex flex-col items-center justify-end p-3 shadow-xl glass">
        <div className="w-44 h-44 rounded-full bg-[#FF9900] border-4 border-[#FFEB00] absolute -bottom-24 shadow-2xl animate-pulse" />
        {/* Ocean Waves */}
        <div className="w-full h-6 border-t-2 border-[#FFEB00]/60 relative z-10 bg-[#055C2E]/60 backdrop-blur-sm flex items-center justify-center">
          <span className="font-mono text-[10px] font-bold text-[#FFEB00] uppercase tracking-widest">
            GOA BEACH · OCT 2026
          </span>
        </div>
      </div>

      {/* Official Links & Studio Contacts Box */}
      <div className="glass p-5 rounded-2xl border-2 border-[#FFEB00]/40 flex flex-col gap-4 font-mono text-xs shadow-xl">
        <div className="font-extrabold text-[#FFEB00] border-b border-[#FFEB00]/20 pb-2 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF007A]" />
          <span>CONNECT & INFO</span>
        </div>

        <a
          href="https://x.com/247pmstudio"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[#FFFDF2] hover:text-[#FFEB00] font-bold transition-colors"
        >
          <span className="text-[#FF007A]">𝕏</span>
          <span>@247PMSTUDIO</span>
        </a>

        <a
          href="https://t.me/twofourtysevenpm"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[#FFFDF2] hover:text-[#FFEB00] font-bold transition-colors"
        >
          <span className="text-[#FFEB00]">✈</span>
          <span>@TWOFOURTYSEVENPM</span>
        </a>

        <a
          href="mailto:satapathyprayasu@gmail.com"
          className="flex items-center gap-2 text-[#FFFDF2]/80 hover:text-[#FFEB00] text-[11px] font-semibold truncate transition-colors"
        >
          <span>✉</span>
          <span className="truncate">SATAPATHYPRAYASU@GMAIL.COM</span>
        </a>

        <div className="border-t border-[#FFEB00]/20 pt-3 flex flex-col gap-2 font-bold text-[11px]">
          <div className="flex justify-between text-[#FFEB00]">
            <span className="hover:underline cursor-pointer">BRAND KIT</span>
            <span className="hover:underline cursor-pointer">TERMS</span>
          </div>
          <p className="text-[10px] text-[#FFFDF2]/50 font-normal">
            © 2026 HH-GOA. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>

      {/* Vespa Scooter & Beach Vibe Badge */}
      <div className="stamp-button rounded-xl p-3.5 text-center text-xs font-black flex items-center justify-center gap-2">
        <span>🛵</span>
        <span>2:47 PM STUDIO RESIDENCY</span>
      </div>
    </div>
  );
}
