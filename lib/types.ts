import type { FaceCenter } from "./face-detector";

export interface Passenger {
  id: string;
  name: string;
  stackOrRole: string;
  builderTitle: string;
  photo: ImageBitmap | null;
  photoObjectUrl: string | null; // for <img> previews / thumbnails
  faceCenter: FaceCenter | null; // detected face centroid for smart crop
}

export type CardFormat = "porthole" | "boardingPass";

export interface BoardingPassData {
  passengers: Passenger[]; // 1 = solo pass, 2+ = team manifest
  seat: string; // e.g. "247B" — derived from a builder number
  gate: string; // one of the four day tracks
  flightCode: string; // "HHG247"
  qrPayload: string; // encodes the share link
}

export const GATES = ["Genesis", "Triangle", "Build", "Launch"] as const;
export type Gate = (typeof GATES)[number];
