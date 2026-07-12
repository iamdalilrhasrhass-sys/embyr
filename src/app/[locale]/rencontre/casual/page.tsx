import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rencontre Casual — Application gratuite sans engagement | Embir",
  description: "Embir, l'appli de rencontre casual gratuite. Rencontres légères, sans engagement, pour tous les profils et orientations. Matching intelligent et profils vérifiés.",
  alternates: { canonical: "https://embir.xyz/fr/rencontre/casual" },
  openGraph: {
    title: "Rencontre Casual — Sans engagement, sans carte bancaire",
    description: "L'application de rencontre casual gratuite pour tous les profils. Sans abonnement, sans publicité.",
    url: "https://embir.xyz/fr/rencontre/casual",
    locale: "fr_FR",
    images: [`/api/og?title=Rencontre+Casual&variant=market`],
  },
};

export default function Page() {
  return (
    <main className="emb-page min-h-screen">
      <section className="px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d4a574]/20 bg-[#d4a574]/5 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d4a574]" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#d4a574]/80">Rencontre Casual</span>
          </div>
          <h1 className="font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-5xl">La rencontre casual,<br/><span className="text-[#d4a574]">légère et sans prise de tête.</span></h1>
          <p className="mt-6 text-lg leading-relaxed text-white/50">
            Vous cherchez des rencontres sans engagement, légères et authentiques ? Embir est l'application gratuite pensée pour les
            rencontres casual — sans pression, sans abonnement, avec des profils vérifiés et un matching qui respecte vos intentions dès le départ.
          </p>
          <div className="mt-8 flex gap-4">
            <Link prefetch={false} href="/auth/register?source=rencontre-casual" className="inline-flex items-center gap-2 rounded-full bg-[#d4a574] px-8 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">Créer mon profil gratuit</Link>
            <Link prefetch={false} href="/rencontre-sans-abonnement" className="inline-flex items-center rounded-full border border-white/10 px-8 py-4 text-sm font-semibold text-white/70 hover:border-white/20">Comment ça marche</Link>
          </div>
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white/[0.01]">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl text-white mb-6">Pourquoi Embir pour les rencontres casual ?</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="text-lg font-bold text-white mb-2">Intentions claires dès le départ</h3>
              <p className="text-sm text-white/45">Sur Embir, chaque profil indique ce qu'il cherche : relation sérieuse, casual, amitié. Vous ne rencontrez que des personnes qui ont les mêmes attentes que vous.</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="text-lg font-bold text-white mb-2">Toutes orientations, zéro jugement</h3>
              <p className="text-sm text-white/45">Embir accueille toutes les orientations et identités. Le casual dating est pour tout le monde — hétéro, gay, bi, queer, trans. Aucune discrimination.</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="text-lg font-bold text-white mb-2">Matching bidirectionnel</h3>
              <p className="text-sm text-white/45">Notre algorithme de matching tient compte de votre orientation ET de celle de l'autre profil. Vous ne verrez que des personnes réellement compatibles avec vous.</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="text-lg font-bold text-white mb-2">sans carte bancaire, sans surprise</h3>
              <p className="text-sm text-white/45">Messagerie entre connexions réciproques, accès complet aux profils, compatibilité réciproque. Pas d'abonnement caché, pas de paywall pour envoyer un message.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl text-white mb-6">Rencontre casual vs relation sérieuse : comment ça marche sur Embir ?</h2>
          <p className="text-white/45 mb-6">Sur Embir, vous choisissez votre intention lors de la création de votre profil. Si vous cherchez du casual, vous apparaissez dans les résultats des personnes qui cherchent aussi du casual. Si vos envies évoluent, vous pouvez mettre à jour votre profil à tout moment — sans pénalité, sans perte de matchs.</p>
          <p className="text-white/45">Contrairement aux autres applications où les intentions sont floues ou cachées, Embir mise sur la transparence. Moins de temps perdu, plus de connexions authentiques.</p>
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white/[0.01]">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl text-white mb-8">Questions fréquentes</h2>
          <div className="space-y-4">
            <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-white/80 group-open:text-[#d4a574] list-none [&::-webkit-details-marker]:hidden">Embir est-il vraiment adapté aux rencontres casual ?</summary>
              <p className="px-6 pb-4 text-sm text-white/45">Oui. Embir est conçu pour tous les types de rencontres, y compris le casual. L'intention est visible sur chaque profil, ce qui évite les malentendus et les pertes de temps.</p>
            </details>
            <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-white/80 group-open:text-[#d4a574] list-none [&::-webkit-details-marker]:hidden">Faut-il payer pour accéder au casual dating sur Embir ?</summary>
              <p className="px-6 pb-4 text-sm text-white/45">Non. Tout ce qu'il faut pour rencontrer quelqu'un sur Embir est gratuit. Sans carte bancaire. Toutes les fonctionnalités — matching, messagerie, profils complets — sont accessibles sans abonnement.</p>
            </details>
            <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-white/80 group-open:text-[#d4a574] list-none [&::-webkit-details-marker]:hidden">Puis-je changer d'intention plus tard ?</summary>
              <p className="px-6 pb-4 text-sm text-white/45">Oui, à tout moment. Votre intention de rencontre est modifiable depuis votre profil. Si vous passez du casual à une recherche de relation sérieuse, votre profil s'adapte instantanément.</p>
            </details>
          </div>
        </div>
      </section>
      <section className="px-4 pb-16 text-center">
        <Link prefetch={false} href="/auth/register?source=rencontre-casual" className="inline-flex items-center gap-2 rounded-full bg-[#d4a574] px-10 py-4 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]">Commencer les rencontres casual gratuitement</Link>
        <p className="mt-4 text-xs text-white/20">18+ uniquement. Les connexions essentielles sont gratuites. Sans engagement.</p>
      </section>
    </main>
  );
}
