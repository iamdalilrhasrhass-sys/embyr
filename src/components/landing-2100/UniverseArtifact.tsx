"use client";

import {
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useId,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import type { LandingCopy } from "./landing-copy";

interface UniverseArtifactProps {
  copy: LandingCopy["universe"];
  image: ReactNode;
}

export default function UniverseArtifact({
  copy,
  image,
}: UniverseArtifactProps) {
  const [activeTab, setActiveTab] = useState(0);
  const prefix = useId().replaceAll(":", "");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const panelCopy = [
    copy.body,
    copy.intentions.join(" · "),
    copy.quote,
    copy.descriptor,
  ];

  function selectTab(index: number) {
    setActiveTab(index);
    tabRefs.current[index]?.focus();
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const direction = event.key === "ArrowDown" ? 1 : -1;
    selectTab((index + direction + copy.tabs.length) % copy.tabs.length);
  }

  function onObjectMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty("--tilt-y", `${x * 8}deg`);
    event.currentTarget.style.setProperty("--tilt-x", `${y * -6}deg`);
  }

  function resetObject(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
  }

  return (
    <div className="e21-universe__experience">
      <div className="e21-universe__intro">
        <h2 className="e21-chapter__title" aria-label={copy.title}>
          {copy.titleLines.map((line) => (
            <span className="e21-title-line" key={line}>{line}</span>
          ))}
        </h2>
        <p className="e21-chapter__body">{copy.body}</p>
        <div className="e21-universe__tabs" role="tablist" aria-orientation="vertical">
          {copy.tabs.map((tab, index) => (
            <button
              key={tab}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              id={`${prefix}-tab-${index}`}
              type="button"
              role="tab"
              className="e21-universe__tab"
              aria-selected={activeTab === index}
              aria-controls={`${prefix}-panel-${index}`}
              tabIndex={activeTab === index ? 0 : -1}
              onClick={() => setActiveTab(index)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
            >
              <span>{tab}</span>
              <span aria-hidden="true" />
              <span className="e21-universe__tab-index">0{index + 1}</span>
            </button>
          ))}
        </div>
        <div
          id={`${prefix}-panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`${prefix}-tab-${activeTab}`}
          className="e21-universe__panel"
        >
          {panelCopy[activeTab]}
        </div>
      </div>

      <div
        className="e21-universe__object"
        onPointerMove={onObjectMove}
        onPointerLeave={resetObject}
      >
        <div className="e21-universe__image-wrap">{image}</div>
        <p className="e21-universe__drag">{copy.drag}</p>
      </div>

      <div className="e21-universe__profile">
        <div className="e21-universe__profile-copy">
          <h3 className="e21-universe__name">{copy.name}</h3>
          <p className="e21-universe__descriptor">{copy.descriptor}</p>
          <div className="e21-universe__intentions">
            {copy.intentions.map((intention) => (
              <span key={intention} className="e21-universe__intention">
                {intention}
              </span>
            ))}
          </div>
        </div>
        <blockquote className="e21-universe__quote">“{copy.quote}”</blockquote>
        <div className="e21-universe__actions">
          <Link href="/auth/register" className="e21-button e21-button--primary">
            {copy.primary}
          </Link>
          <Link href="/auth/register" className="e21-button e21-button--secondary">
            {copy.secondary}
          </Link>
        </div>
        <p className="e21-universe__notice">{copy.demoNotice}</p>
      </div>
    </div>
  );
}
