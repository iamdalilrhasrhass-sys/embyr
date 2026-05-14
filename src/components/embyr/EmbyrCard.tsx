export default function EmbyrCard({
  children,
  className = "",
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`rounded-[var(--eb-radius-card)] bg-[var(--eb-bg-elev-1)] border border-[var(--eb-border-soft)] ${hover ? "hover:border-[var(--eb-border-strong)] hover:-translate-y-0.5" : ""} transition-all ${className}`}
      style={{ boxShadow: "var(--eb-shadow-md), var(--eb-shadow-inset)" }}
    >
      {children}
    </div>
  );
}
