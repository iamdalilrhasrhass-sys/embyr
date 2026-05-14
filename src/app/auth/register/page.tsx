"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdult, setIsAdult] = useState(false);
  const [acceptCGU, setAcceptCGU] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isAdult) {
      setError("Vous devez certifier être majeur(e) pour vous inscrire.");
      return;
    }
    if (!acceptCGU) {
      setError("Vous devez accepter les Conditions Générales d'Utilisation.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, isAdult, acceptCGU }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'inscription");
      }

      router.push("/dashboard/profile");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[var(--color-premium-dark)]">
      <div className="absolute inset-0 noise-overlay"></div>
      <div className="absolute inset-0 soft-grid-bg opacity-30"></div>
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-[var(--color-premium-rose)]/10 rounded-full blur-[100px] animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-[var(--color-premium-purple)]/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <Reveal direction="up" className="w-full max-w-md z-10 py-12">
        <TiltCard tiltScale={0.3}>
          <div className="glass-premium w-full p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden border border-[var(--color-premium-rose)]/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--color-premium-rose)]/10 rounded-full blur-[50px]"></div>
            
            <h1 className="text-4xl font-extrabold mb-3 drop-shadow-md tracking-tight">Rejoindre <span className="text-gradient">Embyr</span></h1>
            <p className="text-[var(--color-premium-gray)] mb-8 font-medium">L'élégance et la confidentialité.</p>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm font-medium backdrop-blur-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="group">
                <label className="block text-sm font-bold text-gray-300 mb-2 group-focus-within:text-[var(--color-premium-rose)] transition-colors">Email</label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-[var(--color-premium-rose)] focus:ring-1 focus:ring-[var(--color-premium-rose)]/50 transition-all text-white shadow-inner"
                  placeholder="votre@email.com"
                />
              </div>
              <div className="group">
                <label className="block text-sm font-bold text-gray-300 mb-2 group-focus-within:text-[var(--color-premium-rose)] transition-colors">Mot de passe</label>
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-[var(--color-premium-rose)] focus:ring-1 focus:ring-[var(--color-premium-rose)]/50 transition-all text-white shadow-inner"
                  placeholder="••••••••"
                />
                <p className="text-xs text-[var(--color-premium-gray)]/60 mt-2 font-medium">8 caractères minimum.</p>
              </div>

              <div className="space-y-4 pt-2">
                <label className="flex items-start space-x-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5 mt-0.5">
                    <input 
                      type="checkbox" 
                      checked={isAdult}
                      onChange={(e) => setIsAdult(e.target.checked)}
                      className="peer appearance-none w-5 h-5 border border-white/20 rounded bg-black/40 checked:bg-[var(--color-premium-rose)] checked:border-[var(--color-premium-rose)] transition-colors"
                    />
                    <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors leading-relaxed">
                    Embyr est réservé aux personnes majeures. En créant un compte, vous certifiez avoir 18 ans ou plus.
                  </span>
                </label>
                
                <label className="flex items-start space-x-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5 mt-0.5">
                    <input 
                      type="checkbox" 
                      checked={acceptCGU}
                      onChange={(e) => setAcceptCGU(e.target.checked)}
                      className="peer appearance-none w-5 h-5 border border-white/20 rounded bg-black/40 checked:bg-[var(--color-premium-rose)] checked:border-[var(--color-premium-rose)] transition-colors"
                    />
                    <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors leading-relaxed">
                    J'accepte les <Link href="/legal/cgu" className="text-[var(--color-premium-rose)] hover:text-white font-bold transition-colors">Conditions Générales d'Utilisation</Link> et la <Link href="/legal/confidentialite" className="text-[var(--color-premium-rose)] hover:text-white font-bold transition-colors">politique de confidentialité</Link>.
                  </span>
                </label>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-premium text-white font-bold text-lg py-4 rounded-2xl hover:shadow-[0_0_20px_rgba(244,63,143,0.4)] transition-all disabled:opacity-50 mt-4 premium-glow hover:scale-[1.02]"
              >
                {loading ? "Création..." : "Créer mon compte"}
              </button>
            </form>

            <p className="text-center mt-8 text-sm text-gray-400 font-medium">
              Déjà un compte ? <Link href="/auth/login" className="text-[var(--color-premium-rose)] hover:text-white transition-colors font-bold ml-1">Se connecter</Link>
            </p>
          </div>
        </TiltCard>
      </Reveal>
    </div>
  );
}