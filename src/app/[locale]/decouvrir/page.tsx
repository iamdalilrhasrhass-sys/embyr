import type { Metadata } from "next";
import DiscoveryExperience from "@/components/acquisition/DiscoveryExperience";
import { discoveryCopy, type DiscoveryLocale } from "@/components/acquisition/discovery-copy";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === "fr";
  return {
    title: isFr
      ? "Découvrez des profils compatibles, sans vous inscrire d’abord | Embir"
      : "Explore compatible profiles before you sign up | Embir",
    description: isFr
      ? "Aperçus anonymisés issus de profils réellement publiés sur Embir. Découvrez la compatibilité avant de créer votre profil."
      : "Anonymized previews from real published Embir profiles. Explore compatibility before creating your profile.",
    robots: { index: false, follow: true },
  };
}
export default async function DecouvrirPage({ params }: { params: Params }) {
  const { locale } = await params;
  const normalizedLocale: DiscoveryLocale = locale === "fr" ? "fr" : "en";

  return (
    <DiscoveryExperience
      copy={discoveryCopy[normalizedLocale]}
      locale={normalizedLocale}
    />
  );
}
