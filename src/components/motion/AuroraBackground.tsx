'use client';

import { useMemo } from 'react';

interface Blob {
  id: number;
  x: string;
  y: string;
  w: string;
  h: string;
  color: string;
  opacity: number;
  blur: string;
  animDuration: number;
  animDelay: number;
  morphScale: number;
}

const EMBYR_BLOBS: Blob[] = [
  // Grand rose central-haut — cœur chaud
  { id: 1, x: '50%', y: '-10%', w: '50rem', h: '50rem', color: '#f43f5e', opacity: 0.22, blur: '120px', animDuration: 16, animDelay: 0, morphScale: 1.12 },
  // Amber sur la droite — chaleur
  { id: 2, x: '85%', y: '8%', w: '38rem', h: '38rem', color: '#f59e0b', opacity: 0.16, blur: '110px', animDuration: 20, animDelay: -4, morphScale: 1.08 },
  // Purple profond en bas à gauche — mystère
  { id: 3, x: '8%', y: '55%', w: '34rem', h: '34rem', color: '#a855f7', opacity: 0.13, blur: '100px', animDuration: 24, animDelay: -8, morphScale: 1.14 },
  // Rose pâle en bas à droite — sensualité
  { id: 4, x: '75%', y: '65%', w: '30rem', h: '30rem', color: '#fb7185', opacity: 0.11, blur: '90px', animDuration: 18, animDelay: -2, morphScale: 1.06 },
  // Amber doré en haut à gauche — luxe
  { id: 5, x: '15%', y: '-5%', w: '28rem', h: '28rem', color: '#d97706', opacity: 0.09, blur: '95px', animDuration: 22, animDelay: -11, morphScale: 1.10 },
  // Violet électrique — accent
  { id: 6, x: '60%', y: '35%', w: '24rem', h: '24rem', color: '#7c3aed', opacity: 0.07, blur: '85px', animDuration: 26, animDelay: -6, morphScale: 1.05 },
];

const FEMYNYA_BLOBS: Blob[] = [
  { id: 1, x: '50%', y: '-10%', w: '50rem', h: '50rem', color: '#ec4899', opacity: 0.18, blur: '120px', animDuration: 16, animDelay: 0, morphScale: 1.12 },
  { id: 2, x: '85%', y: '8%', w: '38rem', h: '38rem', color: '#8b5cf6', opacity: 0.16, blur: '110px', animDuration: 20, animDelay: -4, morphScale: 1.08 },
  { id: 3, x: '8%', y: '55%', w: '34rem', h: '34rem', color: '#d946ef', opacity: 0.10, blur: '100px', animDuration: 24, animDelay: -8, morphScale: 1.14 },
  { id: 4, x: '75%', y: '65%', w: '30rem', h: '30rem', color: '#f472b6', opacity: 0.09, blur: '90px', animDuration: 18, animDelay: -2, morphScale: 1.06 },
  { id: 5, x: '15%', y: '-5%', w: '28rem', h: '28rem', color: '#c084fc', opacity: 0.07, blur: '95px', animDuration: 22, animDelay: -11, morphScale: 1.10 },
  { id: 6, x: '60%', y: '35%', w: '24rem', h: '24rem', color: '#a78bfa', opacity: 0.05, blur: '85px', animDuration: 26, animDelay: -6, morphScale: 1.05 },
];

export default function AuroraBackground({
  variant = 'femynya',
}: {
  variant?: 'femynya' | 'embyr' | 'embir';
}) {
  const blobs = variant === 'embyr' || variant === 'embir' ? EMBYR_BLOBS : FEMYNYA_BLOBS;
  const isEmbyr = variant === 'embyr' || variant === 'embir';

  // Génère les keyframes inline pour chaque blob
  const blobStyles = useMemo(() => {
    return blobs.map((b) => {
      const name = `auroraBlob${b.id}`;
      return `@keyframes ${name} {
  0%   { transform: translate(0, 0) scale(1); opacity: ${b.opacity}; }
  25%  { transform: translate(${b.id % 2 === 0 ? '2rem' : '-1.5rem'}, ${b.id % 3 === 0 ? '-2rem' : '1rem'}) scale(${b.morphScale}); opacity: ${(b.opacity * 1.3).toFixed(3)}; }
  50%  { transform: translate(${b.id % 2 === 0 ? '-1rem' : '2rem'}, ${b.id % 3 === 0 ? '1.5rem' : '-2.5rem'}) scale(${(b.morphScale * 0.92).toFixed(2)}); opacity: ${(b.opacity * 0.85).toFixed(3)}; }
  75%  { transform: translate(${b.id % 2 === 0 ? '-2rem' : '1rem'}, ${b.id % 3 === 0 ? '0.5rem' : '-0.5rem'}) scale(${(b.morphScale * 1.05).toFixed(2)}); opacity: ${(b.opacity * 1.1).toFixed(3)}; }
  100% { transform: translate(0, 0) scale(1); opacity: ${b.opacity}; }
}`;
    }).join('\n');
  }, [blobs]);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" style={{ background: '#06030F' }}>
      {/* Styles injectés pour les keyframes uniques par blob */}
      <style>{blobStyles}</style>

      {/* Blobs animés */}
      {blobs.map((b) => (
        <div
          key={b.id}
          className="absolute rounded-full"
          style={{
            left: b.x,
            top: b.y,
            width: b.w,
            height: b.h,
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle at center, ${b.color} 0%, transparent 70%)`,
            filter: `blur(${b.blur})`,
            animation: `auroraBlob${b.id} ${b.animDuration}s ease-in-out ${b.animDelay}s infinite`,
            willChange: 'transform, opacity',
          }}
        />
      ))}

      {/* Grain / noise overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />

      {/* Subtle grid — only Embyr */}
      {isEmbyr && (
        <div
          className="absolute inset-0 z-[1]"
          style={{
            opacity: 0.03,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            maskImage: 'radial-gradient(circle at 50% 30%, black 40%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 30%, black 40%, transparent 80%)',
          }}
        />
      )}

      {/* Vignette — assombrit les bords pour focaliser le centre */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background: 'radial-gradient(ellipse at 50% 35%, transparent 50%, rgba(6,3,15,0.6) 100%)',
        }}
      />

      {/* Ligne d'horizon subtile — ligne lumineuse */}
      {isEmbyr && (
        <div
          className="absolute left-0 right-0 z-[3]"
          style={{
            top: '55%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(251,113,133,0.08) 20%, rgba(245,158,11,0.10) 50%, rgba(168,85,247,0.06) 80%, transparent)',
            animation: 'horizonPulse 8s ease-in-out infinite',
          }}
        />
      )}
    </div>
  );
}
