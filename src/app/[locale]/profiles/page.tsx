"use client";
import { useState, useEffect, useCallback } from "react";
import AppShell from "@/components/layout/AppShell";
import PremiumBlurImage from "@/components/ui/PremiumBlurImage";
import { usePremium } from "@/hooks/usePremium";
import Link from "next/link";
export default function MembresPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ city: "", gender: "", lookingFor: "", minAge: "", maxAge: "" });
  const { isPremium } = usePremium();

  const fetchProfiles = useCallback(() => {
    const params = new URLSearchParams();
    params.set("limit", "20");
    if (filters.city) params.set("city", filters.city);
    if (filters.gender) params.set("gender", filters.gender);
    if (filters.lookingFor) params.set("lookingFor", filters.lookingFor);
    if (filters.minAge) params.set("minAge", filters.minAge);
    if (filters.maxAge) params.set("maxAge", filters.maxAge);
    setLoading(true); setError("");
    fetch(`/api/profiles?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); setLoading(false); return; }
        setProfiles(data.profiles || []);
        setLoading(false);
      })
      .catch(() => { setError("Erreur réseau"); setLoading(false); });
  }, [filters]);

  useEffect(() => { fetchProfiles(); }, []);

  const resetFilters = () => {
    setFilters({ city: "", gender: "", lookingFor: "", minAge: "", maxAge: "" });
  };

  const hasFilters = Object.values(filters).some((v) => v);

  return (
    <AppShell>
      <main className="min-h-screen text-white pt-20 pb-24" style={{ background: "var(--color-premium-dark)" }}>
        <div className="fixed inset-0 noise-overlay pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-1" style={{
              background: "linear-gradient(135deg, #F5F5F5 60%, var(--color-premium-purple) 80%, var(--color-premium-rose) 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              Profils
            </h1>
            <p className="text-white/30 text-sm">
              {profiles.length} profil{profiles.length !== 1 ? "s" : ""} à découvrir
            </p>
          </div>

          {/* Bannière freemium discrète */}
          {!isPremium && !loading && (
            <Link
              href="/premium"
              className="block mb-5 px-4 py-2.5 rounded-xl text-sm border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] hover:border-white/10 transition-all group"
            >
              <span className="text-white/50 group-hover:text-white/70 transition-colors">
                Les photos sont légèrement floutées.{" "}
                <span className="text-[var(--color-premium-rose)]/80 group-hover:text-[var(--color-premium-rose)] underline underline-offset-2">
                  Passe Premium
                </span>{" "}
                pour voir les profils en détail.
              </span>
            </Link>
          )}

          {/* Filtres */}
          <div className="flex flex-wrap gap-2 mb-6">
            <select
              value={filters.gender}
              onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
              className="px-3 py-2 rounded-xl text-xs bg-white/[0.04] border border-white/[0.06] text-white/60 focus:outline-none focus:border-white/20 transition-colors appearance-none"
            >
              <option value="">Genre</option>
              <option value="woman">Femme</option>
              <option value="man">Homme</option>
              <option value="non_binary">Non-binaire</option>
            </select>
            <input
              placeholder="Ville"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="px-3 py-2 rounded-xl text-xs bg-white/[0.04] border border-white/[0.06] text-white/60 w-24 focus:outline-none focus:border-white/20 transition-colors"
            />
            <input
              placeholder="Âge min"
              type="number"
              value={filters.minAge}
              onChange={(e) => setFilters({ ...filters, minAge: e.target.value })}
              className="px-3 py-2 rounded-xl text-xs bg-white/[0.04] border border-white/[0.06] text-white/60 w-20 focus:outline-none focus:border-white/20 transition-colors"
            />
            <input
              placeholder="Âge max"
              type="number"
              value={filters.maxAge}
              onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })}
              className="px-3 py-2 rounded-xl text-xs bg-white/[0.04] border border-white/[0.06] text-white/60 w-20 focus:outline-none focus:border-white/20 transition-colors"
            />
            <button
              onClick={fetchProfiles}
              className="px-4 py-2 rounded-xl text-xs font-medium text-white"
              style={{ background: "linear-gradient(135deg, var(--color-premium-purple), var(--color-premium-rose))" }}
            >
              Appliquer
            </button>
            {hasFilters && (
              <button onClick={resetFilters} className="px-4 py-2 rounded-xl text-xs text-white/40 hover:text-white/70 transition-colors">
                Réinitialiser
              </button>
            )}
          </div>

          {/* Contenu */}
          {error && !loading ? (
            <div className="text-center py-20">
              <p className="text-white/40 mb-4">{error}</p>
              <button onClick={fetchProfiles} className="px-5 py-2.5 rounded-xl text-sm font-medium text-white"
                style={{ background: "linear-gradient(135deg, var(--color-premium-purple), var(--color-premium-rose))" }}>
                Réessayer
              </button>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-2xl overflow-hidden animate-pulse bg-white/[0.02] border border-white/[0.03]">
                  <div className="aspect-[3/4] bg-white/[0.02]" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 w-24 bg-white/[0.04] rounded" />
                    <div className="h-3 w-32 bg-white/[0.02] rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <div className="text-4xl opacity-20">🔍</div>
              <p className="text-white/40">{hasFilters ? "Aucun profil trouvé. Élargis tes critères." : "Aucun profil pour le moment."}</p>
              {hasFilters && (
                <button onClick={resetFilters} className="px-4 py-2 rounded-xl text-xs text-white/50 hover:text-white/80 transition-colors">
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          ) : (
            /* Grille : 1 col mobile, 2 tablet, 3 desktop */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {profiles.map((p: any) => {
                const photoUrl = p.publicPhotos?.[0] || p.avatar || null;
                return (
                  <Link
                    key={p.id || p.userId}
                    href={`/profiles/${p.id || p.userId}`}
                    className="group rounded-2xl overflow-hidden border border-white/[0.04] bg-white/[0.01] backdrop-blur-sm hover:border-white/[0.08] hover:bg-white/[0.02] transition-all duration-300"
                  >
                    {/* Photo */}
                    <div className="aspect-[3/4] relative overflow-hidden">
                      <PremiumBlurImage
                        src={photoUrl}
                        alt={p.username || p.displayName || "Membre"}
                        className="w-full h-full"
                      />
                      {/* Badge premium discret */}
                      {!isPremium && (
                        <div className="absolute top-2 right-2 z-10">
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-black/40 text-white/50 backdrop-blur-sm border border-white/5">
                            {photoUrl ? "Photos premium" : "Aperçu"}
                          </span>
                        </div>
                      )}
                      {/* Online badge */}
                      {p.isOnline && (
                        <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                          <span className="text-[9px] text-green-400/80">En ligne</span>
                        </div>
                      )}
                    </div>

                    {/* Infos */}
                    <div className="p-4 space-y-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-sm font-semibold text-white/85 group-hover:text-white transition-colors truncate">
                          {p.username || p.displayName || "Membre"}
                        </h3>
                        {p.isVerified && (
                          <span className="text-[11px]" title="Vérifié">🛡️</span>
                        )}
                        {p.isPremium && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-fuchsia-500/10 text-fuchsia-400/80 border border-fuchsia-500/10">
                            Premium
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-white/35">
                        {[p.age && `${p.age} ans`, p.city].filter(Boolean).join(" • ")}
                      </p>
                      {p.lastActive && (
                        <p className="text-[10px] text-white/20">Actif{typeof p.lastActive === "string" ? " " + p.lastActive : " récemment"}</p>
                      )}
                      <div className="pt-2">
                        <span className="inline-flex items-center gap-1 text-[11px] text-white/30 group-hover:text-white/60 group-hover:bg-white/[0.04] px-2 py-1 -ml-2 rounded-lg transition-all">
                          Voir le profil
                          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </AppShell>
  );
}
