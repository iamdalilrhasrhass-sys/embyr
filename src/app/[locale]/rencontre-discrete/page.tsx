import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Application de rencontre discrète — contrôles de confidentialité",
  description: "Embir protège votre vie privée : profils visibles uniquement par les personnes compatibles, navigation discrète. Les connexions essentielles sont gratuites.",
  alternates: { canonical: "https://embir.xyz/rencontre-discrete" },
  openGraph: {
    title: "Application de rencontre discrète — contrôles de confidentialité",
    description: "Embir protège votre vie privée : profils visibles uniquement par les personnes compatibles, navigation discrète. Les connexions essentielles sont gratuites.",
    url: "https://embir.xyz/rencontre-discrete",
    locale: "fr_FR",
    siteName: "Embir",
    images: [`/api/og?title=Rencontre+discrète+—+contrôles+de+confidentialité&variant=market`],
  },
};

export default function Page() {
  return (
    <main className="emb-page min-h-screen">
      <section className="px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d4a574]/20 bg-[#d4a574]/5 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d4a574]" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#d4a574]/80">Discret</span>
          </div>
          <h1 className="font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-5xl">Une application de rencontre qui respecte votre besoin de discrétion.</h1>
          <p className="mt-6 text-lg leading-relaxed text-white/50">Embir protège votre vie privée : profils visibles uniquement par les personnes compatibles, navigation discrète. Les connexions essentielles sont gratuites.</p>
          <div className="mt-8 flex gap-4">
            <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] transition-all hover:bg-[#e8c4a2]">Créer mon profil gratuit</Link>
            <Link href="/" className="inline-flex items-center rounded-full border border-white/10 px-8 py-4 text-sm font-semibold text-white/70 hover:border-white/20">Accueil</Link>
          </div>
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white/[0.01]">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl text-white mb-8">Pourquoi choisir Embir</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="text-lg font-bold text-white mb-2">Profils vérifiés</h3>
              <p className="text-sm text-white/45">Chaque membre peut demander une vérification par selfie. Le badge est visible ; les outils de blocage et de signalement restent indispensables.</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="text-lg font-bold text-white mb-2">Connexions essentielles gratuites</h3>
              <p className="text-sm text-white/45">Messagerie entre connexions réciproques, compatibilité réciproque, profils complets. Sans abonnement, sans publicité.</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="text-lg font-bold text-white mb-2">Matching intelligent</h3>
              <p className="text-sm text-white/45">Le moteur applique vos préférences déclarées dans les deux sens pour proposer des profils compatibles.</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="text-lg font-bold text-white mb-2">Respect et confidentialité</h3>
              <p className="text-sm text-white/45">Vos données ne sont jamais revendues. Zéro publicité intrusive. signalement et blocage.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl text-white mb-8">Questions fréquentes</h2>
          <div className="space-y-4">
            <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-white/80 group-open:text-[#d4a574] list-none [&::-webkit-details-marker]:hidden">Embir est-il vraiment gratuit ?</summary>
              <p className="px-6 pb-4 text-sm text-white/45">Oui. Tout ce qu’il faut pour rencontrer quelqu’un est gratuit. Sans carte bancaire. Les membres fondateurs contribuent aux choix produit.</p>
            </details>
            <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-white/80 group-open:text-[#d4a574] list-none [&::-webkit-details-marker]:hidden">Comment les profils sont-ils vérifiés ?</summary>
              <p className="px-6 pb-4 text-sm text-white/45">La vérification par selfie est facultative : un membre envoie une photo avec un code unique. Si la demande est approuvée, un badge visible apparaît sur son profil.</p>
            </details>
            <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-white/80 group-open:text-[#d4a574] list-none [&::-webkit-details-marker]:hidden">Dans quelles villes Embir est-il disponible ?</summary>
              <p className="px-6 pb-4 text-sm text-white/45">Embir est disponible partout en France, avec des inscriptions ouvertes à Paris, Lyon, Marseille, Toulouse, Nice, Lille, Bordeaux et Nantes.</p>
            </details>
            <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-white/80 group-open:text-[#d4a574] list-none [&::-webkit-details-marker]:hidden">Embir est-il une alternative à Grindr ?</summary>
              <p className="px-6 pb-4 text-sm text-white/45">Oui. Contrairement à Grindr, Embir n'a pas de publicité, vérifie chaque profil, et propose un matching par IA au lieu d'un simple tri par distance.</p>
            </details>
          </div>
        </div>
      </section>
      <section className="px-4 pb-16 text-center">
        <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-[#d4a574] px-10 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">Créer mon profil gratuit</Link>
        <p className="mt-4 text-xs text-white/20">18+ uniquement. Les connexions essentielles sont gratuites. Sans engagement.</p>
      </section>
    </main>
  );
}
