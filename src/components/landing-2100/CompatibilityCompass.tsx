"use client";

import { useId, useRef, useEffect, useCallback, useMemo } from "react";
import { compassPetalPath } from "./geometry";
import {
  createPhysicsState,
  tickPhysics,
  clampTilt,
} from "./compass-physics";

interface CompatibilityCompassProps {
  labels: [string, string, string];
  help: string;
}

export default function CompatibilityCompass({
  labels,
  help,
}: CompatibilityCompassProps) {
  const gradientId = useId().replaceAll(":", "");
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGGElement>(null);
  const petalRefs = useRef<(SVGPathElement | null)[]>([]);
  const indicatorRef = useRef<SVGCircleElement>(null);
  const coreRef = useRef<SVGCircleElement>(null);
  const needleRef = useRef<SVGPathElement>(null);

  // Stable physics state (not React state — no re-renders)
  const physicsRef = useRef(createPhysicsState(0.08));
  const dragRef = useRef<{
    active: boolean;
    lastX: number;
    lastY: number;
  }>({ active: false, lastX: 0, lastY: 0 });
  const rafRef = useRef<number>(0);
  const prefersReducedMotion = useRef(false);

  // Check reduced motion preference once
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.current = mq.matches;
    const handler = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Single rAF loop — writes transforms directly to DOM refs
  const animate = useCallback(() => {
    const p = physicsRef.current;
    tickPhysics(p, 0.92, prefersReducedMotion.current);

    const angle = p.angle;
    const tiltX = p.tiltX;
    const tiltY = p.tiltY;
    const degrees = Math.round((angle * 180) / Math.PI);

    // Update ring rotation (3D)
    if (ringRef.current) {
      ringRef.current.style.transform =
        `rotateZ(${angle}rad) rotateX(${tiltY}deg) rotateY(${tiltX}deg)`;
    }

    // Update each petal (translateZ for depth)
    petalRefs.current.forEach((el, i) => {
      if (!el) return;
      const zDepth = 4 + i * 2;
      el.style.transform = `translateZ(${zDepth}px)`;
    });

    // Update indicator dot
    if (indicatorRef.current) {
      indicatorRef.current.setAttribute("cx", String(320 + Math.cos(angle) * 217));
      indicatorRef.current.setAttribute("cy", String(320 + Math.sin(angle) * 217));
    }

    // Update core glow based on proximity to reciprocal orientation
    if (coreRef.current) {
      const reciprocalStrength = Math.max(0, 1 - Math.abs(angle - 0.08) / 1.5);
      coreRef.current.setAttribute("r", String(15 + reciprocalStrength * 8));
      coreRef.current.setAttribute("opacity", String(0.7 + reciprocalStrength * 0.3));
    }

    // Update needle arc
    if (needleRef.current) {
      needleRef.current.setAttribute(
        "d",
        `M 320 598 L ${320 + Math.cos(angle) * 43} ${598 + Math.sin(angle) * 4}`
      );
    }

    // Update ARIA live region
    const liveEl = containerRef.current?.querySelector(".e21-screenreader");
    if (liveEl) liveEl.textContent = `${degrees}°`;

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  // Start/stop rAF
  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  // ── Pointer handlers ──

  const onPointerDown = useCallback((event: React.PointerEvent) => {
    const el = event.currentTarget as HTMLElement;
    el.setPointerCapture(event.pointerId);
    dragRef.current = {
      active: true,
      lastX: event.clientX,
      lastY: event.clientY,
    };
    physicsRef.current.isDragging = true;
  }, []);

  const onPointerMove = useCallback((event: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const dx = event.clientX - dragRef.current.lastX;
    const dy = event.clientY - dragRef.current.lastY;
    dragRef.current.lastX = event.clientX;
    dragRef.current.lastY = event.clientY;

    const p = physicsRef.current;
    // Angular velocity from horizontal drag
    p.velocity += dx * 0.004;
    // Cap max velocity to prevent explosion
    p.velocity = clampTilt(p.velocity, 0.8);
    // Tilt from vertical drag
    p.targetTiltX = clampTilt(p.targetTiltX + dx * 0.1, 18);
    p.targetTiltY = clampTilt(p.targetTiltY - dy * 0.1, 18);
  }, []);

  const onPointerUp = useCallback((event: React.PointerEvent) => {
    const el = event.currentTarget as HTMLElement;
    el.releasePointerCapture(event.pointerId);
    dragRef.current.active = false;
    physicsRef.current.isDragging = false;
    // Target returns to rest angle
    physicsRef.current.targetAngle = 0.08;
    physicsRef.current.targetTiltX = 0;
    physicsRef.current.targetTiltY = 0;
  }, []);

  const onPointerCancel = useCallback((event: React.PointerEvent) => {
    dragRef.current.active = false;
    physicsRef.current.isDragging = false;
    physicsRef.current.targetAngle = 0.08;
    physicsRef.current.targetTiltX = 0;
    physicsRef.current.targetTiltY = 0;
  }, []);

  // ── Keyboard nudge ──

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const p = physicsRef.current;
      p.velocity += event.key === "ArrowRight" ? 0.15 : -0.15;
      p.velocity = clampTilt(p.velocity, 0.8);
      // Reset target so it springs back
      p.isDragging = false;
      p.targetAngle = 0.08;
    },
    []
  );

  // Precompute petal paths (static geometry, only depends on identity)
  const staticPetals = useMemo(
    () => Array.from({ length: 4 }, (_, index) => compassPetalPath(index, 0)),
    []
  );

  return (
    <div
      ref={containerRef}
      className="e21-compass"
      tabIndex={0}
      role="img"
      aria-label={help}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onKeyDown={onKeyDown}
      style={{ touchAction: "none" }}
    >
      <svg
        className="e21-compass__svg"
        viewBox="0 0 640 640"
        aria-labelledby={`${gradientId}-title`}
        style={{ perspective: "600px" }}
      >
        <title id={`${gradientId}-title`}>{labels[2]}</title>
        <desc>{help}</desc>
        <defs>
          <radialGradient id={`${gradientId}-glass`} cx="45%" cy="38%" r="70%">
            <stop offset="0%" stopColor="#f2ede4" stopOpacity="0.15" />
            <stop offset="55%" stopColor="#a86f50" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#09060c" stopOpacity="0.7" />
          </radialGradient>
          <linearGradient
            id={`${gradientId}-warm`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#f1d6b6" />
            <stop offset="100%" stopColor="#f06d55" />
          </linearGradient>
          <filter
            id={`${gradientId}-glow`}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Static background rings */}
        <circle
          cx="320"
          cy="320"
          r="236"
          fill={`url(#${gradientId}-glass)`}
          stroke="#f2ede4"
          strokeOpacity="0.32"
        />
        <circle
          cx="320"
          cy="320"
          r="190"
          fill="none"
          stroke="#f2ede4"
          strokeOpacity="0.08"
          strokeDasharray="2 12"
        />
        <circle
          cx="320"
          cy="320"
          r="145"
          fill="none"
          stroke="#f2ede4"
          strokeOpacity="0.07"
        />
        <path
          d="M 84 320 H 556 M 320 84 V 556"
          stroke="#f2ede4"
          strokeOpacity="0.08"
        />

        {/* Rotating ring group */}
        <g
          ref={ringRef}
          style={{ transformStyle: "preserve-3d", transformOrigin: "320px 320px" }}
        >
          <circle
            cx="320"
            cy="320"
            r="218"
            fill="none"
            stroke="#a86f50"
            strokeOpacity="0.42"
          />

          {/* Petals with depth */}
          {staticPetals.map((path, index) => (
            <path
              key={index}
              ref={(el) => {
                petalRefs.current[index] = el;
              }}
              className="e21-compass__petal"
              d={path}
              fill="none"
              stroke={index > 1 ? "#f06d55" : "#f1d6b6"}
              strokeOpacity={index % 2 === 0 ? 0.9 : 0.65}
              strokeWidth={index % 2 === 0 ? 2.4 : 1.5}
              filter={`url(#${gradientId}-glow)`}
              style={{ transformStyle: "preserve-3d" }}
            />
          ))}

          {/* Core glow */}
          <circle
            ref={coreRef}
            cx="320"
            cy="320"
            r="15"
            fill={`url(#${gradientId}-warm)`}
            filter={`url(#${gradientId}-glow)`}
          />
          <circle cx="320" cy="320" r="4" fill="#f2ede4" />

          {/* Direction indicator */}
          <circle
            ref={indicatorRef}
            cx="320"
            cy="320"
            r="9"
            fill="#f06d55"
            stroke="#f2ede4"
            strokeWidth="2"
          />
        </g>

        {/* Static arc + needle base */}
        <path
          d="M 138 555 Q 320 620 502 555"
          fill="none"
          stroke="#a86f50"
          strokeOpacity="0.66"
        />
        <path
          ref={needleRef}
          d="M 320 598 L 320 598"
          stroke="#f06d55"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>

      <span className="e21-compass__label e21-compass__label--you">
        {labels[0]}
      </span>
      <span className="e21-compass__label e21-compass__label--search">
        {labels[1]}
      </span>
      <span className="e21-compass__label e21-compass__label--reciprocal">
        {labels[2]}
      </span>
      <span className="e21-compass__help">{help}</span>
      <span className="e21-screenreader" aria-live="polite">
        5°
      </span>
    </div>
  );
}
