"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { AuroraBubbles, VibeCard } from "@/components/VibeEffects";

const floatingWords = ["Réel", "Premium", "Sans pubs", "Vie privée", "Vérifié"];

const PARTICLES = 60;
function generateParticles() {
  return Array.from({ length: PARTICLES }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 8,
    duration: Math.random() * 6 + 8,
    color: i % 3 === 0 ? "#ff6b35" : i % 3 === 1 ? "#e91e63" : "#c87f5a",
  }));
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const particles = useRef(generateParticles());

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.2]);

  return (
    <main ref={containerRef} className="min-h-screen bg-[#0a0612] text-white overflow-x-hidden relative">
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#e91e63]/10 blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#ff6b35]/8 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] rounded-full bg-[#c87f5a]/6 blur-[80px]" />
      </div>

      {/* Aurora 3D floating orbs */}
      <div className="fixed inset-0 pointer-events-none z-[2]">
        <AuroraBubbles />
      </div>

      {/* Floating embers */}
      {particles.current.map((p) => (
        <motion.div
          key={p.id}
          className="fixed pointer-events-none z-[1] rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
          animate={{ y: [0, -60, 0], opacity: [0, 1, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Hero */}
      <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#ff6b35]/20 bg-[#ff6b35]/[0.04] backdrop-blur-xl"
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-[#ff6b35] shadow-[0_0_12px_rgba(255,107,53,0.6)]"
          />
          <span className="text-sm text-[#ff6b35]/80 tracking-wide font-medium">Lancement — Mai 2026</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-center leading-[0.95] tracking-tight mb-6"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          <span className="block text-white/60 text-2xl md:text-4xl mb-4 tracking-widest uppercase">Connexion,</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff6b35] via-[#e91e63] to-[#c87f5a]">pas juste un</span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#e91e63] to-[#ff6b35]">plan cul.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-lg md:text-xl text-white/50 text-center max-w-xl mb-10 leading-relaxed"
        >
          La première plateforme de rencontres gay sans pubs, avec des <span className="text-[#ff6b35]/80">profils vérifiés</span> et une <span className="text-[#e91e63]/80">vraie modération</span>.
          <br />
          <span className="text-sm text-white/30">-75% vs Grindr Unlimited.</span>
        </motion.p>

        {/* Floating words */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {floatingWords.map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              {word}
            </motion.span>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <motion.a
            whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(255,107,53,0.4)" }}
            whileTap={{ scale: 0.97 }}
            href="/join"
            className="relative px-10 py-4 rounded-full font-bold text-lg text-white shadow-[0_0_30px_rgba(233,30,99,0.3)] overflow-hidden group cursor-pointer inline-block text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#e91e63] to-[#ff6b35]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-premium-rose)] to-[var(--color-premium-purple)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10">Rejoins Embyr — À partir de 39,99€/an</span>
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="#why"
            className="px-10 py-4 rounded-full font-medium text-white/70 border border-white/10 bg-white/[0.03] backdrop-blur-xl hover:bg-white/[0.06] transition-colors text-center"
          >
            Pourquoi Embyr →
          </motion.a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 flex flex-col items-center gap-2 text-white/20"
        >
          <span className="text-xs tracking-[0.3em] uppercase">Défiler</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>
      </motion.div>

      {/* Why Embyr section */}
      <section id="why" className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-5xl font-black text-center mb-16"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-premium-rose)] to-[var(--color-premium-purple)]">Pourquoi Embyr</span>
          <br />
          <span className="text-white/60 text-xl md:text-2xl">Différent par conception.</span>
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl w-full">
          {[
            { title: "Zéro pubs tierces", desc: "Ton expérience n'est pas un panneau publicitaire. On se finance par les abonnements, pas tes données.", icon: "🚫" },
            { title: "Vraie modération", desc: "Racisme, grossophobie, sérophobie = bannissement. Une file de modération dédiée.", icon: "🛡️" },
            { title: "Prix justes", desc: "-50% vs Grindr. Aucun piège, aucun micro-paiement. Un abonnement débloque tout.", icon: "💰" },
          ].map((item, i) => (
            <VibeCard key={item.title}>
              <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ scale: 1.02, borderColor: "rgba(255,107,53,0.3)" }}
              className="relative group p-8 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#ff6b35]/5 to-[#e91e63]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-white/50 leading-relaxed">{item.desc}</p>
            </motion.div>
            </VibeCard>
          ))}
        </div>
      </section>

      {/* Pricing section */}
      <section id="pricing" className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-5xl font-black text-center mb-6"
        >
          Prix justes.
          <br />
          <span className="text-white/40 text-xl md:text-2xl">-75% vs Grindr Unlimited.</span>
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl w-full mt-6">
          {[
            { name: "Pass 7 Jours", price: "6,99 €", period: "one-shot", best: false },
            { name: "Mensuel", price: "9,99 €", period: "/mois", best: true },
            { name: "Annuel", price: "59,99 €", period: "/an", best: false },
          ].map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ scale: 1.03 }}
              className={`relative group p-8 rounded-2xl border backdrop-blur-xl transition-all duration-300 text-center ${
                plan.best
                  ? "border-[#ff6b35]/30 bg-[#ff6b35]/[0.04] shadow-[0_0_40px_rgba(255,107,53,0.15)]"
                  : "border-white/5 bg-white/[0.02]"
              }`}
            >
              {plan.best && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[#e91e63] to-[#ff6b35] text-xs font-bold uppercase tracking-wider">
                  Meilleur choix
                </div>
              )}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#ff6b35]/5 to-[#e91e63]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="text-4xl font-black mb-1 bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-premium-rose)] to-[var(--color-premium-purple)]">{plan.price}</div>
              <div className="text-white/30 text-sm mb-4">{plan.period}</div>
              <div className="text-white/40 text-sm space-y-2">
                <div>✓ Swipes illimités</div>
                <div>✓ Badge Vérifié</div>
                <div>✓ Zéro pub. Jamais.</div>
                <div>✓ Support prioritaire</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Founder plan */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 p-8 rounded-2xl border border-[#c87f5a]/20 bg-[#c87f5a]/[0.03] backdrop-blur-xl text-center max-w-lg w-full"
        >
          <h3 className="text-xl font-bold mb-2 text-[#c87f5a]">Fondateur Annuel</h3>
          <div className="text-3xl font-black mb-1">39,99 €/an</div>
          <p className="text-white/40 text-sm">Limité à 5000 membres. Verrouille ton prix à vie.</p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12 mt-20 text-center">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff6b35]/30 via-[#e91e63]/30 to-transparent opacity-50" />
        <p className="text-white/30 text-sm">© 2026 Embyr. Connexion, pas juste un plan cul.</p>
      </footer>
    </main>
  );
}
