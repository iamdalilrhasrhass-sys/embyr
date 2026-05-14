"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  { num: "01", title: "Crée ton compte", desc: "Email + âge vérifié. 2 minutes, sans engagement.", color: "from-[var(--color-premium-rose)] to-[var(--color-premium-purple)]" },
  { num: "02", title: "Vérifie ton identité", desc: "Selfie avec code unique. Badge Vérifié en 24h.", color: "from-[var(--color-premium-purple)] to-[var(--color-premium-purple)]" },
  { num: "03", title: "Découvre des profils", desc: "Parcours les membres vérifiés, filtre par intentions.", color: "from-purple-500 to-pink-500" },
  { num: "04", title: "Échange en toute sécurité", desc: "Messagerie chiffrée, modération active, signalement", color: "from-pink-500 to-rose-400" },
];

function StepCard({ num, title, desc, color, index }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: "easeOut" }}
      className="relative flex items-start gap-6 group"
    >
      {/* Timeline connector line */}
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={isInView ? { scale: 1, rotate: 0 } : {}}
          transition={{ duration: 0.6, delay: index * 0.12 + 0.3, type: "spring" }}
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-xl font-black text-white shadow-lg relative z-10`}
        >
          {num}
        </motion.div>
        {index < steps.length - 1 && (
          <motion.div
            initial={{ height: 0 }}
            animate={isInView ? { height: 60 } : { height: 0 }}
            transition={{ duration: 0.6, delay: index * 0.12 + 0.5 }}
            className="w-px bg-gradient-to-b from-[var(--color-premium-rose)]/30 to-transparent mt-3"
          />
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: index * 0.12 + 0.4 }}
        className="flex-1 p-6 rounded-2xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] hover:border-[var(--color-premium-purple)]/10 transition-all duration-500"
      >
        <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
      </motion.div>
    </motion.div>
  );
}

export default function LandingHow() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-32 px-4 max-w-3xl mx-auto relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-premium-purple)]/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-black text-center text-white mb-4 tracking-tight"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        Comment ça{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-premium-rose)] via-[var(--color-premium-purple)] to-pink-300">
          marche
        </span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center text-gray-500 mb-16"
      >
        Simple, rapide, sécurisé.
      </motion.p>

      <div className="space-y-6">
        {steps.map((s, i) => <StepCard key={s.num} {...s} index={i} />)}
      </div>
    </section>
  );
}
