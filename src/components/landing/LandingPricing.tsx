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
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[400px] bg-[var(--color-premium-purple)]/[0.03] rounded-full blur-[150px] pointer-events-none" />

      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-black text-center text-white mb-4 tracking-tight"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        Des tarifs{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-premium-rose)] via-[var(--color-premium-purple)] to-[var(--color-premium-purple)]">
          transparents
        </span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center text-gray-500 mb-16"
      >
        Paiement sécurisé Stripe. Aucun renouvellement automatique caché.
      </motion.p>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        {tiers.map((t, i) => <PricingCard key={t.name} tier={t} index={i} />)}
      </div>

      {/* Founder VIP CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-16 p-10 rounded-3xl border border-indigo-400/10 bg-gradient-to-r from-indigo-500/[0.04] via-violet-500/[0.04] to-cyan-500/[0.04] backdrop-blur-2xl text-center relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-400/[0.04] rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/[0.04] rounded-full blur-[80px]" />

        <div className="relative z-10">
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-flex px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 border border-indigo-400/10 text-indigo-300 text-xs font-bold tracking-wide mb-6"
          >
            ✦ ÉDITION LIMITÉE — 200 PLACES ✦
          </motion.div>

          <h3 className="text-3xl md:text-4xl font-black text-white mb-3">Programme Fondatrice</h3>
          <p className="text-gray-400 max-w-md mx-auto mb-8">
            VIP gratuit à vie, badge exclusif, accès anticipé aux nouvelles fonctionnalités.
          </p>

          <Link href="/profiles" className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-lg hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] transition-all duration-500 hover:scale-105">
            Découvrir les profils
            <span className="text-xl">→</span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
