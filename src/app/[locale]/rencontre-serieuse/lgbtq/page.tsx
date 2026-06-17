import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rencontre sérieuse LGBTQ+ — pour des connexions durables",
  description: "Embir est conçu pour la communauté LGBTQ+ qui cherche des relations sérieuses. Gratuit au lancement, profils vérifiés.",
  alternates: { canonical: "https://embir.xyz/rencontre-serieuse/lgbtq" },
  openGraph: {
    title: "Rencontre sérieuse LGBTQ+ — pour des connexions durables",
    description: "Embir est conçu pour la communauté LGBTQ+ qui cherche des relations sérieuses. Gratuit au lancement, profils vérifiés.",
    url: "https://embir.xyz/rencontre-serieuse/lgbtq",
    locale: "fr_FR",
    siteName: "Embir",
  },
};

export default function Page() {
  return (
    <main className="emb-page min-h-screen">
      <section className="px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d4a574]/20 bg-[#d4a574]/5 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d4a574]" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#d4a574]/80">LGBTQ+</span>
          </div>
          <h1 className="font-serif text-4xl font-light text-white sm:text-5xl">Rencontre sérieuse LGBTQ+</h1>
          <p className="mt-6 text-lg text-white/50">Embir est conçu pour la communauté LGBTQ+ qui cherche des relations sérieuses. Gratuit au lancement, profils vérifiés.</p>
          <div className="mt-8 flex gap-4">
            <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">Créer mon profil gratuit</Link>
            <Link href="/rencontre-sans-abonnement" className="inline-flex items-center rounded-full border border-white/10 px-8 py-4 text-sm font-semibold text-white/70 hover:border-white/20">Avantages gratuits</Link>
          </div>
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white/[0.01]">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl text-white mb-6">Pourquoi choisir Embir</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="text-lg font-bold text-white mb-2">Profils vérifiés</h3>
              <p className="text-sm text-white/45">Chaque membre est vérifié par selfie. Pas de faux profils, pas de déceptions.</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="text-lg font-bold text-white mb-2">100% gratuit au lancement</h3>
              <p className="text-sm text-white/45">Messagerie illimitée, matching IA, profils complets. Sans engagement.</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="text-lg font-bold text-white mb-2">Filtres d'orientation</h3>
              <p className="text-sm text-white/45">Vous voyez uniquement les profils compatibles avec votre orientation et vos préférences.</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="text-lg font-bold text-white mb-2">Respect et confidentialité</h3>
              <p className="text-sm text-white/45">Modération humaine, données protégées, zéro revente.</p>
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
              <p className="px-6 pb-4 text-sm text-white/45">Oui. Pendant la phase de lancement, toutes les fonctionnalités sont gratuites — messagerie, matching, profils. Les membres fondateurs conservent l'accès premium à vie.</p>
            </details>
            <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-white/80 group-open:text-[#d4a574] list-none [&::-webkit-details-marker]:hidden">Comment fonctionne le matching par orientation ?</summary>
              <p className="px-6 pb-4 text-sm text-white/45">Vous définissez votre orientation et vos préférences. Notre IA vous montre uniquement les profils compatibles — personne ne vous voit si vous ne correspondez pas à ses critères.</p>
            </details>
            <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-white/80 group-open:text-[#d4a574] list-none [&::-webkit-details-marker]:hidden">Y a-t-il une communauté active sur Embir ?</summary>
              <p className="px-6 pb-4 text-sm text-white/45">Embir est en phase de lancement. La communauté grandit chaque jour. En tant que membre fondateur, vous faites partie des premiers à rejoindre.</p>
            </details>
          </div>
        </div>
      </section>
      <section className="px-4 pb-16 text-center">
        <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-[#d4a574] px-10 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">Créer mon profil gratuit</Link>
        <p className="mt-4 text-xs text-white/20">18+ uniquement. Gratuit au lancement. Sans engagement.</p>
      </section>
    </main>
  );
}