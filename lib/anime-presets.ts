/**
 * Built-in Anime & Pop-Culture Co-Pilot Mascot Presets.
 * Crisp 400x400 SVG artwork rendered locally on canvas without needing Google downloads or uploads.
 */

export interface AnimePreset {
  id: string;
  name: string;
  tagline: string;
  defaultSpeech: string;
  svg: string;
}

export const ANIME_PRESETS: AnimePreset[] = [
  {
    id: "luffy",
    name: "Strawhat Luffy 🏴‍☠️",
    tagline: "One Piece",
    defaultSpeech: "King of the Hackers! 🏴‍☠️",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <defs>
        <radialGradient id="bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#00D2FF"/>
          <stop offset="100%" stop-color="#0052D4"/>
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="url(#bg)"/>
      <circle cx="200" cy="200" r="160" fill="#FFD2A8"/>
      <!-- Straw Hat -->
      <path d="M40,160 Q200,60 360,160 Q380,210 200,195 Q20,210 40,160 Z" fill="#FFE066" stroke="#D4A373" stroke-width="6"/>
      <path d="M80,172 Q200,105 320,172" fill="none" stroke="#FF007A" stroke-width="22"/>
      <path d="M40,195 Q200,230 360,195" fill="none" stroke="#E6C280" stroke-width="12"/>
      <!-- Hair -->
      <path d="M120,180 Q100,220 130,240 Q150,190 170,220 M230,220 Q250,190 270,240 Q300,220 280,180" fill="#111111"/>
      <!-- Eyes & Smile -->
      <circle cx="155" cy="235" r="10" fill="#111111"/>
      <circle cx="245" cy="235" r="10" fill="#111111"/>
      <!-- Scar under eye -->
      <path d="M145,255 L165,265 M150,265 L160,255" stroke="#FF007A" stroke-width="4" stroke-linecap="round"/>
      <!-- Huge Smile -->
      <path d="M130,270 Q200,340 270,270 Z" fill="#FFFFFF" stroke="#111111" stroke-width="6"/>
      <path d="M135,275 Q200,305 265,275" fill="none" stroke="#FF007A" stroke-width="8"/>
    </svg>`,
  },
  {
    id: "goku",
    name: "Super Saiyan 💥",
    tagline: "Dragon Ball",
    defaultSpeech: "Over 9000 Bounties! 💥",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <defs>
        <radialGradient id="aura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFEB00"/>
          <stop offset="50%" stop-color="#FF9900"/>
          <stop offset="100%" stop-color="#2A0845"/>
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="url(#aura)"/>
      <!-- Spiky Golden Hair -->
      <path d="M200,40 L160,140 L110,70 L120,170 L50,140 L110,210 L30,220 L100,260 M200,40 L240,140 L290,70 L280,170 L350,140 L290,210 L370,220 L300,260" fill="#FFEB00" stroke="#FF9900" stroke-width="8"/>
      <!-- Face -->
      <polygon points="120,220 280,220 250,330 200,360 150,330" fill="#FFE0B2" stroke="#111111" stroke-width="6"/>
      <!-- Sharp Eyebrows & Teal Eyes -->
      <path d="M130,240 L185,260 L135,265 Z M270,240 L215,260 L265,265 Z" fill="#FFEB00"/>
      <ellipse cx="165" cy="270" rx="8" ry="14" fill="#00F0FF"/>
      <ellipse cx="235" cy="270" rx="8" ry="14" fill="#00F0FF"/>
      <!-- Grin -->
      <path d="M165,315 Q200,330 235,315" fill="none" stroke="#111111" stroke-width="6" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: "gojo",
    name: "Gojo Satoru 🕶️",
    tagline: "Jujutsu Kaisen",
    defaultSpeech: "Domain Expansion: Goa 🕶️",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <rect width="400" height="400" fill="#0D1117"/>
      <!-- Spiky White Hair -->
      <path d="M70,180 Q100,60 200,40 Q300,60 330,180 Q360,120 300,70 Q200,20 100,70 Z" fill="#FFFFFF"/>
      <circle cx="200" cy="220" r="120" fill="#F5E0C3"/>
      <!-- White Spikes Hair Front -->
      <path d="M100,160 L140,210 L170,150 L200,220 L230,150 L260,210 L300,160 L270,120 L130,120 Z" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="4"/>
      <!-- Iconic Black Blindfold / Glasses -->
      <rect x="110" y="200" width="180" height="50" rx="12" fill="#111111" stroke="#38BDF8" stroke-width="4"/>
      <circle cx="160" cy="225" r="8" fill="#00F0FF"/>
      <circle cx="240" cy="225" r="8" fill="#00F0FF"/>
      <!-- Smirk -->
      <path d="M175,290 Q210,310 235,285" fill="none" stroke="#111111" stroke-width="6" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: "pikachu",
    name: "Pikachu ⚡",
    tagline: "Pokémon",
    defaultSpeech: "Pika Pika! 100K Volts ⚡",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <rect width="400" height="400" fill="#055C2E"/>
      <!-- Ears -->
      <path d="M100,160 L40,30 Q90,70 140,130 Z" fill="#FFEB00" stroke="#111111" stroke-width="6"/>
      <path d="M40,30 Q60,50 80,70 L55,45 Z" fill="#111111"/>
      <path d="M300,160 L360,30 Q310,70 260,130 Z" fill="#FFEB00" stroke="#111111" stroke-width="6"/>
      <path d="M360,30 Q340,50 320,70 L345,45 Z" fill="#111111"/>
      <!-- Head -->
      <circle cx="200" cy="230" r="130" fill="#FFEB00" stroke="#111111" stroke-width="6"/>
      <!-- Cheeks -->
      <circle cx="120" cy="265" r="32" fill="#FF007A"/>
      <circle cx="280" cy="265" r="32" fill="#FF007A"/>
      <!-- Eyes -->
      <circle cx="150" cy="210" r="18" fill="#111111"/>
      <circle cx="145" cy="205" r="7" fill="#FFFFFF"/>
      <circle cx="250" cy="210" r="18" fill="#111111"/>
      <circle cx="245" cy="205" r="7" fill="#FFFFFF"/>
      <!-- Nose & Mouth -->
      <ellipse cx="200" cy="230" rx="5" ry="3" fill="#111111"/>
      <path d="M180,245 Q200,260 200,245 Q200,260 220,245" fill="none" stroke="#111111" stroke-width="5" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: "cyberbot",
    name: "Cyber Pilot 🤖",
    tagline: "Mecha / Sci-Fi",
    defaultSpeech: "Systems Online: 100% 🤖",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <rect width="400" height="400" fill="#1F0938"/>
      <!-- Robot Helmet -->
      <rect x="90" y="100" width="220" height="220" rx="40" fill="#21262D" stroke="#00F0FF" stroke-width="8"/>
      <!-- Visor -->
      <rect x="110" y="150" width="180" height="70" rx="20" fill="#00F0FF"/>
      <path d="M120,165 L280,165" stroke="#FFFFFF" stroke-width="6" opacity="0.6"/>
      <!-- Cyber Glow Eyes -->
      <circle cx="160" cy="185" r="12" fill="#FF007A"/>
      <circle cx="240" cy="185" r="12" fill="#FF007A"/>
      <!-- Antenna -->
      <line x1="200" y1="100" x2="200" y2="40" stroke="#FF007A" stroke-width="8"/>
      <circle cx="200" cy="35" r="14" fill="#FFEB00"/>
      <!-- Speaker Mouth Grid -->
      <rect x="150" y="250" width="100" height="30" rx="8" fill="#0D1117" stroke="#39FF14" stroke-width="4"/>
      <line x1="170" y1="250" x2="170" y2="280" stroke="#39FF14" stroke-width="3"/>
      <line x1="200" y1="250" x2="200" y2="280" stroke="#39FF14" stroke-width="3"/>
      <line x1="230" y1="250" x2="230" y2="280" stroke="#39FF14" stroke-width="3"/>
    </svg>`,
  },
  {
    id: "hacker_cat",
    name: "Cyber Cat 🐱",
    tagline: "Neko Hacker",
    defaultSpeech: "Meow! Hacking 3 AM 🐾",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <rect width="400" height="400" fill="#0A2416"/>
      <!-- Hoodie -->
      <path d="M80,380 C80,200 320,200 320,380 Z" fill="#02381A" stroke="#39FF14" stroke-width="6"/>
      <!-- Cat Head -->
      <circle cx="200" cy="220" r="100" fill="#111111"/>
      <!-- Ears -->
      <polygon points="110,160 140,80 180,140" fill="#111111" stroke="#39FF14" stroke-width="5"/>
      <polygon points="125,145 145,95 165,135" fill="#FF007A"/>
      <polygon points="290,160 260,80 220,140" fill="#111111" stroke="#39FF14" stroke-width="5"/>
      <polygon points="275,145 255,95 235,135" fill="#FF007A"/>
      <!-- Neon Matrix Glasses -->
      <rect x="130" y="195" width="60" height="35" rx="8" fill="#39FF14"/>
      <rect x="210" y="195" width="60" height="35" rx="8" fill="#39FF14"/>
      <line x1="190" y1="210" x2="210" y2="210" stroke="#39FF14" stroke-width="5"/>
      <!-- Whiskers -->
      <line x1="100" y1="240" x2="50" y2="230" stroke="#FFEB00" stroke-width="4"/>
      <line x1="100" y1="255" x2="50" y2="260" stroke="#FFEB00" stroke-width="4"/>
      <line x1="300" y1="240" x2="350" y2="230" stroke="#FFEB00" stroke-width="4"/>
      <line x1="300" y1="255" x2="350" y2="260" stroke="#FFEB00" stroke-width="4"/>
    </svg>`,
  },
];

/**
 * Converts an SVG string preset into a ready ImageBitmap and ObjectURL.
 */
export async function loadPresetMascot(svgString: string): Promise<{ bitmap: ImageBitmap; objectUrl: string }> {
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const objectUrl = URL.createObjectURL(blob);
  const img = new Image();
  img.src = objectUrl;
  await img.decode();
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, 400, 400);
  const bitmap = await createImageBitmap(canvas);
  return { bitmap, objectUrl };
}
