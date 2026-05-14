import Link from "next/link";
import EmbyrLogo from "@/components/brand/EmbyrLogo";

export default function Footer() {
  return (
    <footer className="bg-[#0a0612] border-t border-white/5 py-12 mt-20 relative">
      {/* Embyr accent line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff6b35]/30 via-[#e91e63]/30 to-transparent opacity-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <EmbyrLogo size="sm" className="mb-2" />
            <span className="hidden">
              Emb<span className="text-[var(--color-premium-rose)]">yr</span>
            </span>
            <p className="mt-4 text-sm text-[var(--color-premium-gray)] leading-relaxed">
              La première plateforme de rencontres gay premium, sans pubs,
              avec une vraie modération et des profils vérifiés.
            </p>
            <p className="mt-4 text-xs font-bold text-red-400">18+ UNIQUEMENT</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4 text-white">Navigation</h3>
            <ul className="space-y-2 text-sm text-[var(--color-premium-gray)]">
              <li><Link href="/" className="hover:text-[var(--color-premium-rose)]">Accueil</Link></li>
              <li><Link href="/profiles" className="hover:text-[var(--color-premium-rose)]">Profils</Link></li>
              <li><Link href="/pricing" className="hover:text-[var(--color-premium-rose)]">Tarifs</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4 text-white">Légal & Sécurité</h3>
            <ul className="space-y-2 text-sm text-[var(--color-premium-gray)]">
              <li><Link href="/legal/cgu" className="hover:text-[var(--color-premium-rose)]">Conditions Générales</Link></li>
              <li><Link href="/legal/confidentialite" className="hover:text-[var(--color-premium-rose)]">Confidentialité</Link></li>
              <li><Link href="/legal/18-plus" className="hover:text-[var(--color-premium-rose)]">Vérification d'âge</Link></li>
              <li><Link href="/legal/moderation" className="hover:text-[var(--color-premium-rose)]">Modération & Signalement</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4 text-white">Support</h3>
            <ul className="space-y-2 text-sm text-[var(--color-premium-gray)]">
              <li><a href="mailto:contact@embir.xyz" className="hover:text-[var(--color-premium-rose)]">contact@embir.xyz</a></li>
              <li><Link href="/faq" className="hover:text-[var(--color-premium-rose)]">Foire Aux Questions</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 text-center text-xs text-[var(--color-premium-gray)] flex flex-col md:flex-row justify-between items-center gap-2">
          <p>© {new Date().getFullYear()} Embyr. Tous droits réservés.</p>
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]/60" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#e91e63]/60" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#c87f5a]/60" />
            <span className="text-white/30">•</span>
            <p>Connexion, pas juste un plan cul.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
