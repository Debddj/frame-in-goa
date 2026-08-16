# Frame in Goa — HH Goa 2026 Task #1

> **Official Builder ID & Boarding Pass / PFP Frame Generator for Hacker House Goa 2026**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-frame--in--goa--lac.vercel.app-055C2E?style=for-the-badge&logo=vercel&logoColor=white)](https://frame-in-goa-lac.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js%2016-App%20Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Web Worker](https://img.shields.io/badge/Web%20Worker-OffscreenCanvas-FFEB00?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-Face%20Detection-FF007A?style=for-the-badge&logo=google)](https://developers.google.com/mediapipe)

---

## 🚀 Live Demo

**Direct URL:** [https://frame-in-goa-lac.vercel.app/](https://frame-in-goa-lac.vercel.app/)

No signup, no login wall, and no server bottleneck — upload a photo, customize your builder pass, and get an instant high-resolution graphic ready for download or X/Twitter sharing in one tap.

---

## ⚡ Recruiter / Evaluator Quick Tour (30 Seconds)

If you're evaluating this submission, here is the fastest way to test all capabilities live:

1. **Launch**: Open [https://frame-in-goa-lac.vercel.app/](https://frame-in-goa-lac.vercel.app/) on desktop or mobile.
2. **Smart Face Detection**: Drop any photo (including iPhone `.heic` photos, landscape, or portrait). Notice how **Google MediaPipe FaceDetector** runs client-side to instantly find and center your face (instead of naive center-cropping).
3. **Format Switcher**:
   - **✈ Boarding Pass**: Realistic flight stub with seat number, gate (day track), flight code, ticket-stub QR code, and custom motto.
   - **◉ PFP Frame**: Porthole avatar frame with gradient rings, retro beach stamps, and circular typography.
4. **Team Manifest Mode**: In Boarding Pass mode, click `+ ADD TEAMMATE TO MANIFEST` to add up to 5 teammates on a unified multi-passenger manifest ticket.
5. **Creative Customizer**: Select color themes (*Palm Emerald*, *Sunset Amber*, *Cyber Neon*, etc.), retro stickers, and stack-aware builder titles.
6. **Zero-Lag Export & Share**: Click **DOWNLOAD** for a crisp 300 DPI PNG composited off the main thread via **OffscreenCanvas Web Worker**, or **SHARE TO X** to generate a real dynamic OG-image preview via Vercel Blob.

---

## 💡 Concept

Instead of the generic "tropical passport" badge that most Task #1 entries converge on, **Frame in Goa** frames the output as a literal **boarding pass to the residency** — complete with seat assignment, gate (day track), flight code, perforated stub, and scannable QR strip. 

This doubles as the team-frame requirement naturally: a flight boarding pass seamlessly extends to a multi-passenger flight manifest.

---

## 🛠 Stack

- **Next.js 16 (App Router)** + **React 19** + **TypeScript** + **Tailwind CSS v4**
- **Native Canvas 2D Engine** — handcrafted drawing routines without `html-to-image` or heavy DOM screenshot libraries, delivering instant rendering and ultra-crisp output.
- **OffscreenCanvas Web Worker** — canvas rendering executes completely off the main UI thread with zero-copy `ImageBitmap` transfers so interactions never stutter.
- **Google MediaPipe FaceDetector** — client-side WASM face detection model automatically locating face bounding boxes for intelligent cropping.
- **heic2any** — client-side, lazy-loaded WASM decoder for seamless iPhone HEIC/HEIF photo uploads.
- **qrcode** — dynamic vector-accurate QR code rendering for the ticket stub.
- **@vercel/blob** — lightweight serverless storage backing dynamic OpenGraph social share cards with real rendered previews.

---

## 🏛 Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│  1. Upload (UploadZone)                                                │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────────────┐  │
│  │ HEIC Decode  │ ───▶ │ ImageBitmap  │ ───▶ │ MediaPipe ML Face    │  │
│  │ (WASM Lazy)  │      │ (Decoded)    │      │ Detector (Client)    │  │
│  └──────────────┘      └──────────────┘      └──────────┬───────────┘  │
│                                                         │ faceCenter   │
├─────────────────────────────────────────────────────────┼──────────────┤
│  2. Composite (Web Worker OffscreenCanvas)              ▼              │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  OffscreenCanvas Pipeline                                         │ │
│  │  ┌───────────────────┐    ┌────────────────────────────────────┐  │ │
│  │  │ Smart Face-Aware  │    │ Canvas 2D Compositor               │  │ │
│  │  │ Focal Crop        │    │ (Boarding Pass / Porthole PFP)     │  │ │
│  │  └───────────────────┘    └────────────────────────────────────┘  │ │
│  │  ┌───────────────────┐    ┌────────────────────────────────────┐  │ │
│  │  │ Paper Grain Noise │    │ Gradient Rings, Badges, QR Code    │  │ │
│  │  │ Procedural Gen    │    │ & Circular Micro-Typography        │  │ │
│  │  └───────────────────┘    └────────────────────────────────────┘  │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                          │ ImageBitmap Transfer (Zero-Copy)            │
├──────────────────────────┼─────────────────────────────────────────────┤
│  3. Output & Share       ▼                                             │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐  │
│  │ High-Res PNG     │    │ Mobile Native    │    │ 𝕏 Share Intent +  │  │
│  │ Direct Download  │    │ Web Share API    │    │ Vercel Blob OG   │  │
│  └──────────────────┘    └──────────────────┘    └──────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🌟 Key Engineering Differentiators

| Feature | Typical Submissions | Frame in Goa |
|---|---|---|
| **Face Cropping** | Naive center-crop (chops foreheads/chins) | **Client-side MediaPipe FaceDetector** auto-centers crop on actual face coordinates |
| **Rendering Performance** | Main-thread `html-to-image` (causes frame drops) | **Dedicated Web Worker + OffscreenCanvas** with zero-copy `ImageBitmap` transfers |
| **Apple HEIC Support** | Fails or errors on iOS photo uploads | **Client-side WASM HEIC decoder** converts iPhone camera shots seamlessly |
| **Team Manifests** | Separate rigid template or unsupported | **Dynamic multi-passenger manifest** supporting 1 to 5 builders per pass |
| **Social Sharing** | Static default placeholder card | **Dynamic Vercel Blob OG pipeline** showcasing the user's actual generated card |

---

## 📁 Project Structure

```
hhgoa-boarding-pass/
├── app/
│   ├── page.tsx               # Main UI — upload, interactive fields, format toggle, live preview
│   ├── layout.tsx             # Metadata, metadataBase, typography (Space Grotesk + IBM Plex Mono)
│   ├── globals.css            # Custom design tokens, glassmorphism, animations
│   ├── api/share/route.ts     # Edge/Serverless POST: stores card in Vercel Blob for OG preview
│   └── p/[id]/page.tsx        # Dynamic share route: serves real OpenGraph image tags
├── components/
│   ├── UploadZone.tsx         # Drag-and-drop file handler, HEIC decode, MediaPipe trigger
│   ├── CardPreview.tsx        # Interactive canvas preview hook, 3D tilt effects
│   ├── CustomizerPanel.tsx    # Theme presets, stickers, custom motto & builder titles
│   ├── ShareActions.tsx       # Download PNG + Web Share API + X Intent share handler
│   ├── PalmTreesBg.tsx        # Responsive SVG beach scene & ambient sunset layers
│   ├── BeachSignpost.tsx      # Interactive retro beach milestone signpost
│   └── RightFlankPanel.tsx    # Studio connect info & brand kit details
├── lib/
│   ├── canvas-engine.ts       # Handcrafted 2D canvas drawing engine (ticket + porthole)
│   ├── smart-crop.ts          # Face-aware smart crop algorithm with heuristic fallbacks
│   ├── face-detector.ts       # Singleton MediaPipe FaceDetector wrapper
│   ├── theme.ts               # Palette definitions & canvas typography configurations
│   ├── builder-titles.ts      # Stack-aware builder class title generator
│   ├── noise-texture.ts       # Procedural paper noise texture generator
│   ├── heic.ts                # HEIC/HEIF format detection and WASM conversion
│   ├── ids.ts                 # Flight code and seat assignment algorithms
│   └── share.ts               # Share ID encode/decode utilities
├── workers/
│   └── canvas-worker.ts       # Web Worker running OffscreenCanvas compositing
└── public/
    └── manifest.json          # Web app manifest for PWA installability
```

---

## 💻 Local Development

### Prerequisites

- Node.js 18+
- npm or pnpm or yarn

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/Debddj/frame-in-goa.git
cd frame-in-goa

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Environment Variables

Only required if you want to test the **share-via-link** OpenGraph preview feature locally. (Direct PNG download and native mobile sharing require zero configuration):

| Variable | Description |
|---|---|
| `BLOB_READ_WRITE_TOKEN` | Generated automatically when connecting a Vercel Blob store in the Vercel Dashboard (*Storage → Create → Blob*). |

---

## 🚢 Deployment

The project is continuously deployed to Vercel:

- **Production URL:** [https://frame-in-goa-lac.vercel.app/](https://frame-in-goa-lac.vercel.app/)

To deploy your own fork:

```bash
# Deploy with Vercel CLI
npx vercel
```

---

## 👥 Team

**Team Name:** `NULL POINTERS`

- **Debnil Dey** ([@Debddj](https://github.com/Debddj))
- **Arnav Sharma**

