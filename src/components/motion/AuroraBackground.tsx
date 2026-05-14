'use client';

export default function AuroraBackground({
  variant = 'femynya',
}: {
  variant?: 'femynya' | 'embyr';
}) {
  const femynya = variant === 'femynya';
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Top-center glow */}
      <div
        className={`absolute -top-32 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full blur-3xl animate-[auroraFloat_12s_ease-in-out_infinite] ${
          femynya ? 'bg-pink-500/18' : 'bg-cyan-400/16'
        }`}
      />
      {/* Right glow */}
      <div
        className={`absolute right-[-8rem] top-24 h-[28rem] w-[28rem] rounded-full blur-3xl animate-[auroraFloat_15s_ease-in-out_infinite_reverse] ${
          femynya ? 'bg-violet-500/16' : 'bg-indigo-600/18'
        }`}
      />
      {/* Bottom-left glow */}
      <div
        className={`absolute bottom-[-10rem] left-[-6rem] h-[26rem] w-[26rem] rounded-full blur-3xl animate-[auroraFloat_18s_ease-in-out_infinite] ${
          femynya ? 'bg-fuchsia-400/10' : 'bg-violet-500/12'
        }`}
      />
    </div>
  );
}
