"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

function ProfileCard({ profile, onLike, onPass }: any) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const badges: string[] = [];
  if (profile.isVerified) badges.push("✅ Vérifié");
  if (profile.isFounder) badges.push("👑 Fondatrice");
  if (profile.isPremium) badges.push("💎 Premium");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      exit={{ opacity: 0, x: 300, transition: { duration: 0.3 } }}
      className="relative max-w-md mx-auto p-6 rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl"
    >
      {/* Avatar placeholder */}
      <div className="w-full h-56 rounded-2xl bg-gradient-to-br from-[var(--color-premium-rose)]/20 to-[var(--color-premium-purple)]/20 flex items-center justify-center text-6xl border border-white/5 mb-4">
        {profile.isVerified ? "🛡️" : "👤"}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-xl font-bold text-white">{profile.displayName || profile.username}</h3>
        {badges.map(b => (
          <span key={b} className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">{b}</span>
        ))}
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
        {profile.city && <span>📍 {profile.city}</span>}
        <span>{profile.age} ans</span>
        {profile.profileCompletionScore && (
          <span>{Math.round(profile.profileCompletionScore)}% complété</span>
        )}
      </div>

      {profile.description && (
        <p className="text-gray-300 text-sm mb-6 line-clamp-3">{profile.description}</p>
      )}

      {profile.intentions?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-6">
          {profile.intentions.slice(0, 3).map((intent: string) => (
            <span key={intent} className="text-xs px-2 py-1 rounded-lg bg-[var(--color-premium-purple)]/10 text-[var(--color-premium-rose)] border border-[var(--color-premium-purple)]/20">
              {intent}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onPass}
          className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/30 transition-all font-semibold"
        >
          Passer
        </button>
        <button
          onClick={onLike}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[var(--color-premium-rose)] to-[var(--color-premium-purple)] text-white font-bold hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all"
        >
          J'aime
        </button>
      </div>
    </motion.div>
  );
}

export default function DecouvrirPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mutual, setMutual] = useState<any>(null);

  useEffect(() => {
    fetch("/api/match/feed")
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(d.error);
        else setProfiles(d.profiles || []);
        setLoading(false);
      })
      .catch(() => { setError("Erreur réseau"); setLoading(false); });
  }, []);

  const handleLike = async () => {
    const profile = profiles[current];
    if (!profile) return;
    try {
      const res = await fetch("/api/match/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: profile.userId, action: "like" })
      });
      const d = await res.json();
      if (d.matched) setMutual(profile);
      setCurrent(c => c + 1);
    } catch { setCurrent(c => c + 1); }
  };

  const handlePass = async () => {
    const profile = profiles[current];
    if (!profile) return;
    try {
      await fetch("/api/match/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: profile.userId, action: "pass" })
      });
    } catch {}
    setCurrent(c => c + 1);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Chargement des profils...</div>
      </main>
    );
  }

  if (error && profiles.length === 0) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
        <div className="text-4xl mb-4">💫</div>
        <p className="text-gray-300 text-lg mb-2">Aucun profil disponible</p>
        <p className="text-gray-500 text-sm mb-6">Complète ton profil pour apparaître dans les suggestions.</p>
        <Link href="/dashboard/profile" className="px-6 py-3 rounded-full bg-gradient-to-r from-[var(--color-premium-rose)] to-[var(--color-premium-purple)] text-white font-bold">
          Compléter mon profil
        </Link>
      </main>
    );
  }

  if (current >= profiles.length) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
        <div className="text-4xl mb-4">🎉</div>
        <p className="text-gray-300 text-lg mb-2">Fin des profils pour aujourd'hui</p>
        <p className="text-gray-500 text-sm">Reviens plus tard pour de nouvelles suggestions.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      
      {/* Mutual match popup */}
      <AnimatePresence>
        {mutual && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <div className="p-10 rounded-3xl border border-[var(--color-premium-purple)]/20 bg-gradient-to-br from-[var(--color-premium-rose)]/20 to-[var(--color-premium-purple)]/10 backdrop-blur-xl text-center max-w-sm mx-4">
              <div className="text-5xl mb-4">💜</div>
              <h2 className="text-2xl font-bold text-white mb-2">Match !</h2>
              <p className="text-gray-300 mb-1">{mutual.displayName || mutual.username} t'aime aussi</p>
              <p className="text-gray-500 text-sm mb-6">Envoyez-vous un message !</p>
              <Link href="/messages" className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-[var(--color-premium-rose)] to-[var(--color-premium-purple)] text-white font-bold">
                Aller aux messages
              </Link>
              <button onClick={() => setMutual(null)} className="block w-full mt-3 text-gray-400 text-sm">
                Continuer à découvrir
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-24 pb-16 px-4 max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-white text-center mb-2" style={{ fontFamily: "Arial, sans-serif" }}>
          Découvrir
        </h1>
        <p className="text-gray-400 text-center text-sm mb-8">
          Profil {current + 1} sur {profiles.length}
        </p>

        <AnimatePresence mode="wait">
          <ProfileCard 
            key={profiles[current]?.userId} 
            profile={profiles[current]} 
            onLike={handleLike} 
            onPass={handlePass} 
          />
        </AnimatePresence>
      </div>
    </main>
  );
}
