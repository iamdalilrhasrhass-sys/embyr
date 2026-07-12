import type { CSSProperties } from 'react';
type Size = 'sm' | 'md' | 'lg';
const H: Record<Size, number> = { sm: 28, md: 40, lg: 56 };
/** Mark = /brand/embir-mark.svg via <img>. NE PAS inliner (collision d'IDs si rendu plusieurs fois). */
export default function EmbirLogo({ size = 'md', variant = 'lockup', showTagline = false, className = '' }:
  { size?: Size; variant?: 'mark' | 'lockup'; showTagline?: boolean; className?: string }) {
  const h = H[size];
  const mark = (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/brand/embir-mark.svg" alt="Embir" width={h} height={h} style={{ display: 'block' } as CSSProperties} />
  );
  if (variant === 'mark') return <span className={className}>{mark}</span>;
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {mark}
      <span className="flex flex-col leading-none">
        <span className="font-extrabold tracking-tight text-white" style={{ fontSize: h * 0.62 }}>embir<span style={{ color: '#d4a574' }}>.</span></span>
        {showTagline && <span className="uppercase text-[#d4a574]/80" style={{ fontSize: h * 0.16, letterSpacing: '0.25em' }}>core connection features are free</span>}
      </span>
    </span>
  );
}
