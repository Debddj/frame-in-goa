"use client";

export function BeachSignpost() {
  return (
    <div className="hidden lg:flex flex-col items-center fixed left-6 xl:left-12 top-28 z-10 w-64 pointer-events-auto transition-all duration-300">
      {/* Wooden Signpost Column */}
      <div className="w-4 h-[440px] bg-[#FFFFFF] border-2 border-[#111111] absolute top-4 left-1/2 -translate-x-1/2 rounded-sm shadow-md" />

      {/* Arrow 1: Yellow - 6800+ Registrations */}
      <div className="relative z-10 my-2 w-full transform -rotate-2 hover:rotate-0 transition-transform">
        <div className="signpost-arrow bg-[#FFEB00] text-[#055C2E] border-2 border-[#111111] px-4 py-2.5 shadow-lg flex flex-col justify-center">
          <div className="text-xl font-black font-mono leading-none tracking-tight">
            6800+ <span className="text-[10px] uppercase font-bold tracking-widest text-[#055C2E]">REGISTRATIONS 2024</span>
          </div>
        </div>
      </div>

      {/* Arrow 2: Pink/Magenta - 390+ Hackers */}
      <div className="relative z-10 my-2 w-full transform rotate-3 hover:rotate-0 transition-transform">
        <div className="signpost-arrow signpost-arrow-magenta bg-[#FF007A] text-[#FFFDF2] border-2 border-[#FFEB00] px-4 py-2.5 shadow-lg flex flex-col justify-center">
          <div className="text-xl font-black font-mono leading-none tracking-tight">
            390+ <span className="text-[10px] uppercase font-bold tracking-widest text-[#FFEB00]">HACKERS</span>
          </div>
        </div>
      </div>

      {/* Arrow 3: Yellow - 100 Projects */}
      <div className="relative z-10 my-2 w-full transform -rotate-1 hover:rotate-0 transition-transform">
        <div className="signpost-arrow bg-[#FFEB00] text-[#055C2E] border-2 border-[#111111] px-4 py-2.5 shadow-lg flex flex-col justify-center">
          <div className="text-xl font-black font-mono leading-none tracking-tight">
            100 <span className="text-[10px] uppercase font-bold tracking-widest text-[#055C2E]">PROJECTS SHIPPED</span>
          </div>
        </div>
      </div>

      {/* Arrow 4: Magenta - $50K+ Bounties */}
      <div className="relative z-10 my-2 w-full transform rotate-2 hover:rotate-0 transition-transform">
        <div className="signpost-arrow signpost-arrow-magenta bg-[#FF007A] text-[#FFFDF2] border-2 border-[#FFEB00] px-4 py-2.5 shadow-lg flex flex-col justify-center">
          <div className="text-xl font-black font-mono leading-none tracking-tight">
            $50K+ <span className="text-[10px] uppercase font-bold tracking-widest text-[#FFEB00]">BOUNTIES 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
