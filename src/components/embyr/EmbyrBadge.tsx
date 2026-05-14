type BadgeVariant = "premium" | "certified" | "online" | "new";
const BADGE_COLORS: Record<BadgeVariant, string> = {
  premium: "bg-[var(--eb-copper)]",
  certified: "bg-[var(--eb-gold-dark)]",
  online: "bg-[var(--eb-success)]",
  new: "bg-[var(--eb-accent)]",
};

export default function EmbyrBadge({ variant = "new", children }: { variant?: BadgeVariant; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-[var(--eb-radius-badge)] text-[10px] font-medium text-white ${BADGE_COLORS[variant]}`}>
      {children}
    </span>
  );
}
