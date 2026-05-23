import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import "../globals.css";
import "@/styles/embyr-tokens.css";
import "@/styles/mobile.css";
import { Geist, Geist_Mono } from "next/font/google";
import { Fraunces } from "next/font/google";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], weight: ["500", "700"] });

export const metadata: Metadata = {
  title: "Embyr — Rencontre gay gratuite | App de rencontre entre hommes",
  description: "Embyr est l'app de rencontre gay 100% gratuite. Crée ton profil, rencontre des mecs près de chez toi, sans pression. Rencontre gay nouvelle génération.",
  keywords: ["rencontre gay", "app rencontre gay", "rencontre entre hommes", "site rencontre gay gratuit", "dating gay", "rencontre gay gratuite", "application gay", "gay dating france", "rencontre mec", "chat gay"],
  manifest: "/manifest.json",
  themeColor: "#06030F",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Embyr" },
  openGraph: {
    type: "website",
    siteName: "Embyr",
    title: "Embyr — Rencontre gay gratuite | App de rencontre entre hommes",
    description: "App de rencontre gay 100% gratuite. Crée ton profil, rencontre des mecs près de chez toi. Gratuit au lancement.",
    url: "https://embir.xyz",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Embyr — Rencontre gay gratuite",
    description: "App de rencontre gay 100% gratuite. Crée ton profil, rencontre des mecs près de chez toi.",
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
    <html lang={locale} data-site="embyr" className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased relative" style={{ background: "#06030F", color: "rgba(255,255,255,0.9)", fontFamily: "Arial, sans-serif" }}>
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
