"use client";

import { useId, useMemo, useState } from "react";
import { compassPetalPath } from "./geometry";

interface CompatibilityCompassProps {
  labels: [string, string, string];
  help: string;
}

export default function CompatibilityCompass({
  labels,
  help,
}: CompatibilityCompassProps) {
  const [rotation, setRotation] = useState(0.08);
  const gradientId = useId().replaceAll(":", "");
  const petals = useMemo(
    () => Array.from({ length: 4 }, (_, index) => compassPetalPath(index, rotation)),
    [rotation],
  );
  const degrees = Math.round((rotation * 180) / Math.PI);

  return (
    <div
      className="e21-compass"
      tabIndex={0}
      role="application"
      aria-label={help}
      onKeyDown={(event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        setRotation((value) => value + (event.key === "ArrowRight" ? 0.08 : -0.08));
      }}
      onPointerMove={(event) => {
        if (event.pointerType === "touch") return;
        const bounds = event.currentTarget.getBoundingClientRect();
        const normalized = (event.clientX - bounds.left) / bounds.width - 0.5;
        setRotation(normalized * 0.42);
      }}
      onPointerLeave={() => setRotation(0.08)}
    >
      <svg className="e21-compass__svg" viewBox="0 0 640 640" aria-labelledby={`${gradientId}-title`}>
        <title id={`${gradientId}-title`}>{labels[2]}</title>
        <defs>
          <radialGradient id={`${gradientId}-glass`} cx="45%" cy="38%" r="70%">
            <stop offset="0%" stopColor="#f2ede4" stopOpacity="0.15" />
            <stop offset="55%" stopColor="#a86f50" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#09060c" stopOpacity="0.7" />
          </radialGradient>
          <linearGradient id={`${gradientId}-warm`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f1d6b6" />
            <stop offset="100%" stopColor="#f06d55" />
          </linearGradient>
          <filter id={`${gradientId}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx="320" cy="320" r="236" fill={`url(#${gradientId}-glass)`} stroke="#f2ede4" strokeOpacity="0.32" />
        <circle cx="320" cy="320" r="218" fill="none" stroke="#a86f50" strokeOpacity="0.42" />
        <circle cx="320" cy="320" r="190" fill="none" stroke="#f2ede4" strokeOpacity="0.08" strokeDasharray="2 12" />
        <circle cx="320" cy="320" r="145" fill="none" stroke="#f2ede4" strokeOpacity="0.07" />
        <path d="M 84 320 H 556 M 320 84 V 556" stroke="#f2ede4" strokeOpacity="0.08" />

        {petals.map((path, index) => (
          <path
            key={path}
            className="e21-compass__petal"
            d={path}
            fill="none"
            stroke={index > 1 ? "#f06d55" : "#f1d6b6"}
            strokeOpacity={index % 2 === 0 ? 0.9 : 0.65}
            strokeWidth={index % 2 === 0 ? 2.4 : 1.5}
            filter={`url(#${gradientId}-glow)`}
          />
        ))}

        <circle cx="320" cy="320" r="15" fill={`url(#${gradientId}-warm)`} filter={`url(#${gradientId}-glow)`} />
        <circle cx="320" cy="320" r="4" fill="#f2ede4" />
        <circle
          cx={320 + Math.cos(rotation) * 217}
          cy={320 + Math.sin(rotation) * 217}
          r="9"
          fill="#f06d55"
          stroke="#f2ede4"
          strokeWidth="2"
        />
        <path d="M 138 555 Q 320 620 502 555" fill="none" stroke="#a86f50" strokeOpacity="0.66" />
        <path
          d={`M 320 598 L ${320 + Math.cos(rotation) * 43} ${598 + Math.sin(rotation) * 4}`}
          stroke="#f06d55"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      <span className="e21-compass__label e21-compass__label--you">{labels[0]}</span>
      <span className="e21-compass__label e21-compass__label--search">{labels[1]}</span>
      <span className="e21-compass__label e21-compass__label--reciprocal">{labels[2]}</span>
      <span className="e21-compass__help">{help}</span>
      <span className="e21-screenreader" aria-live="polite">{degrees}°</span>
    </div>
  );
}
