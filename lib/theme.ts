// Official HH Goa 2026 (2:47 PM Studio) Brand Kit Tokens.
// Direct palette and typography sampled from official HH Goa 26 assets.

export const theme = {
  color: {
    // Primary palm emerald ground (sampled from official website background)
    emerald: "#055C2E",
    emeraldDark: "#02381A",
    emeraldLight: "#0D723B",
    
    // Signature Sun Yellow (used for main HACKER HOUSE title & signposts)
    yellow: "#FFEB00",
    yellowDark: "#D6C400",

    // Signature Hot Magenta / Neon Pink (used for Devanagari गोवा script & badges)
    magenta: "#FF007A",
    magentaDark: "#C7005F",

    // Goa Sunset Orange
    sunOrange: "#FF9900",

    // Ticket & UI surface colors
    cardStock: "#FFFDF2", // warm paper cream
    ink: "#055C2E",       // text ground
    navy: "#0A2416",      // deep palm dark text
    sand: "#E5D9B6",      // subtle dividers
    sandDark: "#055C2E",  // labels on card
    white: "#FFFFFF",
    black: "#111111",
  },
  font: {
    mono: "'IBM Plex Mono', ui-monospace, monospace",
    display: "'Space Grotesk', ui-sans-serif, sans-serif",
    serif: "'Playfair Display', 'Bodoni Moda', Georgia, serif",
  },
  export: {
    boardingPass: { w: 1600, h: 1000 },
    porthole: { w: 1200, h: 1200 },
  },
} as const;

export type Theme = typeof theme;
