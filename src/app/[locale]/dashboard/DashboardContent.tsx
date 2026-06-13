"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface UserData {
  id: string;
  email: string;
  emailVerified: boolean;
  phone?: string;
  phoneVerified?: boolean;
  role: string;
  profile?: {
    id: string;
    username: string;
    displayName: string | null;
    isPremium: boolean;
  };
}

interface NotificationPrefs {
  smsEnabled: boolean;
  inAppEnabled: boolean;
}

export default function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  // Phone verification state
  const [phone, setPhone] = useState("");
  const [phoneStep, setPhoneStep] = useState<"idle" | "sending" | "sent" | "verifying" | "done">("idle");
  const [smsCode, setSmsCode] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [countdown, setCountdown] = useState(0);

  // Notification prefs state
  const [prefs, setPrefs] = useState<NotificationPrefs>({ smsEnabled: true, inAppEnabled: true });
  const [prefsLoaded, setPrefsLoaded] = useState(false);

  useEffect(() => {
    const checkoutSuccess = searchParams.get("checkout");
    if (checkoutSuccess === "success") {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
      router.replace("/dashboard");
    }
  }, [searchParams, router]);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push("/auth/login");
        } else {
          setUser(data.user);
          if (data.user.phone) setPhone(data.user.phone);
          if (data.user.phoneVerified) setPhoneStep("done");
        }
      })
      .catch(() => router.push("/auth/login"))
      .finally(() => setLoading(false));
  }, [router]);

  // Load notification preferences
  useEffect(() => {
    fetch("/api/notifications/preferences")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPrefs(data.preferences);
          setPrefsLoaded(true);
          if (data.phone) setPhone(data.phone);
          if (data.phoneVerified) setPhoneStep("done");
        }
      })
      .catch(() => {});
  }, []);

  // Countdown for resend
  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const handlePhoneSubmit = async () => {
    const phoneClean = phone.replace(/\s/g, "").replace(/\./g, "");
    const frenchPhoneRegex = /^(0[1-9]\d{8}|\+33[1-9]\d{8})$/;
    if (!frenchPhoneRegex.test(phoneClean)) {
      setPhoneError("Numéro français invalide (ex: 0612345678)");
      return;
    }

    setPhoneError("");
    setPhoneStep("sending");

    try {
      const res = await fetch("/api/sms/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneClean }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPhoneError(data.error || "Erreur d'envoi");
        setPhoneStep("idle");
        return;
      }
      setPhoneStep("sent");
      setCountdown(60);

      // Dev mode auto-fill
      if (data.devCode) setSmsCode(data.devCode);
    } catch {
      setPhoneError("Erreur réseau");
      setPhoneStep("idle");
    }
  };

  const handleVerifyCode = async () => {
    if (!smsCode || smsCode.length < 6) {
      setPhoneError("Code à 6 chiffres requis");
      return;
    }

    setPhoneStep("verifying");

    try {
      const res = await fetch("/api/sms/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: smsCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPhoneError(data.error || "Code invalide");
        setPhoneStep("sent");
        return;
      }
      setPhoneStep("done");
      setUser((prev) => (prev ? { ...prev, phone: phone, phoneVerified: true } : prev));
    } catch {
      setPhoneError("Erreur de vérification");
      setPhoneStep("sent");
    }
  };

  const handleToggleSms = async (enabled: boolean) => {
    const newPrefs = { ...prefs, smsEnabled: enabled };
    setPrefs(newPrefs);
    await fetch("/api/notifications/preferences", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPrefs),
    });
  };

  const handleLogout = async () => {
    document.cookie = "token=; Path=/; Max-Age=0";
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="font-mono text-[6px] tracking-[0.3em] text-white/75 uppercase">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <div className="grain" />

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl"
            style={{
              background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(236,72,153,0.1))",
              border: "1px solid rgba(139,92,246,0.1)",
              backdropFilter: "blur(20px)",
            }}
          >
            <span className="font-body text-xs text-white/70">
              ✅ Paiement confirmé — Bienvenue sur Embir Premium !
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="px-6 py-4 border-b" style={{ borderColor: "rgba(139,92,246,0.04)" }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-[6px] flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6366F1, #06B6D4)" }}
            >
              <span className="font-display font-bold text-[10px] text-white">F</span>
            </div>
            <span className="font-body text-xs font-medium text-white/85 tracking-wider">Embir</span>
          </Link>
          <div className="flex items-center gap-6">
            {user?.profile?.isPremium && (
              <span className="font-mono text-[6px] tracking-[0.3em] text-gold-light/60 uppercase">Premium</span>
            )}
            <button
              onClick={handleLogout}
              className="text-[7px] font-mono tracking-[0.25em] text-white/75 hover:text-rose-light transition-all duration-300 uppercase cursor-pointer"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[6px] font-mono tracking-[0.35em] uppercase mb-6"
            style={{ background: "rgba(139,92,246,0.02)", border: "1px solid rgba(139,92,246,0.06)", color: "#A78BFA" }}>
            <div className="w-1 h-1 rounded-full bg-violet" /> Mon compte
          </div>

          <h1 className="font-serif text-[clamp(2.5rem,8vw,4rem)] font-normal tracking-tight leading-[0.9] italic mb-4"
            style={{ background: "linear-gradient(135deg, #F5F5F5 60%, #A78BFA 80%, #F472B6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Bienvenue{user?.profile?.username ? `, ${user.profile.username}` : ""}.
          </h1>

          <p className="font-body text-sm text-white/75 font-light mb-12 tracking-wide">
            Connecté en tant que {user?.email}
          </p>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="rounded-2xl p-5" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.025), transparent)", border: "1px solid rgba(139,92,246,0.04)" }}>
              <div className="font-mono text-[6px] tracking-[0.3em] uppercase text-white/80 mb-2">Statut</div>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${user?.profile?.isPremium ? "bg-gold-light" : "bg-white/10"}`} />
                <span className="font-body text-xs text-white/85">{user?.profile?.isPremium ? "Premium ✦" : "Compte gratuit"}</span>
              </div>
            </div>

            <div className="rounded-2xl p-5" style={{ background: "linear-gradient(135deg, rgba(236,72,153,0.025), transparent)", border: "1px solid rgba(236,72,153,0.015)" }}>
              <div className="font-mono text-[6px] tracking-[0.3em] uppercase text-white/80 mb-2">Profil</div>
              <span className="font-body text-xs text-white/85">{user?.profile?.username || "À compléter"}</span>
            </div>

            <div className="rounded-2xl p-5" style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.025), transparent)", border: "1px solid rgba(212,175,55,0.015)" }}>
              <div className="font-mono text-[6px] tracking-[0.3em] uppercase text-white/80 mb-2">Téléphone</div>
              <span className="font-body text-xs text-white/85">
                {phoneStep === "done" ? "✅ Vérifié" : (user?.phone || "Non vérifié")}
              </span>
            </div>
          </div>

          {/* ═══════ PHONE VERIFICATION ═══════ */}
          {phoneStep !== "done" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md rounded-2xl p-6 mb-8"
              style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.025), rgba(10,10,15,0.2))", border: "1px solid rgba(139,92,246,0.04)" }}
            >
              <div className="font-serif text-sm italic text-white/85 mb-1">📱 Vérifie ton téléphone</div>
              <p className="font-body text-[8px] text-white/80 font-light mb-4 tracking-wider">
                Obligatoire pour sécuriser ton compte. Le SMS est gratuit.
              </p>

              {phoneStep === "idle" || phoneStep === "sending" ? (
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0612345678"
                    className="flex-1 bg-transparent px-3 py-2 rounded-xl text-xs text-white/850 font-body outline-none"
                    style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                    disabled={phoneStep === "sending"}
                  />
                  <button
                    onClick={handlePhoneSubmit}
                    disabled={phoneStep === "sending" || !phone}
                    className="px-4 py-2 rounded-xl text-[7px] font-mono tracking-wider cursor-pointer disabled:opacity-30"
                    style={{ background: "linear-gradient(135deg, #6366F1, #06B6D4)", color: "white" }}
                  >
                    {phoneStep === "sending" ? "..." : "Envoyer"}
                  </button>
                </div>
              ) : phoneStep === "sent" || phoneStep === "verifying" ? (
                <div>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={smsCode}
                      onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="Code à 6 chiffres"
                      maxLength={6}
                      className="flex-1 bg-transparent px-3 py-2 rounded-xl text-xs text-white/850 font-body outline-none tracking-[0.3em] text-center"
                      style={{ border: "1px solid rgba(255,255,255,0.06)", letterSpacing: "0.5em" }}
                      disabled={phoneStep === "verifying"}
                    />
                    <button
                      onClick={handleVerifyCode}
                      disabled={phoneStep === "verifying" || smsCode.length < 6}
                      className="px-4 py-2 rounded-xl text-[7px] font-mono tracking-wider cursor-pointer disabled:opacity-30"
                      style={{ background: "linear-gradient(135deg, #6366F1, #06B6D4)", color: "white" }}
                    >
                      {phoneStep === "verifying" ? "..." : "Vérifier"}
                    </button>
                  </div>
                  <button
                    onClick={handlePhoneSubmit}
                    disabled={countdown > 0}
                    className="font-mono text-[6px] tracking-wider text-rose-light/60 hover:text-rose-light transition-all duration-300 cursor-pointer disabled:opacity-20"
                  >
                    {countdown > 0 ? `Renvoyer dans ${countdown}s` : "Renvoyer le code"}
                  </button>
                </div>
              ) : null}

              {phoneError && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="font-mono text-[6px] text-red-400/40 tracking-wider mt-2">{phoneError}</motion.p>
              )}
            </motion.div>
          )}

          {/* ═══════ NOTIFICATION SETTINGS ═══════ */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-md rounded-2xl p-6 mb-8"
            style={{ background: "linear-gradient(135deg, rgba(236,72,153,0.015), rgba(10,10,15,0.2))", border: "1px solid rgba(236,72,153,0.015)" }}
          >
            <div className="font-serif text-sm italic text-white/85 mb-4">🔔 Notifications</div>

            {/* SMS toggle */}
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="font-body text-[9px] text-white/85 font-medium">Notifications SMS</div>
                <div className="font-mono text-[6px] text-white/80 tracking-wider mt-0.5">
                  Reçois un SMS pour les messages importants
                </div>
              </div>
              <button
                onClick={() => handleToggleSms(!prefs.smsEnabled)}
                className={`relative w-10 h-5 rounded-full transition-all duration-300 cursor-pointer ${prefs.smsEnabled ? "bg-gradient-to-r from-violet to-pink" : "bg-white/8"}`}
                style={{ background: prefs.smsEnabled ? "linear-gradient(135deg, #6366F1, #06B6D4)" : "rgba(255,255,255,0.06)" }}
              >
                <motion.div
                  className="absolute top-0.5 w-4 h-4 bg-white rounded-full"
                  animate={{ x: prefs.smsEnabled ? 20 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            <div className="h-[1px] bg-white/[0.02] my-2" />

            {/* In-app toggle */}
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="font-body text-[9px] text-white/85 font-medium">Notifications in-app</div>
                <div className="font-mono text-[6px] text-white/80 tracking-wider mt-0.5">
                  Toujours actif — notifications sur la plateforme
                </div>
              </div>
              <div className="w-10 h-5 rounded-full flex items-center justify-center cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #6366F1, #06B6D4)", opacity: 0.5 }}>
                <motion.div className="w-4 h-4 bg-white rounded-full" style={{ x: 20 }} />
              </div>
            </div>

            <p className="font-mono text-[5px] text-white/80 tracking-wider mt-3">
              💡 Les notifications in-app sont toujours actives. Les SMS peuvent être désactivés à tout moment.
            </p>
          </motion.div>

          {/* Premium upsell */}
          {!user?.profile?.isPremium && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-sm rounded-2xl p-6 text-center"
              style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.035), rgba(236,72,153,0.025))", border: "1px solid rgba(139,92,246,0.02)" }}
            >
              <div className="font-serif text-base italic text-white/85 mb-2">Premium arrive bientôt ✦</div>
              <p className="font-body text-[9px] text-white/80 mb-4 font-light">
                Avantages exclusifs pour les membres fondateurs.
              </p>
              <button
                onClick={() => router.push("/premium")}
                className="px-6 py-2 rounded-xl text-[8px] font-mono tracking-wider transition-all duration-300 cursor-pointer"
                style={{ background: "linear-gradient(135deg, #6366F1, #06B6D4)", color: "white" }}
              >
                En savoir plus →
              </button>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
