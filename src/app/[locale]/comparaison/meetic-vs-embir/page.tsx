import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Meetic vs Embir — Comparaison 2026",
  description: "Comparaison Meetic vs Embir : abonnement, gratuité, vérification, public. Le sérieux a-t-il un prix ?",
  alternates: { canonical: "https://embir.xyz/comparaison/meetic-vs-embir" },
};

export default function Page() {
  return (
    <main className="emb-page min-h-screen">
      <section className="px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl"><h1 className="font-serif text-4xl font-light text-white sm:text-5xl">Meetic vs Embir : le duel</h1><p className="mt-6 text-lg text-white/50">Comparaison Meetic vs Embir : abonnement, gratuité, vérification, public. Le sérieux a-t-il un prix ?</p></div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white/[0.01]">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl text-white mb-8">Meetic vs Embir — les différences</h2>
          <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
            <div className="grid grid-cols-3 border-b border-white/[0.04] px-6 py-4 text-sm font-semibold text-white/30 uppercase"><div>Critère</div><div className="text-center">Meetic</div><div className="text-center text-[#d4a574]">Embir</div></div>
            <div className="grid grid-cols-3 border-b border-white/[0.02] px-6 py-3.5"><div className="text-sm text-white/60">Prix</div><div className="text-sm text-center text-white/30">8-40€/mois</div><div className="text-sm text-center font-semibold text-[#d4a574]">Gratuit au lancement</div></div>
            <div className="grid grid-cols-3 border-b border-white/[0.02] px-6 py-3.5"><div className="text-sm text-white/60">Publicités</div><div className="text-sm text-center text-white/30">Oui</div><div className="text-sm text-center font-semibold text-[#d4a574]">Zéro</div></div>
            <div className="grid grid-cols-3 border-b border-white/[0.02] px-6 py-3.5"><div className="text-sm text-white/60">Profils vérifiés</div><div className="text-sm text-center text-white/30">Optionnel</div><div className="text-sm text-center font-semibold text-[#d4a574]">Obligatoire</div></div>
            <div className="grid grid-cols-3 border-b border-white/[0.02] px-6 py-3.5"><div className="text-sm text-white/60">Matching</div><div className="text-sm text-center text-white/30">Basique</div><div className="text-sm text-center font-semibold text-[#d4a574]">IA DeepSeek</div></div>
            <div className="grid grid-cols-3 px-6 py-3.5"><div className="text-sm text-white/60">Messages gratuits</div><div className="text-sm text-center text-white/30">Limités</div><div className="text-sm text-center font-semibold text-[#d4a574]">Illimités</div></div>
          </div>
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8"><div className="mx-auto max-w-4xl"><h2 className="font-serif text-3xl text-white mb-6">Pour qui Embir est-il fait ?</h2><p className="text-white/50 mb-8">Embir est conçu pour ceux qui recherchent une expérience de rencontre plus authentique, sans pub, avec profils vérifiés et matching IA. Si vous en avez assez des applis qui limitent vos messages ou vous montrent des pubs, Embir est fait pour vous.</p><div className="flex gap-4"><Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">Créer mon profil gratuit</Link><Link href="/rencontre-sans-abonnement" className="text-sm text-white/40 hover:text-[#d4a574] self-center">Voir les avantages</Link></div></div></section>
      <section className="px-4 pb-16 text-center"><Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-[#d4a574] px-10 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">Créer mon profil gratuit</Link></section>
    </main>
  );
}