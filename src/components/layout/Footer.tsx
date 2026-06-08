import Link from "next/link";
import EmbyrLogo from "@/components/brand/EmbirLogo";

export default function Footer() {
  return (
    <footer className="bg-[#0a0612] border-t border-white/5 py-12 mt-20 relative">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#06B6D4]/30 via-[#6366F1]/30 to-transparent opacity-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <EmbyrLogo size="sm" className="mb-2" />
            <span className="hidden">
              Emb<span className="text-cyan-400">yr</span>
            </span>
            <p className="mt-4 text-sm text-[var(--color-premium-gray)] leading-relaxed">
              App de rencontre gay nouvelle génération. Gratuite pendant
              sa phase de lancement. Paris d&apos;abord, profils réels,
              messagerie gratuite.
            </p>
            <p className="mt-4 text-xs font-bold text-red-400">18+ UNIQUEMENT</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4 text-white">Navigation</h3>
            <ul className="space-y-2 text-sm text-[var(--color-premium-gray)]">
              <li><Link href="/" className="hover:text-cyan-400">Accueil</Link></li>
              <li><Link href="/paris" className="hover:text-cyan-400">100 fondateurs Paris</Link></li>
              <li><Link href="/about" className="hover:text-cyan-400">À propos</Link></li>
              <li><Link href="/membres" className="hover:text-cyan-400">Membres</Link></li>
              <li><Link href="/premium" className="hover:text-cyan-400">Premium</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4 text-white">Légal & Sécurité</h3>
            <ul className="space-y-2 text-sm text-[var(--color-premium-gray)]">
              <li><Link href="/legal/cgu" className="hover:text-cyan-400">Conditions Générales</Link></li>
              <li><Link href="/legal/confidentialite" className="hover:text-cyan-400">Confidentialité</Link></li>
              <li><Link href="/legal/18-plus" className="hover:text-cyan-400">Vérification d&apos;âge</Link></li>
              <li><Link href="/legal/moderation" className="hover:text-cyan-400">Modération & Signalement</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4 text-white">Support</h3>
            <ul className="space-y-2 text-sm text-[var(--color-premium-gray)]">
              <li><a href="mailto:contact@embir.xyz" className="hover:text-cyan-400">contact@embir.xyz</a></li>
              <li><Link href="/faq" className="hover:text-cyan-400">Foire Aux Questions</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 text-center text-xs text-[var(--color-premium-gray)] flex flex-col md:flex-row justify-between items-center gap-2">
          <p>© 2026 embir.xyz. Tous droits réservés.</p>
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60" />
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/60" />
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400/60" />
            <span className="text-white/30">•</span>
            <p>Rencontre plus librement. Gratuitement.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
