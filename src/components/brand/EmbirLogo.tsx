'use client';

type EmbyrLogoProps = {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
};

const textSizes = {
  sm: 'text-2xl',
  md: 'text-3xl',
  lg: 'text-5xl sm:text-6xl',
};

const dotSizes = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-14 w-14',
};

export default function EmbyrLogo({
  size = 'md',
  showText = true,
  className = '',
}: EmbyrLogoProps) {
  if (!showText) {
    return (
      <span
        className={`relative inline-flex ${dotSizes[size]} shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#ff1f5a] via-[#ff5e36] to-[#ffa333] shadow-[0_0_24px_rgba(255,94,54,0.44)] ${className}`}
        role="img"
        aria-label="embir.xyz"
      >
        <span className="absolute inset-[3px] rounded-full border border-white/22" />
        <span className="h-1/3 w-1/3 rounded-full bg-white/92 shadow-[0_0_14px_rgba(255,255,255,0.62)]" />
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-baseline ${size === 'lg' ? 'gap-4' : 'gap-2'} ${className}`}
      aria-label="embir.xyz — Allume l'étincelle"
    >
      <span
        className={`font-sans font-black leading-none tracking-[-0.065em] text-white ${textSizes[size]}`}
      >
        embir
        <span className="bg-gradient-to-tr from-[#ff1f5a] via-[#ff5e36] to-[#ffa333] bg-clip-text text-transparent">
          .
        </span>
        xyz
      </span>

      {size === 'lg' ? (
        <span className="hidden text-xs font-semibold uppercase tracking-[0.28em] text-white/32 md:inline-flex">
          Allume l&apos;étincelle
        </span>
      ) : null}
    </div>
  );
}
