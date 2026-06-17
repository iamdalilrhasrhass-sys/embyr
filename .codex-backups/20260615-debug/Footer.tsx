import Link from "next/link";
import EmbirLogo from "@/components/brand/EmbirLogo";

export default function Footer() {
  return (
    <footer className="bg-[#070409] border-t border-white/6 py-12 mt-20 relative">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff1f5a]/35 via-[#ff5e36]/35 to-transparent opacity-80" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <EmbirLogo size="sm" className="mb-2" />
            <p className="mt-4 text-sm text-[var(--color-premium-gray)] leading-relaxed">
              International dating platform for all orientations.
              Free at launch, freemium later, with verified profiles and compatibility-first discovery.
            </p>
            <p className="mt-4 text-xs font-bold text-red-400">18+ ONLY</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4 text-white">Navigation</h3>
            <ul className="space-y-2 text-sm text-[var(--color-premium-gray)]">
              <li><Link href="/" className="hover:text-[#ff5e36]">Home</Link></li>
              <li><Link href="/free-dating-app" className="hover:text-[#ff5e36]">Free launch</Link></li>
              <li><Link href="/freemium-model" className="hover:text-[#ff5e36]">Freemium model</Link></li>
              <li><Link href="/us" className="hover:text-[#ff5e36]">United States</Link></li>
              <li><Link href="/uk" className="hover:text-[#ff5e36]">United Kingdom</Link></li>
              <li><Link href="/lgbtq-dating-app" className="hover:text-[#ff5e36]">Orientations</Link></li>
              <li><Link href="/verified-dating-app" className="hover:text-[#ff5e36]">Safety</Link></li>
              <li><Link href="/about" className="hover:text-[#ff5e36]">About</Link></li>
              <li><Link href="/membres" className="hover:text-[#ff5e36]">Members</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4 text-white">Legal & Safety</h3>
            <ul className="space-y-2 text-sm text-[var(--color-premium-gray)]">
              <li><Link href="/legal/cgu" className="hover:text-[#ff5e36]">Terms of Service</Link></li>
              <li><Link href="/legal/confidentialite" className="hover:text-[#ff5e36]">Privacy Policy</Link></li>
              <li><Link href="/legal/18-plus" className="hover:text-[#ff5e36]">Age Verification</Link></li>
              <li><Link href="/legal/moderation" className="hover:text-[#ff5e36]">Moderation & Reporting</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4 text-white">Support</h3>
            <ul className="space-y-2 text-sm text-[var(--color-premium-gray)]">
              <li><a href="mailto:contact@embir.xyz" className="hover:text-[#ff5e36]">contact@embir.xyz</a></li>
              <li><Link href="/faq" className="hover:text-[#ff5e36]">FAQ</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 text-center text-xs text-[var(--color-premium-gray)] flex flex-col md:flex-row justify-between items-center gap-2">
          <p>© 2026 embir.xyz. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff1f5a]/70" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5e36]/70" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffa333]/70" />
            <span className="text-white/30">•</span>
            <p>France · UK · USA · all orientations</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
