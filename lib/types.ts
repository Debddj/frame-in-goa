import type { FaceCenter } from "./face-detector";

export type ThemePreset = "palmEmerald" | "sunsetVaporwave" | "cyberMidnight" | "vintageTicket";
export type StickerPreset = "none" | "pirate" | "cyber" | "anime" | "rocket" | "palm";

export interface Passenger {
  id: string;
  name: string;
  stackOrRole: string;
  builderTitle: string;
  photo: ImageBitmap | null;
  photoObjectUrl: string | null;
  faceCenter: FaceCenter | null;
  characterPhoto?: ImageBitmap | null;
  characterPhotoUrl?: string | null;
  customMotto?: string;
}

export type CardFormat = "porthole" | "boardingPass";

export interface BoardingPassData {
  passengers: Passenger[];
  seat: string;
  gate: string;
  flightCode: string;
  qrPayload: string;
  themePreset: ThemePreset;
  stickerPreset: StickerPreset;
  customMotto?: string;
}

export const GATES = ["Genesis", "Triangle", "Build", "Launch"] as const;
export type Gate = (typeof GATES)[number];
