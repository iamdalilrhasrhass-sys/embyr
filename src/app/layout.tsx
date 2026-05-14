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
  title: "Embyr — Club Privé Premium",
  description: "Plateforme de rencontres premium, authentiques et sélectives. Embyr — l'excellence de la rencontre.",
  manifest: "/manifest.json",
  themeColor: "#0A0B0E",
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
      <body className="antialiased" style={{ background: "var(--eb-bg-base)", color: "var(--eb-text-primary)", fontFamily: "var(--eb-font-body)" }}>
        {children}
      </body>
    </html>
  );
}
