'use client';

type EmbyrLogoProps = {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
};

export default function EmbyrLogo({
  size = 'md',
  showText = true,
  className = '',
}: EmbyrLogoProps) {
  const sizes = {
    sm: { mark: 'h-8 w-8', text: 'text-xl' },
    md: { mark: 'h-10 w-10', text: 'text-2xl' },
    lg: { mark: 'h-14 w-14', text: 'text-4xl' },
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Symbole : E abstrait dans un cercle / gemme */}
      <div
        className={`relative shrink-0 overflow-hidden rounded-2xl border border-cyan-300/20 bg-white/10 shadow-[0_0_42px_rgba(6,182,212,0.22)] backdrop-blur-xl ${sizes.mark}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_18%,rgba(255,255,255,0.8),transparent_18%),linear-gradient(135deg,#06b6d4,#3730a3_52%,#7c3aed)]" />
        <div className="absolute inset-[3px] rounded-[14px] bg-black/25" />
        <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full p-3" fill="none" aria-hidden="true">
          <path d="M42 14H22C18.5 14 16 16.5 16 20V44C16 47.5 18.5 50 22 50H44" stroke="white" strokeWidth="5" strokeLinecap="round" />
          <path d="M22 31H42" stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0.86" />
          <path d="M23 22H45" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.62" />
          <path d="M23 42H45" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.62" />
        </svg>
        <div className="absolute bottom-1 right-1 h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(103,232,249,0.95)]" />
      </div>

      {showText && (
        <div className="leading-none">
          <div className={`font-black tracking-[-0.06em] text-white ${sizes.text}`}>
            Emb<span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400 bg-clip-text text-transparent">yr</span>
          </div>
          <div className="mt-1 hidden text-[10px] font-medium uppercase tracking-[0.32em] text-white/40 sm:block">
            Club privé
          </div>
        </div>
      )}
    </div>
  );
}
