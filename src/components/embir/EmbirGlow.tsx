"use client";
export default function EmbirGlow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`embir-glow ${className}`}>{children}</div>;
}
