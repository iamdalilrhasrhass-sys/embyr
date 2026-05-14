"use client";
import { useRef, useState, useCallback, type ReactNode } from "react";

interface Vibe3DCardProps {
  children: ReactNode;
  className?: string;
  tiltAmount?: number;
  glare?: boolean;
  scale?: number;
  depth?: number; // pseudo-3D elevation
}

export default function Vibe3DCard({
  children,
  className = "",
  tiltAmount = 12,
  glare = true,
  scale = 1.03,
  depth = 20,
}: Vibe3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -tiltAmount;
      const rotateY = ((x - centerX) / centerX) * tiltAmount;
      setTransform(
        `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale},${scale},${scale}) translateZ(${depth}px)`
      );
      if (glare) {
        setGlarePos({
          x: (x / rect.width) * 100,
          y: (y / rect.height) * 100,
          opacity: 0.12,
        });
      }
    },
    [tiltAmount, scale, depth, glare]
  );

  const handleMouseLeave = useCallback(() => {
    setTransform(
      `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1) translateZ(0px)`
    );
    setGlarePos({ x: 50, y: 50, opacity: 0 });
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden transition-all duration-500 ease-out will-change-transform ${className}`}
      style={{
        transform,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,${glarePos.opacity}) 0%, transparent 60%)`,
          }}
        />
      )}
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
