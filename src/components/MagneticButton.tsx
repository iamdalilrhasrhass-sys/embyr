"use client";
import { useRef, ReactNode, MouseEvent } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  href?: string;
}

export default function MagneticButton({ children, className = "", onClick, type = "button", disabled, href }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${Math.round(x * 0.3)}px, ${Math.round(y * 0.3)}px)`;
  };

  const onMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "translate(0, 0)";
  };

  if (href) {
    return (
      <a href={href}>
        <div ref={ref} className={className} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} style={{ transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          {children}
        </div>
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled}>
      <div ref={ref} className={className} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} style={{ transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
        {children}
      </div>
    </button>
  );
}
