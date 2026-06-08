"use client";
import { useState } from "react";
import Link from "next/link";
import EmbyrAvatar from "@/components/embyr/EmbyrAvatar";
import EmbyrBadge from "@/components/embyr/EmbyrBadge";
import EmbirLogo from "@/components/brand/EmbirLogo";

const NAV_SECTIONS = [
  {
    title: "Explorer",
    items: [
      { href: "/dashboard", icon: "•", label: "Tableau de bord" },
      { href: "/membres", icon: "•", label: "Membres" },
      { href: "/messages", icon: "•", label: "Messages" },
    ],
  },
  {
    title: "Communauté",
    items: [
      { href: "/salons", icon: "•", label: "Salons" },
      { href: "/annonces", icon: "•", label: "Annonces" },
      { href: "/forum", icon: "•", label: "Forum" },
      { href: "/videos", icon: "•", label: "Vidéos" },
    ],
  },
  {
    title: "Mon univers",
    items: [
      { href: "/dashboard/profile", icon: "•", label: "Mon profil" },
      { href: "/albums", icon: "•", label: "Albums" },
      { href: "/favoris", icon: "•", label: "Favoris" },
      { href: "/blacklist", icon: "•", label: "Blacklist" },
      { href: "/temoignages", icon: "•", label: "Témoignages" },
      { href: "/certification", icon: "•", label: "Certification" },
      { href: "/apercu-visiteur", icon: "•", label: "Aperçu visiteur" },
    ],
  },
  {
    title: "Premium",
    items: [
      { href: "/premium", icon: "•", label: "Premium bientôt" },
      { href: "/mode-discret", icon: "•", label: "Mode Discret" },
      { href: "/ambassadeur", icon: "•", label: "Ambassadeur" },
    ],
  },
  {
    title: "Autres",
    items: [
      { href: "/notifications", icon: "•", label: "Notifications" },
      { href: "/parametres", icon: "•", label: "Paramètres" },
      { href: "/affichage", icon: "•", label: "Affichage" },
      { href: "/faq", icon: "•", label: "FAQ" },
      { href: "/sites-partenaires", icon: "•", label: "Sites partenaires" },
      { href: "/installer-application", icon: "•", label: "Installer" },
      { href: "/legal/cgu", icon: "•", label: "CGU" },
    ],
  },
];

export default function SideDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-[var(--eb-bg-overlay)] backdrop-blur-md" onClick={onClose} />
      {/* Drawer */}
      <nav
        className="mobile-drawer fixed top-0 left-0 z-50 w-[min(85vw,360px)] bg-[var(--eb-bg-elev-1)] border-r border-[var(--eb-border-soft)] flex flex-col"
        style={{ animation: "slideIn 0.28s cubic-bezier(0.32, 0.72, 0, 1)" }}
      >
        {/* Header */}
        <div className="p-5 flex flex-col items-center border-b border-[var(--eb-border-soft)]">
          <EmbyrAvatar name="Membre" size={96} isPremium />
          <EmbirLogo size="sm" className="mt-4" />
          <EmbyrBadge variant="online">En ligne</EmbyrBadge>
        </div>

        {/* Scrollable nav */}
        <div className="flex-1 overflow-y-auto px-3 py-4 mobile-scroll space-y-4">
          {NAV_SECTIONS.map((section, si) => (
            <div key={si}>
              <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--eb-text-muted)] mb-2">{section.title}</p>
              <div className="space-y-0.5">
                {section.items.map((item, ii) => (
                  <Link
                    key={ii}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm transition-all hover:bg-[var(--eb-bg-elev-2)] ${item.label === "Premium bientôt" ? "text-[var(--eb-accent)] font-medium" : "text-[var(--eb-text-secondary)]"}`}
                  >
                    <span className="text-base w-5 text-center text-[#ff5e36]">{item.icon}</span>
                    <span>{item.label}</span>
                    {item.label === "Premium bientôt" && <span className="ml-auto text-[10px] bg-[var(--eb-accent)]/20 text-[var(--eb-accent)] px-2 py-0.5 rounded-full font-medium">BIENTÔT</span>}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--eb-border-soft)]">
          <Link href="/auth/logout" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-[10px] text-sm text-[var(--eb-text-muted)] hover:bg-[var(--eb-bg-elev-2)] transition-colors">
            Déconnexion
          </Link>
        </div>
      </nav>
      <style jsx>{`@keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }`}</style>
    </>
  );
}
