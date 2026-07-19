"use client";
import { useState } from "react";
import Link from "next/link";
import SideDrawer from "./SideDrawer";
import BottomNav from "./BottomNav";
import EmbirLogo from "@/components/brand/EmbirLogo";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <SideDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar desktop */}
        <div className="sticky top-0 z-40 hidden items-center justify-between border-b border-white/8 bg-embir-void/90 px-6 py-4 backdrop-blur-2xl md:flex">
          <Link href="/dashboard" className="shrink-0">
            <EmbirLogo size="sm" />
          </Link>
          <div className="flex items-center gap-1">
            {[
              { href: "/membres", label: "Membres" },
              { href: "/messages", label: "Messages" },
              { href: "/dashboard", label: "Profil" },
              { href: "/paris", label: "Fondateurs" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-xs font-semibold text-white/55 transition-colors hover:bg-white/[0.05] hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Top bar mobile */}
        <div className="flex items-center justify-between border-b border-white/[0.06] bg-embir-void/95 px-4 py-3 md:hidden">
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-embir-rose/10 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-embir-blush"
            aria-label="Ouvrir la navigation"
            aria-expanded={drawerOpen}
          >☰</button>
          <EmbirLogo size="sm" />
          <div className="w-10" />
        </div>
        {/* Content */}
        <main className="flex-1 pb-20 md:pb-0" style={{ paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))" }}>{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
