"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import EmbirLogo from "@/components/brand/EmbirLogo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import AuthModal from "@/components/auth/AuthModal";
import { useTranslations } from "next-intl";

/* Brand OS tokens are referenced here because hover state is applied inline. */

const T = {
  void: "var(--embir-void-950)",
  bone: "var(--embir-bone-100)",
  bone55: "var(--embir-muted-on-dark)",
  bone60: "var(--embir-muted-on-dark)",
  ember: "var(--embir-rose-500)",
  emberHover: "var(--embir-blush-300)",
  coral: "var(--embir-rose-500)",
  copper: "var(--embir-blush-300)",
  hairline: "var(--embir-line-on-dark)",
  hairlineHover: "color-mix(in srgb, var(--embir-bone-100) 20%, transparent)",
  focus: "var(--embir-focus)",
  overlay: "rgba(0,0,0,0.6)",
  navBg: "color-mix(in srgb, var(--embir-void-950) 95%, transparent)",
} as const;

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-embir-blush focus-visible:rounded-sm";

export default function Navbar({ showLogo }: { showLogo?: boolean }) {
  const t = useTranslations("nav");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const openAuth = useCallback((tab: "login" | "register") => {
    setAuthTab(tab);
    setAuthOpen(true);
  }, []);

  const navLinks = [
    { href: "/amour", label: "Amour" },
    { href: "/amis", label: "Amis" },
    { href: "/fun", label: "Fun" },
    { href: "/sport", label: "Sport" },
    { href: "/evenements", label: "Événements" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "border-b backdrop-blur-2xl shadow-[0_18px_80px_rgba(0,0,0,0.35)]"
            : "bg-transparent"
        }`}
        style={{
          borderColor: scrolled ? T.hairline : "transparent",
          backgroundColor: scrolled ? T.navBg : "transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              {showLogo ? (
                <Link href="/" prefetch={false} className={`shrink-0 ${focusRing}`}>
                  <EmbirLogo size="md" className="embir-logo--nav-compact" />
                </Link>
              ) : (
                <div className="shrink-0">
                  <EmbirLogo size="md" className="embir-logo--nav-compact" />
                </div>
              )}
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={false}
                  className={`text-sm font-medium transition-colors ${focusRing}`}
                  style={{ color: T.bone55 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = T.bone)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = T.bone55)}
                >
                  {link.label}
                </Link>
              ))}
              <LanguageSwitcher />
              <button
                onClick={() => openAuth("login")}
                className={`text-sm font-medium transition-colors ${focusRing}`}
                style={{ color: T.bone55 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = T.bone)}
                onMouseLeave={(e) => (e.currentTarget.style.color = T.bone55)}
              >
                {t("login")}
              </button>
              <button
                onClick={() => openAuth("register")}
                className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 min-h-[44px] text-sm font-bold transition-all ${focusRing}`}
                style={{ backgroundColor: T.ember, color: T.void }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = T.emberHover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = T.ember)
                }
              >
                {t("create_universe")}
              </button>
            </div>

            {/* Mobile controls — all touch targets ≥44px */}
            <div className="flex md:hidden items-center gap-1.5">
              <button
                onClick={() => openAuth("login")}
                className={`text-xs font-medium px-2.5 py-2 min-h-[44px] min-w-[44px] rounded-full border transition-all ${focusRing}`}
                style={{ color: T.bone60, borderColor: T.hairline }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = T.bone;
                  e.currentTarget.style.borderColor = T.hairlineHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = T.bone60;
                  e.currentTarget.style.borderColor = T.hairline;
                }}
              >
                {t("login")}
              </button>
              <button
                onClick={() => openAuth("register")}
                className={`text-xs font-bold px-3 py-2 min-h-[44px] min-w-[44px] rounded-full shadow-[var(--shadow-brand)] transition-all hover:scale-105 ${focusRing}`}
                style={{
                  color: T.bone,
                  background: `linear-gradient(135deg, ${T.coral}, ${T.copper})`,
                }}
              >
                {t("register")}
              </button>
              <LanguageSwitcher />
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`relative min-w-[44px] min-h-[44px] flex flex-col items-center justify-center gap-1.5 z-50 ${focusRing}`}
                aria-label="Menu"
                aria-expanded={menuOpen}
              >
                <span
                  className={`block w-6 h-[2px] rounded transition-all duration-300 ${
                    menuOpen ? "rotate-45 translate-y-[5px]" : ""
                  }`}
                  style={{ backgroundColor: T.bone }}
                />
                <span
                  className={`block w-6 h-[2px] rounded transition-all duration-300 ${
                    menuOpen ? "opacity-0" : ""
                  }`}
                  style={{ backgroundColor: T.bone }}
                />
                <span
                  className={`block w-6 h-[2px] rounded transition-all duration-300 ${
                    menuOpen ? "-rotate-45 -translate-y-[5px]" : ""
                  }`}
                  style={{ backgroundColor: T.bone }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu overlay — scrollable + safe-area-inset-bottom */}
        <div
          className={`fixed inset-0 z-40 transition-opacity duration-300 md:hidden ${
            menuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          style={{ backgroundColor: T.overlay }}
          aria-hidden={!menuOpen}
        >
          <div
            className="flex flex-col items-center gap-8 px-4 overflow-y-auto"
            style={{
              height: "100dvh",
              maxHeight: "100dvh",
              paddingTop: "clamp(4rem, 15vh, 8rem)",
              paddingBottom: "calc(2rem + env(safe-area-inset-bottom, 0px))",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <EmbirLogo size="md" variant="mark" className="mb-2" />
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                onClick={closeMenu}
                className={`text-3xl font-bold transition-colors ${focusRing}`}
                style={{ color: T.bone }}
                onMouseEnter={(e) => (e.currentTarget.style.color = T.ember)}
                onMouseLeave={(e) => (e.currentTarget.style.color = T.bone)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4">
              <LanguageSwitcher />
            </div>
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={() => {
                  closeMenu();
                  openAuth("login");
                }}
                className={`text-lg font-medium transition-colors px-4 py-3 min-h-[44px] ${focusRing}`}
                style={{ color: T.bone55 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = T.bone)}
                onMouseLeave={(e) => (e.currentTarget.style.color = T.bone55)}
              >
                {t("login")}
              </button>
              <button
                onClick={() => {
                  closeMenu();
                  openAuth("register");
                }}
                className={`emb-button-primary text-lg px-8 py-4 rounded-full min-h-[44px] ${focusRing}`}
              >
                {t("create_universe")}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialTab={authTab}
      />
    </>
  );
}
