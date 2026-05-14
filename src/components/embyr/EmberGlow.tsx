"use client";
export default function EmberGlow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`ember-glow ${className}`}>{children}</div>;
}
