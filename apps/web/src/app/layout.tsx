import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { AuthProvider } from "@/components/layout/AuthProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://eventlux.in"),
  title: {
    default: "EVENT-LUX — University Events Platform",
    template: "%s | EVENT-LUX",
  },
  description: "Discover and register for the best university events across India. Tech fests, cultural nights, hackathons, workshops and more — all in one premium platform.",
  keywords: ["university events", "college events", "hackathon", "tech fest", "cultural events", "India", "student events"],
  authors: [{ name: "EVENT-LUX" }],
  creator: "EVENT-LUX",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://eventlux.in",
    siteName: "EVENT-LUX",
    title: "EVENT-LUX — University Events Platform",
    description: "Discover and register for the best university events across India.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "EVENT-LUX" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EVENT-LUX — University Events Platform",
    description: "Discover and register for the best university events across India.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#1A1C22" }, { media: "(prefers-color-scheme: light)", color: "#D1D5DB" }],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
