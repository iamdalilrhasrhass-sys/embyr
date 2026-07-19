"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/membres", label: "Membres" },
  { href: "/messages", label: "Messages" },
  { href: "/dashboard", label: "Profil" },
  { href: "/salons", label: "Salons" },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="bottom-nav-safe fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.08] bg-embir-void/95 backdrop-blur-xl md:hidden">
      <div className="flex items-center justify-around h-14 px-1"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        {navItems.map(item => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href}
              className={`flex min-h-11 min-w-11 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1 transition-all ${
                active ? "text-white" : "text-white/30"}`}
              style={active ? { background: "rgba(216,139,167,0.1)" } : {}}>
              <span
                className={`h-1.5 w-1.5 rounded-full ${active ? "bg-embir-rose shadow-[var(--shadow-brand)]" : "bg-white/22"}`}
              />
              <span className="text-[9px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
