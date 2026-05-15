import { VibeKeyframes } from "@/components/VibeEffects";
import LogoutButton from "@/components/layout/LogoutButton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--color-premium-dark)] text-[var(--color-premium-white)] flex flex-col">
      <VibeKeyframes />
      {/* Noise + Grid background */}
      <div className="fixed inset-0 noise-overlay pointer-events-none z-0" />
      <div className="fixed inset-0 soft-grid-bg opacity-20 pointer-events-none z-0" />

      {/* Top Navigation */}
      <nav
        className="sticky top-0 z-50 border-b backdrop-blur-2xl"
        style={{
          background: "rgba(10,3,0,0.85)",
          borderColor: "rgba(255,107,53,0.08)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a
            href="/dashboard"
            className="flex items-center gap-3 group"
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, var(--color-premium-purple), var(--color-premium-rose))",
              }}
            >
              <span className="font-bold text-sm text-white">E</span>
            </div>
            <span className="font-bold text-white/90 text-sm tracking-wide group-hover:text-white transition-colors">
              Embyr
            </span>
          </a>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { href: "/dashboard", label: "Accueil" },
              { href: "/dashboard/profile", label: "Mon Profil" },
              { href: "/membres", label: "Membres" },
              { href: "/messages", label: "Messages" },
              { href: "/premium", label: "Premium bientôt" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-xl text-xs font-medium text-white/60 hover:text-white hover:bg-white/[0.04] transition-all duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <a
              href="/dashboard/profile"
              className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-xs hover:border-[var(--color-premium-rose)]/30 transition-all"
              title="Mon compte"
            >
              👤
            </a>
            <LogoutButton />
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden flex overflow-x-auto border-t border-white/[0.04] px-2">
          {[
            { href: "/dashboard", label: "Accueil" },
            { href: "/dashboard/profile", label: "Profil" },
            { href: "/membres", label: "Membres" },
            { href: "/messages", label: "Messages" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex-shrink-0 px-3 py-2.5 text-[10px] font-medium text-white/50 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 relative z-10 pb-16 md:pb-0">
        {children}
      </main>

      {/* No footer — app, not landing */}
    </div>
  );
}
