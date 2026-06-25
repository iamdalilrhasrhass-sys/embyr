import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: "min-h-[44px] px-4 text-sm",
  md: "min-h-[48px] px-6 text-base",
  lg: "min-h-[56px] px-8 text-lg",
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--e21-ember)] text-[var(--e21-bone)] border border-[var(--e21-ember)] font-bold",
  secondary:
    "border border-[var(--e21-line)] text-[var(--e21-bone)] bg-[rgba(242,237,228,0.04)]",
  ghost:
    "text-[var(--e21-muted)] bg-transparent border border-transparent",
  danger:
    "bg-[var(--e21-coral)] text-white border border-[var(--e21-coral)] font-bold",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center gap-2 rounded-[var(--eb-radius-sm,12px)]",
        "font-sans font-medium tracking-wide",
        "transition-all duration-200",
        "focus-visible:outline-2 focus-visible:outline-[var(--e21-focus,#ffd2b8)] focus-visible:outline-offset-2",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        "touch-manipulation select-none",
        sizeStyles[size],
        variantStyles[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
