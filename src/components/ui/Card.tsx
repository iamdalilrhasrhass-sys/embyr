import type { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

export default function Card({
  header,
  footer,
  children,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={[
        "rounded-[var(--eb-radius-lg,24px)]",
        "border border-[var(--e21-line)]",
        "bg-[rgba(255,255,255,0.02)]",
        "backdrop-blur-lg",
        "overflow-hidden",
        className,
      ].join(" ")}
      {...props}
    >
      {header && (
        <div className="px-6 py-4 border-b border-[var(--e21-line)]">
          {header}
        </div>
      )}

      <div className="px-6 py-5">{children}</div>

      {footer && (
        <div className="px-6 py-4 border-t border-[var(--e21-line)]">
          {footer}
        </div>
      )}
    </div>
  );
}
