// Design tokens for the HH Goa 2026 boarding-pass concept.
// Shared between CSS (globals.css mirrors these as custom properties)
// and the canvas engine (which can't read CSS vars, so it imports this directly).
//
// Direction: a departure-board / flight-ticket aesthetic, not the
// jungle-green + mustard "tropical passport" look most other Task #1
// submissions are converging on. Dusk-navy ground, warm cream ticket
// stock, one coral accent used sparingly as the signature color.

export const theme = {
  color: {
    ink: "#12181F", // page/app background — dusk, not pure black
    cardStock: "#F6EFE1", // the ticket itself — warm paper white
    coral: "#FF6B4A", // signature accent — used sparingly (stub, seat number)
    teal: "#1F8A70", // secondary accent — porthole ring, gate marker
    navy: "#1B2430", // primary text on cream
    sand: "#D8C9A3", // dividers, perforation dots, muted labels
    sandDark: "#9C8F6C", // muted label text on cream (AA against cardStock)
  },
  font: {
    // Mono carries the "ticket data" fields (SEAT / GATE / FLIGHT) —
    // borrowed from real departure-board typography, which is the
    // signature element of the whole design.
    mono: "'IBM Plex Mono', ui-monospace, monospace",
    // A geometric sans with actual personality for names/headings,
    // deliberately not Inter/system-ui.
    display: "'Space Grotesk', ui-sans-serif, sans-serif",
  },
  // Canonical export sizes. 2x the visual design size so the PNG
  // stays crisp when embedded in an X card or cropped to a circular PFP.
  export: {
    boardingPass: { w: 1600, h: 1000 },
    porthole: { w: 1200, h: 1200 },
  },
} as const;

export type Theme = typeof theme;
