import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import "../globals.css";
import "@/styles/embir-tokens.css";
import "@/styles/mobile.css";
import { Geist, Geist_Mono } from "next/font/google";
import { Fraunces, Playfair_Display } from "next/font/google";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], weight: ["500", "700"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });

export const metadata: Metadata = {
  verification: { google: "zhl0TqH5BoVmHCeI9QrtuMd8yoO05uJK_oMM_yEh3ss" },
  title: "embir.xyz — Rencontre gay gratuite à Paris | 100 membres fondateurs",
  description: "embir.xyz lance ses 100 premiers membres fondateurs à Paris : app de rencontre gay gratuite, sans pubs, sans faux profils et pensée pour des rencontres réelles.",
  keywords: ["rencontre gay Paris", "app rencontre gay", "rencontre entre hommes", "site rencontre gay gratuit", "dating gay", "rencontre gay gratuite", "application gay", "gay dating france", "rencontre mec", "chat gay", "embir xyz"],
  manifest: "/manifest.json",
  themeColor: "#06030F",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "embir.xyz" },
  openGraph: {
    type: "website",
    siteName: "embir.xyz",
    title: "embir.xyz — Les 100 membres fondateurs à Paris",
    description: "Une app de rencontre gay gratuite, locale et honnête : Paris d'abord, vrais profils uniquement, zéro faux compteur.",
    url: "https://embir.xyz",
    locale: "fr_FR",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "embir.xyz — Rencontres entre hommes" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "embir.xyz — Rencontre gay gratuite à Paris",
    description: "Rejoins les 100 premiers membres fondateurs à Paris. Gratuit, sans pubs, sans faux profils.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "embir.xyz" }],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://embir.xyz" },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) notFound();
  const messages = await getMessages();

  return (
    <html lang={locale} data-site="embir" className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased relative" style={{ background: "#0a0614", color: "rgba(255,255,255,0.9)", fontFamily: "'Inter', system-ui, sans-serif" }}>
        <NextIntlClientProvider messages={messages}>
          <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="emb-aurora-bg" />
            <div className="emb-grid" />
            <div className="emb-noise" />
          </div>
          <div className="relative z-[1]">{children}</div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
