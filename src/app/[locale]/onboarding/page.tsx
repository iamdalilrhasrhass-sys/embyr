"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const STEPS = ["identity", "preferences", "universe", "verify"] as const;
const STEP_LABELS = ["Identity", "Preferences", "Universe", "Verify"];

const GENDER_OPTIONS = [
  { value: "HOMME", label: "Homme", icon: "\u2642" },
  { value: "FEMME", label: "Femme", icon: "\u2640" },
  { value: "FEMME_TRANS", label: "Femme trans", icon: "\u2640" },
  { value: "TRAVESTI", label: "Travesti", icon: "\u26a7" },
  { value: "PERSONNE_FEMININE", label: "Personne feminine", icon: "\u2640" },
  { value: "COUPLE", label: "Couple", icon: "\u26ad" },
  { value: "AUTRE", label: "Autre", icon: "\u2726" },
];

const LOOKING_FOR_OPTIONS = [
  { value: "RENCONTRE_SERIEUSE", label: "Rencontre serieuse", icon: "\u2665" },
  { value: "DISCUSSION", label: "Discussion", icon: "\U0001F4AC" },
  { value: "RENCONTRE_DISCARTE", label: "Rencontre sans engagement", icon: "\u26a1" },
  { value: "AMITIE", label: "Amitie", icon: "\U0001F91D" },
  { value: "RELATION_LIBRE", label: "Relation libre", icon: "\U0001F513" },
  { value: "AUTRE", label: "Autre", icon: "\u2726" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    username: "",
    age: "",
    city: "",
    genderIdentity: "",
    lookingFor: "",
    description: "",
  });

  useEffect(() => {
    fetch("/api/profile/me", { credentials: "include" })
      .then((r) => {
        if (r.status === 401) {
          router.push("/auth/login?redirect=/onboarding");
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (d) {
          setForm({
            username: d.username || "",
            age: d.age ? String(d.age) : "",
            city: d.city || "",
            genderIdentity: d.genderIdentity || "",
            lookingFor: d.lookingFor || "",
            description: d.description || "",
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return form.username.length >= 3 && form.age && parseInt(form.age) >= 18;
      case 1:
        return !!form.genderIdentity && !!form.lookingFor;
      case 2:
        return form.description.length >= 20;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/profile/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Erreur");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
      setSaving(false);
      return false;
    }
    setSaving(false);
    return true;
  };

  const handleNext = async () => {
    if (step < STEPS.length - 1) {
      if (step === 1 || step === 2) {
        const ok = await saveProfile();
        if (!ok) return;
      }
      setStep(step + 1);
    } else {
      const ok = await saveProfile();
      if (ok) router.push("/welcome");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0614]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 rounded-full border-2 border-[#d4a574] border-t-transparent"
        />
      </div>
    );
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 bg-[#0a0614]">
      <div className="mx-auto max-w-lg mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#d4a574] to-[#ff5e36] flex items-center justify-center text-[#0a0614] font-black text-lg">E</div>
          <span className="text-xl font-bold text-white tracking-tight">Embir</span>
        </Link>
      </div>

      <div className="mx-auto max-w-lg mb-8">
        <div className="flex items-center justify-between mb-2">
          {STEP_LABELS.map((label, i) => (
            <span key={label} className={`text-xs font-medium transition-colors ${i <= step ? "text-[#d4a574]" : "text-white/20"}`}>{label}</span>
          ))}
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.4, ease: "easeOut" }} className="h-full bg-gradient-to-r from-[#d4a574] via-[#ff5e36] to-[#ff1f5a]" />
        </div>
      </div>

      <div className="mx-auto max-w-lg">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
            {step === 0 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-light text-white mb-2">Build your universe</h1>
                  <p className="text-sm text-white/40">Start with the basics. You can change these later.</p>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Username</label>
                  <input type="text" value={form.username} onChange={(e) => updateField("username", e.target.value)} placeholder="your_username" className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#d4a574]/40 focus:outline-none transition" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">Age</label>
                  <input type="number" min="18" max="99" value={form.age} onChange={(e) => updateField("age", e.target.value)} placeholder="25" className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#d4a574]/40 focus:outline-none transition" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">City</label>
                  <input type="text" value={form.city} onChange={(e) => updateField("city", e.target.value)} placeholder="Paris" className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#d4a574]/40 focus:outline-none transition" />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-light text-white mb-2">Your identity</h1>
                  <p className="text-sm text-white/40">How do you identify? This helps us show you the right people.</p>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/40 mb-3">I am</label>
                  <div className="grid grid-cols-2 gap-3">
                    {GENDER_OPTIONS.map((opt) => (
                      <button key={opt.value} onClick={() => updateField("genderIdentity", opt.value)} className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition ${form.genderIdentity === opt.value ? "border-[#d4a574] bg-[#d4a574]/10 text-white" : "border-white/[0.08] bg-white/[0.02] text-white/50 hover:border-white/15"}`}>
                        <span className="text-lg">{opt.icon}</span>
                        <span className="text-sm font-medium">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/40 mb-3">I&apos;m looking for</label>
                  <div className="grid grid-cols-2 gap-3">
                    {LOOKING_FOR_OPTIONS.map((opt) => (
                      <button key={opt.value} onClick={() => updateField("lookingFor", opt.value)} className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition ${form.lookingFor === opt.value ? "border-[#ff5e36] bg-[#ff5e36]/10 text-white" : "border-white/[0.08] bg-white/[0.02] text-white/50 hover:border-white/15"}`}>
                        <span className="text-lg">{opt.icon}</span>
                        <span className="text-sm font-medium">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-light text-white mb-2">Your universe</h1>
                  <p className="text-sm text-white/40">This is your story. What makes you, you? Be authentic.</p>
                </div>
                <div>
                  <textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} placeholder="I love deep conversations, spontaneous city walks, and building real connections..." rows={6} maxLength={500} className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#d4a574]/40 focus:outline-none transition resize-none" />
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-white/30">Min 20 characters</span>
                    <span className="text-xs text-white/30">{form.description.length}/500</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-[#d4a574]/15 bg-[#d4a574]/[0.04] p-4">
                  <p className="text-xs text-[#d4a574] font-semibold uppercase tracking-wider mb-1">Tip</p>
                  <p className="text-sm text-white/50">Your universe is what sets you apart. Instead of listing hobbies, describe how you see the world.</p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 text-center">
                <div>
                  <h1 className="text-3xl font-light text-white mb-2">Verify your universe</h1>
                  <p className="text-sm text-white/40">Verified profiles get 10x more connections.</p>
                </div>
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-[#d4a574]/20 to-[#ff5e36]/20 flex items-center justify-center">
                  <span className="text-5xl">{"\u2713"}</span>
                </motion.div>
                <div className="space-y-3">
                  <Link href="/verification" className="block w-full px-6 py-4 rounded-xl bg-[#d4a574] text-[#0a0614] font-bold text-center hover:bg-[#e8c4a2] transition">Verify now with a selfie</Link>
                  <button onClick={handleNext} className="block w-full px-6 py-4 rounded-xl border border-white/10 text-white/60 font-medium hover:border-white/20 transition">I&apos;ll do it later</button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 rounded-xl border border-[#ff1f5a]/30 bg-[#ff1f5a]/10 p-3 text-sm text-[#ff1f5a]">{error}</motion.div>
        )}

        {step < 3 && (
          <div className="mt-8 flex items-center justify-between">
            {step > 0 ? (
              <button onClick={() => setStep(step - 1)} className="px-5 py-3 text-sm text-white/40 hover:text-white/70 transition">Back</button>
            ) : (
              <span />
            )}
            <button onClick={handleNext} disabled={!canProceed() || saving} className={`px-8 py-3 rounded-full font-bold text-sm transition ${canProceed() && !saving ? "bg-[#d4a574] text-[#0a0614] hover:bg-[#e8c4a2]" : "bg-white/5 text-white/20 cursor-not-allowed"}`}>
              {saving ? "Saving..." : step === 2 ? "Save & continue" : "Continue"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
