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
      // Section detection
      const sections = ["hero", "manifest", "model", "econ", "universe", "orient", "proof", "member", "final"];
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
    { id: "journal", label: c.nav_journal },
    { id: "member", label: c.nav_pricing },
    { id: "contact", label: c.nav_contact },
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
          embir<span className="emb-dot">.</span>
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

      {/* ═══ ECONOMIC MODEL ═══ */}
      <Section id="econ" eyebrow={c.econ_eyebrow} title={c.econ_title} body={c.econ_body}>
        <div className="emb-econ-grid">
          {c.econ_cards.map((card, i) => (
            <ScrollRevealCard key={i} delay={i * 0.12} className="emb-glass-extreme emb-econ-card">
              <span className="emb-econ-tag">{card.tag}</span>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
              <div className="emb-econ-icon">{["✦", "❖", "◆"][i]}</div>
            </ScrollRevealCard>
          ))}
        </div>
        <motion.div
          className="emb-econ-pledge"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="emb-pledge-mark">◆</span>
          {c.econ_pledge}
        </motion.div>
      </Section>

      {/* ═══ UNIVERSE / INTENTIONS ═══ */}
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

      {/* ═══ MEMBERSHIP ═══ */}
      <section id="member" className="emb-section">
        <div className="emb-section-header">
          <p className="emb-eyebrow">{c.member_eyebrow}</p>
          <h2 className="emb-section-title">{c.member_title}</h2>
          <p className="emb-section-subtitle">{c.member_body}</p>
        </div>
        <div className="emb-tiers-grid">
          {c.member_tiers.map((tier, i) => (
            <ScrollRevealCard
              key={i}
              delay={i * 0.12}
              className={`emb-glass-extreme emb-tier-card ${i === 1 ? "emb-tier-featured" : ""}`}
            >
              {i === 1 && <div className="emb-tier-badge">{locale === "fr" ? "Recommandé" : locale === "es" ? "Recomendado" : "Recommended"}</div>}
              <h3 className="emb-tier-name">{tier.name}</h3>
              <div className="emb-tier-price">{tier.price}</div>
              <ul className="emb-tier-perks">
                {tier.perks.map((perk, j) => (
                  <li key={j}>
                    <span className="emb-perk-check">✓</span>
                    {perk}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className={`emb-tier-cta ${i === 1 ? "emb-cta-mega" : ""}`}>
                {tier.cta}
              </Link>
            </ScrollRevealCard>
          ))}
        </div>
      </section>

      {/* ═══ NEWSLETTER ═══ */}
      <Newsletter c={c} />

      {/* ═══ JOURNAL / EDITORIAL ═══ */}
      <section id="journal" className="emb-section emb-section-dark">
        <div className="emb-section-header">
          <p className="emb-eyebrow">{c.journal_eyebrow}</p>
          <h2 className="emb-section-title">{c.journal_title}</h2>
          <p className="emb-section-subtitle">{c.journal_subtitle}</p>
        </div>
        <div className="emb-journal-grid">
          {c.journal_articles.map((article, i) => (
            <ScrollRevealCard key={i} delay={i * 0.12} className="emb-glass-extreme emb-journal-card">
              <div className="emb-journal-cat">{article.category}</div>
              <h3 className="emb-journal-title">{article.title}</h3>
              <p className="emb-journal-excerpt">{article.excerpt}</p>
              <div className="emb-journal-meta">
                <span>{article.date}</span>
                <span className="emb-journal-dot">·</span>
                <span>{article.readTime}</span>
              </div>
              <div className="emb-journal-arrow">→</div>
            </ScrollRevealCard>
          ))}
        </div>
        <motion.div
          className="emb-journal-cta"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <span>{c.journal_cta}</span>
          <span className="emb-journal-cta-arrow">→</span>
        </motion.div>
      </section>

      {/* ═══ RESOURCES ═══ */}
      <section id="resources" className="emb-section">
        <div className="emb-section-header">
          <p className="emb-eyebrow">{c.resources_eyebrow}</p>
          <h2 className="emb-section-title">{c.resources_title}</h2>
          <p className="emb-section-subtitle">{c.resources_subtitle}</p>
        </div>
        <div className="emb-resources-grid">
          {c.resources_items.map((item, i) => (
            <ScrollRevealCard key={i} delay={i * 0.08} className="emb-glass-extreme emb-resource-card">
              <div className="emb-resource-icon">{item.icon}</div>
              <div className="emb-resource-body">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
              <div className="emb-resource-meta">
                <span className="emb-resource-type">{item.type}</span>
                <span className="emb-resource-size">{item.size}</span>
              </div>
              <div className="emb-resource-download">↓</div>
            </ScrollRevealCard>
          ))}
        </div>
      </section>

      {/* ═══ COMMUNITY — PINNED CINEMA ═══ */}
      <section id="community" className="emb-community-section">
        <div className="emb-community-bg" />
        <div className="emb-section-header">
          <p className="emb-eyebrow">{c.community_eyebrow}</p>
          <h2 className="emb-section-title">{c.community_title}</h2>
          <p className="emb-section-subtitle">{c.community_subtitle}</p>
        </div>
        <div className="emb-community-grid">
          {c.community_features.map((feature, i) => (
            <ScrollRevealCard key={i} delay={i * 0.1} className="emb-glass-extreme emb-community-card">
              <div className="emb-community-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </ScrollRevealCard>
          ))}
        </div>
        <motion.div
          className="emb-community-cta-wrap"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Link href="/auth/register" className="emb-cta-mega emb-cta-primary">
            {c.community_cta}
            <span className="emb-cta-arrow">→</span>
          </Link>
        </motion.div>
      </section>

      {/* ═══ CONTACT ═══ */}
      <section id="contact" className="emb-section">
        <div className="emb-section-header">
          <p className="emb-eyebrow">{c.contact_eyebrow}</p>
          <h2 className="emb-section-title">{c.contact_title}</h2>
          <p className="emb-section-subtitle">{c.contact_body}</p>
        </div>
        <ContactForm c={c} />
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="emb-section">
        <div className="emb-section-header">
          <h2 className="emb-section-title">{c.faq_title}</h2>
        </div>
        <div className="emb-faq-list">
          {c.faq_items.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} delay={i * 0.05} />
          ))}
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
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

function FAQItem({ q, a, delay }: { q: string; a: string; delay: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className={`emb-faq-item ${open ? "emb-faq-open" : ""}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <button className="emb-faq-question" onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <span className={`emb-faq-icon ${open ? "emb-faq-icon-open" : ""}`}>+</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="emb-faq-answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Newsletter({ c }: { c: ReturnType<typeof getCopy> }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <section className="emb-newsletter-section">
      <motion.div
        className="emb-newsletter-card emb-glass-extreme"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="emb-newsletter-glow" />
        <h3>{c.news_title}</h3>
        <p>{c.news_body}</p>
        {sent ? (
          <div className="emb-news-success">
            <span className="emb-check-circle">✓</span>
            {c.news_success}
          </div>
        ) : (
          <form
            className="emb-news-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (email) setSent(true);
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={c.news_placeholder}
              required
              className="emb-news-input"
            />
            <button type="submit" className="emb-cta-mega emb-news-btn">
              {c.news_cta}
            </button>
          </form>
        )}
      </motion.div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
//  CONTACT FORM
// ═══════════════════════════════════════════════════════════
function ContactForm({ c }: { c: ReturnType<typeof getCopy> }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  return (
    <motion.div
      className="emb-glass-extreme emb-contact-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {sent ? (
        <div className="emb-contact-success">
          <span className="emb-check-circle emb-check-large">✓</span>
          <p>{c.contact_success}</p>
        </div>
      ) : (
        <form
          className="emb-contact-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (form.name && form.email && form.message) setSent(true);
          }}
        >
          <div className="emb-contact-row">
            <input
              type="text"
              placeholder={c.contact_fields.name}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="emb-contact-input"
            />
            <input
              type="email"
              placeholder={c.contact_fields.email}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="emb-contact-input"
            />
          </div>
          <textarea
            placeholder={c.contact_fields.message}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
            rows={5}
            className="emb-contact-textarea"
          />
          <button type="submit" className="emb-cta-mega emb-cta-primary emb-contact-submit">
            {c.contact_submit}
            <span className="emb-cta-arrow">→</span>
          </button>
        </form>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
//  RICH FOOTER
// ═══════════════════════════════════════════════════════════
function RichFooter({ c }: { c: ReturnType<typeof getCopy> }) {
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
              embir<span className="emb-dot">.</span>
            </div>
            <p className="emb-footer-tagline">{c.footer_tagline}</p>
            <div className="emb-footer-socials">
              <span className="emb-social">𝕏</span>
              <span className="emb-social">ⓘ</span>
              <span className="emb-social">✦</span>
              <span className="emb-social">❖</span>
            </div>
          </div>
          <div className="emb-footer-cols">
            {cols.map((col, i) => (
              <div key={i} className="emb-footer-col">
                <h4>{col.title}</h4>
                <ul>
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a href="#">{link}</a>
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
