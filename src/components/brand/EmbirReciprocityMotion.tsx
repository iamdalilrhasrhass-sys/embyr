"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  EMBIR_MARK_PATHS,
  EMBIR_MARK_STROKE_WIDTH,
  EmbirMark,
} from "./EmbirMark";

export function EmbirReciprocityMotion({
  size = 112,
  className = "",
  label = "Embir",
  decorative = false,
}: {
  size?: number;
  className?: string;
  label?: string;
  decorative?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) {
    return <EmbirMark size={size} decorative={decorative} title={label} className={className} />;
  }

  const accessibility = decorative
    ? { "aria-hidden": true as const }
    : { role: "img" as const, "aria-label": label };

  return (
    <motion.svg
      {...accessibility}
      className={className}
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      focusable="false"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.16 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {EMBIR_MARK_PATHS.map((path, index) => (
        <motion.path
          key={path}
          d={path}
          stroke="currentColor"
          strokeWidth={EMBIR_MARK_STROKE_WIDTH}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0, x: index === 0 ? -3 : 3 }}
          animate={{ pathLength: 1, opacity: 1, x: 0 }}
          transition={{
            pathLength: { duration: 0.5, delay: index * 0.08, ease: "easeInOut" },
            opacity: { duration: 0.16, delay: index * 0.08 },
            x: { duration: 0.26, delay: 0.42, ease: "easeOut" },
          }}
        />
      ))}
    </motion.svg>
  );
}
