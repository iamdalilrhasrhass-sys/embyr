"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type {
  DiscoveryGender,
  DiscoverySeeking,
  PublicDiscoveryPreview,
} from "@/lib/discovery-preview";
import type { DiscoveryCopy, DiscoveryLocale } from "./discovery-copy";
import "./discovery.css";

type RequestStatus = "idle" | "loading" | "results" | "empty" | "unavailable";

interface DiscoveryExperienceProps {
  copy: DiscoveryCopy;
  locale: DiscoveryLocale;
}

export default function DiscoveryExperience({ copy, locale }: DiscoveryExperienceProps) {
  const searchParams = useSearchParams();
  const [gender, setGender] = useState<DiscoveryGender | "">("");
  const [seeking, setSeeking] = useState<DiscoverySeeking | "">("");
  const [intent, setIntent] = useState("");
  const [city, setCity] = useState("");
  const [status, setStatus] = useState<RequestStatus>("idle");
  const [previews, setPreviews] = useState<PublicDiscoveryPreview[]>([]);

  useEffect(() => {
    const presetIntent = searchParams.get("intent") || "";
    const presetCity = searchParams.get("city") || "";
    if (presetIntent) setIntent(presetIntent.toUpperCase());
    if (presetCity) setCity(presetCity);
  }, [searchParams]);

  const ready = Boolean(gender && seeking && intent);

  const requestUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (gender) params.set("gender", gender);
    if (seeking) params.set("seeking", seeking);
    if (intent) params.set("intent", intent);
    if (city.trim()) params.set("city", city.trim());
    return `/api/discovery-preview?${params.toString()}`;
  }, [city, gender, intent, seeking]);

  const registerHref = useMemo(() => {
    const prefix = locale === "fr" ? "/fr" : "";
    const params = new URLSearchParams();
    if (gender) params.set("gender", gender);
    if (seeking) params.set("seeking", seeking);
    if (intent) params.set("intent", intent);
    if (city.trim()) params.set("city", city.trim());
    const query = params.toString();
    return `${prefix}/auth/register${query ? `?${query}` : ""}`;
  }, [city, gender, intent, locale, seeking]);

  async function loadPreviews() {
    if (!ready) return;
    setStatus("loading");
    setPreviews([]);
    try {
      const response = await fetch(requestUrl);
      const body = await response.json();
      if (!response.ok || body.status === "unavailable") {
        setStatus("unavailable");
        return;
      }
      const nextPreviews = Array.isArray(body.previews) ? body.previews : [];
      setPreviews(nextPreviews);
      setStatus(nextPreviews.length ? "results" : "empty");
    } catch {
      setStatus("unavailable");
    }
  }

  return (
    <main className="discovery">
      <div className="discovery__shell">
        <section className="discovery__hero">
          <div>
            <h1>{copy.title}</h1>
            <p className="discovery__subtitle">{copy.subtitle}</p>
            <p className="discovery__disclosure">{copy.disclosure}</p>
          </div>

          <form
            className="discovery__form"
            onSubmit={(event) => {
              event.preventDefault();
              void loadPreviews();
            }}
          >
            <OptionGroup
              label={copy.fields.gender}
              options={copy.genderOptions}
              value={gender}
              onChange={(value) => setGender(value as DiscoveryGender)}
            />
            <OptionGroup
              label={copy.fields.seeking}
              options={copy.seekingOptions}
              value={seeking}
              onChange={(value) => setSeeking(value as DiscoverySeeking)}
            />
            <OptionGroup
              label={copy.fields.intent}
              options={copy.intentOptions}
              value={intent}
              onChange={setIntent}
            />
            <label className="discovery__field">
              <span className="discovery__label">{copy.fields.city}</span>
              <input
                className="discovery__city"
                value={city}
                maxLength={80}
                placeholder={copy.fields.cityPlaceholder}
                onChange={(event) => setCity(event.target.value)}
              />
            </label>
            <button className="discovery__submit" type="submit" disabled={!ready || status === "loading"}>
              {status === "loading" ? copy.loading : copy.submit}
            </button>
          </form>
        </section>

        <section className="discovery__results" aria-live="polite">
          {status === "idle" && <p className="discovery__status">{copy.noCard}</p>}
          {status === "loading" && <p className="discovery__status">{copy.loading}</p>}
          {status === "results" && (
            <>
              <h2>{copy.resultsTitle}</h2>
              <p className="discovery__status">{copy.disclosure}</p>
              <div className="discovery__grid">
                {previews.map((preview) => (
                  <article
                    className="discovery__card"
                    key={`${preview.visualSeed}-${preview.cityLabel}-${preview.intentLabel}`}
                    style={{ "--seed": String(preview.visualSeed % 100) } as React.CSSProperties}
                  >
                    <div className="discovery__card-info">
                      <strong>{preview.intentLabel}</strong>
                      <span>{preview.cityLabel}</span>
                      <span>{preview.ageBand}</span>
                    </div>
                  </article>
                ))}
              </div>
              <div className="discovery__actions">
                <Link className="discovery__unlock" href={registerHref}>
                  {copy.unlock}
                </Link>
              </div>
            </>
          )}
          {status === "empty" && (
            <StateBlock title={copy.emptyTitle} body={copy.emptyBody}>
              <Link className="discovery__unlock" href={registerHref}>
                {copy.unlock}
              </Link>
            </StateBlock>
          )}
          {status === "unavailable" && (
            <StateBlock title={copy.unavailableTitle} body={copy.unavailableBody}>
              <button className="discovery__retry" type="button" onClick={() => void loadPreviews()}>
                {copy.retry}
              </button>
            </StateBlock>
          )}
        </section>
      </div>
    </main>
  );
}

function OptionGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="discovery__field">
      <legend>{label}</legend>
      <div className="discovery__options">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className="discovery__option"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function StateBlock({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div className="discovery__state">
      <h2>{title}</h2>
      <p className="discovery__status">{body}</p>
      <div className="discovery__actions">{children}</div>
    </div>
  );
}

