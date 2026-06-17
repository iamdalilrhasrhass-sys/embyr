import EmbirLogo from "@/components/brand/EmbirLogo";

export default function EmbirAvatar({
  src, name, size = 48, isPremium, isOnline,
}: {
  src?: string; name: string; size?: number; isPremium?: boolean; isOnline?: boolean;
}) {
  const initials = name.charAt(0).toUpperCase();
  return (
    <div className="relative inline-flex" style={{ width: size, height: size }}>
      {/* Premium ring */}
      {isPremium && (
        <div className="absolute -inset-[3px] rounded-full animate-[spin_8s_linear_infinite]"
          style={{ background: "conic-gradient(from 0deg, var(--eb-copper), var(--eb-gold-dark), var(--eb-accent), var(--eb-copper))" }} />
      )}
      {/* Avatar */}
      <div className="relative w-full h-full rounded-full overflow-hidden bg-[var(--eb-bg-elev-2)] flex items-center justify-center border-2 border-[var(--eb-bg-base)]">
        {src ? <img src={src} alt={name} className="w-full h-full object-cover" /> : (
          <div className="flex items-center justify-center w-full h-full rounded-full bg-[#0a0614]" style={{ transform: `scale(${size / 48})` }}>
            <EmbirLogo size="sm" variant="mark" />
          </div>
        )}
      </div>
      {/* Online dot */}
      {isOnline && (
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[var(--eb-success)] border-2 border-[var(--eb-bg-base)]" />
      )}
    </div>
  );
}
