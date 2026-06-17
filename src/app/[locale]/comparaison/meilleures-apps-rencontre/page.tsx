import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Meilleures applications de rencontre 2026 — Comparatif",
  description: "Comparatif des meilleures applications de rencontre : Embir, Grindr, Tinder, Bumble, Hinge, Happn. Prix, fonctionnalités, vérification, matching.",
  alternates: { canonical: "https://embir.xyz/comparaison/meilleures-apps-rencontre" },
};

export default function Page() {
  return (
    <main className="emb-page min-h-screen">
      <section className="px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-serif text-4xl font-light text-white sm:text-5xl">Les meilleures applications de rencontre en 2026.</h1>
          <p className="mt-6 text-lg text-white/50">Comparatif des meilleures applications de rencontre : Embir, Grindr, Tinder, Bumble, Hinge, Happn. Prix, fonctionnalités, vérification, matching.</p>
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white/[0.01]">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl text-white mb-8">Apps traditionnelles vs Embir — les différences</h2>
          <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
            <div className="grid grid-cols-3 border-b border-white/[0.04] px-6 py-4 text-sm font-semibold text-white/30 uppercase">
              <div>Critère</div><div className="text-center">Apps traditionnelles</div><div className="text-center text-[#d4a574]">Embir</div>
            </div>
            <div className="grid grid-cols-3 border-b border-white/[0.02] px-6 py-3.5 last:border-b-0 hover:bg-white/[0.01] transition-colors"><div className="text-sm text-white/60">Prix moyen</div><div className="text-sm text-center text-white/30">10-40€/mois</div><div className="text-sm text-center font-semibold text-[#d4a574]">Gratuit au lancement</div></div>
<div className="grid grid-cols-3 border-b border-white/[0.02] px-6 py-3.5 last:border-b-0 hover:bg-white/[0.01] transition-colors"><div className="text-sm text-white/60">Profils vérifiés</div><div className="text-sm text-center text-white/30">Variable</div><div className="text-sm text-center font-semibold text-[#d4a574]">Obligatoire</div></div>
<div className="grid grid-cols-3 border-b border-white/[0.02] px-6 py-3.5 last:border-b-0 hover:bg-white/[0.01] transition-colors"><div className="text-sm text-white/60">Matching IA</div><div className="text-sm text-center text-white/30">Basique</div><div className="text-sm text-center font-semibold text-[#d4a574]">DeepSeek avancé</div></div>
<div className="grid grid-cols-3 border-b border-white/[0.02] px-6 py-3.5 last:border-b-0 hover:bg-white/[0.01] transition-colors"><div className="text-sm text-white/60">Publicités</div><div className="text-sm text-center text-white/30">Présentes</div><div className="text-sm text-center font-semibold text-[#d4a574]">Zéro</div></div>
<div className="grid grid-cols-3 border-b border-white/[0.02] px-6 py-3.5 last:border-b-0 hover:bg-white/[0.01] transition-colors"><div className="text-sm text-white/60">Toutes orientations</div><div className="text-sm text-center text-white/30">Non</div><div className="text-sm text-center font-semibold text-[#d4a574]">Oui</div></div>
          </div>
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl text-white mb-6">Pour qui Embir est-il fait ?</h2>
          <p className="text-white/50 mb-8">Embir est conçu pour les personnes qui recherchent une expérience de rencontre plus authentique, sans publicité, avec des profils vérifiés et un matching intelligent. Si vous en avez assez des applications qui vous montrent des profils aléatoires, vous limitent dans vos messages, ou vous imposent des abonnements coûteux, Embir est fait pour vous.</p>
          <div className="flex gap-4">
            <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">Créer mon profil gratuit</Link>
            <Link href="/rencontre-sans-abonnement" className="text-sm text-white/40 hover:text-[#d4a574] self-center">Voir tous les avantages</Link>
          </div>
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white/[0.01]">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl text-white mb-8">FAQ</h2>
          <div className="space-y-4">
            <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-white/80 group-open:text-[#d4a574] list-none [&::-webkit-details-marker]:hidden">Pourquoi choisir Embir plutôt que Apps traditionnelles ?</summary>
              <p className="px-6 pb-4 text-sm text-white/45">Embir est gratuit au lancement, sans publicité, avec des profils vérifiés obligatoirement. Apps traditionnelles utilise un modèle freemium qui limite les fonctionnalités gratuites.</p>
            </details>
            <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-white/80 group-open:text-[#d4a574] list-none [&::-webkit-details-marker]:hidden">Puis-je utiliser les deux applications ?</summary>
              <p className="px-6 pb-4 text-sm text-white/45">Bien sûr. Beaucoup d'utilisateurs testent Embir en complément de Apps traditionnelles. L'avantage d'Embir est que tout est gratuit pendant le lancement, donc vous ne perdez rien à essayer.</p>
            </details>
          </div>
        </div>
      </section>
      <section className="px-4 pb-16 text-center">
        <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-[#d4a574] px-10 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">Créer mon profil gratuit</Link>
      </section>
    </main>
  );
}