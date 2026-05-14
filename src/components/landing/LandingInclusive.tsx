"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function LandingInclusive() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 px-4 relative overflow-hidden">
      {/* Subtle trans flag halos */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#5BCEFA]/[0.04] rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#F5A9B8]/[0.04] rounded-full blur-[100px] pointer-events-none"
      />

      <div className="max-w-4xl mx-auto text-center relative">
        {/* Elegant flag accent line */}
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: "100%" } : { width: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="h-[2px] bg-gradient-to-r from-transparent via-[#5BCEFA]/60 via-white/40 via-[#F5A9B8]/50 to-transparent mb-16 max-w-[300px] mx-auto"
        />

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          <motion.span
            animate={{ y: [0, -5, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block mr-4 text-5xl md:text-7xl"
          >
            ⚧️
          </motion.span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#5BCEFA] via-white to-[#F5A9B8]">
            Toutes les femmes
          </span>
          <br />
          <span className="text-white/80">ont leur place ici</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg text-gray-300/70 max-w-2xl mx-auto leading-relaxed mb-16"
        >
          Embyr est née d'une conviction simple : les rencontres premium doivent célébrer{" "}
          <span className="text-white/90 font-semibold">toutes les identités</span>.{" "}
          Trans, cis, non-binaires — chaque femme mérite une plateforme qui la respecte, la protège et la met en valeur. Sans exception.
        </motion.p>

        {/* Three elegant value cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          {[
            { title: "Respect", sub: "Zéro tolerance pour la transphobie. Modération stricte.", gradient: "from-[#5BCEFA]/10 to-[#5BCEFA]/5" },
            { title: "Visibilité", sub: "Les profils trans sont mis en avant, pas cachés. Fierté assumée.", gradient: "from-white/[0.04] to-white/[0.01]" },
            { title: "Protection", sub: "Signalement prioritaire. Blocage instantané. Données chiffrées.", gradient: "from-[#F5A9B8]/10 to-[#F5A9B8]/5" },
          ].map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 + i * 0.15 }}
              className="p-6 rounded-2xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-500 group"
            >
              <div className={`w-full h-[2px] bg-gradient-to-r ${v.gradient} mb-4 rounded-full`} />
              <div className="text-white font-bold text-lg mb-1">{v.title}</div>
              <div className="text-gray-500 text-sm leading-relaxed">{v.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Subtle flag-inspired accent */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#5BCEFA]/10 bg-white/[0.02] backdrop-blur-sm"
        >
          <span className="w-2 h-2 rounded-full bg-[#5BCEFA] shadow-[0_0_10px_rgba(91,206,250,0.5)]" />
          <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
          <span className="w-2 h-2 rounded-full bg-[#F5A9B8] shadow-[0_0_10px_rgba(245,169,184,0.5)]" />
          <span className="text-xs text-gray-400 tracking-wide ml-1">Embyr est fièrement inclusive</span>
        </motion.div>

        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: "100%" } : { width: 0 }}
          transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
          className="h-[2px] bg-gradient-to-r from-transparent via-[#5BCEFA]/40 via-white/30 via-[#F5A9B8]/40 to-transparent mt-16 max-w-[300px] mx-auto"
        />
      </div>
    </section>
  );
}
