import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Application de rencontre sans abonnement — connexions essentielles gratuites",
  description: "Tout ce qu'il faut pour rencontrer quelqu'un sur Embir est gratuit. Sans carte bancaire. Messagerie entre connexions réciproques, compatibilité réciproque, zéro pub. Les membres fondateurs gardent l'accès prioritaire aux options facultatives.",
  alternates: { canonical: "https://embir.xyz/rencontre-sans-abonnement" },
  openGraph: {
    title: "Application de rencontre sans abonnement — connexions essentielles gratuites",
    description: "Tout ce qu'il faut pour rencontrer quelqu'un sur Embir est gratuit. Sans carte bancaire. Messagerie entre connexions réciproques, compatibilité réciproque, zéro pub. Les membres fondateurs gardent l'accès prioritaire aux options facultatives.",
    url: "https://embir.xyz/rencontre-sans-abonnement",
    locale: "fr_FR",
    siteName: "Embir",
    images: [`/api/og?title=Application+de+rencontre+sans+carte+bancaire&variant=market`],
  },
};

export default function Page() {
  return (
    <main className="emb-page min-h-screen">
      <section className="px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-embir-rose/20 bg-embir-rose/5 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-embir-rose" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-embir-rose/80">Gratuit</span>
          </div>
          <h1 className="font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-5xl">Une application de rencontre vraiment gratuite, sans abonnement caché.</h1>
          <p className="mt-6 text-lg leading-relaxed text-white/50">Tout ce qu'il faut pour rencontrer quelqu'un sur Embir est gratuit. Sans carte bancaire. Messagerie entre connexions réciproques, compatibilité réciproque, zéro pub. Les membres fondateurs gardent l'accès prioritaire aux options facultatives.</p>
          <div className="mt-8 flex gap-4">
            <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-embir-rose px-8 py-4 text-sm font-bold text-embir-void transition-all hover:bg-embir-blush">Créer mon profil gratuit</Link>
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
              <p className="text-sm text-white/45">La vérification fait partie des fondations du produit. Les membres peuvent se vérifier par selfie pour obtenir un badge vérifié et renforcer la confiance dans la communauté.</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="text-lg font-bold text-white mb-2">Connexions essentielles gratuites</h3>
              <p className="text-sm text-white/45">Messagerie entre connexions réciproques, compatibilité réciproque, profils complets. Sans abonnement, sans publicité.</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="text-lg font-bold text-white mb-2">Compatibilité réelle</h3>
              <p className="text-sm text-white/45">Embir est conçu pour une découverte basée sur la compatibilité — préférences, intentions et orientation guident les suggestions, pas seulement les photos.</p>
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
              <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-white/80 group-open:text-embir-rose list-none [&::-webkit-details-marker]:hidden">Embir est-il vraiment gratuit ?</summary>
              <p className="px-6 pb-4 text-sm text-white/45">Oui. Tout ce qu’il faut pour rencontrer quelqu’un est gratuit. Sans carte bancaire. Les membres fondateurs contribuent aux choix produit.</p>
            </details>
            <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-white/80 group-open:text-embir-rose list-none [&::-webkit-details-marker]:hidden">Comment les profils sont-ils vérifiés ?</summary>
              <p className="px-6 pb-4 text-sm text-white/45">La vérification par selfie est facultative : un membre envoie une photo avec un code unique. Si la demande est approuvée, un badge visible apparaît sur son profil.</p>
            </details>
            <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-white/80 group-open:text-embir-rose list-none [&::-webkit-details-marker]:hidden">Dans quelles villes Embir est-il disponible ?</summary>
              <p className="px-6 pb-4 text-sm text-white/45">Embir est ouvert dans le monde entier sur le web. Les premières communautés se densifient ville par ville, afin de garder des échanges locaux réels tout en accueillant les membres fondateurs partout.</p>
            </details>
            <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-white/80 group-open:text-embir-rose list-none [&::-webkit-details-marker]:hidden">Embir est-il une alternative à Grindr ?</summary>
              <p className="px-6 pb-4 text-sm text-white/45">Oui. Contrairement à Grindr, Embir n'a pas de publicité, vérifie chaque profil, et propose un matching par IA au lieu d'un simple tri par distance.</p>
            </details>
          </div>
        </div>
      </section>
      <section className="px-4 pb-16 text-center">
        <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-embir-rose px-10 py-4 text-sm font-bold text-embir-void hover:bg-embir-blush">Créer mon profil gratuit</Link>
        <p className="mt-4 text-xs text-white/20">18+ uniquement. Les connexions essentielles sont gratuites. Sans engagement.</p>
      </section>
    </main>
  );
}