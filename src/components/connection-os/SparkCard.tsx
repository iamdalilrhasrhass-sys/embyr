"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type {
  ContextTarget,
  ContextualAction,
  SparkCandidate,
  SupportedLocale,
} from "@/components/connection-os/types";
import { candidateProfile, localePath } from "@/components/connection-os/types";

interface SparkCardProps {
  locale: SupportedLocale;
  candidate: SparkCandidate;
  pending: boolean;
  onAction: (
    candidate: SparkCandidate,
    action: ContextualAction,
  ) => Promise<void>;
}

const copy = {
  fr: {
    why: "Pourquoi cette personne",
    fallbackReason: "Vos préférences déclarées sont compatibles.",
    react: "Réagir à un détail",
    instruction: "Choisis ce qui t’a réellement donné envie d’écrire.",
    note: "Ton message",
    placeholder: "Ce détail m’a parlé parce que…",
    hint: "12 à 180 caractères · écrit par toi",
    send: "Envoyer l’étincelle",
    pass: "Pas maintenant",
    profile: "Voir le profil",
    choose: "Choisis d’abord un détail précis.",
    write: "Ajoute un message personnel d’au moins 12 caractères.",
    verified: "Profil vérifié",
    bio: "Sa présentation",
    profileDetail: "Son profil et ses intentions",
    activity: "Activité",
    cityUnknown: "Ville non renseignée",
  },
  en: {
    why: "Why this person",
    fallbackReason: "Your stated preferences are mutually compatible.",
    react: "React to one detail",
    instruction: "Choose what genuinely made you want to write.",
    note: "Your message",
    placeholder: "This detail stood out to me because…",
    hint: "12 to 180 characters · written by you",
    send: "Send the spark",
    pass: "Not now",
    profile: "View profile",
    choose: "Choose a specific detail first.",
    write: "Add a personal message of at least 12 characters.",
    verified: "Verified profile",
    bio: "Their introduction",
    profileDetail: "Their profile and intentions",
    activity: "Activity",
    cityUnknown: "City not provided",
  },
  es: {
    why: "Por qué esta persona",
    fallbackReason: "Vuestras preferencias declaradas son compatibles.",
    react: "Reaccionar a un detalle",
    instruction: "Elige lo que realmente te dio ganas de escribir.",
    note: "Tu mensaje",
    placeholder: "Este detalle me llamó la atención porque…",
    hint: "De 12 a 180 caracteres · escrito por ti",
    send: "Enviar la chispa",
    pass: "Ahora no",
    profile: "Ver perfil",
    choose: "Elige primero un detalle concreto.",
    write: "Añade un mensaje personal de al menos 12 caracteres.",
    verified: "Perfil verificado",
    bio: "Su presentación",
    profileDetail: "Su perfil y sus intenciones",
    activity: "Actividad",
    cityUnknown: "Ciudad no indicada",
  },
} satisfies Record<SupportedLocale, Record<string, string>>;

const reasonLabels: Record<SupportedLocale, Record<string, string>> = {
  fr: {
    RECIPROCAL_PREFERENCES: "Préférences compatibles des deux côtés",
    RECIPROCAL_ELIGIBLE: "Vous vous recherchez mutuellement",
    MUTUAL_PREFERENCES: "Préférences compatibles des deux côtés",
    SHARED_INTENT: "Intention du moment partagée",
    PRIMARY_INTENT: "Même intention principale",
    SHARED_ACTIVITY: "Une activité en commun",
    ACTIVITY: "Une activité en commun",
    SHARED_ACTIVITIES: "Au moins une activité en commun",
    WITHIN_RADIUS: "Dans le rayon choisi",
    DISTANCE: "Dans le rayon choisi",
    WITHIN_DISTANCE: "Distance estimée dans le rayon choisi",
    SAME_CITY_APPROX: "Même ville déclarée",
    SYNCHRONIZED_AVAILABILITY: "Signaux actifs pour la même intention",
    RECENTLY_ACTIVE: "Profil récemment actif",
    VERIFIED: "Profil vérifié",
  },
  en: {
    RECIPROCAL_PREFERENCES: "Preferences align both ways",
    RECIPROCAL_ELIGIBLE: "You are looking for each other",
    MUTUAL_PREFERENCES: "Preferences align both ways",
    SHARED_INTENT: "Shared current intention",
    PRIMARY_INTENT: "Same primary intention",
    SHARED_ACTIVITY: "One activity in common",
    ACTIVITY: "One activity in common",
    SHARED_ACTIVITIES: "At least one activity in common",
    WITHIN_RADIUS: "Within your chosen radius",
    DISTANCE: "Within your chosen radius",
    WITHIN_DISTANCE: "Estimated distance is within your chosen radius",
    SAME_CITY_APPROX: "Same stated city",
    SYNCHRONIZED_AVAILABILITY: "Active signals share the same intention",
    RECENTLY_ACTIVE: "Recently active profile",
    VERIFIED: "Verified profile",
  },
  es: {
    RECIPROCAL_PREFERENCES: "Preferencias compatibles en ambos sentidos",
    RECIPROCAL_ELIGIBLE: "Os buscáis mutuamente",
    MUTUAL_PREFERENCES: "Preferencias compatibles en ambos sentidos",
    SHARED_INTENT: "Intención actual compartida",
    PRIMARY_INTENT: "Misma intención principal",
    SHARED_ACTIVITY: "Una actividad en común",
    ACTIVITY: "Una actividad en común",
    SHARED_ACTIVITIES: "Al menos una actividad en común",
    WITHIN_RADIUS: "Dentro del radio elegido",
    DISTANCE: "Dentro del radio elegido",
    WITHIN_DISTANCE: "Distancia estimada dentro del radio elegido",
    SAME_CITY_APPROX: "Misma ciudad declarada",
    SYNCHRONIZED_AVAILABILITY: "Señales activas con la misma intención",
    RECENTLY_ACTIVE: "Perfil activo recientemente",
    VERIFIED: "Perfil verificado",
  },
};

const activityLabels: Record<SupportedLocale, Record<string, string>> = {
  fr: {
    cinema: "cinéma",
    music: "musique",
    sport: "sport",
    cooking: "cuisine",
    travel: "voyage",
    gaming: "jeux",
    art: "art",
    nature: "nature",
    reading: "lecture",
    dance: "danse",
    photography: "photo",
    volunteering: "bénévolat",
  },
  en: {
    cinema: "cinema",
    music: "music",
    sport: "sport",
    cooking: "cooking",
    travel: "travel",
    gaming: "gaming",
    art: "art",
    nature: "nature",
    reading: "reading",
    dance: "dance",
    photography: "photography",
    volunteering: "volunteering",
  },
  es: {
    cinema: "cine",
    music: "música",
    sport: "deporte",
    cooking: "cocina",
    travel: "viajes",
    gaming: "videojuegos",
    art: "arte",
    nature: "naturaleza",
    reading: "lectura",
    dance: "baile",
    photography: "fotografía",
    volunteering: "voluntariado",
  },
};

const intentLabels: Record<SupportedLocale, Record<string, string>> = {
  fr: {
    AMOUR: "amour",
    AMIS: "amitié",
    FUN: "fun",
    PLAN_CUL: "sans engagement",
    SPORT: "sport",
    EVENEMENTS: "événements",
    DISCUSSION: "discussion",
    AUTRE: "autre",
  },
  en: {
    AMOUR: "love",
    AMIS: "friendship",
    FUN: "fun",
    PLAN_CUL: "casual",
    SPORT: "sport",
    EVENEMENTS: "events",
    DISCUSSION: "conversation",
    AUTRE: "other",
  },
  es: {
    AMOUR: "amor",
    AMIS: "amistad",
    FUN: "diversión",
    PLAN_CUL: "sin compromiso",
    SPORT: "deporte",
    EVENEMENTS: "eventos",
    DISCUSSION: "conversación",
    AUTRE: "otro",
  },
};

function targetKey(target: ContextTarget): string {
  return `${target.type}:${target.id ?? target.label}`;
}

function honestReasons(
  candidate: SparkCandidate,
  locale: SupportedLocale,
): string[] {
  const reasons = candidate.reasonCodes ?? candidate.reasons ?? [];
  return reasons.slice(0, 3).map((reason) => {
    const normalized = reason
      .trim()
      .toUpperCase()
      .replace(/[\s-]+/g, "_");
    return (
      reasonLabels[locale][normalized] ??
      (reason.includes(" ")
        ? reason
        : reason.toLowerCase().replaceAll("_", " "))
    );
  });
}

function availableTargets(
  candidate: SparkCandidate,
  locale: SupportedLocale,
): ContextTarget[] {
  if (candidate.contextTargets && candidate.contextTargets.length > 0) {
    return candidate.contextTargets.slice(0, 5);
  }

  const profile = candidateProfile(candidate);
  const targets: ContextTarget[] = [];
  for (const activity of (profile.activities ?? []).slice(0, 3)) {
    targets.push({
      type: "ACTIVITY",
      id: activity,
      label: `${copy[locale].activity} · ${activityLabels[locale][activity] ?? activity}`,
    });
  }
  if (profile.description) {
    targets.push({
      type: "PROFILE_DETAIL",
      id: "description",
      label: copy[locale].bio,
      preview: profile.description.slice(0, 100),
    });
  }
  if (targets.length === 0) {
    targets.push({
      type: "PROFILE_DETAIL",
      id: "profile",
      label: copy[locale].profileDetail,
    });
  }
  return targets;
}

export function SparkCard({
  locale,
  candidate,
  pending,
  onAction,
}: SparkCardProps) {
  const text = copy[locale];
  const profile = candidateProfile(candidate);
  const targets = useMemo(
    () => availableTargets(candidate, locale),
    [candidate, locale],
  );
  const reasons = useMemo(
    () => honestReasons(candidate, locale),
    [candidate, locale],
  );
  const [selectedTarget, setSelectedTarget] = useState<ContextTarget | null>(
    null,
  );
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const name = profile.displayName || profile.username || "Embir";
  const initial = name.slice(0, 1).toUpperCase();
  const intents = profile.acceptedIntents ?? profile.intentions ?? [];

  async function sendSpark() {
    const cleanNote = note.trim();
    if (!selectedTarget) {
      setError(text.choose);
      return;
    }
    if (cleanNote.length < 12) {
      setError(text.write);
      return;
    }
    setError("");
    await onAction(candidate, {
      action: "like",
      targetType: selectedTarget.type,
      targetId: selectedTarget.id ?? targetKey(selectedTarget),
      note: cleanNote,
    });
  }

  return (
    <article className="rounded-[1.75rem] border border-white/[0.08] bg-white/[0.025] p-5 backdrop-blur-sm transition hover:border-embir-rose/25 sm:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-embir-rose-deep/25 via-embir-rose/20 to-embir-rose/25 font-serif text-2xl text-white/85">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-serif text-xl text-white">{name}</h3>
            {profile.age ? (
              <span className="text-sm text-white/45">{profile.age}</span>
            ) : null}
            {profile.isVerified ? (
              <span
                title={text.verified}
                aria-label={text.verified}
                className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-emerald-400/25 bg-emerald-400/10 text-[10px] text-emerald-300"
              >
                ✓
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-white/35">
            {profile.city || text.cityUnknown}
          </p>
          {intents.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {intents.slice(0, 3).map((intent) => (
                <span
                  key={intent}
                  className="rounded-full bg-embir-rose/10 px-2 py-1 text-[10px] text-embir-rose-soft"
                >
                  {intentLabels[locale][intent] ??
                    intent.toLowerCase().replaceAll("_", " ")}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/[0.06] bg-black/15 p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
          {text.why}
        </p>
        <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-white/55">
          {(reasons.length > 0 ? reasons : [text.fallbackReason]).map(
            (reason) => (
              <li key={reason} className="flex gap-2">
                <span aria-hidden="true" className="text-embir-rose">
                  ✓
                </span>
                <span>{reason}</span>
              </li>
            ),
          )}
        </ul>
      </div>

      <fieldset className="mt-5">
        <legend className="text-sm font-semibold text-white">
          {text.react}
        </legend>
        <p className="mt-1 text-xs text-white/35">{text.instruction}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {targets.map((target) => {
            const key = targetKey(target);
            const selected = selectedTarget
              ? targetKey(selectedTarget) === key
              : false;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={selected}
                onClick={() => setSelectedTarget(target)}
                className={`rounded-xl border px-3 py-2 text-left text-xs transition ${selected ? "border-embir-rose/50 bg-embir-rose/10 text-embir-blush" : "border-white/[0.08] text-white/45 hover:border-white/15 hover:text-white"}`}
              >
                <span className="block">{target.label}</span>
                {target.preview ? (
                  <span className="mt-1 block max-w-xs truncate text-[10px] text-white/30">
                    {target.preview}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="mt-4 block text-xs font-semibold text-white/55">
        {text.note}
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          maxLength={180}
          rows={3}
          placeholder={text.placeholder}
          className="mt-2 w-full resize-none rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm font-normal text-white placeholder:text-white/20 focus:border-embir-rose/40 focus:outline-none"
        />
        <span className="mt-1 flex justify-between text-[10px] font-normal text-white/25">
          <span>{text.hint}</span>
          <span>{note.length}/180</span>
        </span>
      </label>

      {error ? (
        <p role="alert" className="mt-3 text-xs text-embir-rose-soft">
          {error}
        </p>
      ) : null}

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => void sendSpark()}
          disabled={pending}
          className="col-span-2 rounded-xl bg-gradient-to-r from-embir-rose-deep via-embir-rose to-embir-rose px-4 py-3 text-xs font-bold text-embir-void transition hover:brightness-110 disabled:cursor-wait disabled:opacity-45 sm:col-span-1"
        >
          {pending ? "…" : text.send}
        </button>
        <Link
          href={localePath(locale, `/u/${profile.username ?? ""}`)}
          className="inline-flex items-center justify-center rounded-xl border border-white/[0.08] px-4 py-3 text-xs font-semibold text-white/55 transition hover:border-white/15 hover:text-white"
        >
          {text.profile}
        </Link>
        <button
          type="button"
          onClick={() => void onAction(candidate, { action: "pass" })}
          disabled={pending}
          className="rounded-xl border border-white/[0.08] px-4 py-3 text-xs font-semibold text-white/35 transition hover:border-white/15 hover:text-white/65 disabled:opacity-40"
        >
          {text.pass}
        </button>
      </div>
    </article>
  );
}
