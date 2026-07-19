"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ScrollReveal from "@/components/motion/ScrollReveal";
import EmbirLogo from "@/components/brand/EmbirLogo";
import Particles3D from "@/components/Particles3D";
import { AuroraBubbles } from "@/components/VibeEffects";
import { localePath, supportedLocale, type SupportedLocale } from "@/components/connection-os/types";

const copy = {
  fr: { titleA: "Bon", titleB: "retour", subtitle: "Connecte-toi à ton espace Embir.", email: "Email", emailPlaceholder: "vous@exemple.com", password: "Mot de passe", help: "Aide ?", submit: "Se connecter", loading: "Connexion…", fallback: "La connexion a échoué.", required: "Email et mot de passe requis.", invalid: "Email ou mot de passe incorrect.", limited: "Trop de tentatives. Réessaie dans quelques minutes.", new: "Pas encore de compte ?", join: "Créer mon profil" },
  en: { titleA: "Welcome", titleB: "back", subtitle: "Sign in to your Embir space.", email: "Email", emailPlaceholder: "you@example.com", password: "Password", help: "Help?", submit: "Sign in", loading: "Signing in…", fallback: "We could not sign you in.", required: "Email and password are required.", invalid: "Incorrect email or password.", limited: "Too many attempts. Try again in a few minutes.", new: "New to Embir?", join: "Create my profile" },
  es: { titleA: "Qué bueno", titleB: "verte", subtitle: "Accede a tu espacio Embir.", email: "Email", emailPlaceholder: "tu@ejemplo.com", password: "Contraseña", help: "¿Ayuda?", submit: "Entrar", loading: "Accediendo…", fallback: "No se pudo iniciar sesión.", required: "Email y contraseña obligatorios.", invalid: "Email o contraseña incorrectos.", limited: "Demasiados intentos. Inténtalo de nuevo en unos minutos.", new: "¿Aún no tienes cuenta?", join: "Crear mi perfil" },
} satisfies Record<SupportedLocale, Record<string, string>>;

export default function Login() {
  const router = useRouter();
  const params = useParams<{ locale?: string }>();
  const locale = supportedLocale(params.locale ?? "en");
  const text = copy[locale];
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
      const data = await res.json() as { code?: string };

      if (!res.ok) {
        if (data.code === "credentials_required") throw new Error(text.required);
        if (data.code === "credentials_invalid") throw new Error(text.invalid);
        if (data.code === "rate_limited") throw new Error(text.limited);
        throw new Error(text.fallback);
      }

      router.push(localePath(locale, "/dashboard"));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : text.fallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-embir-void px-4">

      {/* ── Liquid gradient mesh ── */}
      <div className="emb-liquid-mesh" />

      {/* ── 3D Particle field ── */}
      <Particles3D count={60} />

      {/* ── Mega orbs ── */}
      <div className="emb-hero-orb emb-hero-orb-1 emb-breath" />
      <div className="emb-hero-orb emb-hero-orb-2 emb-breath" style={{ animationDelay: "-3s" }} />
      <div className="emb-hero-orb emb-hero-orb-3 emb-breath" style={{ animationDelay: "-6s" }} />

      {/* ── Aurora floating bubbles ── */}
      <AuroraBubbles count={25} />

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
                <span className="emb-word">{text.titleA}</span>{" "}
                <span className="emb-word emb-gradient-text-super">{text.titleB}</span>
              </h1>
            </div>

            {/* ── Subtitle — parallax depth 0.8 ── */}
            <div className="emb-parallax-layer mb-8" data-depth="0.8">
              <p className="text-center text-sm font-medium text-white/20">
                {text.subtitle}
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
                  <label htmlFor="login-email" className="mb-2 block text-sm font-bold text-white/40 transition-colors group-focus-within:text-embir-rose">
                    {text.email}
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4 text-white shadow-inner backdrop-blur-xl transition-all placeholder:text-white/15 focus:border-embir-rose/40 focus:outline-none focus:ring-1 focus:ring-embir-rose/30"
                    placeholder={text.emailPlaceholder}
                  />
                </div>

                {/* Password input */}
                <div className="group">
                  <div className="mb-2 flex justify-between">
                    <label htmlFor="login-password" className="block text-sm font-bold text-white/40 transition-colors group-focus-within:text-embir-rose">
                      {text.password}
                    </label>
                    <Link
                      href={localePath(locale, "/support")}
                      className="text-xs text-embir-rose transition-colors hover:text-white"
                    >
                      {text.help}
                    </Link>
                  </div>
                  <input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4 text-white shadow-inner backdrop-blur-xl transition-all placeholder:text-white/15 focus:border-embir-rose/40 focus:outline-none focus:ring-1 focus:ring-embir-rose/30"
                    placeholder="••••••••"
                  />
                </div>

                {/* Submit button — CTA Mega */}
                <button
                  type="submit"
                  disabled={loading}
                  className="emb-cta-mega group relative mt-4 inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-embir-rose-deep via-embir-rose to-embir-blush px-10 py-4 text-base font-bold text-embir-void shadow-[var(--shadow-brand)] transition-all duration-500 disabled:opacity-50"
                >
                  <span className="relative z-10">
                    {loading ? text.loading : text.submit}
                  </span>
                  <div className="absolute inset-0 -translate-x-full animate-[embCtaShimmer_2s_ease-in-out_infinite] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </button>
              </form>
            </div>

            {/* ── Register link — parallax depth 1.2 ── */}
            <div className="emb-parallax-layer mt-8" data-depth="1.2">
              <p className="text-center text-sm font-medium text-white/20">
                {text.new}{" "}
                <Link
                  href={localePath(locale, "/auth/register")}
                  className="ml-1 font-bold text-embir-rose transition-colors hover:text-white"
                >
                  {text.join}
                </Link>
              </p>
            </div>

          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
