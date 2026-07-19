import type { CSSProperties } from "react";
import geometry from "./embir-mark.json";

export const EMBIR_MARK_PATHS = geometry.paths as readonly string[];
export const EMBIR_MARK_STROKE_WIDTH = geometry.strokeWidth;

export type EmbirMarkProps = {
  size?: number;
  decorative?: boolean;
  className?: string;
  style?: CSSProperties;
  title?: string;
};

export function EmbirMark({
  size = 40,
  decorative = true,
  className,
  style,
  title = "Embir",
}: EmbirMarkProps) {
  const accessibility = decorative
    ? { "aria-hidden": true as const }
    : { role: "img" as const, "aria-label": title };

  return (
    <svg
      {...accessibility}
      className={className}
      width={size}
      height={size}
      viewBox={geometry.viewBox}
      fill="none"
      focusable="false"
      style={{ display: "block", flex: "none", ...style }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {EMBIR_MARK_PATHS.map((path) => (
        <path
          key={path}
          d={path}
          stroke="currentColor"
          strokeWidth={EMBIR_MARK_STROKE_WIDTH}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
