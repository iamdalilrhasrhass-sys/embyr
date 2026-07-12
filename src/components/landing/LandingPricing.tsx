"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

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
        Tout ce qu’il faut pour rencontrer quelqu’un est gratuit.
        <br />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#e8c4a2] via-[#d4a574] to-[#f0d0b0]">
          Sans carte bancaire.
        </span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center text-white/30 max-w-lg mx-auto mb-16 font-light"
      >
        Le chemin vers une rencontre reste distinct des services de confort facultatifs.
      </motion.p>

      <div className="grid gap-8 md:grid-cols-3">
        {[
          ["Profil et sélection", "Précise tes préférences, reçois une sélection compatible et réagis avec du contexte."],
          ["Réciprocité et messages", "Une connexion se crée dans les deux sens, puis la conversation peut commencer sans carte bancaire."],
          ["Plan et sécurité", "Propose une rencontre, confirme le plan et garde le contrôle grâce aux outils de sécurité."],
        ].map(([title, body], index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: index * 0.12, ease: "easeOut" }}
            className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-2xl"
          >
            <h3 className="font-serif text-xl text-white/80">{title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-white/40">{body}</p>
          </motion.div>
        ))}
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
            ✦ CONTRAT D’ACCÈS CLAIR ✦
          </motion.div>

          <h3 className="text-3xl md:text-4xl font-light text-white mb-3 font-serif">Commence sans carte bancaire</h3>
          <p className="text-white/30 max-w-md mx-auto mb-8 font-light">
            Tout ce qu’il faut pour rencontrer quelqu’un est gratuit. Les éventuels services supplémentaires restent facultatifs.
          </p>

          <Link href="/auth/register" className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-[#d4a574] text-[#0a0614] font-medium text-lg hover:shadow-[0_0_40px_rgba(212,165,116,0.4)] transition-all duration-500 hover:scale-105">
            Créer mon profil
            <span className="text-xl">→</span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
