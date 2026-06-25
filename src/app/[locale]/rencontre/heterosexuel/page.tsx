import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rencontre Hétérosexuelle — Application gratuite pour hétéros | Embir",
  description: "Embir, l'application de rencontre gratuite pour hétérosexuels. Matching intelligent, profils vérifiés, toutes intentions. Rejoignez la communauté Embir.",
  alternates: { canonical: "https://embir.xyz/fr/rencontre/heterosexuel" },
  openGraph: {
    title: "Rencontre Hétérosexuelle — 100% gratuit | Embir",
    description: "L'appli de rencontre gratuite pour hétérosexuels. Matching bidirectionnel, profils vérifiés, sans abonnement.",
    url: "https://embir.xyz/fr/rencontre/heterosexuel",
    locale: "fr_FR",
    images: [`/api/og?title=Rencontre+Hétérosexuelle&variant=market`],
  },
};

export default function Page() {
  return (
    <main className="emb-page min-h-screen">
      <section className="px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d4a574]/20 bg-[#d4a574]/5 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d4a574]" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#d4a574]/80">Rencontre Hétérosexuelle</span>
          </div>
          <h1 className="font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-5xl">Rencontre hétérosexuelle<br/><span className="text-[#d4a574]">gratuite, sérieuse et moderne.</span></h1>
          <p className="mt-6 text-lg leading-relaxed text-white/50">
            Embir est l'application de rencontre gratuite qui place l'hétérosexualité comme une orientation parmi d'autres — respectée, bien ciblée, sans sous-catégories payantes.
            Profils vérifiés, matching bidirectionnel par orientation, intentions claires dès le départ.
          </p>
          <div className="mt-8 flex gap-4">
            <Link prefetch={false} href="/auth/register?source=rencontre-heterosexuel" className="inline-flex items-center gap-2 rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">Créer mon profil gratuit</Link>
            <Link prefetch={false} href="/rencontre-sans-abonnement" className="inline-flex items-center rounded-full border border-white/10 px-8 py-4 text-sm font-semibold text-white/70 hover:border-white/20">Comment ça marche</Link>
          </div>
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white/[0.01]">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl text-white mb-6">Embir pour les rencontres hétérosexuelles</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="text-lg font-bold text-white mb-2">Matching par orientation</h3>
              <p className="text-sm text-white/45">Notre algorithme de matching bidirectionnel filtre par orientation à la base de données. En tant qu'hétérosexuel(le), vous ne voyez que des profils réellement compatibles avec vous.</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="text-lg font-bold text-white mb-2">Profils vérifiés par selfie</h3>
              <p className="text-sm text-white/45">Chaque profil sur Embir est vérifié par selfie en temps réel. Fini les faux profils, les photos volées et les mauvaises surprises.</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="text-lg font-bold text-white mb-2">Toutes les intentions</h3>
              <p className="text-sm text-white/45">Relation sérieuse, rencontre casual ou simple amitié — vous choisissez ce que vous cherchez. Vous ne verrez que des profils qui cherchent la même chose.</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="text-lg font-bold text-white mb-2">Gratuit, sans condition</h3>
              <p className="text-sm text-white/45">Messagerie illimitée, profils complets, matching IA. Pas de boost payant pour être vu, pas d'abonnement pour débloquer les messages.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl text-white mb-6">Pourquoi choisir Embir plutôt que Tinder ou Bumble ?</h2>
          <p className="text-white/45 mb-4">Les grandes applications de rencontre comme Tinder ou Bumble ont transformé la rencontre en abonnement : payez pour voir qui vous a liké, payez pour remonter dans les profils, payez pour envoyer un Super Like. Sur Embir, tout est gratuit au lancement.</p>
          <p className="text-white/45 mb-4">De plus, Embir propose un filtrage par orientation réellement efficace grâce à un matching bidirectionnel — si vous êtes hétérosexuel(le), vous ne verrez que des profils hétérosexuels compatibles avec votre genre. Pas de paramétrage compliqué, juste la bonne personne.</p>
          <p className="text-white/45">Et parce qu'Embir accueille toutes les orientations, la communauté est diverse et respectueuse — sans ségrégation entre les utilisateurs.</p>
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white/[0.01]">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl text-white mb-8">Questions fréquentes</h2>
          <div className="space-y-4">
            <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-white/80 group-open:text-[#d4a574] list-none [&::-webkit-details-marker]:hidden">Est-ce qu'Embir est fait pour les hétérosexuels ?</summary>
              <p className="px-6 pb-4 text-sm text-white/45">Embir est fait pour toutes les orientations, y compris les hétérosexuels. Notre matching bidirectionnel garantit que vous ne verrez que des profils compatibles avec votre orientation.</p>
            </details>
            <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-white/80 group-open:text-[#d4a574] list-none [&::-webkit-details-marker]:hidden">Vais-je voir des profils d'autres orientations ?</summary>
              <p className="px-6 pb-4 text-sm text-white/45">Non. Grâce au filtrage bidirectionnel par orientation, vous ne voyez que les profils compatibles avec vous. Si vous êtes hétérosexuel(le), vous verrez uniquement des profils hétérosexuels du genre opposé.</p>
            </details>
            <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-white/80 group-open:text-[#d4a574] list-none [&::-webkit-details-marker]:hidden">Embir est-il gratuit pour les rencontres hétérosexuelles ?</summary>
              <p className="px-6 pb-4 text-sm text-white/45">Oui, Embir est 100% gratuit au lancement pour toutes les orientations, y compris les hétérosexuels. Messagerie, matching et profils complets sans abonnement.</p>
            </details>
          </div>
        </div>
      </section>
      <section className="px-4 pb-16 text-center">
        <Link prefetch={false} href="/auth/register?source=rencontre-heterosexuel" className="inline-flex items-center gap-2 rounded-full bg-[#d4a574] px-10 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">Rejoindre Embir gratuitement</Link>
        <p className="mt-4 text-xs text-white/20">18+ uniquement. Gratuit au lancement. Sans engagement.</p>
      </section>
    </main>
  );
}
