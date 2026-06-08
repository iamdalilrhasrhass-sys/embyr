"use client";
import Link from "next/link";
import EmbyrLogo from "@/components/brand/EmbirLogo";
import { useState, useEffect } from "react";
import { isFreeNightAccess } from "@/lib/freeAccess";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Navbar() {
  const [isFree, setIsFree] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setIsFree(isFreeNightAccess());
    const interval = setInterval(() => setIsFree(isFreeNightAccess()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { href: "/paris", label: "Paris" },
    { href: "/about", label: "À propos" },
    { href: "/membres", label: "Membres" },
    { href: "/premium", label: "Premium" },
    { href: "/auth/login", label: "Connexion" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/8 bg-[#070409]/82 backdrop-blur-2xl shadow-[0_18px_80px_rgba(0,0,0,0.35)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <Link href="/" className="shrink-0">
              <EmbyrLogo size="md" showTagline />
            </Link>
            <span className="hidden lg:inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.16em] bg-[#ff5e36]/10 text-[#ffa333] border border-[#ff5e36]/20">
              <span className="w-1.5 h-1.5 bg-[#ff5e36] rounded-full shadow-[0_0_12px_rgba(255,94,54,0.75)] mr-2"></span>
              Lancement gratuit
            </span>
          </div>

          {/* Desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/paris" className="hover:text-[#ff5e36] text-[#ffa333] transition-colors px-3 py-2 rounded-md font-semibold text-sm">Paris</Link>
              <Link href="/about" className="hover:text-white text-gray-300 transition-colors px-3 py-2 rounded-md font-medium text-sm">À propos</Link>
              <Link href="/membres" className="hover:text-white text-gray-300 transition-colors px-3 py-2 rounded-md font-medium text-sm">Membres</Link>
              <Link href="/premium" className="hover:text-[#ff5e36] text-gray-300 transition-colors px-3 py-2 rounded-md font-medium text-sm">Premium</Link>
              <Link href="/auth/login" className="hover:text-white text-gray-300 transition-colors px-3 py-2 font-medium text-sm">Connexion</Link>
              <LanguageSwitcher />
              <Link href="/paris" className="emb-button-primary text-sm px-5 py-2.5">
                Rejoindre Paris
              </Link>
            </div>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 z-50"
            aria-label="Menu"
          >
            <span className={`block w-6 h-[2px] bg-white rounded transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[5px]' : ''}`}></span>
            <span className={`block w-6 h-[2px] bg-white rounded transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-[2px] bg-white rounded transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[5px]' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-xl z-40 transition-opacity duration-300 md:hidden ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col items-center justify-center h-full gap-8 px-4">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} onClick={closeMenu} className="text-3xl font-bold hover:text-[var(--color-premium-rose)] transition-colors">
              {l.label}
            </Link>
          ))}
          <div className="mt-4">
            <LanguageSwitcher />
          </div>
          <div className="flex gap-4 mt-2">
            <Link href="/dashboard" onClick={closeMenu} className="glass-premium px-8 py-4 rounded-full text-lg font-bold border border-white/20">
              Mon compte
            </Link>
            <Link href="/auth/register" onClick={closeMenu} className="emb-button-primary text-lg px-8 py-4 rounded-full">
              Rejoindre les fondateurs
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
