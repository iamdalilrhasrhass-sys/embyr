"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  // Lock body scroll when open
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isOpen]);

  // Trap focus, close on Escape and restore focus to the opening control.
  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const focusableSelector =
      'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';
    const focusTimer = window.requestAnimationFrame(() => {
      dialogRef.current?.querySelector<HTMLElement>(focusableSelector)?.focus();
    });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      );
      if (focusable.length === 0) {
        e.preventDefault();
        dialogRef.current.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable.at(-1);
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.cancelAnimationFrame(focusTimer);
      window.removeEventListener("keydown", onKey);
      previousFocus?.focus();
    };
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
      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
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
      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error || "Registration failed");
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
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
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="embir-auth-title"
        tabIndex={-1}
        className="relative z-10 max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-[2rem] border border-white/[0.08] bg-embir-raised p-6 shadow-[0_40px_120px_rgba(0,0,0,0.5)] sm:p-8"
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          type="button"
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/40 transition-all hover:border-white/20 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-embir-blush"
          aria-label={t("close")}
        >
          ✕
        </button>

        {/* Logo */}
        <EmbirLogo size="lg" variant="mark" decorative className="mx-auto mb-4 flex justify-center" />

        {/* Tabs */}
        <div className="mb-8 flex rounded-2xl bg-white/[0.03] p-1" role="tablist" aria-label={t("login_tab")}>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "login"}
            onClick={() => { setTab("login"); resetForm(); }}
            className={`min-h-11 flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${
              tab === "login"
                ? "bg-embir-rose text-embir-void"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            {t("login_tab")}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "register"}
            onClick={() => { setTab("register"); resetForm(); }}
            className={`min-h-11 flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${
              tab === "register"
                ? "bg-embir-rose text-embir-void"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            {t("register_tab")}
          </button>
        </div>

        {/* Title */}
        <h2 id="embir-auth-title" className="mb-6 text-center font-serif text-2xl font-light text-white">
          {tab === "login" ? t("welcome_back") : t("join_embir")}
        </h2>

        {/* Error */}
        {error && (
          <div id="embir-auth-error" role="alert" className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-sm font-medium text-red-400">
            {error}
          </div>
        )}

        {/* Login form */}
        {tab === "login" && (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="embir-login-email" className="mb-2 block text-sm font-bold text-white/40">
                {t("email")}
              </label>
              <input
                id="embir-login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "embir-auth-error" : undefined}
                placeholder="votre@email.com"
                className="w-full rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4 text-white backdrop-blur-xl transition-all placeholder:text-white/15 focus:border-embir-rose/40 focus:outline-none focus:ring-1 focus:ring-embir-rose/30"
              />
            </div>
            <div>
              <label htmlFor="embir-login-password" className="mb-2 block text-sm font-bold text-white/40">
                {t("password")}
              </label>
              <input
                id="embir-login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "embir-auth-error" : undefined}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4 text-white backdrop-blur-xl transition-all placeholder:text-white/15 focus:border-embir-rose/40 focus:outline-none focus:ring-1 focus:ring-embir-rose/30"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-r from-embir-rose-deep via-embir-rose to-embir-blush px-8 py-4 text-sm font-bold text-embir-void shadow-[var(--shadow-brand)] transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? "..." : t("loginBtn")}
            </button>
            <p className="text-center text-sm text-white/25">
              {t("noAccount")}{" "}
              <button
                type="button"
                onClick={() => { setTab("register"); resetForm(); }}
                className="min-h-11 rounded-lg px-2 font-bold text-embir-rose transition-colors hover:text-white"
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
              <label htmlFor="embir-register-email" className="mb-2 block text-sm font-bold text-white/40">
                {t("email")}
              </label>
              <input
                id="embir-register-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "embir-auth-error" : undefined}
                placeholder="votre@email.com"
                className="w-full rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4 text-white backdrop-blur-xl transition-all placeholder:text-white/15 focus:border-embir-rose/40 focus:outline-none focus:ring-1 focus:ring-embir-rose/30"
              />
            </div>
            <div>
              <label htmlFor="embir-register-password" className="mb-2 block text-sm font-bold text-white/40">
                {t("password")}
              </label>
              <input
                id="embir-register-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "embir-auth-error" : undefined}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4 text-white backdrop-blur-xl transition-all placeholder:text-white/15 focus:border-embir-rose/40 focus:outline-none focus:ring-1 focus:ring-embir-rose/30"
              />
            </div>
            <label className="flex min-h-11 cursor-pointer items-start gap-3 py-2">
              <input
                type="checkbox"
                checked={isAdult}
                onChange={(e) => setIsAdult(e.target.checked)}
                className="mt-0.5 h-5 w-5 accent-embir-rose"
              />
              <span className="text-xs text-white/40">
                {t("register") === "Inscription"
                  ? "Je certifie avoir 18 ans ou plus."
                  : "I certify that I am 18 years or older."}
              </span>
            </label>
            <label className="flex min-h-11 cursor-pointer items-start gap-3 py-2">
              <input
                type="checkbox"
                checked={acceptCGU}
                onChange={(e) => setAcceptCGU(e.target.checked)}
                className="mt-0.5 h-5 w-5 accent-embir-rose"
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
              className="w-full rounded-full bg-gradient-to-r from-embir-rose-deep via-embir-rose to-embir-blush px-8 py-4 text-sm font-bold text-embir-void shadow-[var(--shadow-brand)] transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? "..." : t("registerBtn")}
            </button>
            <p className="text-center text-sm text-white/25">
              {t("hasAccount")}{" "}
              <button
                type="button"
                onClick={() => { setTab("login"); resetForm(); }}
                className="min-h-11 rounded-lg px-2 font-bold text-embir-rose transition-colors hover:text-white"
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
