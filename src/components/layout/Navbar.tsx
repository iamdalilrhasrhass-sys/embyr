"use client";
import Link from "next/link";
import EmbyrLogo from "@/components/brand/EmbyrLogo";
import { useState, useEffect } from "react";
import { isFreeNightAccess } from "@/lib/freeAccess";

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
    { href: "/profiles", label: "Profils" },
    { href: "/pricing", label: "Tarifs" },
    { href: "/auth/login", label: "Connexion" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass-card border-b-0 border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
<Link href="/" className="shrink-0">
              <EmbyrLogo size="md" />
            </Link>
            {isFree && (
              <span className="hidden md:inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-[#1c0f2b] text-[var(--color-premium-purple)] border border-[var(--color-premium-purple)]/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <span className="w-1.5 h-1.5 bg-[var(--color-premium-purple)] rounded-full animate-pulse mr-2"></span>
                🌙 Night Club : Gratuit jusqu'à 07h00
              </span>
            )}
          </div>

          {/* Desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/profiles" className="hover:text-[var(--color-premium-rose)] transition-colors px-3 py-2 rounded-md font-medium">Profils</Link>
              <Link href="/pricing" className="hover:text-[var(--color-premium-rose)] transition-colors px-3 py-2 rounded-md font-medium">Tarifs</Link>
              <Link href="/pricing" className="hover:text-[var(--color-premium-rose)] transition-colors px-3 py-2 rounded-md font-medium text-[var(--color-premium-rose)] font-bold">Premium</Link>
              <Link href="/auth/login" className="hover:text-white text-gray-300 transition-colors px-3 py-2 font-medium">Connexion</Link>
              <Link href="/auth/register" className="bg-gradient-premium hover:opacity-90 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-[0_0_15px_rgba(244,63,143,0.3)]">
                Creer un compte
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
          <div className="flex gap-4 mt-4">
            <Link href="/dashboard" onClick={closeMenu} className="glass-premium px-8 py-4 rounded-full text-lg font-bold border border-white/20">
              Mon compte
            </Link>
            <Link href="/auth/register" onClick={closeMenu} className="bg-gradient-premium text-white px-8 py-4 rounded-full text-lg font-bold shadow-[0_0_20px_rgba(244,63,143,0.4)]">
              S&apos;inscrire
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
