'use client';

import { useId } from 'react';

type EmbyrLogoProps = {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
};

const fullLogoSizes = {
  sm: 'h-9 w-[120px]',
  md: 'h-11 w-[148px]',
  lg: 'h-20 w-[270px]',
};

const markSizes = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-14 w-14',
};

const flamePath =
  'M85,145 C55,115 30,85 30,55 C30,25 60,12 75,40 C78,45 82,53 82,58 C85,42 92,20 108,10 C118,3 128,15 122,35 C138,45 132,75 118,105 C102,125 92,138 85,145 Z';

export default function EmbyrLogo({
  size = 'md',
  showText = true,
  className = '',
}: EmbyrLogoProps) {
  const rawId = useId().replace(/:/g, '');
  const gradientId = `embirFlame-${rawId}`;
  const glowId = `embirGlow-${rawId}`;

  if (!showText) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 150 180"
        className={`${markSizes[size]} shrink-0 overflow-visible drop-shadow-[0_0_14px_rgba(255,31,90,0.58)] ${className}`}
        role="img"
        aria-label="embir.xyz"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ff1f5a" />
            <stop offset="60%" stopColor="#ff5e36" />
            <stop offset="100%" stopColor="#ffa333" />
          </linearGradient>
          <filter id={glowId} x="-55%" y="-55%" width="210%" height="210%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d={flamePath} fill={`url(#${gradientId})`} filter={`url(#${glowId})`} />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 600 180"
      className={`${fullLogoSizes[size]} shrink-0 overflow-visible ${className}`}
      role="img"
      aria-label="embir.xyz — Allume l'étincelle"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#ff1f5a" />
          <stop offset="60%" stopColor="#ff5e36" />
          <stop offset="100%" stopColor="#ffa333" />
        </linearGradient>
        <filter id={glowId} x="-55%" y="-55%" width="210%" height="210%">
          <feGaussianBlur stdDeviation="5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter={`url(#${glowId})`}>
        <path d={flamePath} fill={`url(#${gradientId})`} />
      </g>

      <text
        x="165"
        y="112"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="72"
        fontWeight="800"
        fill="#FFFFFF"
        letterSpacing="-3"
      >
        embir
        <tspan fill={`url(#${gradientId})`} fontWeight="400" letterSpacing="-1">
          .xyz
        </tspan>
      </text>
    </svg>
  );
}
