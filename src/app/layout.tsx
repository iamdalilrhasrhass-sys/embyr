import type { Metadata } from "next";
import "./globals.css";
import "@/styles/embyr-tokens.css";
import "@/styles/mobile.css";
import { Geist, Geist_Mono } from "next/font/google";
import { Fraunces } from "next/font/google";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], weight: ["500", "700"] });

export const metadata: Metadata = {
  title: "Embyr — Rencontre plus librement. Gratuitement.",
  description: "Plateforme de rencontre moderne et élégante, gratuite pendant sa phase de lancement. Crée ton profil et rejoins la communauté fondatrice.",
  manifest: "/manifest.json",
  themeColor: "#06030F",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Embyr" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-site="embyr" className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased relative" style={{ background: "#06030F", color: "rgba(255,255,255,0.9)", fontFamily: "Arial, sans-serif" }}>
        {/* Fixed ambient layer — EMBYR style */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="emb-aurora-bg" />
          <div className="emb-grid" />
          <div className="emb-noise" />
        </div>
        <div className="relative z-[1]">
          {children}
        </div>
      </body>
    </html>
  );
}
