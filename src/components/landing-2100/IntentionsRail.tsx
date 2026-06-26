"use client";

import { useState } from "react";
import Link from "next/link";
import type { LandingCopy } from "./landing-copy";

interface IntentionsRailProps {
  copy: LandingCopy["intentions"];
}

export default function IntentionsRail({ copy }: IntentionsRailProps) {
  const [selected, setSelected] = useState(0);
  const active = copy.items[selected];

  return (
    <section id="intentions" className="e21-chapter e21-intentions">
      <div className="e21-shell">
        <div className="e21-intentions__header">
          <h2 className="e21-chapter__title">{copy.title}</h2>
          <p className="e21-intentions__body">{copy.body}</p>
        </div>
        <div className="e21-intentions__rail" role="tablist" aria-label={copy.title}>
          {copy.items.map((item, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={selected === index}
              className="e21-intentions__item"
              key={item.label}
              onMouseEnter={() => setSelected(index)}
              onClick={() => setSelected(index)}
              onFocus={() => setSelected(index)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div
          className="e21-intentions__preview"
          role="tabpanel"
          aria-live="polite"
          key={active.label}
        >
          <p>{active.preview}</p>
          <Link href={active.href}>{active.label}</Link>
        </div>
      </div>
    </section>
  );
}
