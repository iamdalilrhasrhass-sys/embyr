'use client';
import { ReactNode, useRef } from 'react';

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  intensity?: number;
  tiltScale?: number;
};

export default function TiltCard({
  children,
  className = '',
  intensity = 6,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  function onMove(event: React.MouseEvent<HTMLDivElement>) {
    const node = ref.current;
    if (!node) return;
    if (window.innerWidth < 768) return;
    const rect = node.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * intensity;
    const rotateX = -((y / rect.height) - 0.5) * intensity;
    node.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  }

  function onLeave() {
    const node = ref.current;
    if (!node) return;
    node.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={[
        'transition-transform duration-300 ease-out will-change-transform',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}
