"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const pillars = [
  { icon: "•", title: "Vérification Selfie", desc: "Chaque profil peut obtenir le badge Vérifié en photo avec un code unique. Zéro tolérance pour les faux comptes.", color: "from-[#ff1f5a]/20 to-[#ff5e36]/5" },
  { icon: "•", title: "Premium Par Design", desc: "Une expérience pensée pour les adultes exigeants. Interface sombre, typographie nette, confidentialité absolue.", color: "from-[#ff5e36]/20 to-[#ffa333]/5" },
  { icon: "•", title: "Modération Humaine", desc: "Des modérateurs réels examinent chaque signalement. Pas d'algorithme opaque — des vraies personnes qui protègent la communauté.", color: "from-[#ff1f5a]/18 to-[#ff5e36]/5" },
  { icon: "⚧️", title: "Communauté Inclusive", desc: "Embir célèbre tous les hommes gay. Gays, bis, queers — vous êtes chez vous ici. Une plateforme pensée pour vous.", color: "from-[#5BCEFA]/20 to-[#F5A9B8]/10" },
];

function PillarCard({ icon, title, desc, color, index }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hovered, setHovered] = useState(false);
  const isTrans = icon === "⚧️";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, rotateX: 15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group perspective-1000"
    >
      <motion.div
        animate={hovered ? { rotateY: 5, rotateX: -5, scale: 1.02, z: 30 } : { rotateY: 0, rotateX: 0, scale: 1, z: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className={`relative p-8 rounded-3xl border backdrop-blur-2xl overflow-hidden ${
          isTrans
            ? "border-[#5BCEFA]/15 bg-gradient-to-b from-[#5BCEFA]/[0.04] to-[#F5A9B8]/[0.03]"
            : "border-white/[0.06] bg-white/[0.02]"
        }`}
      >
        {isTrans && (
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#5BCEFA] via-white to-[#F5A9B8] opacity-60" />
        )}
        <motion.div
          animate={hovered ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4 }}
          className={`absolute inset-0 bg-gradient-to-br ${color} rounded-3xl`}
        />
        <motion.div
          animate={hovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          className={`absolute -inset-[1px] rounded-3xl opacity-0 blur-sm -z-10 ${
            isTrans
              ? "bg-gradient-to-r from-[#5BCEFA]/40 via-white/20 to-[#F5A9B8]/30"
              : "bg-gradient-to-r from-[#ff1f5a]/30 via-[#ff5e36]/20 to-[#ffa333]/20"
          }`}
        />

        <div className="relative z-10">
          <motion.div
            animate={hovered ? { scale: 1.2, rotate: -5 } : { scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`w-16 h-16 rounded-2xl border flex items-center justify-center text-3xl mb-6 ${
              isTrans
                ? "bg-gradient-to-br from-[#5BCEFA]/20 to-[#F5A9B8]/10 border-[#5BCEFA]/20"
                : "bg-gradient-to-br from-white/[0.08] to-white/[0.02] border-white/[0.06]"
            }`}
          >
            {icon}
          </motion.div>

          <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
          <p className="text-gray-400/80 leading-relaxed text-sm">{desc}</p>

          <motion.div
            animate={hovered ? { width: "100%", opacity: 1 } : { width: "0%", opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`h-px mt-6 ${
              isTrans
                ? "bg-gradient-to-r from-[#5BCEFA]/60 via-white/40 to-[#F5A9B8]/50"
                : "bg-gradient-to-r from-[#ff1f5a]/50 via-[#ff5e36]/35 to-transparent"
            }`}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LandingWhy() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-32 px-4 max-w-6xl mx-auto relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#ff5e36]/[0.04] rounded-full blur-[150px] pointer-events-none" />

      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-6xl font-black text-center text-white mb-6 tracking-tight"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        Pourquoi{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff1f5a] via-[#ff5e36] to-[#ffa333]">
          embir.xyz
        </span>
        {" "}?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center text-gray-400 mb-20 max-w-lg mx-auto text-lg"
      >
        Une plateforme de rencontres qui célèbre <span className="text-white/80 font-medium">la communauté gay</span>.
      </motion.p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((p, i) => <PillarCard key={p.title} {...p} index={i} />)}
      </div>
    </section>
  );
}
