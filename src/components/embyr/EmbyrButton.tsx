"use client";
type Variant = "primary" | "secondary" | "ghost" | "danger" | "copper";

const STYLES: Record<Variant, string> = {
  primary: "bg-[var(--eb-accent)] text-[var(--eb-text-primary)]",
  secondary: "bg-[var(--eb-bg-elev-2)] text-[var(--eb-text-primary)] border border-[var(--eb-border-soft)]",
  ghost: "bg-transparent text-[var(--eb-text-secondary)] hover:bg-[var(--eb-bg-elev-2)]",
  danger: "bg-[var(--eb-danger)] text-white",
  copper: "bg-[var(--eb-copper)] text-[var(--eb-text-primary)]",
};

export default function EmbyrButton({
  variant = "primary",
  children,
  className = "",
  ...props
}: {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`min-h-[44px] px-5 py-3 rounded-[var(--eb-radius-btn)] font-medium text-sm active:scale-[0.97] transition-transform ${STYLES[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
