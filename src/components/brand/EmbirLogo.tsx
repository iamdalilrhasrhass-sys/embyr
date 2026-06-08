'use client';

type EmbyrLogoProps = {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
};

const sizeMap = {
  sm: { mark: 'h-8 w-8', text: 'text-xl', gap: 'gap-2' },
  md: { mark: 'h-10 w-10', text: 'text-2xl', gap: 'gap-3' },
  lg: { mark: 'h-14 w-14', text: 'text-4xl', gap: 'gap-4' },
};

export default function EmbyrLogo({
  size = 'md',
  showText = true,
  className = '',
}: EmbyrLogoProps) {
  const sizes = sizeMap[size];
  const gradientId = `embir-flame-${size}`;

  return (
    <div className={`inline-flex items-center ${sizes.gap} ${className}`} aria-label="embir.xyz">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 45 45"
        className={`${sizes.mark} shrink-0 overflow-visible drop-shadow-[0_0_12px_rgba(255,31,90,0.48)]`}
        role="img"
        aria-hidden={!showText}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ff1f5a" />
            <stop offset="60%" stopColor="#ff5e36" />
            <stop offset="100%" stopColor="#ffa333" />
          </linearGradient>
          <filter id={`${gradientId}-glow`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M22.5,38 C14.5,30 8,22 8,14 C8,6 16,2.5 20,10 C20.8,11.3 21.8,13.5 21.8,14.8 C22.5,10.7 24.3,5 28.5,2.5 C31.1,0.7 33.7,3.8 32.1,9 C36.3,11.6 34.7,19.5 31,27.3 C26.8,32.6 24.3,36.1 22.5,38 Z"
          fill={`url(#${gradientId})`}
          filter={`url(#${gradientId}-glow)`}
        />
      </svg>

      {showText && (
        <div className="leading-none">
          <div className={`font-black tracking-[-0.065em] text-white ${sizes.text}`}>
            embir
            <span className="bg-gradient-to-r from-[#ff1f5a] via-[#ff5e36] to-[#ffa333] bg-clip-text font-normal tracking-[-0.035em] text-transparent">
              .xyz
            </span>
          </div>
          <div className="mt-1 hidden text-[10px] font-medium uppercase tracking-[0.32em] text-white/35 sm:block">
            Allume l&apos;étincelle
          </div>
        </div>
      )}
    </div>
  );
}
