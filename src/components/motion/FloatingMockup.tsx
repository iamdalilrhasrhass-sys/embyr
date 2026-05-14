'use client';
import { ReactNode } from 'react';

type FloatingMockupProps = {
  children: ReactNode;
  className?: string;
};

export default function FloatingMockup({
  children,
  className = '',
}: FloatingMockupProps) {
  return (
    <div
      className={`relative will-change-transform animate-[softFloat_7s_ease-in-out_infinite] ${className}`}
    >
      {children}
    </div>
  );
}
