"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import EmbirLogo from "@/components/brand/EmbirLogo";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "login" | "register";
}

export default function AuthModal({ isOpen, onClose, initialTab = "login" }: AuthModalProps) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">(initialTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdult, setIsAdult] = useState(false);
  const [acceptCGU, setAcceptCGU] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const resetForm = useCallback(() => {
    setEmail("");
    setPassword("");
    setIsAdult(false);
    setAcceptCGU(false);
    setError("");
    setLoading(false);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleLogin = async (e: React.FormEvent) => {
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
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isAdult) {
      setError(t("register") === "Inscription"
        ? "Vous devez certifier être majeur(e)."
        : "You must certify you are 18+.");
      return;
    }
    if (!acceptCGU) {
      setError(t("register") === "Inscription"
        ? "Vous devez accepter les conditions."
        : "You must accept the terms.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, isAdult, acceptTerms: acceptCGU, acceptPrivacy: acceptCGU }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" />

      {/* Modal card */}
      <div className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/[0.08] bg-[#0d0816] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.5)]">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all"
          aria-label={t("close")}
        >
          ✕
        </button>

        {/* Logo */}
        <EmbirLogo size="lg" variant="mark" className="mx-auto mb-4 flex justify-center" />

        {/* Tabs */}
        <div className="flex rounded-2xl bg-white/[0.03] p-1 mb-8">
          <button
            onClick={() => { setTab("login"); resetForm(); }}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
              tab === "login"
                ? "bg-[#d4a574] text-[#0a0614]"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            {t("login_tab")}
          </button>
          <button
            onClick={() => { setTab("register"); resetForm(); }}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
              tab === "register"
                ? "bg-[#d4a574] text-[#0a0614]"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            {t("register_tab")}
          </button>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-serif font-light text-white text-center mb-6">
          {tab === "login" ? t("welcome_back") : t("join_embir")}
        </h2>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-sm font-medium text-red-400">
            {error}
          </div>
        )}

        {/* Login form */}
        {tab === "login" && (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-white/40">
                {t("email")}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4 text-white backdrop-blur-xl transition-all placeholder:text-white/15 focus:border-[#d4a574]/40 focus:outline-none focus:ring-1 focus:ring-[#d4a574]/30"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-white/40">
                {t("password")}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4 text-white backdrop-blur-xl transition-all placeholder:text-white/15 focus:border-[#d4a574]/40 focus:outline-none focus:ring-1 focus:ring-[#d4a574]/30"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-r from-[#ff1f5a] via-[#ff5e36] to-[#ffa333] px-8 py-4 text-sm font-bold text-white shadow-[0_12px_40px_rgba(255,31,90,0.3)] transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? "..." : t("loginBtn")}
            </button>
            <p className="text-center text-sm text-white/25">
              {t("noAccount")}{" "}
              <button
                type="button"
                onClick={() => { setTab("register"); resetForm(); }}
                className="font-bold text-[#d4a574] hover:text-white transition-colors"
              >
                {t("registerBtn")}
              </button>
            </p>
          </form>
        )}

        {/* Register form */}
        {tab === "register" && (
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-white/40">
                {t("email")}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4 text-white backdrop-blur-xl transition-all placeholder:text-white/15 focus:border-[#d4a574]/40 focus:outline-none focus:ring-1 focus:ring-[#d4a574]/30"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-white/40">
                {t("password")}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4 text-white backdrop-blur-xl transition-all placeholder:text-white/15 focus:border-[#d4a574]/40 focus:outline-none focus:ring-1 focus:ring-[#d4a574]/30"
              />
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isAdult}
                onChange={(e) => setIsAdult(e.target.checked)}
                className="mt-0.5 accent-[#d4a574]"
              />
              <span className="text-xs text-white/40">
                {t("register") === "Inscription"
                  ? "Je certifie avoir 18 ans ou plus."
                  : "I certify that I am 18 years or older."}
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptCGU}
                onChange={(e) => setAcceptCGU(e.target.checked)}
                className="mt-0.5 accent-[#d4a574]"
              />
              <span className="text-xs text-white/40">
                {t("register") === "Inscription"
                  ? "J'accepte les conditions d'utilisation et la politique de confidentialité."
                  : "I accept the Terms of Service and Privacy Policy."}
              </span>
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-r from-[#ff1f5a] via-[#ff5e36] to-[#ffa333] px-8 py-4 text-sm font-bold text-white shadow-[0_12px_40px_rgba(255,31,90,0.3)] transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? "..." : t("registerBtn")}
            </button>
            <p className="text-center text-sm text-white/25">
              {t("hasAccount")}{" "}
              <button
                type="button"
                onClick={() => { setTab("login"); resetForm(); }}
                className="font-bold text-[#d4a574] hover:text-white transition-colors"
              >
                {t("loginBtn")}
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
