"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

const tiers = [
  { name: "7 jours", price: "4,99", period: "€", desc: "Idéal pour découvrir", features: ["Accès complet 7 jours", "Chat illimité", "Profils vérifiés", "Sans renouvellement auto"], cta: "Découvrir", popular: false, gradient: "from-white/5 to-white/[0.02]" },
  { name: "1 mois", price: "14,99", period: "€", desc: "Le plus choisi", features: ["Tout l'offre Premium", "Badge Premium", "Profil mis en avant", "Messagerie prioritaire"], cta: "Choisir", popular: true, gradient: "from-[var(--color-premium-rose)]/20 via-purple-500/15 to-[var(--color-premium-purple)]/20" },
  { name: "12 mois", price: "49,99", period: "€", desc: "Économise 70 %", features: ["Accès Premium 1 an", "Badge Premium permanent", "Visibilité maximale", "Support prioritaire 24/7"], cta: "Économiser", popular: false, gradient: "from-white/5 to-white/[0.02]" },
];

function PricingCard({ tier, index }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative ${tier.popular ? "scale-105 z-10" : ""}`}
    >
      {tier.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="px-5 py-1.5 rounded-full bg-gradient-to-r from-[var(--color-premium-rose)] to-[var(--color-premium-purple)] text-white text-xs font-bold tracking-wide shadow-[0_0_20px_rgba(139,92,246,0.4)]"
          >
            LE PLUS CHOISI
          </motion.div>
        </div>
      )}

      <motion.div
        animate={hovered ? { scale: 1.03, y: -5 } : { scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`relative p-8 rounded-3xl border backdrop-blur-2xl overflow-hidden transition-all duration-500 ${
          tier.popular
            ? "border-[var(--color-premium-purple)]/30 bg-gradient-to-b from-[var(--color-premium-rose)]/10 to-transparent shadow-[0_0_60px_rgba(139,92,246,0.1)]"
            : "border-white/[0.06] bg-white/[0.02] hover:border-[var(--color-premium-purple)]/15"
        }`}
      >
        {/* Hover glow */}
        <motion.div
          animate={hovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          className={`absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-[var(--color-premium-rose)]/30 via-[var(--color-premium-purple)]/20 to-pink-500/20 opacity-0 blur-md -z-10`}
        />

        <div className="relative z-10">
          <h3 className="text-lg font-semibold text-white/70 mb-1">{tier.name}</h3>
          <p className="text-xs text-gray-500 mb-6">{tier.desc}</p>

          <div className="mb-6">
            <span className="text-5xl font-black text-white">{tier.price}</span>
            <span className="text-lg text-gray-400 ml-1">{tier.period}</span>
          </div>

          <ul className="space-y-3 mb-8">
            {tier.features.map((f: string) => (
              <li key={f} className="flex items-center gap-3 text-sm text-gray-300">
                <span className="w-5 h-5 rounded-full bg-gradient-to-r from-[var(--color-premium-rose)]/20 to-[var(--color-premium-purple)]/20 flex items-center justify-center text-[10px] text-[var(--color-premium-rose)]">✓</span>
                {f}
              </li>
            ))}
          </ul>

          <Link
            href="/pricing"
            className={`block w-full text-center py-4 rounded-xl font-bold text-sm transition-all duration-500 ${
              tier.popular
                ? "bg-gradient-to-r from-[var(--color-premium-rose)] to-[var(--color-premium-purple)] text-white hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
                : "border border-white/10 text-white hover:bg-white/5 hover:border-[var(--color-premium-purple)]/30"
            }`}
          >
            {tier.cta}
            {tier.popular && <span className="ml-2">→</span>}
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LandingPricing() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-32 px-4 max-w-5xl mx-auto relative">
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[400px] bg-[#d4a574]/[0.03] rounded-full blur-[150px] pointer-events-none" />

      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-light text-center text-white mb-4 tracking-tight font-serif"
      >
        Gratuit au lancement,
        <br />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#e8c4a2] via-[#d4a574] to-[#f0d0b0]">
          freemium plus tard
        </span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center text-white/30 max-w-lg mx-auto mb-16 font-light"
      >
        On commence gratuit, tout illimité. Freemium plus tard. Les fondateurs gardent un accès privilégié à vie.
      </motion.p>

      {/* Pricing cards */}
      <div className="grid md:grid-cols-3 gap-8 items-start">
        {/* Free - Launch */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0, ease: "easeOut" }}
          className="relative p-8 rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-2xl"
        >
          <div className="relative z-10">
            <div className="inline-flex mb-4 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/10">
              <span className="text-xs font-bold tracking-wider text-green-400 uppercase">🎉 Au lancement</span>
            </div>
            <h3 className="text-lg font-medium text-white/70 mb-1 font-serif">Free</h3>
            <p className="text-xs text-white/30 mb-6 font-light">Tout illimité, zéro engagement</p>
            <div className="mb-6">
              <span className="text-5xl font-light text-white font-serif">0</span>
              <span className="text-lg text-white/40 ml-1">€</span>
            </div>
            <ul className="space-y-3 mb-8">
              {["Profils illimités", "Messages illimités", "Photos illimitées", "Matching IA", "Badge Fondateur"].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-white/40 font-light">
                  <span className="w-5 h-5 rounded-full bg-[#d4a574]/10 flex items-center justify-center text-[10px] text-[#d4a574]">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/auth/register"
              className="block w-full text-center py-4 rounded-xl font-medium text-sm bg-[#d4a574] text-[#0a0614] hover:bg-[#e8c4a2] transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,165,116,0.3)]"
            >
              Créer mon profil
            </Link>
          </div>
        </motion.div>

        {/* Future Premium */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
          className="relative scale-105 z-10 p-8 rounded-3xl border border-[#d4a574]/20 bg-gradient-to-b from-[#d4a574]/5 to-transparent backdrop-blur-2xl shadow-[0_0_60px_rgba(212,165,116,0.05)]"
        >
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="px-5 py-1.5 rounded-full bg-[#d4a574] text-[#0a0614] text-xs font-medium tracking-wide shadow-[0_0_20px_rgba(212,165,116,0.3)]"
            >
              BIENTÔT
            </motion.div>
          </div>
          <div className="relative z-10 mt-4">
            <h3 className="text-lg font-medium text-white/70 mb-1 font-serif">Premium</h3>
            <p className="text-xs text-white/30 mb-6 font-light">Freemium — bientôt</p>
            <div className="mb-6">
              <span className="text-5xl font-light text-white font-serif">?</span>
              <span className="text-lg text-white/40 ml-1">€ / mois</span>
            </div>
            <ul className="space-y-3 mb-8">
              {["Tout le Free", "Badge Premium", "Qui a consulté mon profil", "Navigation discrète", "Support prioritaire", "Nouveautés en avant-première"].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-white/50 font-light">
                  <span className="w-5 h-5 rounded-full bg-[#d4a574]/15 flex items-center justify-center text-[10px] text-[#d4a574]">✦</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/auth/register"
              className="block w-full text-center py-4 rounded-xl font-medium text-sm bg-gradient-to-r from-[#d4a574] to-[#e8c4a2] text-[#0a0614] hover:shadow-[0_0_30px_rgba(212,165,116,0.4)] transition-all duration-500"
            >
              S'inscrire & verrouiller le prix
            </Link>
          </div>
        </motion.div>

        {/* Grindr comparison */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.24, ease: "easeOut" }}
          className="relative p-8 rounded-3xl border border-white/[0.04] bg-white/[0.01] backdrop-blur-2xl opacity-70"
        >
          <div className="relative z-10">
            <div className="inline-flex mb-4 px-3 py-1 rounded-full bg-red-500/5 border border-red-500/10">
              <span className="text-xs font-bold tracking-wider text-red-400/60 uppercase">Le concurrent</span>
            </div>
            <h3 className="text-lg font-medium text-white/40 mb-1 font-serif">Grindr</h3>
            <p className="text-xs text-white/20 mb-6 font-light">Cher, plein de pubs</p>
            <div className="mb-6">
              <span className="text-5xl font-light text-white/30 font-serif line-through">15</span>
              <span className="text-lg text-red-300/40 ml-1">€ / mois</span>
            </div>
            <ul className="space-y-3 mb-8">
              {["Swipes limités", "Messages limités", "Pubs partout", "Pas de vérification", "IA absente"].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-white/20 font-light">
                  <span className="w-5 h-5 rounded-full bg-red-500/5 flex items-center justify-center text-[10px] text-red-400/40">✗</span>
                  <span className="line-through">{f}</span>
                </li>
              ))}
            </ul>
            <div className="block w-full text-center py-4 rounded-xl font-medium text-sm border border-white/[0.04] text-white/20 cursor-not-allowed">
              Pas intéressant
            </div>
          </div>
        </motion.div>
      </div>

      {/* Founder VIP CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-16 p-10 rounded-3xl border border-[#d4a574]/10 bg-gradient-to-r from-[#d4a574]/[0.03] to-[#0a0614] backdrop-blur-2xl text-center relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4a574]/[0.04] rounded-full blur-[80px]" />
        <div className="relative z-10">
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-flex px-4 py-1.5 rounded-full bg-[#d4a574]/10 border border-[#d4a574]/10 text-[#d4a574]/80 text-xs font-medium tracking-wide mb-6 uppercase"
          >
            ✦ ÉDITION LIMITÉE — 200 FONDATEURS ✦
          </motion.div>

          <h3 className="text-3xl md:text-4xl font-light text-white mb-3 font-serif">Programme Fondateur</h3>
          <p className="text-white/30 max-w-md mx-auto mb-8 font-light">
            Premium gratuit à vie. Badge exclusif. Accès anticipé aux nouveautés. Les 200 premiers inscrits ne paieront jamais.
          </p>

          <Link href="/auth/register" className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-[#d4a574] text-[#0a0614] font-medium text-lg hover:shadow-[0_0_40px_rgba(212,165,116,0.4)] transition-all duration-500 hover:scale-105">
            Réserver ma place
            <span className="text-xl">→</span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
