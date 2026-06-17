import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Application de rencontre sérieuse — pour des vraies connexions",
  description: "Embir est une application de rencontre sérieuse conçue pour favoriser les connexions authentiques. Profils vérifiés, matching par compatibilité, sans publicité. Gratuit au lancement.",
alternates: {
    canonical: "https://embir.xyz/rencontre-serieuse",
    languages: {
      "en": "https://embir.xyz/serious-dating-app",
    },
  },
  openGraph: {
    title: "Application de rencontre sérieuse — pour des vraies connexions",
    description: "Embir est une application de rencontre sérieuse conçue pour favoriser les connexions authentiques. Profils vérifiés, matching par compatibilité, sans publicité. Gratuit au lancement.",
    url: "https://embir.xyz/rencontre-serieuse",
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
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#d4a574]/80">Sérieux</span>
          </div>
          <h1 className="font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-5xl">Une application de rencontre pensée pour ceux qui cherchent des relations sérieuses.</h1>
          <p className="mt-6 text-lg leading-relaxed text-white/50">Embir est une application de rencontre sérieuse conçue pour favoriser les connexions authentiques. Profils vérifiés, matching par compatibilité, sans publicité. Gratuit au lancement.</p>
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
              <p className="text-sm text-white/45">La vérification fait partie des fondations du produit. Les membres peuvent se vérifier par selfie pour obtenir un badge vérifié et renforcer la confiance dans la communauté.</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="text-lg font-bold text-white mb-2">100% gratuit au lancement</h3>
              <p className="text-sm text-white/45">Messagerie illimitée, matching IA, profils complets. Sans abonnement, sans publicité.</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="text-lg font-bold text-white mb-2">Compatibilité réelle</h3>
              <p className="text-sm text-white/45">Embir est conçu pour une découverte basée sur la compatibilité — préférences, intentions et orientation guident les suggestions, pas seulement les photos.</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h3 className="text-lg font-bold text-white mb-2">Respect et confidentialité</h3>
              <p className="text-sm text-white/45">Vos données ne sont jamais revendues. Zéro publicité intrusive. Modération humaine.</p>
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
              <p className="px-6 pb-4 text-sm text-white/45">Oui. Pendant la phase de lancement, toutes les fonctionnalités sont gratuites. Les membres fondateurs recevront un accès prioritaire et des avantages produit lors du lancement des fonctionnalités premium.</p>
            </details>
            <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-white/80 group-open:text-[#d4a574] list-none [&::-webkit-details-marker]:hidden">Comment les profils sont-ils vérifiés ?</summary>
              <p className="px-6 pb-4 text-sm text-white/45">Chaque nouveau membre passe par une vérification par selfie en temps réel. Notre système compare la photo de profil avec un selfie pris sur le moment.</p>
            </details>
            <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-white/80 group-open:text-[#d4a574] list-none [&::-webkit-details-marker]:hidden">Dans quelles villes Embir est-il disponible ?</summary>
              <p className="px-6 pb-4 text-sm text-white/45">Embir lance ses premières communautés progressivement en France, aux États-Unis et au Royaume-Uni — en commençant par des membres fondateurs dans des villes clés comme Paris, New York et Londres.</p>
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
        <p className="mt-4 text-xs text-white/20">18+ uniquement. Gratuit au lancement. Sans engagement.</p>
      </section>
    </main>
  );
}