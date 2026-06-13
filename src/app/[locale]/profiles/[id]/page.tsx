"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import PremiumBlurImage from "@/components/ui/PremiumBlurImage";
import { usePremium } from "@/hooks/usePremium";

export default function MembreDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { isPremium } = usePremium();

  useEffect(() => {
    if (!id) return;
    fetch(`/api/profile/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setProfile(d.profile || d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const toggleFav = async () => {
    if (!profile) return;
    if (profile.isFavorited) {
      await fetch(`/api/favorites/${id}`, { method: "DELETE" });
      setProfile({ ...profile, isFavorited: false });
    } else {
      await fetch(`/api/favorites/${id}`, { method: "POST" });
      setProfile({ ...profile, isFavorited: true });
    }
  };

  const block = async () => {
    await fetch(`/api/blocks/${id}`, { method: "POST" });
    router.push("/profiles");
  };

  const photos: string[] = profile?.publicPhotos || [];

  return (
    <AppShell>
      <main className="min-h-screen text-white pt-20 pb-24" style={{ background: "var(--color-premium-dark)" }}>
        <div className="fixed inset-0 noise-overlay pointer-events-none" />
        <div className="max-w-lg mx-auto px-4 relative z-10">
          <button onClick={() => router.back()} className="text-white/40 hover:text-white/70 text-sm mb-5 transition-colors">
            ← Retour
          </button>

          {loading ? (
            <div className="text-center py-20 text-white/30">Chargement...</div>
          ) : profile ? (
            <div className="space-y-5">
              {/* Photos — floutées subtilement si non premium */}
              {photos.length > 0 && (
                <div className={`grid gap-2 ${photos.length === 1 ? "grid-cols-1" : photos.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
                  {photos.map((url: string, i: number) => (
                    <PremiumBlurImage
                      key={i}
                      src={url}
                      alt={`Photo ${i + 1}`}
                      className="aspect-square w-full rounded-2xl"
                    />
                  ))}
                </div>
              )}

              {/* Infos — toujours visibles */}
              <div className="rounded-2xl p-5 space-y-4 border border-white/[0.04] bg-white/[0.01] backdrop-blur-sm">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-white/90">
                    {profile.username || profile.displayName || "Membre"}
                  </h2>
                  {profile.isPremium && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-fuchsia-500/10 text-fuchsia-400/80 border border-fuchsia-500/10">
                       Premium
                    </span>
                  )}
                  {profile.isCertified && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400/80 border border-cyan-500/10">
                      🛡️ Certifié
                    </span>
                  )}
                  {profile.isOnline && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400/80 border border-green-500/10 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                      En ligne
                    </span>
                  )}
                </div>

                <p className="text-sm text-white/50">
                  {[profile.age && `${profile.age} ans`, profile.city].filter(Boolean).join(" • ")}
                </p>

                {profile.description ? (
                  <p className="text-sm text-white/60 leading-relaxed">{profile.description}</p>
                ) : (
                  <p className="text-sm text-white/25 italic">Aucune description</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {isPremium ? (
                  <button
                    onClick={() => router.push(`/messages?to=${id}`)}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold text-white"
                    style={{ background: "linear-gradient(135deg, var(--color-premium-purple), var(--color-premium-rose))" }}
                  >
                    💬 Envoyer un message
                  </button>
                ) : (
                  <Link
                    href="/premium"
                    className="flex-1 py-3 rounded-xl text-sm font-semibold text-white text-center"
                    style={{ background: "linear-gradient(135deg, var(--color-premium-purple), var(--color-premium-rose))" }}
                  >
                    🔓 Débloquer les photos
                  </Link>
                )}
                <button
                  onClick={toggleFav}
                  className="w-12 rounded-xl flex items-center justify-center text-base"
                  style={{
                    background: profile.isFavorited ? "rgba(244,63,143,0.12)" : "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {profile.isFavorited ? "" : "☆"}
                </button>
              </div>

              {/* Rappel freemium discret */}
              {!isPremium && (
                <Link
                  href="/premium"
                  className="block px-4 py-3 rounded-xl text-center text-xs border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors group"
                >
                  <span className="text-white/40 group-hover:text-white/60 transition-colors">
                    Les photos sont floutées.{" "}
                    <span className="text-[var(--color-premium-rose)]/70 group-hover:text-[var(--color-premium-rose)]">
                      Passe Premium
                    </span>{" "}
                    pour les débloquer.
                  </span>
                </Link>
              )}

              <div className="flex gap-2">
                <button
                  onClick={block}
                  className="text-[11px] text-red-400/50 hover:text-red-400 px-3 py-1.5 rounded-lg transition-colors"
                  style={{ border: "1px solid rgba(239,68,68,0.15)" }}
                >
                  🚫 Bloquer
                </button>
                <button className="text-[11px] text-white/25 hover:text-white/40 px-3 py-1.5 rounded-lg transition-colors"
                  style={{ border: "1px solid rgba(255,255,255,0.04)" }}>
                  ⚠️ Signaler
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 space-y-3">
              <div className="text-4xl opacity-20">😕</div>
              <p className="text-white/40">Profil non trouvé</p>
            </div>
          )}
        </div>
      </main>
    </AppShell>
  );
}
