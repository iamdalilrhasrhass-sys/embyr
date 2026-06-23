"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ── Étapes de l'onboarding multi-orientation ──
// 0: Identité (username, age, city)
// 1: Genre (single select)
// 2: Orientation (single select)
// 3: Recherche / seekingGenders (multi select)
// 4: Envies / intentions (multi select)
// 5: Univers (description)
// 6: Vérification
const TOTAL_STEPS = 7;
const STEP_LABELS = [
  "Identité",
  "Genre",
  "Orientation",
  "Recherche",
  "Envies",
  "Univers",
  "Vérif",
];

// ── Options de genre (GENDER_VALUES) ──
// Servent à la fois pour l'identité (single) et la recherche (multi).
const GENDER_OPTIONS = [
  { value: "HOMME", label: "Homme", icon: "♂" },
  { value: "FEMME", label: "Femme", icon: "♀" },
  { value: "FEMME_TRANS", label: "Femme trans", icon: "⚧" },
  { value: "TRAVESTI", label: "Travesti", icon: "⚥" },
  { value: "PERSONNE_FEMININE", label: "Personne féminine", icon: "♀" },
  { value: "COUPLE", label: "Couple", icon: "⚭" },
  { value: "AUTRE", label: "Autre", icon: "✦" },
];

// ── Options d'orientation (ORIENTATIONS) ──
const ORIENTATION_OPTIONS = [
  { value: "HETERO", label: "Hétéro", icon: "⚤" },
  { value: "HOMOSEXUEL", label: "Homosexuel", icon: "⚣" },
  { value: "LESBIENNE", label: "Lesbienne", icon: "⚢" },
  { value: "BI", label: "Bi", icon: "⚥" },
  { value: "QUEER", label: "Queer", icon: "✦" },
  { value: "PAN", label: "Pan", icon: "♥" },
  { value: "FLUIDE", label: "Fluide", icon: "〰" },
  { value: "DEMI", label: "Demi", icon: "◐" },
  { value: "ASEXUEL", label: "Asexuel", icon: "♠" },
  { value: "AUTRE", label: "Autre", icon: "✧" },
];

// ── Options d'envies / intentions (INTENTS) ──
const INTENT_OPTIONS = [
  { value: "AMOUR", label: "Amour", icon: "♥", desc: "Une relation amoureuse sérieuse" },
  { value: "AMIS", label: "Amis", icon: "🤝", desc: "Rencontrer de nouvelles personnes" },
  { value: "FUN", label: "Fun", icon: "⚡", desc: "S’amuser, faire la fête" },
  { value: "PLAN_CUL", label: "Plan cul", icon: "🔥", desc: "Rencontres sans engagement" },
  { value: "SPORT", label: "Sport", icon: "⚽", desc: "Trouver des partenaires sportifs" },
  { value: "EVENEMENTS", label: "Événements", icon: "🎉", desc: "Créer et participer à des events" },
  { value: "DISCUSSION", label: "Discussion", icon: "💬", desc: "Discuter, échanger" },
  { value: "AUTRE", label: "Autre", icon: "✦", desc: "Quelque chose d’autre" },
];

type FormState = {
  username: string;
  age: string;
  city: string;
  genderIdentity: string;
  orientation: string;
  seekingGenders: string[];
  intentions: string[];
  description: string;
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<FormState>({
    username: "",
    age: "",
    city: "",
    genderIdentity: "",
    orientation: "",
    seekingGenders: [],
    intentions: [],
    description: "",
  });

  // ── Chargement initial du profil ──
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
            orientation: d.orientation || "",
            seekingGenders: Array.isArray(d.seekingGenders) ? d.seekingGenders : [],
            intentions: Array.isArray(d.intentions) ? d.intentions : [],
            description: d.description || "",
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  // ── Mise à jour d'un champ scalaire ──
  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ── Toggle d'une valeur dans un champ tableau (multi-sélection) ──
  const toggleArrayValue = (
    field: "seekingGenders" | "intentions",
    value: string
  ) => {
    setForm((prev) => {
      const current = prev[field];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [field]: next };
    });
  };

  // ── Validation par étape ──
  const canProceed = () => {
    switch (step) {
      case 0:
        return form.username.length >= 3 && !!form.age && parseInt(form.age) >= 18;
      case 1:
        return !!form.genderIdentity;
      case 2:
        return !!form.orientation;
      case 3:
        return form.seekingGenders.length >= 1;
      case 4:
        return form.intentions.length >= 1;
      case 5:
        return form.description.length >= 20;
      case 6:
        return true;
      default:
        return false;
    }
  };

  // ── Construction du payload (uniquement les champs remplis) ──
  // On n'envoie que les champs renseignés pour ne pas écraser les
  // données existantes lors des sauvegardes progressives.
  const buildPayload = (): Record<string, unknown> => {
    const payload: Record<string, unknown> = {};
    if (form.username) payload.username = form.username;
    if (form.age) payload.age = form.age;
    if (form.city) payload.city = form.city;
    if (form.genderIdentity) payload.genderIdentity = form.genderIdentity;
    if (form.orientation) payload.orientation = form.orientation;
    if (form.seekingGenders.length > 0) payload.seekingGenders = form.seekingGenders;
    if (form.intentions.length > 0) payload.intentions = form.intentions;
    if (form.description) payload.description = form.description;
    return payload;
  };

  // ── Sauvegarde progressive du profil ──
  const saveProfile = async (payload?: Record<string, unknown>) => {
    setSaving(true);
    setError("");
    try {
      const body = payload ?? buildPayload();
      const res = await fetch("/api/profile/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Erreur lors de la sauvegarde");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
      setSaving(false);
      return false;
    }
    setSaving(false);
    return true;
  };

  // ── Passage à l'étape suivante (avec sauvegarde progressive) ──
  const handleNext = async () => {
    if (step < TOTAL_STEPS - 1) {
      const ok = await saveProfile();
      if (!ok) return;
      setStep(step + 1);
    } else {
      router.push("/welcome");
    }
  };

  // ── État de chargement ──
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

  const progress = ((step + 1) / TOTAL_STEPS) * 100;
  const isLastStep = step === TOTAL_STEPS - 1;

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 bg-[#0a0614]">
      {/* ── Logo ── */}
      <div className="mx-auto max-w-lg mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#d4a574] to-[#ff5e36] flex items-center justify-center text-[#0a0614] font-black text-lg">
            E
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Embir</span>
        </Link>
      </div>

      {/* ── Barre de progression avec labels ── */}
      <div className="mx-auto max-w-lg mb-8">
        <div className="flex items-center justify-between mb-2 gap-1">
          {STEP_LABELS.map((label, i) => (
            <span
              key={label}
              className={`text-[10px] sm:text-xs font-medium transition-colors text-center ${
                i <= step ? "text-[#d4a574]" : "text-white/20"
              }`}
            >
              {label}
            </span>
          ))}
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-[#d4a574] via-[#ff5e36] to-[#ff1f5a]"
          />
        </div>
      </div>

      {/* ── Contenu de l'étape ── */}
      <div className="mx-auto max-w-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            {/* ── ÉTAPE 0 — IDENTITÉ ── */}
            {step === 0 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-light text-white mb-2">
                    Construis ton univers
                  </h1>
                  <p className="text-sm text-white/40">
                    Commence par les bases. Tu pourras tout modifier plus tard.
                  </p>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">
                    Pseudo
                  </label>
                  <input
                    type="text"
                    value={form.username}
                    onChange={(e) => updateField("username", e.target.value)}
                    placeholder="ton_pseudo"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#d4a574]/40 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">
                    Âge
                  </label>
                  <input
                    type="number"
                    min="18"
                    max="99"
                    value={form.age}
                    onChange={(e) => updateField("age", e.target.value)}
                    placeholder="25"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#d4a574]/40 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">
                    Ville
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    placeholder="Paris"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#d4a574]/40 focus:outline-none transition"
                  />
                </div>
              </div>
            )}

            {/* ── ÉTAPE 1 — GENRE ── */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-light text-white mb-2">
                    Comment t’identifies-tu ?
                  </h1>
                  <p className="text-sm text-white/40">
                    Ton genre nous aide à te montrer les bonnes personnes et à
                    activer le filtrage par orientation.
                  </p>
                </div>
                <div>
                  <div className="grid grid-cols-2 gap-3">
                    {GENDER_OPTIONS.map((opt) => {
                      const selected = form.genderIdentity === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => updateField("genderIdentity", opt.value)}
                          className={`flex items-center gap-3 px-4 py-4 rounded-xl border transition text-left ${
                            selected
                              ? "border-[#d4a574] bg-[#d4a574]/10 text-white"
                              : "border-white/[0.08] bg-white/[0.02] text-white/50 hover:border-white/15"
                          }`}
                        >
                          <span className="text-2xl">{opt.icon}</span>
                          <span className="text-sm font-medium">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── ÉTAPE 2 — ORIENTATION ── */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-light text-white mb-2">
                    Quelle est ton orientation ?
                  </h1>
                  <p className="text-sm text-white/40">
                    Filtrage strict : tu ne verras que les profils compatibles
                    avec ton orientation.
                  </p>
                </div>
                <div>
                  <div className="grid grid-cols-2 gap-3">
                    {ORIENTATION_OPTIONS.map((opt) => {
                      const selected = form.orientation === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => updateField("orientation", opt.value)}
                          className={`flex items-center gap-3 px-4 py-4 rounded-xl border transition text-left ${
                            selected
                              ? "border-[#d4a574] bg-[#d4a574]/10 text-white"
                              : "border-white/[0.08] bg-white/[0.02] text-white/50 hover:border-white/15"
                          }`}
                        >
                          <span className="text-2xl">{opt.icon}</span>
                          <span className="text-sm font-medium">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── ÉTAPE 3 — RECHERCHE (seekingGenders, multi) ── */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-light text-white mb-2">
                    Qui cherches-tu ?
                  </h1>
                  <p className="text-sm text-white/40">
                    Tu ne verras que les profils qui correspondent à ta recherche
                    ET qui te cherchent aussi. Tu peux en choisir plusieurs.
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase tracking-wider text-white/40">
                      Je recherche
                    </span>
                    <span className="text-xs text-[#ff5e36] font-medium">
                      {form.seekingGenders.length} sélectionné
                      {form.seekingGenders.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {GENDER_OPTIONS.map((opt) => {
                      const selected = form.seekingGenders.includes(opt.value);
                      return (
                        <button
                          key={opt.value}
                          onClick={() => toggleArrayValue("seekingGenders", opt.value)}
                          className={`relative flex items-center gap-3 px-4 py-4 rounded-xl border transition text-left ${
                            selected
                              ? "border-[#ff5e36] bg-[#ff5e36]/10 text-white"
                              : "border-white/[0.08] bg-white/[0.02] text-white/50 hover:border-white/15"
                          }`}
                        >
                          <span className="text-2xl">{opt.icon}</span>
                          <span className="text-sm font-medium">{opt.label}</span>
                          {selected && (
                            <span className="absolute top-2 right-2 text-[#ff5e36] text-sm">
                              ✓
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="rounded-2xl border border-[#ff5e36]/15 bg-[#ff5e36]/[0.04] p-4">
                  <p className="text-xs text-[#ff5e36] font-semibold uppercase tracking-wider mb-1">
                    Matching bidirectionnel
                  </p>
                  <p className="text-sm text-white/50">
                    Un hétéro ne verra jamais un profil gay, et inversement. Ce
                    filtre est au cœur du système Embir.
                  </p>
                </div>
              </div>
            )}

            {/* ── ÉTAPE 4 — ENVIES / INTENTIONS (multi) ── */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-light text-white mb-2">
                    Quelles sont tes envies ?
                  </h1>
                  <p className="text-sm text-white/40">
                    Sélectionne tout ce qui te parle. On te connectera à des
                    personnes qui partagent tes intentions.
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase tracking-wider text-white/40">
                      Mes envies
                    </span>
                    <span className="text-xs text-[#ff5e36] font-medium">
                      {form.intentions.length} sélectionné
                      {form.intentions.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {INTENT_OPTIONS.map((opt) => {
                      const selected = form.intentions.includes(opt.value);
                      return (
                        <button
                          key={opt.value}
                          onClick={() => toggleArrayValue("intentions", opt.value)}
                          className={`relative flex flex-col gap-1 px-4 py-4 rounded-xl border transition text-left ${
                            selected
                              ? "border-[#ff5e36] bg-[#ff5e36]/10 text-white"
                              : "border-white/[0.08] bg-white/[0.02] text-white/50 hover:border-white/15"
                          }`}
                        >
                          <span className="text-2xl">{opt.icon}</span>
                          <span className="text-sm font-semibold text-white">
                            {opt.label}
                          </span>
                          <span className="text-xs text-white/40">{opt.desc}</span>
                          {selected && (
                            <span className="absolute top-2 right-2 text-[#ff5e36] text-sm">
                              ✓
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── ÉTAPE 5 — UNIVERS (description) ── */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-light text-white mb-2">
                    Décris-toi en quelques mots
                  </h1>
                  <p className="text-sm text-white/40">
                    C’est ton histoire. Qu’est-ce qui fait de toi, toi ? Sois
                    authentique.
                  </p>
                </div>
                <div>
                  <textarea
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="J’aime les conversations profondes, les balades spontanées en ville, et créer de vraies connexions..."
                    rows={6}
                    maxLength={500}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#d4a574]/40 focus:outline-none transition resize-none"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-white/30">Minimum 20 caractères</span>
                    <span className="text-xs text-white/30">
                      {form.description.length}/500
                    </span>
                  </div>
                </div>
                <div className="rounded-2xl border border-[#d4a574]/15 bg-[#d4a574]/[0.04] p-4">
                  <p className="text-xs text-[#d4a574] font-semibold uppercase tracking-wider mb-1">
                    Astuce
                  </p>
                  <p className="text-sm text-white/50">
                    Décris tes passions et ton style. Les profils avec une description ont 3× plus de matchs. Mais tu peux passer cette étape si tu veux.
                  </p>
                </div>
              </div>
            )}

            {/* ── ÉTAPE 6 — VÉRIFICATION ── */}
            {step === 6 && (
              <div className="space-y-6 text-center">
                <div>
                  <h1 className="text-3xl font-light text-white mb-2">
                    Vérifie ton univers
                  </h1>
                  <p className="text-sm text-white/40">
                    Les profils vérifiés obtiennent 10x plus de connexions.
                  </p>
                </div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-[#d4a574]/20 to-[#ff5e36]/20 flex items-center justify-center"
                >
                  <span className="text-5xl text-[#d4a574]">✓</span>
                </motion.div>
                <div className="space-y-3">
                  <Link
                    href="/verification"
                    className="block w-full px-6 py-4 rounded-xl bg-[#d4a574] text-[#0a0614] font-bold text-center hover:bg-[#e8c4a2] transition"
                  >
                    Vérifier maintenant avec un selfie
                  </Link>
                  <button
                    onClick={handleNext}
                    className="block w-full px-6 py-4 rounded-xl border border-white/10 text-white/60 font-medium hover:border-white/20 transition"
                  >
                    Je le ferai plus tard
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Message d'erreur ── */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 rounded-xl border border-[#ff1f5a]/30 bg-[#ff1f5a]/10 p-3 text-sm text-[#ff1f5a]"
          >
            {error}
          </motion.div>
        )}

        {/* ── Navigation Back / Continue (cachée sur l'étape vérif) ── */}
        {!isLastStep && (
          <div className="mt-8 flex items-center justify-between">
            {step > 0 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-5 py-3 text-sm text-white/40 hover:text-white/70 transition"
              >
                Retour
              </button>
            ) : (
              <span />
            )}
            <button
              onClick={handleNext}
              disabled={!canProceed() || saving}
              className={`px-8 py-3 rounded-full font-bold text-sm transition ${
                canProceed() && !saving
                  ? "bg-[#d4a574] text-[#0a0614] hover:bg-[#e8c4a2]"
                  : "bg-white/5 text-white/20 cursor-not-allowed"
              }`}
            >
              {saving
                ? "Sauvegarde..."
                : step === 5
                ? "Enregistrer & continuer"
                : "Continuer"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
