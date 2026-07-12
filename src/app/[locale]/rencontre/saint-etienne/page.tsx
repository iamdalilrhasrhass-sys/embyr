import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rencontre à Saint-Étienne — application gratuite et moderne",
  description: "Découvrez Embir pour faire des rencontres à Saint-Étienne. Application de rencontre gratuite pour les connexions essentielles avec profils vérifiés et matching intelligent.",
  alternates: { canonical: "https://embir.xyz/rencontre/saint-etienne" },
  openGraph: {
    title: "Rencontre à Saint-Étienne",
    description: "Application de rencontre gratuite à Saint-Étienne. Profils vérifiés, compatibilité réciproque, zéro pub.",
    url: "https://embir.xyz/rencontre/saint-etienne",
    locale: "fr_FR",
    images: [`/api/og?title=Rencontre+à+Saint-Étienne&variant=market`],
  },
};

export default function Page() {
  return (
    <main className="emb-page min-h-screen">
      <section className="px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d4a574]/20 bg-[#d4a574]/5 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d4a574]" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#d4a574]/80">Saint-Étienne</span>
          </div>
          <h1 className="font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-5xl">Faire des rencontres à Saint-Étienne<br/><span className="text-[#d4a574]">n'a jamais été aussi simple.</span></h1>
          <p className="mt-6 text-lg leading-relaxed text-white/50">
            Saint-Étienne, la ville design, offre un cadre idéal pour les rencontres. Que vous cherchiez une relation sérieuse,
            une connexion amicale ou simplement élargir votre cercle social, Embir est l'application de rencontre gratuite
            pensée pour Saint-Étienne et ses habitants.
          </p>
          <div className="mt-8 flex gap-4">
            <Link prefetch={false} href="/auth/register?source=rencontre-saint-etienne" className="inline-flex items-center gap-2 rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">Créer mon profil gratuit</Link>
            <Link prefetch={false} href="/rencontre-sans-abonnement" className="inline-flex items-center rounded-full border border-white/10 px-8 py-4 text-sm font-semibold text-white/70 hover:border-white/20">Comment ça marche</Link>
          </div>
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white/[0.01]">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl text-white mb-6">Pourquoi Saint-Étienne adopte Embir</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="text-lg font-bold text-white mb-2">Une communauté locale</h3>
              <p className="text-sm text-white/45">Embir construit des communautés ville par ville. À Saint-Étienne, vous rencontrez des personnes qui vivent et sortent près de chez vous.</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="text-lg font-bold text-white mb-2">Profils vérifiés</h3>
              <p className="text-sm text-white/45">La vérification par selfie est disponible à Saint-Étienne. Un badge visible identifie les profils vérifiés ; aucun système n’élimine tout risque.</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="text-lg font-bold text-white mb-2">Matching intelligent</h3>
              <p className="text-sm text-white/45">Le moteur applique vos préférences déclarées dans les deux sens à Saint-Étienne et dans les environs.</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="text-lg font-bold text-white mb-2">Connexions essentielles gratuites</h3>
              <p className="text-sm text-white/45">Messagerie entre connexions réciproques, profils complets, compatibilité réciproque. Sans abonnement, sans publicité.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl text-white mb-8">Quartiers et environs de Saint-Étienne</h2>
          <p className="text-white/45 mb-6">Embir couvre tous les quartiers de Saint-Étienne : du centre ville à la place Jean Jaurès, en passant par le quartier créatif Manufacture. Ainsi que les communes environnantes pour élargir vos possibilités de rencontres.</p>
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white/[0.01]">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl text-white mb-8">Questions fréquentes</h2>
          <div className="space-y-4">
            <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-white/80 group-open:text-[#d4a574] list-none [&::-webkit-details-marker]:hidden">Embir est-il disponible à Saint-Étienne ?</summary>
              <p className="px-6 pb-4 text-sm text-white/45">Oui, Embir est disponible à Saint-Étienne et dans toutes les grandes villes françaises. Nous construisons des communautés locales actives.</p>
            </details>
            <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-white/80 group-open:text-[#d4a574] list-none [&::-webkit-details-marker]:hidden">Combien de profils sont disponibles à Saint-Étienne ?</summary>
              <p className="px-6 pb-4 text-sm text-white/45">Embir est en expérience de connexion. La communauté Saint-Étienne grandit chaque jour. En tant que membre fondateur, vous faites partie des premiers à rejoindre.</p>
            </details>
            <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-white/80 group-open:text-[#d4a574] list-none [&::-webkit-details-marker]:hidden">Puis-je rencontrer des personnes d'autres villes ?</summary>
              <p className="px-6 pb-4 text-sm text-white/45">Oui, vous pouvez élargir votre rayon de recherche pour découvrir des profils dans les villes voisines et partout en France.</p>
            </details>
          </div>
        </div>
      </section>
      <section className="px-4 pb-16 text-center">
        <Link prefetch={false} href="/auth/register?source=rencontre-saint-etienne" className="inline-flex items-center gap-2 rounded-full bg-[#d4a574] px-10 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">Créer mon profil gratuit à Saint-Étienne</Link>
        <p className="mt-4 text-xs text-white/20">18+ uniquement. Les connexions essentielles sont gratuites. Sans engagement.</p>
      </section>
    </main>
  );
}