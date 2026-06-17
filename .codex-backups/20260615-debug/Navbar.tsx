"use client";
import Link from "next/link";
import EmbirLogo from "@/components/brand/EmbirLogo";
import { useState, useEffect } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { href: "/free-dating-app", label: "Free launch" },
    { href: "/us", label: "USA" },
    { href: "/uk", label: "UK" },
    { href: "/lgbtq-dating-app", label: "Orientations" },
    { href: "/verified-dating-app", label: "Safety" },
    { href: "/about", label: "About" },
    { href: "/membres", label: "Members" },
    { href: "/auth/login", label: "Login" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/8 bg-[#070409]/82 backdrop-blur-2xl shadow-[0_18px_80px_rgba(0,0,0,0.35)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <Link href="/" className="shrink-0">
              <EmbirLogo size="md" showTagline />
            </Link>
            <span className="hidden lg:inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.16em] bg-[#ff5e36]/10 text-[#ffa333] border border-[#ff5e36]/20">
              <span className="w-1.5 h-1.5 bg-[#ff5e36] rounded-full shadow-[0_0_12px_rgba(255,94,54,0.75)] mr-2"></span>
              Free launch · founders
            </span>
          </div>

          {/* Desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/free-dating-app" className="hover:text-[#ff5e36] text-[#ffa333] transition-colors px-3 py-2 rounded-md font-semibold text-sm">Free launch</Link>
              <Link href="/us" className="hover:text-white text-gray-300 transition-colors px-3 py-2 rounded-md font-medium text-sm">USA</Link>
              <Link href="/uk" className="hover:text-white text-gray-300 transition-colors px-3 py-2 rounded-md font-medium text-sm">UK</Link>
              <Link href="/lgbtq-dating-app" className="hover:text-white text-gray-300 transition-colors px-3 py-2 rounded-md font-medium text-sm">Orientations</Link>
              <Link href="/verified-dating-app" className="hover:text-white text-gray-300 transition-colors px-3 py-2 rounded-md font-medium text-sm">Safety</Link>
              <Link href="/about" className="hover:text-white text-gray-300 transition-colors px-3 py-2 rounded-md font-medium text-sm">About</Link>
              <Link href="/membres" className="hover:text-white text-gray-300 transition-colors px-3 py-2 rounded-md font-medium text-sm">Members</Link>
              <Link href="/auth/login" className="hover:text-white text-gray-300 transition-colors px-3 py-2 font-medium text-sm">Login</Link>
              <LanguageSwitcher />
              <Link href="/auth/register" className="emb-button-primary text-sm px-5 py-2.5">
                Join founders
              </Link>
            </div>
          </div>

          {/* Mobile: Auth + Language + Hamburger */}
          <div className="flex md:hidden items-center gap-1.5">
            <Link href="/auth/login" className="text-xs font-medium text-white/60 hover:text-white px-2 py-1.5 rounded-full border border-white/10 hover:border-white/20 transition-all">
              Login
            </Link>
            <Link href="/auth/register" className="text-xs font-bold text-white bg-gradient-to-r from-[#ff1f5a] to-[#ff5e36] px-3 py-1.5 rounded-full shadow-[0_0_12px_rgba(255,31,90,0.3)] transition-all hover:scale-105">
              Sign up
            </Link>
            <LanguageSwitcher />
            <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 z-50"
            aria-label="Menu"
          >
            <span className={`block w-6 h-[2px] bg-white rounded transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[5px]' : ''}`}></span>
            <span className={`block w-6 h-[2px] bg-white rounded transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-[2px] bg-white rounded transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[5px]' : ''}`}></span>
          </button>
          </div>
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
              My account
            </Link>
            <Link href="/auth/register" onClick={closeMenu} className="emb-button-primary text-lg px-8 py-4 rounded-full">
              Join founders
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
