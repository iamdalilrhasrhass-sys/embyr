"use client";
import { useRef } from "react";

export default function Card3DTilt({
  children,
  className = "",
  intensity = 10,
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const x = (clientX - rect.left) / rect.width - 0.5;
    const y = (clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty("--eb-rx", `${x * intensity}deg`);
    card.style.setProperty("--eb-ry", `${-y * intensity}deg`);
  };

  const handleLeave = () => {
    const card = ref.current;
    if (!card) return;
    card.style.setProperty("--eb-rx", "0deg");
    card.style.setProperty("--eb-ry", "0deg");
  };

  return (
    <div
      ref={ref}
      className={`card-3d ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onTouchMove={handleMove}
      onTouchEnd={handleLeave}
    >
      {children}
    </div>
  );
}
