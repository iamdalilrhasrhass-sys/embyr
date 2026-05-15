"use client";
import { useState } from "react";
import SideDrawer from "./SideDrawer";
import BottomNav from "./BottomNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <SideDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar mobile */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(255,107,53,0.06)", background: "rgba(10,3,5,0.95)" }}>
          <button onClick={() => setDrawerOpen(!drawerOpen)} className="w-10 h-10 flex items-center justify-center rounded-lg text-white"
            style={{ background: "rgba(255,107,53,0.1)" }}>☰</button>
          <span className="text-sm font-bold" style={{ background: "linear-gradient(135deg, #818CF8, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Embyr</span>
          <div className="w-10" />
        </div>
        {/* Content */}
        <main className="flex-1 pb-20 md:pb-0" style={{ paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))" }}>{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
