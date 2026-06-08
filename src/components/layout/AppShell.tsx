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
        <div className="hidden md:flex sticky top-0 z-40 items-center justify-between px-6 py-4 border-b border-white/8 bg-[#070409]/88 backdrop-blur-2xl">
          <Link href="/dashboard" className="shrink-0">
            <EmbirLogo size="sm" showTagline />
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
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(255,107,53,0.06)", background: "rgba(10,3,5,0.95)" }}>
          <button onClick={() => setDrawerOpen(!drawerOpen)} className="w-10 h-10 flex items-center justify-center rounded-lg text-white"
            style={{ background: "rgba(255,107,53,0.1)" }}>☰</button>
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
