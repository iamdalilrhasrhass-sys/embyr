"use client";

import {
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useId,
  useRef,
  useState as useReactState,
  useState,
} from "react";
import TrackedLink from "@/components/TrackedLink";
import type { LandingCopy } from "./landing-copy";
import { resetUniverseTilt, tiltFromPointerDelta } from "./universe-tilt";

interface UniverseArtifactProps {
  copy: LandingCopy["universe"];
  image: ReactNode;
  locale: "fr" | "en";
}

export default function UniverseArtifact({
  copy,
  image,
  locale,
}: UniverseArtifactProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [dragging, setDragging] = useReactState(false);
  const prefix = useId().replaceAll(":", "");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const dragStart = useRef({ active: false, x: 0, y: 0 });
  const panelCopy = [
    copy.body,
    copy.intentions.join(" · "),
    copy.quote,
    copy.descriptor,
  ];
  const registerPath = locale === "fr" ? "/fr/auth/register" : "/auth/register";

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

  function applyTilt(node: HTMLDivElement, tilt: { x: number; y: number }) {
    node.style.setProperty("--tilt-y", `${tilt.x}deg`);
    node.style.setProperty("--tilt-x", `${tilt.y}deg`);
  }

  function onObjectDown(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = { active: true, x: event.clientX, y: event.clientY };
    setDragging(true);
  }

  function onObjectMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragStart.current.active) return;
    const tilt = tiltFromPointerDelta(
      event.clientX - dragStart.current.x,
      event.clientY - dragStart.current.y,
    );
    applyTilt(event.currentTarget, tilt);
  }

  function resetObject(event: PointerEvent<HTMLDivElement>) {
    dragStart.current.active = false;
    applyTilt(event.currentTarget, resetUniverseTilt());
    setDragging(false);
  }

  function onObjectUp(event: PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    resetObject(event);
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
        data-dragging={dragging}
        onPointerDown={onObjectDown}
        onPointerMove={onObjectMove}
        onPointerUp={onObjectUp}
        onPointerCancel={resetObject}
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
          <TrackedLink href={registerPath} label={copy.primary} location="universe_demo" className="e21-button e21-button--primary">
            {copy.primary}
          </TrackedLink>
          <TrackedLink href={registerPath} label={copy.secondary} location="universe_demo" className="e21-button e21-button--secondary">
            {copy.secondary}
          </TrackedLink>
        </div>
        <p className="e21-universe__notice">{copy.demoNotice}</p>
      </div>
    </div>
  );
}
