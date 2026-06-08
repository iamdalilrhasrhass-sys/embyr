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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bottom-nav-safe"
      style={{ background: "rgba(10,3,5,0.97)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(255,107,53,0.08)" }}>
      <div className="flex items-center justify-around h-14 px-1"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        {navItems.map(item => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-xl transition-all min-w-[44px] ${
                active ? "text-white" : "text-white/30"}`}
              style={active ? { background: "rgba(255,107,53,0.1)" } : {}}>
              <span
                className={`h-1.5 w-1.5 rounded-full ${active ? "bg-[#ff5e36] shadow-[0_0_10px_rgba(255,94,54,0.85)]" : "bg-white/22"}`}
              />
              <span className="text-[9px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
