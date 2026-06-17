"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import EmbirLogo from "@/components/brand/EmbirLogo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import AuthModal from "@/components/auth/AuthModal";
import { useTranslations } from "next-intl";

export default function Navbar({ showLogo }: { showLogo?: boolean }) {
  const t = useTranslations("nav");
  const tAuth = useTranslations("auth");
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
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const openAuth = useCallback((tab: "login" | "register") => {
    setAuthTab(tab);
    setAuthOpen(true);
  }, []);

  const navLinks = [
    { href: "/discover", label: t("discover") },
    { href: "/creators", label: t("creators") },
    { href: "/events", label: t("events") },
    { href: "/safety", label: t("safety") },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-white/8 bg-[#0a0614]/90 backdrop-blur-2xl shadow-[0_18px_80px_rgba(0,0,0,0.35)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              {showLogo ? (
                <Link href="/" prefetch={false} className="shrink-0">
                  <EmbirLogo size="md" showTagline />
                </Link>
              ) : (
                <div className="shrink-0">
                  <EmbirLogo size="md" showTagline />
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
                  className="text-sm font-medium text-white/55 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <LanguageSwitcher />
              <button
                onClick={() => openAuth("login")}
                className="text-sm font-medium text-white/55 hover:text-white transition-colors"
              >
                {t("login")}
              </button>
              <button
                onClick={() => openAuth("register")}
                className="inline-flex items-center justify-center rounded-full bg-[#d4a574] px-5 py-2.5 text-sm font-bold text-[#0a0614] transition hover:bg-[#e8c4a2]"
              >
                {t("create_universe")}
              </button>
            </div>

            {/* Mobile controls */}
            <div className="flex md:hidden items-center gap-1.5">
              <button
                onClick={() => openAuth("login")}
                className="text-xs font-medium text-white/60 hover:text-white px-2 py-1.5 rounded-full border border-white/10 hover:border-white/20 transition-all"
              >
                {t("login")}
              </button>
              <button
                onClick={() => openAuth("register")}
                className="text-xs font-bold text-white bg-gradient-to-r from-[#ff1f5a] to-[#ff5e36] px-3 py-1.5 rounded-full shadow-[0_0_12px_rgba(255,31,90,0.3)] transition-all hover:scale-105"
              >
                {t("register")}
              </button>
              <LanguageSwitcher />
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 z-50"
                aria-label="Menu"
              >
                <span className={`block w-6 h-[2px] bg-white rounded transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[5px]" : ""}`} />
                <span className={`block w-6 h-[2px] bg-white rounded transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
                <span className={`block w-6 h-[2px] bg-white rounded transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[5px]" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu overlay */}
        <div
          className={`fixed inset-0 bg-black/60 backdrop-blur-xl z-40 transition-opacity duration-300 md:hidden ${
            menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full gap-8 px-4">
            <EmbirLogo size="md" variant="mark" className="mb-2" />
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                onClick={closeMenu}
                className="text-3xl font-bold hover:text-[#d4a574] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4">
              <LanguageSwitcher />
            </div>
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={() => { closeMenu(); openAuth("login"); }}
                className="text-lg font-medium text-white/55 hover:text-white transition-colors px-4 py-2"
              >
                {t("login")}
              </button>
              <button
                onClick={() => { closeMenu(); openAuth("register"); }}
                className="emb-button-primary text-lg px-8 py-4 rounded-full"
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
