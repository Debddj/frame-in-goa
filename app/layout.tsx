import type { Metadata, Viewport } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Signature type pairing for the boarding-pass concept: a geometric
// display face for names/headings, a mono face for ticket data fields
// (SEAT / GATE / FLIGHT) that reads like real departure-board typography.
const displayFont = Space_Grotesk({
  variable: "--font-display-src",
  subsets: ["latin"],
});

const monoFont = IBM_Plex_Mono({
  variable: "--font-mono-src",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HH Goa 2026 — Frame in Goa",
  description:
    "Upload a photo, get a branded HH Goa 2026 boarding pass or PFP frame, share it in one tap. #FrameInGoa",
  openGraph: {
    title: "HH Goa 2026 — Frame in Goa",
    description: "Get your HH Goa 2026 boarding pass. Upload → Frame → Share. #FrameInGoa",
    siteName: "Frame in Goa",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HH Goa 2026 — Frame in Goa",
    description: "Get your HH Goa 2026 boarding pass. Upload → Frame → Share. #FrameInGoa",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#12181F",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-mono">{children}</body>
    </html>
  );
}
