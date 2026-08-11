# Frame in Goa — HH Goa 2026 Task #1

A branded photo → boarding pass / PFP frame generator for the HH Goa 2026
shortlisting task. No login, no signup — upload a photo, get a graphic,
download or share to X in one pass.

**Concept:** instead of the generic "tropical passport" badge most Task #1
entries converge on, this frames the output as a literal **boarding pass**
to the residency — seat, gate (day track), flight code, perforated stub,
QR strip. It doubles as the team-frame requirement for free: a boarding
pass naturally extends to a multi-passenger manifest.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind v4
- Native Canvas 2D compositing (no `html-to-image`/screenshot libs — that's
  what keeps generation feeling instant instead of laggy on mobile)
- **OffscreenCanvas Web Worker** — canvas rendering runs off the main thread
  so the UI never blocks, even on heavy renders
- **MediaPipe FaceDetector** — client-side face detection to auto-center
  the crop on the subject's face (not naive center-crop like other submissions)
- `heic2any` for client-side iPhone HEIC → JPEG conversion (WASM, lazy-loaded)
- `qrcode` for the ticket-stub QR code
- `@vercel/blob` for the one server touchpoint: turning a share-via-link
  into a real OG-image-backed preview

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  Upload (UploadZone)                                │
│  ┌──────────┐   ┌──────────┐   ┌────────────────┐  │
│  │ HEIC     │──▶│ImageBit- │──▶│ MediaPipe Face │  │
│  │ Decode   │   │ map      │   │ Detector       │  │
│  └──────────┘   └──────────┘   └──────┬─────────┘  │
│                                       │ faceCenter  │
├───────────────────────────────────────┼─────────────┤
│  Render (Web Worker)                  ▼             │
│  ┌────────────────────────────────────────────────┐ │
│  │  OffscreenCanvas                               │ │
│  │  ┌─────────────┐  ┌────────────────────┐      │ │
│  │  │ Smart Crop  │  │ Canvas 2D drawing  │      │ │
│  │  │ (face-aware)│  │ (ticket / porthole)│      │ │
│  │  └─────────────┘  └────────────────────┘      │ │
│  │  ┌─────────────┐  ┌────────────────────┐      │ │
│  │  │ Paper noise │  │ Gradient rings     │      │ │
│  │  │ texture     │  │ Circular text      │      │ │
│  │  └─────────────┘  └────────────────────┘      │ │
│  └────────────────────────────────────────────────┘ │
│                       │ ImageBitmap (zero-copy)     │
├───────────────────────┼─────────────────────────────┤
│  Share                ▼                             │
│  ┌──────────┐   ┌──────────┐   ┌────────────────┐  │
│  │ Download │   │ Native   │   │ X Intent +     │  │
│  │ PNG      │   │ Share    │   │ Vercel Blob    │  │
│  │          │   │ Sheet    │   │ OG Image       │  │
│  └──────────┘   └──────────┘   └────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Environment variables

Only needed for the **share-via-link** path (mobile's native share sheet
attaches the file directly and never touches this at all):

| Var | Where it comes from |
|---|---|
| `BLOB_READ_WRITE_TOKEN` | Auto-set when you attach a Vercel Blob store to this project in the Vercel dashboard (Storage → Create → Blob) |

Nothing else. No database, no auth, no login wall by design.

## Project structure

```
app/
  page.tsx                main screen — upload, fields, format toggle, preview
  layout.tsx              font loading (Space Grotesk + IBM Plex Mono), metadata, manifest
  globals.css             design tokens, animations, glassmorphism, noise overlay
  api/share/route.ts      POST: uploads the rendered PNG to Vercel Blob
  p/[id]/page.tsx         share-link landing page — sets the real OG image
                          so the X link preview shows the actual card
components/
  UploadZone.tsx          upload/drag-drop, HEIC conversion, face detection
  CardPreview.tsx         live canvas preview via Web Worker, 3D tilt effect
  ShareActions.tsx        Download + Share to X (native share sheet /
                          X intent fallback), SVG icons, success states
lib/
  theme.ts                design tokens — single source of truth, shared
                          by globals.css and the canvas engine
  canvas-engine.ts        the core renderer: boarding pass (solo + team
                          manifest) and the porthole PFP frame, with
                          paper noise texture and gradient rings
  smart-crop.ts           face-aware crop (centers on detected face) +
                          center-weighted fallback (upward-biased heuristic)
  face-detector.ts        singleton MediaPipe FaceDetector, lazy-loaded
  noise-texture.ts        deterministic paper grain texture generator
  heic.ts                 HEIC/HEIF detection + conversion
  use-canvas-worker.ts    React hook managing the OffscreenCanvas Web Worker
  builder-titles.ts       stack-aware "builder class" generator
  ids.ts                  seat/flight code generation
  share.ts                share-id ↔ blob URL encode/decode (no DB)
  types.ts                shared types
workers/
  canvas-worker.ts        Web Worker that composites on OffscreenCanvas
public/
  manifest.json           PWA manifest for mobile install prompt
```

## Three differentiators over typical submissions

1. **Face-aware cropping** — MediaPipe FaceDetector runs client-side on
   upload and centers the crop window on the detected face. Handles
   portrait/landscape mismatches that naive center-crop can't.

2. **OffscreenCanvas Web Worker** — all canvas compositing runs off the
   main thread via a Web Worker with transferable ImageBitmaps (zero-copy).
   Falls back to main-thread rendering on older browsers.

3. **Real OG image for link previews** — when sharing via link, the
   rendered PNG is uploaded to Vercel Blob and served as the OG image
   for that specific link. No static placeholder.

## Deployment

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Deploy
vercel
```

Attach a Blob store in the Vercel dashboard (Storage → Create → Blob)
to enable the share-via-link flow. The `BLOB_READ_WRITE_TOKEN` env var
is auto-set.
