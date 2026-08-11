const SEAT_LETTERS = "ABCDEF";

/** Boarding-pass-style seat, e.g. "14C". Stable per session via useState. */
export function generateSeat(): string {
  const row = 1 + Math.floor(Math.random() * 42);
  const letter = SEAT_LETTERS[Math.floor(Math.random() * SEAT_LETTERS.length)];
  return `${row}${letter}`;
}

// HHG247 — 247 is the number of builders HH Goa selects. A real detail,
// not a made-up flight number.
export const FLIGHT_CODE = "HHG247";
