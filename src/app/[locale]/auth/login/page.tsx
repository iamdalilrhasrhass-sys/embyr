"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ScrollReveal from "@/components/motion/ScrollReveal";
import EmbirLogo from "@/components/brand/EmbirLogo";
import Particles3D from "@/components/Particles3D";
import { AuroraBubbles } from "@/components/VibeEffects";
export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Identifiants incorrects");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0614] px-4">

      {/* ── Liquid gradient mesh ── */}
      <div className="emb-liquid-mesh" />

      {/* ── 3D Particle field ── */}
      <Particles3D count={60} />

      {/* ── Mega orbs ── */}
      <div className="emb-hero-orb emb-hero-orb-1 emb-breath" />
      <div className="emb-hero-orb emb-hero-orb-2 emb-breath" style={{ animationDelay: "-3s" }} />
      <div className="emb-hero-orb emb-hero-orb-3 emb-breath" style={{ animationDelay: "-6s" }} />

      {/* ── Aurora floating bubbles ── */}
      <AuroraBubbles count={25} colors={["#ffa333", "#ff5e36", "#ff1f5a", "#d4a574", "#c4956a"]} />

      {/* ── ScrollReveal entrance ── */}
      <ScrollReveal direction="up" className="relative z-10 w-full max-w-md">
        {/* ── Parallax layer: card ── */}
        <div className="emb-parallax-layer" data-depth="1">

          {/* ── Glass card extreme ── */}
          <div className="emb-glass-extreme w-full rounded-[2.5rem] p-8 md:p-10">

            {/* ── Logo — parallax depth 0.5 ── */}
            <div className="emb-parallax-layer mb-7 flex justify-center" data-depth="0.3">
              <EmbirLogo size="md" />
            </div>

            {/* ── Title — super title ── */}
            <div className="emb-parallax-layer mb-2" data-depth="0.6">
              <h1 className="emb-super-title text-center text-5xl md:text-6xl text-white">
                <span className="emb-word">Bon</span>{" "}
                <span className="emb-word emb-gradient-text-super">retour</span>
              </h1>
            </div>

            {/* ── Subtitle — parallax depth 0.8 ── */}
            <div className="emb-parallax-layer mb-8" data-depth="0.8">
              <p className="text-center text-sm font-medium text-white/20">
                Connecte-toi à ton espace embir.xyz.
              </p>
            </div>

            {/* ── Error ── */}
            {error && (
              <div className="emb-parallax-layer mb-6" data-depth="0.9">
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-sm font-medium text-red-400 backdrop-blur-md">
                  {error}
                </div>
              </div>
            )}

            {/* ── Form — parallax depth 1 ── */}
            <div className="emb-parallax-layer" data-depth="1">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email input */}
                <div className="group">
                  <label className="mb-2 block text-sm font-bold text-white/40 transition-colors group-focus-within:text-[#d4a574]">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4 text-white shadow-inner backdrop-blur-xl transition-all placeholder:text-white/15 focus:border-[#d4a574]/40 focus:outline-none focus:ring-1 focus:ring-[#d4a574]/30"
                    placeholder="votre@email.com"
                  />
                </div>

                {/* Password input */}
                <div className="group">
                  <div className="mb-2 flex justify-between">
                    <label className="block text-sm font-bold text-white/40 transition-colors group-focus-within:text-[#d4a574]">
                      Mot de passe
                    </label>
                    <Link
                      href="#"
                      className="text-xs text-[#d4a574] transition-colors hover:text-white"
                    >
                      Oublié&nbsp;?
                    </Link>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4 text-white shadow-inner backdrop-blur-xl transition-all placeholder:text-white/15 focus:border-[#d4a574]/40 focus:outline-none focus:ring-1 focus:ring-[#d4a574]/30"
                    placeholder="••••••••"
                  />
                </div>

                {/* Submit button — CTA Mega */}
                <button
                  type="submit"
                  disabled={loading}
                  className="emb-cta-mega group relative mt-4 inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-[#ff1f5a] via-[#ff5e36] to-[#ffa333] px-10 py-4 text-base font-bold text-white shadow-[0_25px_70px_rgba(255,31,90,0.35)] transition-all duration-500 disabled:opacity-50"
                >
                  <span className="relative z-10">
                    {loading ? "Connexion..." : "Se connecter"}
                  </span>
                  <div className="absolute inset-0 -translate-x-full animate-[embCtaShimmer_2s_ease-in-out_infinite] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </button>
              </form>
            </div>

            {/* ── Register link — parallax depth 1.2 ── */}
            <div className="emb-parallax-layer mt-8" data-depth="1.2">
              <p className="text-center text-sm font-medium text-white/20">
                Pas encore de compte&nbsp;?{" "}
                <Link
                  href="/paris"
                  className="ml-1 font-bold text-[#d4a574] transition-colors hover:text-white"
                >
                  Rejoindre les fondateurs
                </Link>
              </p>
            </div>

          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
