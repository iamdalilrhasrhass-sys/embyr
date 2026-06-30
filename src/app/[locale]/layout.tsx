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
import "@/styles/embir-landing.css";
import CookieConsent from "@/components/CookieConsent";
import ClientShell from "@/components/ClientShell";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { VibeKeyframes } from "@/components/VibeEffects";
import ScrollProgress from "@/components/ScrollProgress";
import Footer from "@/components/layout/Footer";
import GlobalJsonLd from "@/components/seo/GlobalJsonLd";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import InstallPrompt from "@/components/InstallPrompt";

const BRAND_SIGNATURE = "COURTIA (courtiark.fr) · Embir (embir.xyz)";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const url = locale === 'en' ? 'https://embir.xyz' : `https://embir.xyz/${locale}`;
  const title = `${t('title')} | ${BRAND_SIGNATURE}`;
  const description = `${t('description')} ${BRAND_SIGNATURE}.`;
  return {
    title: { default: title, template: `%s | ${BRAND_SIGNATURE}` },
    description,
    metadataBase: new URL('https://embir.xyz'),
    verification: { google: 'zhl0TqH5BoVmHCeI9QrtuMd8yoO05uJK_oMM_yEh3ss' },
    alternates: { canonical: url, languages: { 'fr-FR': 'https://embir.xyz/fr', 'en': 'https://embir.xyz', 'x-default': 'https://embir.xyz' } },
    openGraph: { title, description, url, siteName: 'Embir', locale: locale === 'fr' ? 'fr_FR' : 'en_US', type: 'website', images: [{ url: `/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(description)}&locale=${locale}&variant=default`, width: 1200, height: 630, alt: 'Embir' }] },
    twitter: { card: 'summary_large_image', title, description, images: [`/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(description)}&locale=${locale}&variant=default`] },
    manifest: '/manifest.webmanifest',
    appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Embir' },
    robots: locale === 'en' || locale === 'fr' ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
  const t = await getTranslations({ locale, namespace: 'meta' });
  const messages = await getMessages();
  const siteDescription = `${t('description')} ${BRAND_SIGNATURE}.`;

  return (
    <html lang={locale} data-site="embir">
      <head>
        <GlobalJsonLd />
        <meta name="description" content={siteDescription} />
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
            <div className="relative z-[1]">
              {children}
              <Footer />
            </div>
            <ClientShell />
            <VibeKeyframes />
            <ScrollProgress />
            <GoogleAnalytics />
            <CookieConsent />
            <ServiceWorkerRegister />
            <InstallPrompt />
          </NextIntlClientProvider>
      </body>
    </html>
  );
}
