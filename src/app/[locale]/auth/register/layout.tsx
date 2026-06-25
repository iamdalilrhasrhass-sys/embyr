import type { Metadata } from "next";

const copy = {
  fr: {
    title: "Créer un profil gratuit | Embir",
    description:
      "Choisis ton orientation et ton intention pour voir uniquement les profils compatibles avec toi sur Embir.",
  },
  en: {
    title: "Create a free profile | Embir",
    description:
      "Choose your orientation and intention to see only profiles that are compatible with you on Embir.",
  },
  es: {
    title: "Crear un perfil gratis | Embir",
    description:
      "Elige tu orientación y tu intención para ver únicamente perfiles compatibles contigo en Embir.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const selected = locale === "fr" ? copy.fr : locale === "es" ? copy.es : copy.en;
  const canonical =
    locale === "fr"
      ? "https://embir.xyz/fr/auth/register"
      : locale === "es"
        ? "https://embir.xyz/es/auth/register"
        : "https://embir.xyz/auth/register";

  return {
    title: selected.title,
    description: selected.description,
    alternates: {
      canonical,
      languages: {
        "en-US": "https://embir.xyz/auth/register",
        "fr-FR": "https://embir.xyz/fr/auth/register",
        "es-ES": "https://embir.xyz/es/auth/register",
        "x-default": "https://embir.xyz/auth/register",
      },
    },
    robots: { index: false, follow: false },
    openGraph: {
      title: selected.title,
      description: selected.description,
      url: canonical,
      type: "website",
      siteName: "Embir",
    },
  };
}

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
