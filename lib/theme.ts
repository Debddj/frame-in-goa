import type { ThemePreset } from "./types";

export interface ThemeColors {
  bg: string;
  cardStock: string;
  headerBg: string;
  titleColor: string;
  accentYellow: string;
  accentMagenta: string;
  navy: string;
  sand: string;
  badgeBg: string;
  badgeText: string;
}

export const themePalettes: Record<ThemePreset, ThemeColors> = {
  palmEmerald: {
    bg: "#055C2E",
    cardStock: "#FFFDF2",
    headerBg: "#055C2E",
    titleColor: "#FFEB00",
    accentYellow: "#FFEB00",
    accentMagenta: "#FF007A",
    navy: "#0A2416",
    sand: "#E5D9B6",
    badgeBg: "#FF007A",
    badgeText: "#FFFFFF",
  },
  sunsetVaporwave: {
    bg: "#2A0845",
    cardStock: "#FFF8E7",
    headerBg: "#4C1D95",
    titleColor: "#00F0FF",
    accentYellow: "#00F0FF",
    accentMagenta: "#FF007A",
    navy: "#1F0938",
    sand: "#E9D5FF",
    badgeBg: "#FF007A",
    badgeText: "#00F0FF",
  },
  cyberMidnight: {
    bg: "#0D1117",
    cardStock: "#161B22",
    headerBg: "#21262D",
    titleColor: "#39FF14",
    accentYellow: "#39FF14",
    accentMagenta: "#38BDF8",
    navy: "#F0F6FC",
    sand: "#30363D",
    badgeBg: "#8B5CF6",
    badgeText: "#FFFFFF",
  },
  vintageTicket: {
    bg: "#3B2F2F",
    cardStock: "#F5EBE0",
    headerBg: "#2B2B2B",
    titleColor: "#E6C280",
    accentYellow: "#D4A373",
    accentMagenta: "#B83227",
    navy: "#1C1917",
    sand: "#D6C7B2",
    badgeBg: "#B83227",
    badgeText: "#FFFDF2",
  },
};

export const theme = {
  color: {
    emerald: "#055C2E",
    emeraldDark: "#02381A",
    emeraldLight: "#0D723B",
    yellow: "#FFEB00",
    yellowDark: "#D6C400",
    magenta: "#FF007A",
    magentaDark: "#C7005F",
    sunOrange: "#FF9900",
    cardStock: "#FFFDF2",
    ink: "#055C2E",
    navy: "#0A2416",
    sand: "#E5D9B6",
    sandDark: "#055C2E",
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
