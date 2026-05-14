"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    fetch("/api/profile/me")
      .then(res => {
        if (res.status === 401) { router.push("/auth/login?redirect=/dashboard"); return null; }
        return res.json();
      })
      .then(data => {
        if (data) setProfile(data);
        setAuthChecked(true);
      })
      .catch(() => { router.push("/auth/login?redirect=/dashboard"); });
  }, []);

  if (!authChecked) return <div className="min-h-screen flex items-center justify-center text-white/40">Vérification...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">
      <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "Arial, sans-serif" }}>
        Tableau de Bord
      </h1>
      <p className="text-white/40 text-sm mb-8">Bienvenue sur Embyr</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link href="/dashboard/profile" className="group p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300">
          <div className="text-2xl mb-3">👤</div>
          <h3 className="text-lg font-bold mb-1 text-white">Mon Profil</h3>
          <p className="text-white/40 text-sm">Photos, description, préférences</p>
          <span className="inline-block mt-3 text-xs text-[var(--color-premium-rose)] group-hover:translate-x-1 transition-transform">Modifier →</span>
        </Link>
        
        <Link href="/messages" className="group p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300">
          <div className="text-2xl mb-3">💬</div>
          <h3 className="text-lg font-bold mb-1 text-white">Messages</h3>
          <p className="text-white/40 text-sm">Échangez en toute sécurité</p>
          <span className="inline-block mt-3 text-xs text-[var(--color-premium-rose)] group-hover:translate-x-1 transition-transform">Voir →</span>
        </Link>

        <Link href="/pricing" className="group p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300">
          <div className="text-2xl mb-3">⭐</div>
          <h3 className="text-lg font-bold mb-1 text-white">Abonnement</h3>
          <p className="text-white/40 text-sm">Statut: {profile?.isPremium ? 'Premium' : 'Découverte'}</p>
          <span className="inline-block mt-3 text-xs text-indigo-400 group-hover:translate-x-1 transition-transform">Voir les offres →</span>
        </Link>
      </div>
      
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-8">
        <h2 className="text-xl font-bold mb-6">Statistiques</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/[0.03] p-4 rounded-xl">
            <div className="text-3xl font-bold mb-1">—</div>
            <div className="text-xs text-white/30">Vues</div>
          </div>
          <div className="bg-white/[0.03] p-4 rounded-xl">
            <div className="text-3xl font-bold mb-1">—</div>
            <div className="text-xs text-white/30">Favoris</div>
          </div>
          <div className="bg-white/[0.03] p-4 rounded-xl">
            <div className="text-3xl font-bold mb-1">{profile?.isVerified ? '✓' : '—'}</div>
            <div className="text-xs text-white/30">Vérifié</div>
          </div>
        </div>
      </div>
    </div>
  );
}
