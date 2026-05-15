"use client";
import Link from "next/link";
import ScrollReveal from "@/components/motion/ScrollReveal";
import TiltCard from "@/components/motion/TiltCard";

const PREMIUM_FEATURES_COMING = [
  "Messagerie illimitée",
  "Voir qui a consulté mon profil",
  "Voir qui m'a ajouté en favoris",
  "Recherche par préférences",
  "Accès aux profils vérifiés",
  "Accès aux albums publics",
  "Accès aux albums privés",
  "Favoris illimités",
  "Mode discret",
  "Filtrer les profils connectés",
  "Masquer certaines visites",
  "Accès prioritaire aux nouveaux profils",
  "Support prioritaire",
  "Navigation confidentielle",
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-premium-dark)] relative overflow-hidden pb-20">
      <div className="absolute inset-0 noise-overlay"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[var(--color-premium-purple)]/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[40%] left-[-10%] w-[600px] h-[600px] bg-[var(--color-premium-rose)]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute inset-0 soft-grid-bg opacity-30"></div>

      <div className="max-w-4xl mx-auto px-4 pt-24 relative z-10 text-center">

        {/* Hero */}
        <ScrollReveal>
          <div className="mb-4 inline-flex rounded-full border border-purple-400/20 bg-purple-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-purple-300">
            ⭐ Premium bientôt
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Premium <span className="text-gradient">arrive bientôt</span>
          </h1>
          <p className="text-xl text-[var(--color-premium-gray)] max-w-2xl mx-auto leading-relaxed">
            Pendant la phase de lancement, toutes les fonctions essentielles sont
            gratuites. Les options Premium seront disponibles prochainement.
          </p>
        </ScrollReveal>

        {/* Gratuit lancement */}
        <ScrollReveal delay={0.2}>
          <div className="mt-12 rounded-3xl p-8 md:p-12 border border-green-500/10 bg-green-500/[0.02] backdrop-blur-sm max-w-2xl mx-auto">
            <span className="text-4xl mb-4 block">🎁</span>
            <h2 className="text-2xl font-bold text-white mb-3">Gratuit pendant le lancement</h2>
            <p className="text-white/50 mb-6">
              Tu peux créer ton profil, découvrir les membres et utiliser les
              fonctions essentielles gratuitement pendant la phase de lancement.
            </p>
            <Link href="/auth/register"
              className="inline-block px-8 py-3.5 rounded-xl font-bold text-white text-lg"
              style={{ background: "linear-gradient(135deg, #06B6D4, #6366F1)" }}>
              Créer mon profil gratuitement
            </Link>
          </div>
        </ScrollReveal>

        {/* Fonctionnalités Premium à venir */}
        <ScrollReveal delay={0.3}>
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Fonctionnalités Premium à venir</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
              {PREMIUM_FEATURES_COMING.map((f, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.04] bg-white/[0.01] text-left">
                  <span className="text-purple-400/60 text-sm">✦</span>
                  <span className="text-white/60 text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Membres fondateurs */}
        <ScrollReveal delay={0.4}>
          <div className="mt-12 rounded-3xl p-8 border border-amber-500/10 bg-amber-500/[0.02] backdrop-blur-sm max-w-2xl mx-auto">
            <span className="text-3xl mb-3 block">✦</span>
            <h2 className="text-xl font-bold text-white mb-2">Membres fondateurs</h2>
            <p className="text-white/50">
              Les premiers membres actifs pourront recevoir des avantages Premium
              offerts lors du lancement des options payantes.
            </p>
          </div>
        </ScrollReveal>

        {/* Sécurité */}
        <ScrollReveal delay={0.5}>
          <div className="mt-16 max-w-xl mx-auto">
            <div className="inline-flex items-center justify-center p-5 rounded-full bg-white/5 mb-6 border border-white/10">
              <svg className="w-10 h-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Paiement 100% sécurisé</h2>
            <p className="text-white/40 text-sm">
              Lorsque les options payantes seront disponibles, vos transactions seront
              chiffrées et sécurisées par Stripe. Prix clairs, données protégées.
            </p>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}
