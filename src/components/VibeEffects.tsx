"use client";

import { useEffect, useRef, useState, useCallback } from 'react';

// ═══════════════════════════════════
//  VIBE CODE 3D — Premium Effects Library
//  Aurora • Glass • 3D Tilt • Parallax • Stagger
// ═══════════════════════════════════

// ─── 3D Tilt Card ─────────────────
export function VibeCard({ children, className = '', intensity = 15, glare = true }: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({});

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setStyle({
      transform: `perspective(1000px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale3d(1.02,1.02,1.02)`,
      transition: 'transform 0.1s ease-out',
    });
  }, [intensity]);

  const handleLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)',
      transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
    });
  };

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={style}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {glare && (
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.08) 0%, transparent 60%)',
          }}
        />
      )}
      {children}
    </div>
  );
}

// ─── 3D Scroll Section ─────────────────
export function ScrollSection({ children, className = '', speed = 0.5 }: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportH / 2;
      const distance = (elementCenter - viewportCenter) * speed;
      setOffset(distance);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translateY(${offset * 0.15}px) scale(${1 + Math.abs(offset) * 0.0001})`,
        transition: 'transform 0.1s linear',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}

// ─── Stagger Entrance ─────────────────
export function Stagger({ children, className = '', delay = 0.1 }: {
  children: React.ReactNode[];
  className?: string;
  delay?: number;
}) {
  return (
    <div className={className}>
      {Array.isArray(children) && children.map((child, i) => (
        <div
          key={i}
          className="stagger-item"
          style={{
            opacity: 0,
            transform: 'translateY(40px) rotateX(10deg)',
            animation: `staggerIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * delay}s forwards`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

// ─── Floating Aurora Bubbles ─────────────────
export function AuroraBubbles({ count = 20, colors = ['#6366F1', '#8B5CF6', '#06B6D4', '#A78BFA'] }: {
  count?: number;
  colors?: string[];
}) {
  const bubbles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    duration: 3 + Math.random() * 4,
    delay: Math.random() * 3,
    blur: 80 + Math.random() * 40,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ perspective: '800px' }}>
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="absolute rounded-full"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            background: `radial-gradient(circle, ${b.color}40, transparent 70%)`,
            filter: `blur(${b.blur}px)`,
            animation: `auroraFloat ${b.duration}s ease-in-out ${b.delay}s infinite alternate`,
            opacity: 0.3 + Math.random() * 0.4,
          }}
        />
      ))}
    </div>
  );
}

// ─── 3D Depth Layer ─────────────────
export function DepthLayer({ children, depth = 0, className = '' }: {
  children: React.ReactNode;
  depth?: number; // 0-1 (0=far, 1=near)
  className?: string;
}) {
  const scale = 0.8 + depth * 0.4;
  const translateZ = depth * 200;
  const blur = (1 - depth) * 3;

  return (
    <div
      className={className}
      style={{
        transform: `translateZ(${translateZ}px) scale(${scale})`,
        filter: `blur(${blur}px)`,
        transition: 'transform 0.1s linear',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}

// ─── Glass Card 3D ─────────────────
export function GlassCard3D({ children, className = '' }: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--mouse-x', `${x}%`);
      el.style.setProperty('--mouse-y', `${y}%`);
    };

    el.addEventListener('mousemove', handleMouseMove);
    return () => el.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={ref}
      className={`relative group ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      {/* Glass layer */}
      <div className="absolute inset-0 rounded-3xl border border-white/10 backdrop-blur-xl bg-white/[0.03] transition-all duration-500 group-hover:border-white/20 group-hover:bg-white/[0.06]"
        style={{
          transform: 'translateZ(0px)',
          background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.06) 0%, transparent 60%)',
        }}
      />
      {/* Content */}
      <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
        {children}
      </div>
      {/* Glow edge */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(139,92,246,0.1) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}

// ─── Parallax Hero ─────────────────
export function ParallaxHero({ children, className = '' }: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Parallax background */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translateY(${scrollY * 0.3}px)`,
          willChange: 'transform',
        }}
      >
        <AuroraBubbles count={30} />
      </div>
      {/* Content moves slower */}
      <div
        className="relative z-10"
        style={{
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Rotating 3D Ring ─────────────────
export function Rotating3DRing({ children, className = '', speed = 20 }: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}) {
  return (
    <div className={`relative ${className}`} style={{ perspective: '1200px' }}>
      <div
        className="animate-rotate3d"
        style={{
          animation: `rotate3d ${speed}s linear infinite`,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── CSS Keyframes (inject once) ─────────────────
export function VibeKeyframes() {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes staggerIn {
        from { opacity: 0; transform: translateY(40px) rotateX(10deg); }
        to { opacity: 1; transform: translateY(0) rotateX(0deg); }
      }
      @keyframes auroraFloat {
        0% { transform: translateY(0px) translateX(0px) scale(1); }
        50% { transform: translateY(-30px) translateX(20px) scale(1.3); }
        100% { transform: translateY(10px) translateX(-15px) scale(0.9); }
      }
      @keyframes rotate3d {
        from { transform: rotateY(0deg); }
        to { transform: rotateY(360deg); }
      }
      @keyframes glowPulse {
        0%, 100% { box-shadow: 0 0 20px rgba(139,92,246,0.1); }
        50% { box-shadow: 0 0 40px rgba(139,92,246,0.2); }
      }
      @keyframes float3d {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33% { transform: translateY(-10px) rotate(2deg); }
        66% { transform: translateY(5px) rotate(-1deg); }
      }
      .perspective-1000 { perspective: 1000px; }
      .transform-3d { transform-style: preserve-3d; }
      .translate-z-10 { transform: translateZ(10px); }
      .translate-z-20 { transform: translateZ(20px); }
      .translate-z-50 { transform: translateZ(50px); }
      .backface-hidden { backface-visibility: hidden; }
    `}} />
  );
}
