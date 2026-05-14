"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Particles3D from "@/components/ui/Particles3D";

const particles = Array.from({length: 60}, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 8 + 6,
  delay: Math.random() * 5,
  opacity: Math.random() * 0.6 + 0.1,
}));

const floatingWords = ["Fierté", "Communauté", "Liberté", "Respect", "🏳️‍🌈 Amour"];

export default function LandingHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <section ref={containerRef} className="emb-aurora relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Grid géométrique + aurora */}
      <div className="emb-aurora-bg" />
      <div className="emb-grid" />
      <div className="emb-noise" />

      {/* 3D Particle field */}
      <Particles3D count={55} className="absolute inset-0 z-[2]" />

      {/* Animated nebula blobs following mouse */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none max-w-[100vw] hidden sm:block"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)" }}
        animate={{ x: mousePos.x - 300, y: mousePos.y - 300 }}
        transition={{ type: "spring", damping: 30, stiffness: 80 }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none max-w-[95vw] hidden sm:block"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.1), transparent 70%)" }}
        animate={{ x: mousePos.x * 0.5 - 200, y: mousePos.y * 0.7 - 200 }}
        transition={{ type: "spring", damping: 40, stiffness: 60 }}
      />
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full blur-[90px] pointer-events-none max-w-[90vw] hidden sm:block"
        style={{ background: "radial-gradient(circle, rgba(244,63,143,0.08), transparent 70%)" }}
        animate={{ x: mousePos.x * 0.3 - 175, y: mousePos.y * 0.5 - 175 }}
        transition={{ type: "spring", damping: 50, stiffness: 50 }}
      />

      {/* Particle field */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: p.opacity }}
            animate={{ y: [0, -30, 0], opacity: [p.opacity, p.opacity * 2, p.opacity] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Main content */}
      <motion.div style={{ y, opacity, scale }} className="relative z-10 text-center px-4 max-w-4xl">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--color-premium-purple)]/20 bg-[var(--color-premium-purple)]/[0.04] backdrop-blur-2xl mb-12"
        >
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="w-2 h-2 rounded-full bg-[var(--color-premium-rose)] shadow-[0_0_12px_rgba(139,92,246,0.6)]" />
          <span className="text-sm text-[var(--color-premium-rose)]/80 tracking-wide font-medium">Lancement — Mai 2026</span>
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="w-2 h-2 rounded-full bg-[var(--color-premium-purple)] shadow-[0_0_12px_rgba(6,182,212,0.6)]" />
        </motion.div>

        {/* ⚧️ Insigne */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -30 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.5, type: "spring", stiffness: 200 }}
          className="absolute top-8 right-8 md:top-16 md:right-16 z-20"
        >
          <motion.div
            animate={{ y: [0, -6, 0], rotate: [0, 3, -3, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl"
          >
            <div className="absolute -inset-[1px] rounded-full bg-gradient-to-r from-[#5BCEFA]/40 via-white/20 to-[#F5A9B8]/40 opacity-60 blur-sm" />
            <span className="relative z-10 text-2xl">⚧️</span>
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tighter mb-8"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-[#38BDF8] via-white to-[#818CF8]">ENTRE NOUS</span>
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-[#818CF8] via-white to-[#38BDF8]">
            FIERS ET LIBRES
          </span>
          <span className="block text-white/30 text-4xl sm:text-5xl md:text-6xl font-light mt-4">sans limites</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="text-lg md:text-xl text-gray-300/80 max-w-xl mx-auto mb-14 leading-relaxed"
        >
          Là où l'authenticité est notre force. <br />
          Profils <span className="text-[#38BDF8] font-semibold">vérifiés</span>, communauté <span className="text-[#818CF8] font-semibold">bienveillante</span>, espace <span className="text-[#38BDF8] font-semibold">safe</span>.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <Link href="/auth/register" className="group relative px-10 py-5 rounded-full font-bold text-lg transition-all duration-500">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--color-premium-purple)] via-purple-500 to-[var(--color-premium-purple)] opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--color-premium-purple)] via-purple-500 to-[var(--color-premium-purple)] blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10 text-white">Rejoindre Embyr</span>
          </Link>

          <Link href="/profiles" className="group relative px-10 py-5 rounded-full font-semibold text-lg transition-all duration-500">
            <div className="absolute inset-0 rounded-full border border-white/15 bg-white/[0.03] backdrop-blur-2xl group-hover:border-[var(--color-premium-purple)]/30 group-hover:bg-white/[0.06] transition-all" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--color-premium-rose)]/0 via-[var(--color-premium-purple)]/0 to-pink-500/0 group-hover:from-[var(--color-premium-rose)]/5 group-hover:via-[var(--color-premium-purple)]/5 group-hover:to-pink-500/5 transition-all duration-700" />
            <span className="relative z-10 text-white/80 group-hover:text-white transition-colors flex items-center gap-2">
              Découvrir les profils
              <span className="text-[var(--color-premium-rose)] group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </Link>
        </motion.div>

        {/* Floating keywords */}
        <div className="mt-20 flex flex-wrap justify-center gap-3">
          {floatingWords.map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: [0.4, 0.7, 0.4], y: 0 }}
              transition={{ duration: 3, delay: 1.5 + i * 0.15, repeat: Infinity, repeatType: "reverse" }}
              className="px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-sm text-xs text-gray-400 tracking-widest uppercase"
            >
              {word}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 z-10"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-[0.3em] text-white/20 uppercase">Découvrir</span>
          <div className="w-5 h-8 rounded-full border border-white/10 flex justify-center pt-1.5">
            <motion.div animate={{ y: [0, 6, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} className="w-1 h-1.5 rounded-full bg-white/40" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
