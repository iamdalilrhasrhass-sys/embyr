"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const founderCards = [
  { number: 1, badge: "👑", title: "Fondatrice #1", status: "Première inscrite" },
  { number: 2, badge: "💎", title: "Fondatrice #2", status: "Membre fondatrice" },
  { number: 3, badge: "✨", title: "Fondatrice #3", status: "Profil vérifié" },
];

export default function LandingFounders() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section ref={ref} className="py-32 px-4 max-w-4xl mx-auto text-center relative">
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-amber-400/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        Profils{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-200 to-pink-300">
          Fondatrices
        </span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-gray-500 mb-20 max-w-md mx-auto"
      >
        Les premières à rejoindre l'aventure Embyr. Une place parmi elles t'attend.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {founderCards.map((f, i) => (
          <motion.div
            key={f.number}
            initial={{ opacity: 0, y: 60, rotateY: 20 }}
            animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 + i * 0.15, ease: "easeOut" }}
            onMouseEnter={() => setHovered(f.number)}
            onMouseLeave={() => setHovered(null)}
            className="relative perspective-1000"
          >
            <motion.div
              animate={hovered === f.number ? { rotateY: 10, rotateX: -5, scale: 1.05, z: 50 } : { rotateY: 0, rotateX: 0, scale: 1, z: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="p-8 rounded-3xl border border-amber-400/10 bg-gradient-to-b from-amber-500/[0.04] to-pink-500/[0.02] backdrop-blur-2xl relative overflow-hidden"
            >
              <motion.div
                animate={hovered === f.number ? { opacity: 1 } : { opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-br from-amber-400/[0.06] via-purple-500/[0.03] to-pink-500/[0.04] rounded-3xl"
              />

              <div className="relative z-10">
                <motion.div
                  animate={hovered === f.number ? { y: -5, scale: 1.1 } : { y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-amber-400/20 to-pink-400/20 border-2 border-amber-400/20 flex items-center justify-center text-4xl mb-6"
                >
                  {f.badge}
                </motion.div>

                <div className="text-white font-bold text-lg">{f.title}</div>
                <div className="text-xs text-amber-400/70 mt-1 mb-1">Badge Fondatrice</div>
                <div className="text-xs text-gray-500">{f.status}</div>
              </div>

              {/* Animated corner glow */}
              <motion.div
                animate={hovered === f.number ? { opacity: 0.6 } : { opacity: 0 }}
                className="absolute -top-10 -right-10 w-20 h-20 bg-amber-400/20 rounded-full blur-2xl"
              />
            </motion.div>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="text-gray-600 text-sm"
      >
        Il reste encore des places. Deviens la prochaine Fondatrice.
      </motion.p>
    </section>
  );
}
