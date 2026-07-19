import type { CSSProperties } from "react";
import { EmbirMark } from "./EmbirMark";

export type EmbirLogoProps = {
  variant?: "mark" | "wordmark" | "lockup" | "stacked";
  tone?: "light" | "dark" | "rose" | "mono";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  tagline?: string | null;
  animated?: boolean;
  decorative?: boolean;
  className?: string;
};

const MARK_SIZE = { xs: 20, sm: 30, md: 40, lg: 56, xl: 72 } as const;
const WORD_SIZE = { xs: 18, sm: 24, md: 31, lg: 43, xl: 54 } as const;

const TONES = {
  light: {
    mark: "var(--embir-blush-300)",
    word: "var(--embir-bone-100)",
    tagline: "var(--embir-muted-on-dark)",
  },
  dark: {
    mark: "var(--embir-plum-900)",
    word: "var(--embir-plum-900)",
    tagline: "var(--embir-plum-700)",
  },
  rose: {
    mark: "var(--embir-rose-400)",
    word: "var(--embir-bone-100)",
    tagline: "var(--embir-blush-200)",
  },
  mono: { mark: "currentColor", word: "currentColor", tagline: "currentColor" },
} as const;

export function EmbirLogo({
  variant = "lockup",
  tone = "light",
  size = "md",
  tagline = null,
  animated = false,
  decorative = false,
  className = "",
}: EmbirLogoProps) {
  const colors = TONES[tone];
  const accessibility = decorative ? { "aria-hidden": true as const } : {};
  const markSize = MARK_SIZE[size];
  const wordSize = WORD_SIZE[size];
  const mark = (
    <EmbirMark
      size={markSize}
      decorative={variant === "mark" ? decorative : true}
      className={animated ? "embir-mark--ambient" : undefined}
      style={{ color: colors.mark }}
    />
  );
  const wordmark = (
    <span
      className="embir-logo__wordmark"
      style={{ color: colors.word, fontSize: wordSize } as CSSProperties}
    >
      Embir
    </span>
  );

  if (variant === "mark") {
    return <span {...accessibility} className={`embir-logo embir-logo--mark ${className}`.trim()}>{mark}</span>;
  }
  if (variant === "wordmark") {
    return <span {...accessibility} className={`embir-logo embir-logo--wordmark ${className}`.trim()}>{wordmark}</span>;
  }

  return (
    <span
      {...accessibility}
      className={`embir-logo embir-logo--${variant} ${className}`.trim()}
      data-animated={animated || undefined}
    >
      {mark}
      <span className="embir-logo__copy">
        {wordmark}
        {tagline ? (
          <span className="embir-logo__tagline" style={{ color: colors.tagline }}>
            {tagline}
          </span>
        ) : null}
      </span>
    </span>
  );
}

export default EmbirLogo;
