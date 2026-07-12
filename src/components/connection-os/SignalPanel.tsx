"use client";

import { useState } from "react";
import type {
  ConnectionIntent,
  PresenceSignal,
  SignalFormat,
  SocialEnergy,
  SupportedLocale,
} from "@/components/connection-os/types";

export interface SignalDraft {
  intent: ConnectionIntent;
  socialEnergy: SocialEnergy;
  formats: SignalFormat[];
  availabilityText: string;
  approximateArea: string;
  durationHours: number;
}

interface SignalPanelProps {
  locale: SupportedLocale;
  signal: PresenceSignal | null;
  saving: boolean;
  error?: string;
  onSave: (draft: SignalDraft) => Promise<void>;
  onDelete: () => Promise<void>;
}

const INTENTS: ConnectionIntent[] = [
  "AMOUR",
  "AMIS",
  "FUN",
  "PLAN_CUL",
  "SPORT",
  "EVENEMENTS",
  "DISCUSSION",
];

const ENERGIES: SocialEnergy[] = ["CALME", "OUVERTE", "SPONTANEE"];
const FORMATS: SignalFormat[] = [
  "DISCUSSION",
  "CAFE",
  "BALADE",
  "SPORT",
  "SORTIE",
  "ACTIVITE",
];

const labels = {
  fr: {
    step: "01 · Signal",
    title: "Quelle énergie veux-tu partager maintenant ?",
    body: "Ton signal expire automatiquement. Il précise ton intention sans révéler ta position exacte.",
    intent: "Intention du moment",
    energy: "Énergie sociale",
    formats: "Formats qui te conviennent",
    availability: "Disponibilité (facultatif)",
    availabilityPlaceholder: "Cette semaine après 18 h",
    area: "Zone approximative (facultatif)",
    areaPlaceholder: "Centre-ville, rive gauche…",
    activate: "Activer pour 24 h",
    update: "Mettre à jour le signal",
    edit: "Modifier",
    deactivate: "Désactiver",
    active: "Signal actif",
    until: "jusqu’au",
    private: "Position précise jamais affichée",
    chooseFormat: "Choisis au moins un format.",
    maxFormats: "Choisis quatre formats maximum.",
  },
  en: {
    step: "01 · Signal",
    title: "What energy do you want to share right now?",
    body: "Your signal expires automatically. It states your intention without exposing your exact location.",
    intent: "Current intention",
    energy: "Social energy",
    formats: "Formats that work for you",
    availability: "Availability (optional)",
    availabilityPlaceholder: "This week after 6 pm",
    area: "Approximate area (optional)",
    areaPlaceholder: "City centre, north side…",
    activate: "Activate for 24 hours",
    update: "Update signal",
    edit: "Edit",
    deactivate: "Deactivate",
    active: "Active signal",
    until: "until",
    private: "Exact location is never shown",
    chooseFormat: "Choose at least one format.",
    maxFormats: "Choose no more than four formats.",
  },
  es: {
    step: "01 · Señal",
    title: "¿Qué energía quieres compartir ahora?",
    body: "Tu señal caduca automáticamente. Expresa tu intención sin mostrar tu ubicación exacta.",
    intent: "Intención actual",
    energy: "Energía social",
    formats: "Formatos que te convienen",
    availability: "Disponibilidad (opcional)",
    availabilityPlaceholder: "Esta semana después de las 18 h",
    area: "Zona aproximada (opcional)",
    areaPlaceholder: "Centro, zona norte…",
    activate: "Activar durante 24 h",
    update: "Actualizar señal",
    edit: "Editar",
    deactivate: "Desactivar",
    active: "Señal activa",
    until: "hasta",
    private: "La ubicación exacta nunca se muestra",
    chooseFormat: "Elige al menos un formato.",
    maxFormats: "Elige un máximo de cuatro formatos.",
  },
} satisfies Record<SupportedLocale, Record<string, string>>;

const optionLabels: Record<SupportedLocale, Record<string, string>> = {
  fr: {
    AMOUR: "Amour",
    AMIS: "Amitié",
    FUN: "Fun",
    PLAN_CUL: "Sans engagement",
    SPORT: "Sport",
    EVENEMENTS: "Événements",
    DISCUSSION: "Discussion",
    CALME: "Calme",
    OUVERTE: "Ouverte",
    SPONTANEE: "Spontanée",
    CAFE: "Café",
    BALADE: "Balade",
    SORTIE: "Sortie",
    ACTIVITE: "Activité",
  },
  en: {
    AMOUR: "Love",
    AMIS: "Friendship",
    FUN: "Fun",
    PLAN_CUL: "Casual",
    SPORT: "Sport",
    EVENEMENTS: "Events",
    DISCUSSION: "Conversation",
    CALME: "Calm",
    OUVERTE: "Open",
    SPONTANEE: "Spontaneous",
    CAFE: "Coffee",
    BALADE: "Walk",
    SORTIE: "Night out",
    ACTIVITE: "Activity",
  },
  es: {
    AMOUR: "Amor",
    AMIS: "Amistad",
    FUN: "Diversión",
    PLAN_CUL: "Sin compromiso",
    SPORT: "Deporte",
    EVENEMENTS: "Eventos",
    DISCUSSION: "Conversación",
    CALME: "Tranquila",
    OUVERTE: "Abierta",
    SPONTANEE: "Espontánea",
    CAFE: "Café",
    BALADE: "Paseo",
    SORTIE: "Salida",
    ACTIVITE: "Actividad",
  },
};

const defaultDraft: SignalDraft = {
  intent: "AMOUR",
  socialEnergy: "OUVERTE",
  formats: ["DISCUSSION"],
  availabilityText: "",
  approximateArea: "",
  durationHours: 24,
};

function initialDraft(signal: PresenceSignal | null): SignalDraft {
  if (!signal) return defaultDraft;
  return {
    intent: signal.intent,
    socialEnergy: signal.socialEnergy,
    formats: signal.formats.length > 0 ? signal.formats : ["DISCUSSION"],
    availabilityText: signal.availabilityText ?? "",
    approximateArea: signal.approximateArea ?? "",
    durationHours: 24,
  };
}

export function SignalPanel({
  locale,
  signal,
  saving,
  error,
  onSave,
  onDelete,
}: SignalPanelProps) {
  const copy = labels[locale];
  const [editing, setEditing] = useState(!signal);
  const [draft, setDraft] = useState<SignalDraft>(() => initialDraft(signal));
  const [validationError, setValidationError] = useState("");

  function toggleFormat(format: SignalFormat) {
    if (!draft.formats.includes(format) && draft.formats.length >= 4) {
      setValidationError(copy.maxFormats);
      return;
    }
    setValidationError("");
    setDraft((current) => ({
      ...current,
      formats: current.formats.includes(format)
        ? current.formats.filter((item) => item !== format)
        : [...current.formats, format],
    }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draft.formats.length === 0) {
      setValidationError(copy.chooseFormat);
      return;
    }
    setValidationError("");
    await onSave(draft);
  }

  const expiry = signal?.expiresAt
    ? new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(signal.expiresAt))
    : null;

  return (
    <section
      aria-labelledby="signal-title"
      className="rounded-[2rem] border border-[#ff5e36]/20 bg-[#ff5e36]/[0.035] p-5 sm:p-7 shadow-[0_24px_80px_rgba(0,0,0,0.22)]"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#ff8a5c]">
            {copy.step}
          </p>
          <h2
            id="signal-title"
            className="font-serif text-2xl text-white sm:text-3xl"
          >
            {copy.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/45">
            {copy.body}
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5 text-[10px] font-semibold text-emerald-300/80">
          <span aria-hidden="true">⌖</span> {copy.private}
        </span>
      </div>

      {signal && !editing ? (
        <div className="rounded-2xl border border-[#d4a574]/20 bg-[#d4a574]/[0.06] p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.8)]" />
                <p className="text-sm font-semibold text-white">
                  {copy.active}
                </p>
              </div>
              <p className="mt-2 text-sm text-white/55">
                {optionLabels[locale][signal.intent]} ·{" "}
                {optionLabels[locale][signal.socialEnergy]}
                {expiry ? ` · ${copy.until} ${expiry}` : ""}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {signal.formats.map((format) => (
                  <span
                    key={format}
                    className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11px] text-white/55"
                  >
                    {optionLabels[locale][format] ?? format}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-white/65 transition hover:border-white/20 hover:text-white"
              >
                {copy.edit}
              </button>
              <button
                type="button"
                onClick={() => void onDelete()}
                disabled={saving}
                className="rounded-xl border border-[#ff1f5a]/20 px-4 py-2.5 text-xs font-semibold text-[#ff7895] transition hover:bg-[#ff1f5a]/10 disabled:opacity-40"
              >
                {copy.deactivate}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-6">
          <fieldset>
            <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
              {copy.intent}
            </legend>
            <div className="flex flex-wrap gap-2">
              {INTENTS.map((intent) => (
                <button
                  key={intent}
                  type="button"
                  aria-pressed={draft.intent === intent}
                  onClick={() =>
                    setDraft((current) => ({ ...current, intent }))
                  }
                  className={`rounded-full border px-4 py-2.5 text-xs font-semibold transition ${draft.intent === intent ? "border-[#d4a574] bg-[#d4a574] text-[#0a0614]" : "border-white/[0.08] text-white/55 hover:border-[#d4a574]/30 hover:text-white"}`}
                >
                  {optionLabels[locale][intent]}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
              {copy.energy}
            </legend>
            <div className="grid grid-cols-3 gap-2">
              {ENERGIES.map((energy) => (
                <button
                  key={energy}
                  type="button"
                  aria-pressed={draft.socialEnergy === energy}
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      socialEnergy: energy,
                    }))
                  }
                  className={`rounded-xl border px-3 py-3 text-xs font-semibold transition ${draft.socialEnergy === energy ? "border-[#ff5e36]/50 bg-[#ff5e36]/12 text-white" : "border-white/[0.08] text-white/45 hover:text-white"}`}
                >
                  {optionLabels[locale][energy]}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
              {copy.formats}
            </legend>
            <div className="flex flex-wrap gap-2">
              {FORMATS.map((format) => (
                <button
                  key={format}
                  type="button"
                  aria-pressed={draft.formats.includes(format)}
                  onClick={() => toggleFormat(format)}
                  className={`rounded-full border px-4 py-2 text-xs transition ${draft.formats.includes(format) ? "border-[#ff5e36]/50 bg-[#ff5e36]/10 text-[#ffb08d]" : "border-white/[0.08] text-white/45 hover:text-white"}`}
                >
                  {optionLabels[locale][format] ?? format}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold uppercase tracking-[0.12em] text-white/35">
              {copy.availability}
              <input
                value={draft.availabilityText}
                maxLength={120}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    availabilityText: event.target.value,
                  }))
                }
                placeholder={copy.availabilityPlaceholder}
                className="mt-2 w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm font-normal normal-case tracking-normal text-white placeholder:text-white/20 focus:border-[#d4a574]/40 focus:outline-none"
              />
            </label>
            <label className="text-xs font-semibold uppercase tracking-[0.12em] text-white/35">
              {copy.area}
              <input
                value={draft.approximateArea}
                maxLength={80}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    approximateArea: event.target.value,
                  }))
                }
                placeholder={copy.areaPlaceholder}
                className="mt-2 w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm font-normal normal-case tracking-normal text-white placeholder:text-white/20 focus:border-[#d4a574]/40 focus:outline-none"
              />
            </label>
          </div>

          {(validationError || error) && (
            <p role="alert" className="text-sm text-[#ff7895]">
              {validationError || error}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            {signal && (
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-xl px-5 py-3 text-sm font-semibold text-white/45 transition hover:text-white"
              >
                {locale === "fr"
                  ? "Annuler"
                  : locale === "es"
                    ? "Cancelar"
                    : "Cancel"}
              </button>
            )}
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-gradient-to-r from-[#ff5e36] to-[#d4a574] px-6 py-3 text-sm font-bold text-[#10050a] shadow-[0_16px_40px_rgba(255,94,54,0.18)] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-50"
            >
              {saving ? "…" : signal ? copy.update : copy.activate}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
