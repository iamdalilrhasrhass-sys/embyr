import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import "../globals.css";
import "@/styles/embir-tokens.css";
import "@/styles/mobile.css";
import ClientShell from "@/components/ClientShell";

export const metadata: Metadata = {
  metadataBase: new URL("https://embir.xyz"),
  verification: { google: "zhl0TqH5BoVmHCeI9QrtuMd8yoO05uJK_oMM_yEh3ss" },
  title: "Embir — Gay Dating App for Authentic Connections | Free & Safe",
  description: "Embir is the global gay dating app for real connections. Free, safe, no ads, no paywalls. Available in 25 languages. Join founding members now.",
  keywords: ["gay dating app", "free gay dating", "gay chat", "men seeking men", "dating app for men", "gay meet", "global gay dating", "LGBTQ dating"],
  manifest: "/manifest.json",
  themeColor: "#06030F",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Embir" },
  openGraph: {
    type: "website",
    siteName: "Embir",
    title: "Embir — Gay Dating App for Authentic Connections",
    description: "Meet authentic gay men worldwide. Free, safe, and designed for real connections. No ads, no paywalls.",
    url: "https://embir.xyz",
    locale: "en_US",
    images: [{ url: "https://embir.xyz/og-image.png", width: 1200, height: 630, alt: "Embir — Gay dating app" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Embir — Gay Dating App",
    description: "Free, safe, no ads. The gay dating app for authentic connections worldwide.",
    images: [{ url: "https://embir.xyz/og-image.png", width: 1200, height: 630, alt: "Embir" }],
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://embir.xyz",
    languages: {
      "en": "https://embir.xyz",
      "fr": "https://embir.xyz/fr",
      "es": "https://embir.xyz/es",
      "de": "https://embir.xyz/de",
      "pt": "https://embir.xyz/pt",
      "it": "https://embir.xyz/it",
      "nl": "https://embir.xyz/nl",
      "ru": "https://embir.xyz/ru",
      "zh": "https://embir.xyz/zh",
      "ja": "https://embir.xyz/ja",
      "ko": "https://embir.xyz/ko",
      "ar": "https://embir.xyz/ar",
      "hi": "https://embir.xyz/hi",
      "tr": "https://embir.xyz/tr",
      "pl": "https://embir.xyz/pl",
      "sv": "https://embir.xyz/sv",
      "da": "https://embir.xyz/da",
      "fi": "https://embir.xyz/fi",
      "no": "https://embir.xyz/no",
      "th": "https://embir.xyz/th",
      "vi": "https://embir.xyz/vi",
      "id": "https://embir.xyz/id",
      "ms": "https://embir.xyz/ms",
      "ro": "https://embir.xyz/ro",
      "uk": "https://embir.xyz/uk",
      "x-default": "https://embir.xyz",
    },
  },
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
    <html lang={locale} data-site="embir">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`} />
            <script dangerouslySetInnerHTML={{ __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
            `}} />
          </>
        )}
      </head>
      <body className="antialiased relative" style={{ background: "#0a0614", color: "rgba(255,255,255,0.9)", fontFamily: "'Inter', system-ui, sans-serif" }}>
          <NextIntlClientProvider messages={messages}>
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
              <div className="emb-aurora-bg" />
              <div className="emb-grid" />
              <div className="emb-noise" />
            </div>
            <div className="relative z-[1]">{children}</div>
            <ClientShell />
          </NextIntlClientProvider>
      </body>
    </html>
  );
}
