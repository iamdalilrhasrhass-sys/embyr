"use client";

import { useId, useMemo, useState } from "react";
import {
  buildReciprocalStrands,
  reciprocalStrength,
} from "./geometry";
import type { LandingCopy } from "./landing-copy";

interface ReciprocityInstrumentProps {
  copy: LandingCopy["reciprocity"];
}

export default function ReciprocityInstrument({
  copy,
}: ReciprocityInstrumentProps) {
  const [orientation, setOrientation] = useState(0.72);
  const [intention, setIntention] = useState(0.66);
  const [affinity, setAffinity] = useState(0.58);
  const prefix = useId().replaceAll(":", "");
  const strands = useMemo(
    () => buildReciprocalStrands({ orientation, intention, affinity }),
    [orientation, intention, affinity],
  );
  const outbound = (orientation + intention) / 2;
  const inbound = (orientation + affinity) / 2;
  const strength = reciprocalStrength(outbound, inbound);
  const coreRadius = 18 + strength * 28;
  const axes = [
    { label: copy.axes[0], value: orientation, setValue: setOrientation },
    { label: copy.axes[1], value: intention, setValue: setIntention },
    { label: copy.axes[2], value: affinity, setValue: setAffinity },
  ];

  return (
    <div className="e21-reciprocity__instrument">
      <div className="e21-reciprocity__visual">
        <span className="e21-reciprocity__core-label">{copy.result}</span>
        <svg
          className="e21-reciprocity__svg"
          viewBox="0 0 1000 520"
          role="img"
          aria-labelledby={`${prefix}-title ${prefix}-description`}
        >
          <title id={`${prefix}-title`}>{copy.result}</title>
          <desc id={`${prefix}-description`}>{copy.demoNotice}</desc>
          <defs>
            <linearGradient id={`${prefix}-left`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f06d55" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f0b083" stopOpacity="0.72" />
            </linearGradient>
            <linearGradient id={`${prefix}-right`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f2d6b8" stopOpacity="0.78" />
              <stop offset="100%" stopColor="#f2ede4" stopOpacity="0.54" />
            </linearGradient>
            <radialGradient id={`${prefix}-core`}>
              <stop offset="0%" stopColor="#fff8e9" />
              <stop offset="45%" stopColor="#f06d55" stopOpacity="0.86" />
              <stop offset="100%" stopColor="#c56f4e" stopOpacity="0" />
            </radialGradient>
          </defs>

          {Array.from({ length: 5 }, (_, index) => (
            <circle
              key={index}
              cx="500"
              cy="260"
              r={70 + index * 48}
              fill="none"
              stroke="#f2ede4"
              strokeOpacity={0.04 + index * 0.015}
              strokeDasharray={index % 2 === 0 ? "3 12" : undefined}
            />
          ))}

          {strands.map((strand, index) => (
            <g key={index}>
              <path
                d={strand.leftPath}
                fill="none"
                stroke={`url(#${prefix}-left)`}
                strokeOpacity={strand.opacity}
                strokeWidth={index === 5 || index === 6 ? 2.2 : 1.1}
              />
              <path
                d={strand.rightPath}
                fill="none"
                stroke={`url(#${prefix}-right)`}
                strokeOpacity={strand.opacity}
                strokeWidth={index === 5 || index === 6 ? 2.2 : 1.1}
              />
            </g>
          ))}

          <circle cx="42" cy="260" r="10" fill="#09060c" stroke="#f06d55" strokeWidth="3" />
          <circle cx="958" cy="260" r="10" fill="#09060c" stroke="#f2ede4" strokeWidth="3" />
          <circle
            cx="500"
            cy="260"
            r={coreRadius}
            fill={`url(#${prefix}-core)`}
            opacity={0.66 + strength * 0.34}
          />
          <circle cx="500" cy="260" r="7" fill="#fff8e9" />
        </svg>
        <span className="e21-reciprocity__outcome e21-reciprocity__outcome--left">
          {copy.outbound}
        </span>
        <span className="e21-reciprocity__outcome e21-reciprocity__outcome--right">
          {copy.inbound}
        </span>
      </div>

      <div className="e21-controls">
        {axes.map((axis) => (
          <div className="e21-control" key={axis.label}>
            <label>
              <span>{axis.label}</span>
              <output>{Math.round(axis.value * 100)}</output>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(axis.value * 100)}
              aria-label={axis.label}
              onChange={(event) => axis.setValue(Number(event.target.value) / 100)}
            />
          </div>
        ))}
      </div>
      <p className="e21-reciprocity__notice" aria-live="polite">
        {copy.demoNotice}
      </p>
    </div>
  );
}
