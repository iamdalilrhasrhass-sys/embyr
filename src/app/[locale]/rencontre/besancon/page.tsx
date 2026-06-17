import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rencontre à Besançon — application gratuite et moderne",
  description: "Découvrez Embir pour faire des rencontres à Besançon. Application de rencontre gratuite au lancement avec profils vérifiés et matching intelligent.",
  alternates: { canonical: "https://embir.xyz/rencontre/besancon" },
};

export default function Page() {
  return (
    <main className="emb-page min-h-screen">
      <section className="px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d4a574]/20 bg-[#d4a574]/5 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d4a574]" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#d4a574]/80">Besançon</span>
          </div>
          <h1 className="font-serif text-4xl font-light text-white sm:text-5xl">Faire des rencontres à Besançon<br/><span className="text-[#d4a574]">n'a jamais été aussi simple.</span></h1>
          <p className="mt-6 text-lg text-white/50">Besançon, la cité de Vauban, offre un cadre idéal pour les rencontres. Avec Embir, trouvez des profils compatibles près de chez vous.</p>
          <div className="mt-8 flex gap-4">
            <Link prefetch={false} href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">Créer mon profil gratuit</Link>
            <Link prefetch={false} href="/rencontre-sans-abonnement" className="inline-flex items-center rounded-full border border-white/10 px-8 py-4 text-sm font-semibold text-white/70 hover:border-white/20">Comment ça marche</Link>
          </div>
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white/[0.01]">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl text-white mb-6">Pourquoi Besançon adopte Embir</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"><h3 className="text-lg font-bold text-white mb-2">Communauté locale</h3><p className="text-sm text-white/45">Embir construit des communautés ville par ville. À Besançon, rencontrez des gens près de chez vous.</p></div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"><h3 className="text-lg font-bold text-white mb-2">Profils vérifiés</h3><p className="text-sm text-white/45">Chaque profil est vérifié par selfie. Fini les faux profils à Besançon.</p></div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"><h3 className="text-lg font-bold text-white mb-2">Matching intelligent</h3><p className="text-sm text-white/45">Notre IA comprend vos préférences et suggère des profils compatibles à Besançon.</p></div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"><h3 className="text-lg font-bold text-white mb-2">100% gratuit</h3><p className="text-sm text-white/45">Messagerie illimitée, matching IA, zéro pub. Sans engagement.</p></div>
          </div>
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl"><h2 className="font-serif text-3xl text-white mb-8">Quartiers de Besançon</h2><p className="text-white/45">Embir couvre tous les quartiers : de la Citadelle au centre historique, en passant par les quais du Doubs.</p></div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white/[0.01]">
        <div className="mx-auto max-w-3xl"><h2 className="font-serif text-3xl text-white mb-8">FAQ</h2>
          <div className="space-y-4">
            <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-white/80 group-open:text-[#d4a574] list-none [&::-webkit-details-marker]:hidden">Embir est-il disponible à Besançon ?</summary>
              <p className="px-6 pb-4 text-sm text-white/45">Oui, Embir est disponible à Besançon et dans toutes les villes françaises.</p>
            </details>
            <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-white/80 group-open:text-[#d4a574] list-none [&::-webkit-details-marker]:hidden">Puis-je rencontrer des personnes d'autres villes ?</summary>
              <p className="px-6 pb-4 text-sm text-white/45">Oui, élargissez votre rayon pour découvrir des profils dans les villes voisines.</p>
            </details>
          </div>
        </div>
      </section>
      <section className="px-4 pb-16 text-center">
        <Link prefetch={false} href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-[#d4a574] px-10 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">Créer mon profil gratuit à Besançon</Link>
      </section>
    </main>
  );
}