"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getCopy, type Locale } from "@/lib/landing-copy";

// ═══════════════════════════════════════════════════════════
//  EMBIR — Landing Experience
//  Scroll 3D · Parallax · Liquid Mesh · Glass Extreme
//  FR / EN / ES — native triple localisation
// ═══════════════════════════════════════════════════════════

interface Props {
  locale: Locale;
}

export default function EmbirLandingExperience({ locale }: Props) {
  const c = getCopy(locale);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Global scroll progress ──
  const { scrollYProgress } = useScroll({ container: containerRef });
  const progressScale = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  // ── Hero parallax ──
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.92]);
  const heroBlur = useTransform(scrollYProgress, [0, 0.1], [0, 8]);
  const heroFilter = useMotionTemplate`blur(${heroBlur}px)`;

  // ── Background mesh parallax ──
  const meshY = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const meshScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);

  // ── Language switcher state ──
  const [langOpen, setLangOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      setNavScrolled(el.scrollTop > 80);
      const sections = ["hero", "manifest", "model", "universe", "orient", "final"];
      const scrollTop = el.scrollTop + el.clientHeight * 0.3;
      for (let i = sections.length - 1; i >= 0; i--) {
        const node = document.getElementById(sections[i]);
        if (node && node.offsetTop <= scrollTop) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // ── Custom cursor + mouse tracking on glass cards ──
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 767px)").matches) return;

    // Create cursor elements
    const cursor = document.createElement("div");
    cursor.className = "emb-cursor";
    const cursorDot = document.createElement("div");
    cursorDot.className = "emb-cursor-dot";
    document.body.appendChild(cursor);
    document.body.appendChild(cursorDot);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;

      // Track mouse on glass cards
      const cards = document.querySelectorAll(".emb-glass-extreme");
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        (card as HTMLElement).style.setProperty("--mouse-x", `${x}%`);
        (card as HTMLElement).style.setProperty("--mouse-y", `${y}%`);
      });
    };

    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      raf = requestAnimationFrame(animate);
    };
    animate();

    // Cursor grow on hoverable elements
    const onHoverable = () => cursor.style.width = "60px";
    const onHoverableLeave = () => cursor.style.width = "40px";
    const hoverables = document.querySelectorAll("a, button, .emb-glass-extreme");
    hoverables.forEach((h) => {
      h.addEventListener("mouseenter", onHoverable);
      h.addEventListener("mouseleave", onHoverableLeave);
    });

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      cursor.remove();
      cursorDot.remove();
      hoverables.forEach((h) => {
        h.removeEventListener("mouseenter", onHoverable);
        h.removeEventListener("mouseleave", onHoverableLeave);
      });
    };
  }, []);

  // ── Hero canvas particle system ──
  useEffect(() => {
    const canvas = document.getElementById("emb-hero-canvas") as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);
    const particles: { x: number; y: number; vx: number; vy: number; r: number; color: string; opacity: number }[] = [];
    const colors = ["rgba(212,165,116,", "rgba(255,94,54,", "rgba(255,31,90,"];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    let rafId = 0;
    const render = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const dx = p.x - particles[j].x;
          const dy = p.y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.strokeStyle = p.color + (0.08 * (1 - dist / 120)) + ")";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }

        // Draw particle
        ctx.fillStyle = p.color + p.opacity + ")";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      rafId = requestAnimationFrame(render);
    };
    render();

    const onResize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const langLabel = locale === "fr" ? "FR" : locale === "es" ? "ES" : "EN";
  const langFull = locale === "fr" ? "Français" : locale === "es" ? "Español" : "English";
  const langs: { code: string; label: string; href: string }[] = [
    { code: "en", label: "English", href: "/" },
    { code: "fr", label: "Français", href: "/fr" },
    { code: "es", label: "Español", href: "/es" },
  ];

  const navItems = [
    { id: "manifest", label: c.nav_vision },
    { id: "model", label: c.nav_model },
    { id: "universe", label: c.nav_universe },
    { id: "orient", label: locale === "fr" ? "Orientations" : locale === "es" ? "Orientaciones" : "Orientations" },
  ];

  return (
    <div ref={containerRef} className="emb-scroll-root">
      {/* ═══ PROGRESS BAR ═══ */}
      <motion.div
        className="emb-scroll-progress"
        style={{ scaleX: progressScale, transformOrigin: "0%" }}
      />

      {/* ═══ NAV ═══ */}
      <motion.nav
        className={`emb-nav ${navScrolled ? "emb-nav-scrolled" : ""}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link href={locale === "en" ? "/" : `/${locale}`} className="emb-nav-logo">
          Embir
        </Link>
        <div className="emb-nav-links">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`emb-nav-link ${activeSection === item.id ? "emb-nav-link-active" : ""}`}
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="emb-nav-actions">
          {/* Language switcher */}
          <div className="emb-lang-switch" onMouseEnter={() => setLangOpen(true)} onMouseLeave={() => setLangOpen(false)}>
            <button className="emb-lang-btn">
              <span className="emb-lang-globe">◐</span>
              {langLabel}
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  className="emb-lang-menu"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {langs.map((l) => (
                    <Link key={l.code} href={l.href} className={`emb-lang-item ${l.code === locale ? "emb-lang-item-active" : ""}`}>
                      <span className="emb-lang-code">{l.code.toUpperCase()}</span>
                      {l.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Link href="/auth/register" className="emb-nav-cta">
            {c.nav_join}
          </Link>
        </div>
      </motion.nav>

      {/* ═══ HERO ═══ */}
      <section id="hero" className="emb-hero">
        {/* Liquid mesh background */}
        <motion.div className="emb-liquid-mesh" style={{ y: meshY, scale: meshScale }} />

        {/* Particle canvas */}
        <canvas id="emb-hero-canvas" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }} />

        {/* Floating orbs */}
        <div className="emb-hero-orbs">
          <motion.div
            className="emb-orb emb-orb-1"
            animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="emb-orb emb-orb-2"
            animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="emb-orb emb-orb-3"
            animate={{ x: [0, 40, 0], y: [0, 60, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <motion.div className="emb-hero-content" style={{ y: heroY, opacity: heroOpacity, scale: heroScale, filter: heroFilter }}>
          <motion.div
            className="emb-hero-badge emb-float-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="emb-badge-dot" />
            {c.hero_badge}
          </motion.div>

          <h1 className="emb-super-title">
            <span className="emb-word emb-gradient-text-super" style={{ animationDelay: "0.1s" }}>{c.hero_title_line1}</span>
            <br />
            <span className="emb-word emb-gradient-text-super" style={{ animationDelay: "0.3s" }}>{c.hero_title_line2}</span>
          </h1>

          <motion.p
            className="emb-hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {c.hero_subtitle}
          </motion.p>

          <motion.div
            className="emb-hero-ctas"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Link href="/auth/register" className="emb-cta-mega emb-cta-primary">
              {c.hero_cta_primary}
              <span className="emb-cta-arrow">→</span>
            </Link>
            <a href="#manifest" className="emb-cta-ghost">
              {c.hero_cta_secondary}
            </a>
          </motion.div>

          <motion.div
            className="emb-hero-strip"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {c.hero_strip.map((s, i) => (
              <span key={i} className="emb-strip-item">
                <span className="emb-strip-dot" />
                {s}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="emb-scroll-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{ opacity: heroOpacity }}
        >
          <span>{c.hero_scroll_hint}</span>
          <motion.div
            className="emb-scroll-mouse"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="emb-scroll-wheel" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ MANIFESTO ═══ */}
      <div className="emb-glow-divider" />
      <Section id="manifest" eyebrow={c.manifest_eyebrow} title={c.manifest_title} body={c.manifest_body}>
        <div className="emb-pillars">
          {c.manifest_pillars.map((p, i) => (
            <ScrollRevealCard key={i} delay={i * 0.15} className="emb-glass-extreme emb-pillar-card">
              <div className="emb-pillar-num">0{i + 1}</div>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
              <div className="emb-pillar-glow" />
            </ScrollRevealCard>
          ))}
        </div>
      </Section>

      {/* ═══ MODEL — SCROLL 3D ═══ */}
      <div className="emb-glow-divider" />
      <section id="model" className="emb-model-section">
        <div className="emb-section-header">
          <p className="emb-eyebrow">{c.model_eyebrow}</p>
          <h2 className="emb-section-title">{c.model_title}</h2>
        </div>
        <div className="emb-model-track">
          {c.model_steps.map((step, i) => (
            <ModelStep3D key={i} step={step} index={i} total={c.model_steps.length} />
          ))}
        </div>
        <motion.p
          className="emb-model-outro"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {c.model_outro}
        </motion.p>
      </section>

      {/* ═══ UNIVERSE / INTENTIONS ═══ */}
      <div className="emb-glow-divider" />
      <section id="universe" className="emb-section">
        <div className="emb-section-header">
          <p className="emb-eyebrow">{c.universe_eyebrow}</p>
          <h2 className="emb-section-title">{c.universe_title}</h2>
          <p className="emb-section-subtitle">{c.universe_subtitle}</p>
        </div>
        <div className="emb-universe-grid">
          {c.universe_cards.map((card, i) => (
            <ScrollRevealCard key={i} delay={i * 0.08} className="emb-glass-extreme emb-universe-card">
              <div className="emb-universe-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
              <Link href={`/auth/register?intent=${card.title}`} className="emb-universe-link">
                →
              </Link>
            </ScrollRevealCard>
          ))}
        </div>
      </section>

      {/* ═══ ORIENTATION ═══ */}
      <div className="emb-glow-divider" />
      <section id="orient" className="emb-section emb-section-dark">
        <div className="emb-section-header">
          <p className="emb-eyebrow">{c.orient_eyebrow}</p>
          <h2 className="emb-section-title">{c.orient_title}</h2>
          <p className="emb-section-subtitle">{c.orient_subtitle}</p>
        </div>
        <div className="emb-orient-grid">
          {c.orient_cards.map((card, i) => (
            <ScrollRevealCard key={i} delay={i * 0.1} className="emb-glass-extreme emb-orient-card">
              <div className="emb-orient-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </ScrollRevealCard>
          ))}
        </div>
      </section>

      {/* ═══ PROOF / STATS ═══ */}
      <section id="proof" className="emb-section">
        <div className="emb-section-header">
          <p className="emb-eyebrow">{c.proof_eyebrow}</p>
          <h2 className="emb-section-title">{c.proof_title}</h2>
        </div>
        <div className="emb-stats-grid">
          {c.proof_stats.map((stat, i) => (
            <ScrollRevealCard key={i} delay={i * 0.1} className="emb-stat-card">
              <div className="emb-stat-value emb-gradient-text-super">{stat.value}</div>
              <div className="emb-stat-label">{stat.label}</div>
            </ScrollRevealCard>
          ))}
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <div className="emb-glow-divider" />
      <section id="final" className="emb-final">
        <motion.div
          className="emb-final-bg"
          style={{ scale: useTransform(scrollYProgress, [0.8, 1], [1, 1.15]) }}
        />
        <div className="emb-liquid-mesh" />
        <motion.div
          className="emb-final-content"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <p className="emb-eyebrow">{c.final_eyebrow}</p>
          <h2 className="emb-final-title emb-gradient-text-super">{c.final_title}</h2>
          <p className="emb-final-body">{c.final_body}</p>
          <Link href="/auth/register" className="emb-cta-mega emb-cta-primary emb-cta-large">
            {c.final_cta}
            <span className="emb-cta-arrow">→</span>
          </Link>
        </motion.div>
      </section>

      {/* ═══ RICH FOOTER ═══ */}
      <RichFooter c={c} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════

function Section({ id, eyebrow, title, body, children }: { id: string; eyebrow: string; title: string; body: string; children: ReactNode }) {
  return (
    <section id={id} className="emb-section">
      <div className="emb-section-header">
        <p className="emb-eyebrow">{eyebrow}</p>
        <h2 className="emb-section-title">{title}</h2>
        <p className="emb-section-subtitle">{body}</p>
      </div>
      {children}
    </section>
  );
}

function ScrollRevealCard({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 50, rotateX: -8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ModelStep3D({ step, index, total }: { step: { num: string; title: string; body: string }; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-15, 0, 15]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);

  return (
    <motion.div
      ref={ref}
      className="emb-model-step"
      style={{ y, rotateY, scale, opacity, perspective: 1000 }}
    >
      <div className="emb-model-step-inner emb-glass-extreme">
        <div className="emb-model-num">{step.num}</div>
        <div className="emb-model-content">
          <h3>{step.title}</h3>
          <p>{step.body}</p>
        </div>
        {index < total - 1 && <div className="emb-model-connector" />}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
//  RICH FOOTER
// ═══════════════════════════════════════════════════════════
function RichFooter({ c }: { c: ReturnType<typeof getCopy> }) {
  const linkMap: Record<string, string> = {
    "Amour": "/amour", "Love": "/amour",
    "Amis": "/amis", "Friends": "/amis",
    "Fun": "/fun",
    "Plan cul": "/plan-cul", "Casual": "/plan-cul",
    "Sport": "/sport", "Sports": "/sport",
    "Événements": "/evenements", "Events": "/evenements",
    "Amor": "/amour", "Amigos": "/amis", "Deportes": "/sport", "Eventos": "/evenements",
  };
  const cols = [
    { title: c.footer_product, links: c.footer_links_product },
    { title: c.footer_company, links: c.footer_links_company },
    { title: c.footer_resources, links: c.footer_links_resources },
    { title: c.footer_legal, links: c.footer_links_legal },
  ];

  return (
    <footer className="emb-rich-footer">
      <div className="emb-liquid-mesh" />
      <div className="emb-footer-content">
        <div className="emb-footer-top">
          <div className="emb-footer-brand">
            <div className="emb-footer-logo">
              Embir
            </div>
            <p className="emb-footer-tagline">{c.footer_tagline}</p>
            <div className="emb-footer-socials">
              <a href="https://x.com/embir_xyz" target="_blank" rel="noopener noreferrer" className="emb-social" aria-label="X">𝕏</a>
              <a href="https://instagram.com/embir_xyz" target="_blank" rel="noopener noreferrer" className="emb-social" aria-label="Instagram">ⓘ</a>
              <a href="/amour" className="emb-social" aria-label="Amour">♥</a>
              <a href="/evenements" className="emb-social" aria-label="Événements">❖</a>
            </div>
          </div>
          <div className="emb-footer-cols">
            {cols.map((col, i) => (
              <div key={i} className="emb-footer-col">
                <h4>{col.title}</h4>
                <ul>
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <Link href={linkMap[link] ?? "/"}>{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="emb-footer-bottom">
          <span>© 2026 Embir. {c.footer_rights}</span>
          <span className="emb-footer-made">{c.footer_made_with}</span>
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════
//  Motion template helper (inline to avoid extra import)
// ═══════════════════════════════════════════════════════════
function useMotionTemplate(strings: TemplateStringsArray, ...values: any[]) {
  return useTransform(values, (latest) => strings.reduce((acc, str, i) => acc + str + (latest[i] || ""), ""));
}
