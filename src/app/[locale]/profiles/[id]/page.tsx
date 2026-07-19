"use client";
import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import PremiumBlurImage from "@/components/ui/PremiumBlurImage";
import { usePremium } from "@/hooks/usePremium";
function generateUserGradient(userId: string) {
  if (!userId) return "linear-gradient(135deg, var(--embir-void-950), var(--embir-plum-900))";
  const hash = Array.from(userId).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue1 = hash % 360;
  const hue2 = (hue1 + 60) % 360;
  return `linear-gradient(135deg, hsl(${hue1}, 60%, 15%), hsl(${hue2}, 40%, 10%), var(--embir-void-950))`;
}

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
  const userGradient = useMemo(() => generateUserGradient(id), [id]);

  return (
    <AppShell>
      <main className="relative min-h-screen overflow-hidden bg-embir-void pb-24 pt-20 text-white">
        {/* Immersive User Universe Background */}
        <div className="absolute inset-0 opacity-40 transition-all duration-1000" style={{ background: userGradient }} />
        <div className="fixed inset-0 noise-overlay pointer-events-none opacity-50" />
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />

        <div className="max-w-2xl mx-auto px-4 relative z-10">
          <button onClick={() => router.back()} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 text-white/60 hover:text-white hover:bg-white/[0.08] text-sm mb-6 transition-all backdrop-blur-md">
            <span>←</span> Retour
          </button>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="w-12 h-12 rounded-full border-2 border-embir-rose/20 border-t-embir-rose animate-spin" />
              <p className="text-embir-rose/60 text-sm uppercase tracking-widest">Loading universe...</p>
            </div>
          ) : profile ? (
            <div className="space-y-8">
              {/* Immersive Header */}
              <div className="text-center space-y-4 pt-4 pb-8">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full" />
                    <PremiumBlurImage
                        src={profile.avatar || photos[0]}
                        alt={profile.displayName || profile.username}
                        className="w-32 h-32 rounded-full border-4 border-embir-void object-cover shadow-2xl relative z-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <h1 className="text-4xl font-serif font-light text-white tracking-tight">
                    {profile.username || profile.displayName || "Membre"}
                  </h1>
                  <p className="text-sm font-medium text-embir-rose uppercase tracking-widest">
                    {[profile.age && `${profile.age} ans`, profile.city].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3">
                  {profile.isPremium && (
                    <span className="text-[10px] px-3 py-1 rounded-full bg-embir-rose/10 text-embir-rose border border-embir-rose/20 uppercase tracking-wider font-semibold">
                       Founder
                    </span>
                  )}
                  {profile.isCertified && (
                    <span className="text-[10px] px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-wider font-semibold">
                      Verified
                    </span>
                  )}
                  {profile.isOnline && (
                    <span className="text-[10px] px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      Live
                    </span>
                  )}
                </div>
              </div>

              {/* Photos Gallery */}
              {photos.length > 0 && (
                <div className={`grid gap-3 ${photos.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                  {photos.map((url: string, i: number) => (
                    <PremiumBlurImage
                      key={i}
                      src={url}
                      alt={`Photo ${i + 1}`}
                      className="aspect-[4/5] w-full rounded-[2rem] object-cover border border-white/[0.06] shadow-2xl hover:border-white/20 transition-all"
                    />
                  ))}
                </div>
              )}

              {/* Personal Universe Box */}
              <div className="rounded-[2rem] p-8 border border-white/[0.08] bg-embir-void/60 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <span className="font-serif text-8xl">"</span>
                </div>
                {profile.description ? (
                  <p className="text-lg text-white/80 leading-relaxed font-serif relative z-10">{profile.description}</p>
                ) : (
                  <p className="text-lg text-white/30 italic font-serif relative z-10">Welcome to my universe.</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                {isPremium ? (
                  <button
                    onClick={() => router.push(`/messages?to=${id}`)}
                    className="flex-1 py-4 rounded-full text-sm font-bold text-embir-void bg-embir-rose hover:bg-embir-blush transition-colors"
                  >
                    Send message
                  </button>
                ) : (
                  <Link
                    href="/premium"
                    className="flex-1 py-4 rounded-full text-sm font-bold text-embir-void text-center bg-gradient-to-r from-embir-rose-deep to-embir-rose shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                  >
                    Unlock photos
                  </Link>
                )}
                <button
                  onClick={toggleFav}
                  className="w-14 rounded-full flex items-center justify-center text-xl transition-all"
                  style={{
                    background: profile.isFavorited ? "rgba(216,139,167,0.15)" : "rgba(255,255,255,0.04)",
                    border: profile.isFavorited ? "1px solid rgba(216,139,167,0.3)" : "1px solid rgba(255,255,255,0.1)",
                    color: profile.isFavorited ? "var(--embir-rose-500)" : "rgba(255,255,255,0.6)"
                  }}
                >
                  {profile.isFavorited ? "★" : "☆"}
                </button>
              </div>

              {/* Rappel freemium discret */}
              {!isPremium && (
                <div className="text-center pt-2">
                  <Link href="/premium" className="text-xs text-white/40 hover:text-white/70 transition-colors">
                    Photos are blurred. <span className="text-embir-rose">Become a Founder</span> to unlock.
                  </Link>
                </div>
              )}

              <div className="flex justify-center gap-6 pt-10 pb-8">
                <button
                  onClick={block}
                  className="text-xs text-red-400/40 hover:text-red-400 transition-colors"
                >
                  Block
                </button>
                <button className="text-xs text-white/20 hover:text-white/50 transition-colors">
                  Report
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-32 space-y-4">
              <div className="text-5xl opacity-20">😶</div>
              <p className="text-white/40 text-sm uppercase tracking-widest font-semibold">Profile not found</p>
            </div>
          )}
        </div>
      </main>
    </AppShell>
  );
}
