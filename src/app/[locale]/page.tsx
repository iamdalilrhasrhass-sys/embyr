import type { Metadata } from "next";
import Landing2100 from "@/components/landing-2100/Landing2100";
import { landingCopy, type LandingLocale } from "@/components/landing-2100/landing-copy";
import { buildLanguageAlternates, publicLandingLocales, type PublicLandingLocale } from "@/seo/url";

export const revalidate = 3600;

type LandingMetadata = {
  title: string;
  description: string;
  openGraphLocale: string;
};

export const landingMetadataByLocale = {
  en: {
    title: "Embir — Meet people who are looking for you too",
    description:
      "A free-at-launch dating platform for every orientation and intention, built around reciprocal compatibility, personal universes and respectful discovery.",
    openGraphLocale: "en_US",
  },
  fr: {
    title: "Embir — Rencontrez ceux qui vous cherchent aussi",
    description:
      "Une plateforme de rencontre gratuite au lancement, pensée pour toutes les orientations et toutes les intentions, avec compatibilité réciproque et univers personnels.",
    openGraphLocale: "fr_FR",
  },
  es: {
    title: "Embir — Conoce a quienes también te buscan",
    description:
      "Una plataforma de citas gratis durante el lanzamiento, creada para cada orientación e intención, con compatibilidad recíproca y universos personales.",
    openGraphLocale: "es_ES",
  },
  de: {
    title: "Embir — Triff Menschen, die dich ebenfalls suchen",
    description:
      "Eine Dating-Plattform, die zum Start kostenlos ist und jede Orientierung und Absicht mit gegenseitiger Kompatibilität und persönlichen Welten verbindet.",
    openGraphLocale: "de_DE",
  },
  it: {
    title: "Embir — Incontra chi sta cercando anche te",
    description:
      "Una piattaforma di incontri gratuita al lancio, pensata per ogni orientamento e intenzione, con compatibilità reciproca e universi personali.",
    openGraphLocale: "it_IT",
  },
} satisfies Record<PublicLandingLocale, LandingMetadata>;

function isPublicLandingLocale(locale: string): locale is PublicLandingLocale {
  return locale in landingMetadataByLocale;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!isPublicLandingLocale(locale)) {
    return {
      metadataBase: new URL("https://embir.xyz"),
      alternates: {
        canonical: "https://embir.xyz",
        languages: buildLanguageAlternates("/"),
      },
      robots: { index: false, follow: false },
    };
  }

  const metadata = landingMetadataByLocale[locale];
  const publicPath = publicLandingLocales[locale];
  const canonical = `https://embir.xyz${publicPath === "/" ? "" : publicPath}`;
  const ogImage = `/api/og?title=${encodeURIComponent(metadata.title)}&subtitle=${encodeURIComponent(metadata.description)}&locale=${locale}&variant=default`;

  return {
    title: metadata.title,
    description: metadata.description,
    metadataBase: new URL("https://embir.xyz"),
    alternates: {
      canonical,
      languages: buildLanguageAlternates(publicPath),
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: "Embir",
      title: metadata.title,
      description: metadata.description,
      url: canonical,
      locale: metadata.openGraphLocale,
      images: [{ url: ogImage, width: 1200, height: 630, alt: metadata.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      images: [ogImage],
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const landingLocale: LandingLocale = locale in landingCopy ? (locale as LandingLocale) : "en";

  return <Landing2100 locale={landingLocale} />;
}
