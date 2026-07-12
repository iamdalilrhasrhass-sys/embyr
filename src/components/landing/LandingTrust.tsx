"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const badges = [
  { icon: "🔒", title: "Connexions essentielles", sub: "Sans carte bancaire" },
  { icon: "🛡️", title: "Confidentialité", sub: "Contrôles de visibilité" },
  { icon: "👁️", title: "Signalement", sub: "Blocage immédiat" },
  { icon: "✅", title: "Badge Vérifié", sub: "Selfie avec code" },
  { icon: "📱", title: "Préférences réciproques", sub: "Dans les deux sens" },
  { icon: "", title: "Sélection courte", sub: "Pas de swipe infini" },
];

export default function LandingTrust() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-32 px-4 max-w-5xl mx-auto relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-premium-purple)]/[0.02] rounded-full blur-[150px] pointer-events-none" />

      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-black text-center text-white mb-4 tracking-tight"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        Une plateforme de{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-premium-rose)] via-[var(--color-premium-purple)] to-[var(--color-premium-purple)]">
          confiance
        </span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center text-gray-500 mb-16"
      >
        Tout est pensé pour votre sérénité.
      </motion.p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {badges.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.08, type: "spring" }}
            className="p-5 rounded-2xl border border-white/[0.04] bg-white/[0.01] backdrop-blur-sm text-center hover:bg-white/[0.04] hover:border-[var(--color-premium-purple)]/15 transition-all duration-500 group"
          >
            <div className="text-2xl mb-2 group-hover:scale-125 transition-transform duration-300">{b.icon}</div>
            <div className="text-xs font-bold text-white/80">{b.title}</div>
            <div className="text-[10px] text-gray-500 mt-1">{b.sub}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
