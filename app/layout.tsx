import type { Metadata, Viewport } from "next";
import { Space_Grotesk, IBM_Plex_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const displayFont = Space_Grotesk({
  variable: "--font-display-src",
  subsets: ["latin"],
});

const monoFont = IBM_Plex_Mono({
  variable: "--font-mono-src",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const serifFont = Playfair_Display({
  variable: "--font-serif-src",
  weight: ["600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HH Goa 2026 — Frame in Goa | 2:47 PM Studio",
  description:
    "Upload a photo, get an official branded HH Goa 2026 boarding pass or PFP frame, share it in one tap. #FrameInGoa",
  openGraph: {
    title: "HH Goa 2026 — Frame in Goa",
    description: "Get your official HH Goa 2026 boarding pass. Upload → Frame → Share. #FrameInGoa",
    siteName: "Frame in Goa",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HH Goa 2026 — Frame in Goa",
    description: "Get your official HH Goa 2026 boarding pass. Upload → Frame → Share. #FrameInGoa",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#055C2E",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${monoFont.variable} ${serifFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-mono bg-[#055C2E] text-[#FFFDF2]">{children}</body>
    </html>
  );
}
