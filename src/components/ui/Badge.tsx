import type { HTMLAttributes, ReactNode } from "react";

type BadgeVariant = "amber" | "coral" | "muted";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  amber:
    "bg-[rgba(212,165,116,0.12)] border-[rgba(212,165,116,0.28)] text-[var(--e21-ember,#c56f4e)]",
  coral:
    "bg-[rgba(240,109,85,0.12)] border-[rgba(240,109,85,0.28)] text-[var(--e21-coral,#f06d55)]",
  muted:
    "bg-[rgba(242,237,228,0.04)] border-[var(--e21-line)] text-[var(--e21-muted)]",
};

export default function Badge({
  variant = "amber",
  children,
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5",
        "px-3 py-1.5 min-h-[28px]",
        "rounded-full",
        "border",
        "font-sans text-xs font-semibold tracking-wide uppercase",
        "select-none",
        variantStyles[variant],
        className,
      ].join(" ")}
      {...props}
    >
      {variant === "amber" && (
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--e21-ember,#c56f4e)]" aria-hidden="true" />
      )}
      {variant === "coral" && (
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--e21-coral,#f06d55)]" aria-hidden="true" />
      )}
      {children}
    </span>
  );
}
