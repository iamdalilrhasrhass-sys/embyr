import type { HTMLAttributes } from "react";

type AvatarSize = "sm" | "md" | "lg" | "xl";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt: string;
  fallback?: string;
  size?: AvatarSize;
  isOnline?: boolean;
}

const sizeMap: Record<AvatarSize, number> = {
  sm: 32,
  md: 44,
  lg: 64,
  xl: 96,
};

const onlineDotSizes: Record<AvatarSize, string> = {
  sm: "w-2 h-2 -bottom-px -right-px",
  md: "w-2.5 h-2.5 -bottom-0.5 -right-0.5",
  lg: "w-3 h-3 -bottom-0.5 -right-0.5",
  xl: "w-3.5 h-3.5 -bottom-0.5 -right-0.5",
};

export default function Avatar({
  src,
  alt,
  fallback,
  size = "md",
  isOnline,
  className = "",
  ...props
}: AvatarProps) {
  const px = sizeMap[size];

  const initials = fallback
    ? fallback.slice(0, 2).toUpperCase()
    : alt
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "?";

  return (
    <div
      className={["relative inline-flex flex-shrink-0", className].join(" ")}
      style={{ width: px, height: px }}
      {...props}
    >
      <div
        className={[
          "w-full h-full rounded-full overflow-hidden",
          "bg-[var(--e21-raised,#100a12)]",
          "border border-[var(--e21-line)]",
          "flex items-center justify-center",
        ].join(" ")}
        role="img"
        aria-label={alt}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <span
            className={[
              "font-sans font-semibold text-[var(--e21-bone)] select-none",
              size === "sm" ? "text-xs" : "",
              size === "md" ? "text-sm" : "",
              size === "lg" ? "text-base" : "",
              size === "xl" ? "text-xl" : "",
            ].join(" ")}
          >
            {initials}
          </span>
        )}
      </div>

      {isOnline && (
        <span
          className={[
            "absolute rounded-full",
            "bg-[var(--e21-coral,#f06d55)]",
            "border-2 border-[var(--e21-void,#09060c)]",
            onlineDotSizes[size],
          ].join(" ")}
          aria-label="En ligne"
          role="status"
        />
      )}
    </div>
  );
}
