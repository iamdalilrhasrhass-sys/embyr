"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  localePath,
  supportedLocale,
  type SupportedLocale,
} from "@/components/connection-os/types";

const TOTAL_STEPS = 8;

const GENDERS = [
  "HOMME",
  "FEMME",
  "FEMME_TRANS",
  "TRAVESTI",
  "PERSONNE_FEMININE",
  "COUPLE",
  "AUTRE",
] as const;
const ORIENTATIONS = [
  "HETERO",
  "HOMOSEXUEL",
  "LESBIENNE",
  "BI",
  "QUEER",
  "PAN",
  "FLUIDE",
  "DEMI",
  "ASEXUEL",
  "AUTRE",
] as const;
const INTENTS = [
  "AMOUR",
  "AMIS",
  "FUN",
  "PLAN_CUL",
  "SPORT",
  "EVENEMENTS",
  "DISCUSSION",
  "AUTRE",
] as const;
const ACTIVITIES = [
  "cinema",
  "music",
  "sport",
  "cooking",
  "travel",
  "gaming",
  "art",
  "nature",
  "reading",
  "dance",
  "photography",
  "volunteering",
] as const;

type Gender = (typeof GENDERS)[number];
type Orientation = (typeof ORIENTATIONS)[number];
type Intent = (typeof INTENTS)[number];
type Activity = (typeof ACTIVITIES)[number];

interface FormState {
  username: string;
  age: string;
  city: string;
  genderIdentity: Gender | "";
  orientation: Orientation | "";
  consentSensitiveData: boolean;
  seekingGenders: Gender[];
  acceptedIntents: Intent[];
  primaryIntent: Intent | "";
  activities: Activity[];
  seekingAgeMin: number;
  seekingAgeMax: number;
  seekingRadiusKm: number;
  description: string;
}

const initialForm: FormState = {
  username: "",
  age: "",
  city: "",
  genderIdentity: "",
  orientation: "",
  consentSensitiveData: false,
  seekingGenders: [],
  acceptedIntents: [],
  primaryIntent: "",
  activities: [],
  seekingAgeMin: 18,
  seekingAgeMax: 99,
  seekingRadiusKm: 50,
  description: "",
};

const copy = {
  fr: {
    stepLabels: [
      "Identité",
      "Genre",
      "Orientation",
      "Recherche",
      "Intentions",
      "Activités",
      "Distance",
      "Univers",
    ],
    progress: "Progression du profil",
    autosave: "Chaque étape est enregistrée",
    back: "Retour",
    next: "Enregistrer et continuer",
    finish: "Terminer mon profil",
    saving: "Enregistrement…",
    free: "Tout ce qu’il faut pour rencontrer quelqu’un est gratuit. Sans carte bancaire.",
    identityTitle: "Commençons par toi",
    identityBody:
      "Ces informations permettent de construire une sélection locale et adulte.",
    username: "Pseudo",
    age: "Âge",
    city: "Ville",
    genderTitle: "Comment t’identifies-tu ?",
    genderBody:
      "Choisis la formulation qui te correspond le mieux aujourd’hui.",
    orientationTitle: "Quelle est ton orientation ?",
    orientationBody:
      "Cette donnée sensible sert uniquement à appliquer tes préférences de rencontre.",
    consentTitle: "Mon choix, mon consentement",
    consentBody:
      "J’accepte qu’Embir utilise mon orientation et les genres recherchés uniquement pour proposer des profils réciproquement compatibles. Je peux modifier ou retirer ces préférences dans mon profil.",
    privacy: "Lire la politique de confidentialité",
    seekingTitle: "Qui souhaites-tu rencontrer ?",
    seekingBody:
      "La sélection respecte les préférences des deux personnes, pas seulement les tiennes.",
    selected: "sélectionné",
    intentsTitle: "Que veux-tu vivre maintenant ?",
    intentsBody:
      "Choisis plusieurs intentions si besoin, puis indique celle qui compte le plus aujourd’hui.",
    primary: "Intention principale",
    primaryHint:
      "Elle ordonne ta sélection sans masquer tes autres intentions.",
    activitiesTitle: "Qu’aimerais-tu partager ?",
    activitiesBody:
      "Les activités donnent des points d’accroche concrets pour une première réaction.",
    rangeTitle: "Ton cadre de rencontre",
    rangeBody:
      "Tu gardes le contrôle. Embir n’affiche jamais ta position précise.",
    ageRange: "Tranche d’âge recherchée",
    radius: "Rayon maximum",
    radiusHint: "La distance reste approximative côté public.",
    universeTitle: "Donne une voix à ton profil",
    universeBody: "Quelques phrases sincères valent mieux qu’une bio parfaite.",
    description: "Ta présentation",
    descriptionPlaceholder:
      "J’aime les conversations qui prennent leur temps, les balades spontanées et…",
    descriptionHint: "20 caractères minimum",
    finalNote:
      "Ton profil servira à une sélection courte, jamais à un swipe infini.",
    error: "Impossible d’enregistrer cette étape.",
    loading: "Chargement de ton profil…",
  },
  en: {
    stepLabels: [
      "Identity",
      "Gender",
      "Orientation",
      "Search",
      "Intentions",
      "Activities",
      "Distance",
      "Profile",
    ],
    progress: "Profile progress",
    autosave: "Every step is saved",
    back: "Back",
    next: "Save and continue",
    finish: "Complete my profile",
    saving: "Saving…",
    free: "Everything you need to meet someone is free. No credit card required.",
    identityTitle: "Let’s start with you",
    identityBody:
      "This information helps build a local, adults-only selection.",
    username: "Username",
    age: "Age",
    city: "City",
    genderTitle: "How do you identify?",
    genderBody: "Choose the wording that fits you best today.",
    orientationTitle: "What is your orientation?",
    orientationBody:
      "This sensitive data is used only to apply your dating preferences.",
    consentTitle: "My choice, my consent",
    consentBody:
      "I agree that Embir may use my orientation and the genders I seek only to suggest mutually compatible profiles. I can change or remove these preferences from my profile.",
    privacy: "Read the privacy policy",
    seekingTitle: "Who would you like to meet?",
    seekingBody:
      "The selection respects both people’s preferences, not only yours.",
    selected: "selected",
    intentsTitle: "What do you want right now?",
    intentsBody:
      "Choose several intentions if needed, then mark the one that matters most today.",
    primary: "Primary intention",
    primaryHint:
      "It orders your selection without hiding your other intentions.",
    activitiesTitle: "What would you like to share?",
    activitiesBody:
      "Activities create concrete starting points for a first reaction.",
    rangeTitle: "Your meeting boundaries",
    rangeBody: "You stay in control. Embir never displays your exact location.",
    ageRange: "Preferred age range",
    radius: "Maximum radius",
    radiusHint: "Distance remains approximate publicly.",
    universeTitle: "Give your profile a voice",
    universeBody: "A few honest sentences beat a perfect bio.",
    description: "Your introduction",
    descriptionPlaceholder:
      "I enjoy conversations that take their time, spontaneous walks and…",
    descriptionHint: "20 characters minimum",
    finalNote:
      "Your profile powers a short selection, never an endless swipe feed.",
    error: "This step could not be saved.",
    loading: "Loading your profile…",
  },
  es: {
    stepLabels: [
      "Identidad",
      "Género",
      "Orientación",
      "Búsqueda",
      "Intenciones",
      "Actividades",
      "Distancia",
      "Perfil",
    ],
    progress: "Progreso del perfil",
    autosave: "Cada etapa queda guardada",
    back: "Atrás",
    next: "Guardar y continuar",
    finish: "Completar mi perfil",
    saving: "Guardando…",
    free: "Todo lo necesario para conocer a alguien es gratis. Sin tarjeta bancaria.",
    identityTitle: "Empecemos por ti",
    identityBody:
      "Esta información permite crear una selección local y solo para adultos.",
    username: "Usuario",
    age: "Edad",
    city: "Ciudad",
    genderTitle: "¿Cómo te identificas?",
    genderBody: "Elige la formulación que mejor te represente hoy.",
    orientationTitle: "¿Cuál es tu orientación?",
    orientationBody:
      "Este dato sensible se usa únicamente para aplicar tus preferencias de encuentro.",
    consentTitle: "Mi elección, mi consentimiento",
    consentBody:
      "Acepto que Embir use mi orientación y los géneros que busco únicamente para proponer perfiles compatibles de forma recíproca. Puedo modificar o retirar estas preferencias desde mi perfil.",
    privacy: "Leer la política de privacidad",
    seekingTitle: "¿A quién quieres conocer?",
    seekingBody:
      "La selección respeta las preferencias de ambas personas, no solo las tuyas.",
    selected: "seleccionado",
    intentsTitle: "¿Qué quieres vivir ahora?",
    intentsBody:
      "Elige varias intenciones si lo necesitas y marca la más importante hoy.",
    primary: "Intención principal",
    primaryHint: "Ordena tu selección sin ocultar tus otras intenciones.",
    activitiesTitle: "¿Qué te gustaría compartir?",
    activitiesBody:
      "Las actividades crean puntos concretos para una primera reacción.",
    rangeTitle: "Tu marco de encuentro",
    rangeBody:
      "Tú mantienes el control. Embir nunca muestra tu ubicación exacta.",
    ageRange: "Rango de edad buscado",
    radius: "Radio máximo",
    radiusHint: "La distancia pública siempre es aproximada.",
    universeTitle: "Dale voz a tu perfil",
    universeBody: "Unas frases sinceras valen más que una bio perfecta.",
    description: "Tu presentación",
    descriptionPlaceholder:
      "Me gustan las conversaciones sin prisa, los paseos espontáneos y…",
    descriptionHint: "20 caracteres como mínimo",
    finalNote:
      "Tu perfil alimenta una selección corta, nunca un feed infinito.",
    error: "No se pudo guardar esta etapa.",
    loading: "Cargando tu perfil…",
  },
} satisfies Record<SupportedLocale, Record<string, string | string[]>>;

const optionLabels: Record<SupportedLocale, Record<string, string>> = {
  fr: {
    HOMME: "Homme",
    FEMME: "Femme",
    FEMME_TRANS: "Femme trans",
    TRAVESTI: "Travesti",
    PERSONNE_FEMININE: "Personne féminine",
    COUPLE: "Couple",
    AUTRE: "Autre",
    HETERO: "Hétéro",
    HOMOSEXUEL: "Homosexuel",
    LESBIENNE: "Lesbienne",
    BI: "Bi",
    QUEER: "Queer",
    PAN: "Pan",
    FLUIDE: "Fluide",
    DEMI: "Demi",
    ASEXUEL: "Asexuel",
    AMOUR: "Amour",
    AMIS: "Amitié",
    FUN: "Fun",
    PLAN_CUL: "Sans engagement",
    SPORT: "Sport",
    EVENEMENTS: "Événements",
    DISCUSSION: "Discussion",
    cinema: "Cinéma",
    music: "Musique",
    sport: "Sport",
    cooking: "Cuisine",
    travel: "Voyage",
    gaming: "Jeux",
    art: "Art",
    nature: "Nature",
    reading: "Lecture",
    dance: "Danse",
    photography: "Photo",
    volunteering: "Bénévolat",
  },
  en: {
    HOMME: "Man",
    FEMME: "Woman",
    FEMME_TRANS: "Trans woman",
    TRAVESTI: "Cross-dresser",
    PERSONNE_FEMININE: "Feminine person",
    COUPLE: "Couple",
    AUTRE: "Other",
    HETERO: "Straight",
    HOMOSEXUEL: "Gay",
    LESBIENNE: "Lesbian",
    BI: "Bi",
    QUEER: "Queer",
    PAN: "Pan",
    FLUIDE: "Fluid",
    DEMI: "Demi",
    ASEXUEL: "Asexual",
    AMOUR: "Love",
    AMIS: "Friendship",
    FUN: "Fun",
    PLAN_CUL: "Casual",
    SPORT: "Sport",
    EVENEMENTS: "Events",
    DISCUSSION: "Conversation",
    cinema: "Cinema",
    music: "Music",
    sport: "Sport",
    cooking: "Cooking",
    travel: "Travel",
    gaming: "Gaming",
    art: "Art",
    nature: "Nature",
    reading: "Reading",
    dance: "Dance",
    photography: "Photography",
    volunteering: "Volunteering",
  },
  es: {
    HOMME: "Hombre",
    FEMME: "Mujer",
    FEMME_TRANS: "Mujer trans",
    TRAVESTI: "Travesti",
    PERSONNE_FEMININE: "Persona femenina",
    COUPLE: "Pareja",
    AUTRE: "Otro",
    HETERO: "Hetero",
    HOMOSEXUEL: "Gay",
    LESBIENNE: "Lesbiana",
    BI: "Bi",
    QUEER: "Queer",
    PAN: "Pan",
    FLUIDE: "Fluida",
    DEMI: "Demi",
    ASEXUEL: "Asexual",
    AMOUR: "Amor",
    AMIS: "Amistad",
    FUN: "Diversión",
    PLAN_CUL: "Sin compromiso",
    SPORT: "Deporte",
    EVENEMENTS: "Eventos",
    DISCUSSION: "Conversación",
    cinema: "Cine",
    music: "Música",
    sport: "Deporte",
    cooking: "Cocina",
    travel: "Viajes",
    gaming: "Videojuegos",
    art: "Arte",
    nature: "Naturaleza",
    reading: "Lectura",
    dance: "Baile",
    photography: "Fotografía",
    volunteering: "Voluntariado",
  },
};

function arrayValue<T extends string>(current: T[], value: T): T[] {
  return current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value];
}

export default function OnboardingPage() {
  const router = useRouter();
  const locale = supportedLocale(useLocale());
  const text = copy[locale];
  const stepLabels = text.stepLabels as string[];
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormState>(initialForm);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/profile/me", {
      credentials: "include",
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (response.status === 401) {
          router.replace(
            `${localePath(locale, "/auth/login")}?redirect=${encodeURIComponent(localePath(locale, "/onboarding"))}`,
          );
          return null;
        }
        if (!response.ok) throw new Error("profile_load_failed");
        return response.json();
      })
      .then((data: Record<string, unknown> | null) => {
        if (!data) return;
        const accepted = Array.isArray(data.acceptedIntents)
          ? (data.acceptedIntents as Intent[])
          : Array.isArray(data.intentions)
            ? (data.intentions as Intent[])
            : [];
        const storedStep =
          typeof data.onboardingStep === "number" ? data.onboardingStep : 0;
        setForm({
          username: typeof data.username === "string" ? data.username : "",
          age: data.age ? String(data.age) : "",
          city: typeof data.city === "string" ? data.city : "",
          genderIdentity: GENDERS.includes(data.genderIdentity as Gender)
            ? (data.genderIdentity as Gender)
            : "",
          orientation: ORIENTATIONS.includes(data.orientation as Orientation)
            ? (data.orientation as Orientation)
            : "",
          consentSensitiveData:
            data.consentSensitiveData === true ||
            storedStep >= 3 ||
            Boolean(data.orientation),
          seekingGenders: Array.isArray(data.seekingGenders)
            ? data.seekingGenders.filter((item): item is Gender =>
                GENDERS.includes(item as Gender),
              )
            : [],
          acceptedIntents: accepted.filter((item): item is Intent =>
            INTENTS.includes(item as Intent),
          ),
          primaryIntent: INTENTS.includes(data.primaryIntent as Intent)
            ? (data.primaryIntent as Intent)
            : (accepted[0] ?? ""),
          activities: Array.isArray(data.activities)
            ? data.activities.filter((item): item is Activity =>
                ACTIVITIES.includes(item as Activity),
              )
            : [],
          seekingAgeMin:
            typeof data.seekingAgeMin === "number" ? data.seekingAgeMin : 18,
          seekingAgeMax:
            typeof data.seekingAgeMax === "number" ? data.seekingAgeMax : 99,
          seekingRadiusKm:
            typeof data.seekingRadiusKm === "number"
              ? data.seekingRadiusKm
              : 50,
          description:
            typeof data.description === "string" ? data.description : "",
        });
        setStep(Math.min(storedStep, TOTAL_STEPS - 1));
      })
      .catch((caught) => {
        if (!(caught instanceof DOMException && caught.name === "AbortError"))
          setError(text.error as string);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [locale, router, text.error]);

  function canProceed(): boolean {
    switch (step) {
      case 0:
        return (
          /^[a-zA-Z0-9_.-]{3,30}$/.test(form.username) &&
          Number(form.age) >= 18 &&
          Number(form.age) <= 120 &&
          form.city.trim().length >= 2
        );
      case 1:
        return Boolean(form.genderIdentity);
      case 2:
        return Boolean(form.orientation) && form.consentSensitiveData;
      case 3:
        return form.seekingGenders.length > 0;
      case 4:
        return (
          form.acceptedIntents.length > 0 &&
          Boolean(form.primaryIntent) &&
          form.acceptedIntents.includes(form.primaryIntent as Intent)
        );
      case 5:
        return form.activities.length > 0;
      case 6:
        return (
          form.seekingAgeMin >= 18 &&
          form.seekingAgeMax <= 120 &&
          form.seekingAgeMin <= form.seekingAgeMax &&
          form.seekingRadiusKm >= 1 &&
          form.seekingRadiusKm <= 500
        );
      case 7:
        return form.description.trim().length >= 20;
      default:
        return false;
    }
  }

  function stepPayload(
    currentStep: number,
    complete: boolean,
  ): Record<string, unknown> {
    const payload: Record<string, unknown> = {
      onboardingStep: complete ? 10 : currentStep + 1,
      language: locale,
    };
    if (currentStep === 0)
      Object.assign(payload, {
        username: form.username.trim(),
        age: Number(form.age),
        city: form.city.trim(),
      });
    if (currentStep === 1) payload.genderIdentity = form.genderIdentity;
    if (currentStep === 2)
      Object.assign(payload, {
        orientation: form.orientation,
        consentSensitiveData: true,
      });
    if (currentStep === 3) payload.seekingGenders = form.seekingGenders;
    if (currentStep === 4)
      Object.assign(payload, {
        acceptedIntents: form.acceptedIntents,
        intentions: form.acceptedIntents,
        primaryIntent: form.primaryIntent,
      });
    if (currentStep === 5) payload.activities = form.activities;
    if (currentStep === 6)
      Object.assign(payload, {
        seekingAgeMin: form.seekingAgeMin,
        seekingAgeMax: form.seekingAgeMax,
        seekingRadiusKm: form.seekingRadiusKm,
      });
    if (currentStep === 7) payload.description = form.description.trim();
    if (complete) payload.onboardingComplete = true;
    return payload;
  }

  async function saveCurrentStep() {
    if (!canProceed()) return;
    const complete = step === TOTAL_STEPS - 1;
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/profile/me", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stepPayload(step, complete)),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(
          (payload as { error?: string }).error || (text.error as string),
        );
      if (complete) router.push(localePath(locale, "/dashboard"));
      else setStep((current) => current + 1);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : (text.error as string),
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0614] text-white">
        <div className="text-center">
          <motion.div
            aria-hidden="true"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
            className="mx-auto h-9 w-9 rounded-full border-2 border-[#d4a574]/20 border-t-[#d4a574]"
          />
          <p className="mt-4 text-sm text-white/40">{text.loading as string}</p>
        </div>
      </main>
    );
  }

  const progress = ((step + 1) / TOTAL_STEPS) * 100;
  const selectedLabel = (count: number) =>
    `${count} ${text.selected as string}${count > 1 && locale === "fr" ? "s" : ""}`;

  return (
    <main className="min-h-screen bg-[#0a0614] px-4 py-8 text-white sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -right-40 -top-40 h-96 w-96 rounded-full bg-[#ff5e36]/[0.07] blur-[100px]"
      />
      <div className="relative mx-auto max-w-2xl">
        <header className="mb-8 flex items-center justify-between gap-4">
          <Link
            href={localePath(locale, "/")}
            className="inline-flex items-center gap-2"
            aria-label="Embir"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#d4a574] to-[#ff5e36] text-lg font-black text-[#0a0614]">
              E
            </span>
            <span className="text-xl font-bold">Embir</span>
          </Link>
          <span className="text-xs text-white/30">
            {step + 1}/{TOTAL_STEPS}
          </span>
        </header>

        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">
            <span>{text.progress as string}</span>
            <span>{text.autosave as string}</span>
          </div>
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            aria-label={text.progress as string}
            className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]"
          >
            <motion.div
              animate={{ width: `${progress}%` }}
              className="h-full rounded-full bg-gradient-to-r from-[#ff1f5a] via-[#ff5e36] to-[#d4a574]"
            />
          </div>
          <div className="mt-3 hidden grid-cols-8 gap-1 sm:grid">
            {stepLabels.map((label, index) => (
              <button
                type="button"
                key={label}
                onClick={() => index < step && setStep(index)}
                disabled={index >= step}
                aria-current={index === step ? "step" : undefined}
                className={`truncate text-center text-[9px] ${index <= step ? "text-[#d4a574]" : "text-white/15"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <section className="rounded-[2rem] border border-white/[0.07] bg-white/[0.025] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.25)] sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.22 }}
            >
              {step === 0 ? (
                <div className="space-y-6">
                  <div>
                    <h1 className="font-serif text-3xl">
                      {text.identityTitle as string}
                    </h1>
                    <p className="mt-2 text-sm text-white/40">
                      {text.identityBody as string}
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.12em] text-white/35">
                      {text.username as string}
                      <input
                        autoComplete="username"
                        value={form.username}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            username: event.target.value,
                          }))
                        }
                        className="mt-2 w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-base font-normal normal-case tracking-normal focus:border-[#d4a574]/40 focus:outline-none"
                      />
                    </label>
                    <label className="text-xs font-semibold uppercase tracking-[0.12em] text-white/35">
                      {text.age as string}
                      <input
                        type="number"
                        min={18}
                        max={120}
                        inputMode="numeric"
                        value={form.age}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            age: event.target.value,
                          }))
                        }
                        className="mt-2 w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-base font-normal normal-case tracking-normal focus:border-[#d4a574]/40 focus:outline-none"
                      />
                    </label>
                  </div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-white/35">
                    {text.city as string}
                    <input
                      autoComplete="address-level2"
                      value={form.city}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          city: event.target.value,
                        }))
                      }
                      className="mt-2 w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-base font-normal normal-case tracking-normal focus:border-[#d4a574]/40 focus:outline-none"
                    />
                  </label>
                </div>
              ) : null}

              {step === 1 ? (
                <div>
                  <h1 className="font-serif text-3xl">
                    {text.genderTitle as string}
                  </h1>
                  <p className="mt-2 text-sm text-white/40">
                    {text.genderBody as string}
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {GENDERS.map((gender) => (
                      <button
                        type="button"
                        key={gender}
                        aria-pressed={form.genderIdentity === gender}
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            genderIdentity: gender,
                          }))
                        }
                        className={`rounded-xl border px-3 py-4 text-sm font-semibold transition ${form.genderIdentity === gender ? "border-[#d4a574] bg-[#d4a574]/10 text-white" : "border-white/[0.08] text-white/45 hover:text-white"}`}
                      >
                        {optionLabels[locale][gender]}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {step === 2 ? (
                <div>
                  <h1 className="font-serif text-3xl">
                    {text.orientationTitle as string}
                  </h1>
                  <p className="mt-2 text-sm text-white/40">
                    {text.orientationBody as string}
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {ORIENTATIONS.map((orientation) => (
                      <button
                        type="button"
                        key={orientation}
                        aria-pressed={form.orientation === orientation}
                        onClick={() =>
                          setForm((current) => ({ ...current, orientation }))
                        }
                        className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${form.orientation === orientation ? "border-[#ff5e36] bg-[#ff5e36]/10 text-white" : "border-white/[0.08] text-white/45 hover:text-white"}`}
                      >
                        {optionLabels[locale][orientation]}
                      </button>
                    ))}
                  </div>
                  <label className="mt-6 flex cursor-pointer gap-3 rounded-2xl border border-[#d4a574]/20 bg-[#d4a574]/[0.05] p-4">
                    <input
                      type="checkbox"
                      checked={form.consentSensitiveData}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          consentSensitiveData: event.target.checked,
                        }))
                      }
                      className="mt-1 h-4 w-4 accent-[#d4a574]"
                    />
                    <span>
                      <strong className="block text-sm text-white">
                        {text.consentTitle as string}
                      </strong>
                      <span className="mt-1 block text-xs leading-relaxed text-white/45">
                        {text.consentBody as string}
                      </span>
                      <Link
                        href={localePath(locale, "/privacy")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-xs font-semibold text-[#d4a574] underline-offset-4 hover:underline"
                      >
                        {text.privacy as string}
                      </Link>
                    </span>
                  </label>
                </div>
              ) : null}

              {step === 3 ? (
                <div>
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <h1 className="font-serif text-3xl">
                        {text.seekingTitle as string}
                      </h1>
                      <p className="mt-2 text-sm text-white/40">
                        {text.seekingBody as string}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-[#ff8a5c]">
                      {selectedLabel(form.seekingGenders.length)}
                    </span>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {GENDERS.map((gender) => (
                      <button
                        type="button"
                        key={gender}
                        aria-pressed={form.seekingGenders.includes(gender)}
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            seekingGenders: arrayValue(
                              current.seekingGenders,
                              gender,
                            ),
                          }))
                        }
                        className={`rounded-xl border px-3 py-4 text-sm font-semibold transition ${form.seekingGenders.includes(gender) ? "border-[#ff5e36] bg-[#ff5e36]/10 text-white" : "border-white/[0.08] text-white/45 hover:text-white"}`}
                      >
                        {optionLabels[locale][gender]}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {step === 4 ? (
                <div>
                  <h1 className="font-serif text-3xl">
                    {text.intentsTitle as string}
                  </h1>
                  <p className="mt-2 text-sm text-white/40">
                    {text.intentsBody as string}
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {INTENTS.map((intent) => (
                      <button
                        type="button"
                        key={intent}
                        aria-pressed={form.acceptedIntents.includes(intent)}
                        onClick={() =>
                          setForm((current) => {
                            const acceptedIntents = arrayValue(
                              current.acceptedIntents,
                              intent,
                            );
                            return {
                              ...current,
                              acceptedIntents,
                              primaryIntent: acceptedIntents.includes(
                                current.primaryIntent as Intent,
                              )
                                ? current.primaryIntent
                                : (acceptedIntents[0] ?? ""),
                            };
                          })
                        }
                        className={`rounded-xl border px-3 py-4 text-sm font-semibold transition ${form.acceptedIntents.includes(intent) ? "border-[#ff5e36] bg-[#ff5e36]/10 text-white" : "border-white/[0.08] text-white/45 hover:text-white"}`}
                      >
                        {optionLabels[locale][intent]}
                      </button>
                    ))}
                  </div>
                  {form.acceptedIntents.length > 0 ? (
                    <fieldset className="mt-6 rounded-2xl border border-white/[0.07] bg-black/15 p-4">
                      <legend className="px-2 text-xs font-bold uppercase tracking-[0.14em] text-[#d4a574]">
                        {text.primary as string}
                      </legend>
                      <p className="mb-3 text-xs text-white/35">
                        {text.primaryHint as string}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {form.acceptedIntents.map((intent) => (
                          <button
                            type="button"
                            key={intent}
                            aria-pressed={form.primaryIntent === intent}
                            onClick={() =>
                              setForm((current) => ({
                                ...current,
                                primaryIntent: intent,
                              }))
                            }
                            className={`rounded-full border px-4 py-2 text-xs font-semibold ${form.primaryIntent === intent ? "border-[#d4a574] bg-[#d4a574] text-[#0a0614]" : "border-white/[0.08] text-white/45"}`}
                          >
                            {optionLabels[locale][intent]}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  ) : null}
                </div>
              ) : null}

              {step === 5 ? (
                <div>
                  <h1 className="font-serif text-3xl">
                    {text.activitiesTitle as string}
                  </h1>
                  <p className="mt-2 text-sm text-white/40">
                    {text.activitiesBody as string}
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {ACTIVITIES.map((activity) => (
                      <button
                        type="button"
                        key={activity}
                        aria-pressed={form.activities.includes(activity)}
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            activities: arrayValue(
                              current.activities,
                              activity,
                            ),
                          }))
                        }
                        className={`rounded-xl border px-3 py-4 text-sm font-semibold transition ${form.activities.includes(activity) ? "border-[#d4a574]/50 bg-[#d4a574]/10 text-white" : "border-white/[0.08] text-white/45 hover:text-white"}`}
                      >
                        {optionLabels[locale][activity]}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {step === 6 ? (
                <div>
                  <h1 className="font-serif text-3xl">
                    {text.rangeTitle as string}
                  </h1>
                  <p className="mt-2 text-sm text-white/40">
                    {text.rangeBody as string}
                  </p>
                  <fieldset className="mt-6">
                    <legend className="text-xs font-bold uppercase tracking-[0.14em] text-white/35">
                      {text.ageRange as string}
                    </legend>
                    <div className="mt-3 grid grid-cols-2 gap-4">
                      <label className="text-xs text-white/35">
                        Min
                        <input
                          type="number"
                          min={18}
                          max={120}
                          value={form.seekingAgeMin}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              seekingAgeMin: Number(event.target.value),
                            }))
                          }
                          className="mt-2 w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-base text-white focus:border-[#d4a574]/40 focus:outline-none"
                        />
                      </label>
                      <label className="text-xs text-white/35">
                        Max
                        <input
                          type="number"
                          min={18}
                          max={120}
                          value={form.seekingAgeMax}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              seekingAgeMax: Number(event.target.value),
                            }))
                          }
                          className="mt-2 w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-base text-white focus:border-[#d4a574]/40 focus:outline-none"
                        />
                      </label>
                    </div>
                  </fieldset>
                  <label className="mt-7 block text-xs font-bold uppercase tracking-[0.14em] text-white/35">
                    <span className="flex justify-between">
                      <span>{text.radius as string}</span>
                      <strong className="text-[#d4a574]">
                        {form.seekingRadiusKm} km
                      </strong>
                    </span>
                    <input
                      type="range"
                      min={1}
                      max={500}
                      step={5}
                      value={form.seekingRadiusKm}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          seekingRadiusKm: Number(event.target.value),
                        }))
                      }
                      className="mt-4 w-full accent-[#d4a574]"
                    />
                    <span className="mt-2 block text-xs font-normal normal-case tracking-normal text-white/30">
                      {text.radiusHint as string}
                    </span>
                  </label>
                </div>
              ) : null}

              {step === 7 ? (
                <div>
                  <h1 className="font-serif text-3xl">
                    {text.universeTitle as string}
                  </h1>
                  <p className="mt-2 text-sm text-white/40">
                    {text.universeBody as string}
                  </p>
                  <label className="mt-6 block text-xs font-bold uppercase tracking-[0.14em] text-white/35">
                    {text.description as string}
                    <textarea
                      value={form.description}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          description: event.target.value,
                        }))
                      }
                      maxLength={1000}
                      rows={7}
                      placeholder={text.descriptionPlaceholder as string}
                      className="mt-2 w-full resize-none rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-base font-normal normal-case leading-relaxed tracking-normal text-white placeholder:text-white/20 focus:border-[#d4a574]/40 focus:outline-none"
                    />
                    <span className="mt-1 flex justify-between text-[10px] font-normal normal-case tracking-normal text-white/25">
                      <span>{text.descriptionHint as string}</span>
                      <span>{form.description.length}/1000</span>
                    </span>
                  </label>
                  <div className="mt-5 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.035] p-4 text-sm leading-relaxed text-emerald-100/65">
                    {text.free as string}
                    <span className="mt-1 block text-xs text-white/35">
                      {text.finalNote as string}
                    </span>
                  </div>
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>

          {error ? (
            <motion.p
              role="alert"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-5 rounded-xl border border-[#ff1f5a]/20 bg-[#ff1f5a]/[0.07] p-3 text-sm text-[#ff9ab0]"
            >
              {error}
            </motion.p>
          ) : null}

          <div className="mt-8 flex items-center justify-between gap-3">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep((current) => Math.max(0, current - 1))}
                disabled={saving}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-white/40 transition hover:text-white disabled:opacity-40"
              >
                {text.back as string}
              </button>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={() => void saveCurrentStep()}
              disabled={!canProceed() || saving}
              className="rounded-xl bg-gradient-to-r from-[#ff5e36] to-[#d4a574] px-6 py-3 text-sm font-bold text-[#10050a] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-25"
            >
              {saving
                ? (text.saving as string)
                : step === TOTAL_STEPS - 1
                  ? (text.finish as string)
                  : (text.next as string)}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
