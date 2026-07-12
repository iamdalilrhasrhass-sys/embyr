"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ScrollReveal from "@/components/motion/ScrollReveal";
import EmbirLogo from "@/components/brand/EmbirLogo";
import Particles3D from "@/components/ui/Particles3D";
import { trackSignupPageView, trackSignupStarted, trackSignupCompleted, trackSignupError } from "@/lib/analytics";
export default function Register() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refParam = searchParams.get("ref") || "";
  const sourceParam = searchParams.get("source") || "";
  const isParisFounder = sourceParam.includes("paris");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState(refParam);
  const [isAdult, setIsAdult] = useState(false);
  const [acceptCGU, setAcceptCGU] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [codeValid, setCodeValid] = useState<boolean | null>(null);
  const [checkingCode, setCheckingCode] = useState(Boolean(refParam.trim()));
  const signupStartedFired = useRef(false);
  const pageViewFired = useRef(false);

  // signup_page_view — fire once on mount
  useEffect(() => {
    if (!pageViewFired.current) {
      pageViewFired.current = true;
      trackSignupPageView();
    }
  }, []);

  // Vérifier le code de parrainage si présent dans l'URL
  useEffect(() => {
    if (refParam && refParam.trim()) {
      fetch("/api/referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: refParam.trim() }),
      })
        .then((res) => res.json())
        .then((data) => {
          setCodeValid(data.valid === true);
        })
        .catch(() => setCodeValid(null))
        .finally(() => setCheckingCode(false));
    }
  }, [refParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isAdult) {
      setError("Vous devez certifier être majeur(e) pour vous inscrire.");
      trackSignupError("not_adult");
      return;
    }
    if (!acceptCGU) {
      setError("Vous devez accepter les Conditions Générales d'Utilisation.");
      trackSignupError("cgu_not_accepted");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          isAdult,
          acceptTerms: acceptCGU,
          acceptPrivacy: acceptCGU,
          referralCode: referralCode.trim() || undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        trackSignupError(data.error || "api_error");
        throw new Error(data.error || "Erreur lors de l'inscription");
      }

      trackSignupCompleted();
      router.push("/onboarding");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur lors de l'inscription";
      setError(message);
      if (!message.includes("Erreur lors de l'inscription")) {
        trackSignupError("network_or_unknown");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#0a0614]">
      {/* ── SUPERNOVA LIQUID MESH ── */}
      <div className="emb-liquid-mesh" />

      {/* ── MEGA ORBS ── */}
      <div className="emb-hero-orb emb-hero-orb-1" />
      <div className="emb-hero-orb emb-hero-orb-2" />
      <div className="emb-hero-orb emb-hero-orb-3" />

      {/* ── 3D PARTICLE FIELD ── */}
      <Particles3D count={65} className="absolute inset-0 z-[1]" />

      {/* ── NOISE OVERLAY ── */}
      <div className="absolute inset-0 noise-overlay z-[2] pointer-events-none" />

      <ScrollReveal direction="up" className="w-full max-w-md z-10 py-12">
        {/* ── GLASS EXTREME CARD ── */}
        <div className="emb-glass-extreme w-full p-8 md:p-10 rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.6)]">
          {/* Inner ambient glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff1f5a]/6 rounded-full blur-[60px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#d4a574]/5 rounded-full blur-[50px] pointer-events-none" />

          {/* ── LOGO ── */}
          <div className="mb-7 flex justify-center relative z-10">
            <EmbirLogo size="md" />
          </div>

          {/* ── PARIS FOUNDER BADGE ── */}
          {isParisFounder && (
            <div className="emb-float-badge mb-5 rounded-2xl border border-[#ff5e36]/25 bg-[#ff5e36]/10 px-4 py-3 text-center text-sm font-semibold text-[#ffa333] relative z-10">
              Paris · accès membre fondateur
            </div>
          )}

          {/* ── SUPER TITLE ── */}
          {isParisFounder ? (
            <h1 className="emb-super-title text-5xl md:text-6xl mb-4 text-white relative z-10">
              <span className="emb-word">Rejoindre</span>{" "}
              <span className="emb-word">les</span>{" "}
              <span className="emb-word emb-gradient-text-super">100</span>{" "}
              <span className="emb-word emb-gradient-text-super">fondateurs</span>
            </h1>
          ) : (
            <h1 className="emb-super-title text-5xl md:text-6xl mb-4 text-white relative z-10">
              <span className="emb-word">Rejoindre</span>{" "}
              <span className="emb-word emb-gradient-text-super">embir.xyz</span>
            </h1>
          )}

          {/* ── SUBTITLE ── */}
          <p className="text-white/40 mb-6 font-medium text-sm leading-relaxed relative z-10">
            {isParisFounder
              ? "Crée ton profil pour rejoindre les premiers membres à Paris."
              : "core connection features are free worldwide. Verified profiles, preferences, compatibility and a transparent optional-services model."}
          </p>

          {/* ── FEATURE TAGS ── */}
          <div className="mb-8 grid grid-cols-3 gap-2 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35 relative z-10">
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] px-2 py-3 backdrop-blur-sm">18+</div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] px-2 py-3 backdrop-blur-sm">free core connections</div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] px-2 py-3 backdrop-blur-sm">Worldwide</div>
          </div>

          {/* ── ERROR ── */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm font-medium backdrop-blur-md relative z-10">
              {error}
            </div>
          )}

          {/* ── REFERRAL CODE STATUS BADGES ── */}
          {refParam && checkingCode && (
            <div className="bg-white/[0.02] border border-white/8 p-3 rounded-xl mb-6 text-sm text-white/40 text-center backdrop-blur-sm relative z-10">
              Vérification du code de parrainage...
            </div>
          )}
          {refParam && codeValid === true && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl mb-6 text-sm font-medium text-center backdrop-blur-sm relative z-10">
              ✅ Code de parrainage <strong>{refParam}</strong> valide ! Vous serez lié à votre parrain.
            </div>
          )}
          {refParam && codeValid === false && (
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 p-3 rounded-xl mb-6 text-sm text-center backdrop-blur-sm relative z-10">
              Code de parrainage &quot;{refParam}&quot; non reconnu. L&apos;inscription est toujours possible.
            </div>
          )}

          {/* ── FORM ── */}
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {/* Email */}
            <div className="group">
              <label className="block text-xs font-bold text-white/35 mb-2 group-focus-within:text-[#d4a574] transition-colors uppercase tracking-[0.08em]">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/8 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#d4a574]/40 focus:ring-1 focus:ring-[#d4a574]/20 transition-all text-white placeholder:text-white/20 shadow-inner backdrop-blur-sm"
                placeholder="votre@email.com"
                onFocus={() => { if (!signupStartedFired.current) { signupStartedFired.current = true; trackSignupStarted("email_focus"); } }}
              />
            </div>

            {/* Password */}
            <div className="group">
              <label className="block text-xs font-bold text-white/35 mb-2 group-focus-within:text-[#d4a574] transition-colors uppercase tracking-[0.08em]">
                Mot de passe
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/8 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#d4a574]/40 focus:ring-1 focus:ring-[#d4a574]/20 transition-all text-white placeholder:text-white/20 shadow-inner backdrop-blur-sm"
                placeholder="••••••••"
              />
              <p className="text-[10px] text-white/20 mt-2 font-medium">8 caractères minimum.</p>
            </div>

            {/* Referral code */}
            <div className="group">
              <label className="block text-xs font-bold text-white/35 mb-2 group-focus-within:text-[#d4a574] transition-colors uppercase tracking-[0.08em]">
                Code de parrainage <span className="text-white/15 font-normal normal-case tracking-normal">(optionnel)</span>
              </label>
              <input
                type="text"
                value={referralCode}
                onChange={(e) => {
                  setReferralCode(e.target.value.toUpperCase());
                  setCodeValid(null);
                }}
                className="w-full bg-white/[0.03] border border-white/8 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#d4a574]/40 focus:ring-1 focus:ring-[#d4a574]/20 transition-all text-white placeholder:text-white/20 shadow-inner backdrop-blur-sm uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal"
                placeholder="EMB-XXXXXX"
                maxLength={10}
              />
              <p className="text-[10px] text-white/20 mt-2 font-medium">
                Tu as été invité(e) ? Entre le code reçu.
              </p>
            </div>

            {/* ── CHECKBOXES ── */}
            <div className="space-y-4 pt-2">
              {/* Adult checkbox */}
              <label className="flex items-start space-x-3 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5 mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    checked={isAdult}
                    onChange={(e) => setIsAdult(e.target.checked)}
                    className="peer appearance-none w-5 h-5 border border-white/15 rounded bg-white/[0.03] checked:bg-[#d4a574] checked:border-[#d4a574] transition-colors backdrop-blur-sm"
                  />
                  <svg className="absolute w-3 h-3 text-[#0a0614] pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors leading-relaxed">
                  Embir est réservé aux personnes majeures. En créant un compte, vous certifiez avoir 18 ans ou plus.
                </span>
              </label>

              {/* CGU checkbox */}
              <label className="flex items-start space-x-3 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5 mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    checked={acceptCGU}
                    onChange={(e) => setAcceptCGU(e.target.checked)}
                    className="peer appearance-none w-5 h-5 border border-white/15 rounded bg-white/[0.03] checked:bg-[#d4a574] checked:border-[#d4a574] transition-colors backdrop-blur-sm"
                  />
                  <svg className="absolute w-3 h-3 text-[#0a0614] pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors leading-relaxed">
                  J&apos;accepte les <Link href="/legal/cgu" prefetch={false} className="text-[#d4a574] hover:text-[#ffa333] font-bold transition-colors">Conditions Générales d&apos;Utilisation</Link> et la <Link href="/legal/confidentialite" prefetch={false} className="text-[#d4a574] hover:text-[#ffa333] font-bold transition-colors">politique de confidentialité</Link>.
                </span>
              </label>
            </div>

            {/* ── CTA MEGA BUTTON ── */}
            <button
              type="submit"
              disabled={loading}
              className="emb-cta-mega w-full bg-gradient-to-r from-[#ff1f5a] via-[#ff5e36] to-[#ffa333] text-white font-bold text-lg py-4 rounded-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed mt-4 relative z-10 shadow-[0_0_40px_rgba(255,31,90,0.25)]"
            >
              {loading ? "Création..." : isParisFounder ? "Créer mon profil fondateur" : "Créer mon compte gratuit"}
            </button>
          </form>

          {/* ── LOGIN LINK ── */}
          <p className="text-center mt-8 text-sm text-white/30 font-medium relative z-10">
            Déjà un compte ? <Link href="/auth/login" prefetch={false} className="text-[#d4a574] hover:text-[#ffa333] transition-colors font-bold ml-1">Se connecter</Link>
          </p>

          {/* ── PARIS MANIFESTO LINK ── */}
          <p className="mt-4 text-center text-[10px] text-white/15 relative z-10">
            Tu viens de la campagne Paris ? <Link href="/paris" prefetch={false} className="text-[#ffa333]/60 hover:text-[#ffa333] transition-colors">Retour au manifeste fondateur</Link>
          </p>
        </div>
      </ScrollReveal>
    </div>
  );
}
