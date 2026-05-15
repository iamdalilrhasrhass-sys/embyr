'use client';

export default function AuroraBackground({
  variant = 'femynya',
}: {
  variant?: 'femynya' | 'embyr';
}) {
  const embyr = variant === 'embyr';
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Top-center glow */}
      <div
        className={`absolute -top-40 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full blur-3xl animate-[auroraFloat_12s_ease-in-out_infinite] ${
          embyr ? 'bg-rose-500/20' : 'bg-pink-500/18'
        }`}
      />
      {/* Right glow — amber pour Embyr */}
      <div
        className={`absolute right-[-10rem] top-16 h-[32rem] w-[32rem] rounded-full blur-3xl animate-[auroraFloat_15s_ease-in-out_infinite_reverse] ${
          embyr ? 'bg-amber-500/18' : 'bg-violet-500/16'
        }`}
      />
      {/* Bottom-left glow */}
      <div
        className={`absolute bottom-[-12rem] left-[-8rem] h-[28rem] w-[28rem] rounded-full blur-3xl animate-[auroraFloat_18s_ease-in-out_infinite] ${
          embyr ? 'bg-purple-600/14' : 'bg-fuchsia-400/10'
        }`}
      />
      {/* Extra glow — bottom right amber/rose blend */}
      <div
        className={`absolute -bottom-24 -right-16 h-[30rem] w-[30rem] rounded-full blur-3xl animate-[auroraFloat_20s_ease-in-out_infinite_reverse] ${
          embyr ? 'bg-rose-400/12' : 'bg-violet-400/5'
        }`}
      />
    </div>
  );
}
