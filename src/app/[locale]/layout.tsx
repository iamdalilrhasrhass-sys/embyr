import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata, Viewport } from "next";
import "../globals.css";
import "@/styles/embir-tokens.css";
import "@/styles/mobile.css";
import "@/styles/embir-20000x.css";
import "@/styles/embir-supernova.css";
import CookieConsent from "@/components/CookieConsent";
import ClientShell from "@/components/ClientShell";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { VibeKeyframes } from "@/components/VibeEffects";
import ScrollProgress from "@/components/ScrollProgress";
import Footer from "@/components/layout/Footer";
import GlobalJsonLd from "@/components/seo/GlobalJsonLd";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const url = locale === 'en' ? 'https://embir.xyz' : `https://embir.xyz/${locale}`;
  return {
    title: t('title'), description: t('description'),
    metadataBase: new URL('https://embir.xyz'),
    verification: { google: 'zhl0TqH5BoVmHCeI9QrtuMd8yoO05uJK_oMM_yEh3ss' },
    alternates: { canonical: url, languages: { 'fr-FR': 'https://embir.xyz/fr', 'en': 'https://embir.xyz', 'x-default': 'https://embir.xyz' } },
    openGraph: { title: t('title'), description: t('description'), url, siteName: 'Embir', locale: locale === 'fr' ? 'fr_FR' : 'en_US', type: 'website', images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Embir' }] },
    twitter: { card: 'summary_large_image', title: t('title'), description: t('description'), images: ['/og-image.png'] },
    manifest: '/manifest.webmanifest',
    appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Embir' },
    robots: locale === 'en' || locale === 'fr' ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#06030F",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.some((supportedLocale) => supportedLocale === locale)) notFound();
  const messages = await getMessages();

  return (
    <html lang={locale} data-site="embir">
      <head>
        <GlobalJsonLd />
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
            <div className="relative z-[1]">
              {children}
              <Footer />
            </div>
            <ClientShell />
            <VibeKeyframes />
            <ScrollProgress />
            <GoogleAnalytics />
            <CookieConsent />
          </NextIntlClientProvider>
      </body>
    </html>
  );
}
