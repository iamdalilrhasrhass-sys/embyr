"use client";

import { useEffect, useRef, useCallback } from "react";

export default function MouseEnvironment() {
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -100, y: -100, tx: -100, ty: -100 });
  const trailIndex = useRef(0);
  const MAX_TRAILS = 12;

  const createTrail = useCallback((x: number, y: number) => {
    const trail = document.createElement("div");
    trail.className = "emb-cursor-trail";
    trail.style.left = x + "px";
    trail.style.top = y + "px";
    trail.style.width = "12px";
    trail.style.height = "12px";
    document.body.appendChild(trail);
    trailRefs.current[trailIndex.current % MAX_TRAILS]?.remove();
    trailRefs.current[trailIndex.current % MAX_TRAILS] = trail;
    trailIndex.current++;
    setTimeout(() => trail.remove(), 600);
  }, []);

  useEffect(() => {
    // Skip on touch devices
    if (typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0)) return;
    if (typeof window !== "undefined" && window.innerWidth < 768) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      if (trailIndex.current % 5 === 0) createTrail(e.clientX, e.clientY);

      // Parallax layers
      const layers = document.querySelectorAll<HTMLElement>(".emb-parallax-layer");
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      layers.forEach((layer) => {
        const depth = parseFloat(layer.dataset.depth || "0");
        layer.style.transform = `translate3d(${dx * depth * 25}px, ${dy * depth * 25}px, 0)`;
      });

      // Glass cards mouse tracking
      const cards = document.querySelectorAll<HTMLElement>(".emb-glass-extreme");
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const rx = ((e.clientX - rect.left) / rect.width) * 100;
        const ry = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty("--mouse-x", `${rx}%`);
        card.style.setProperty("--mouse-y", `${ry}%`);
      });
    };

    const animate = () => {
      const m = mouseRef.current;
      m.tx += (m.x - m.tx) * 0.12;
      m.ty += (m.y - m.ty) * 0.12;
      if (dotRef.current) {
        dotRef.current.style.left = m.tx + "px";
        dotRef.current.style.top = m.ty + "px";
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
      trailRefs.current.forEach((t) => t?.remove());
    };
  }, [createTrail]);

  return <div ref={dotRef} className="emb-cursor-dot hidden md:block" />;
}
