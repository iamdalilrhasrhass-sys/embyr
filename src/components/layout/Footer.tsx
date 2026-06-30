import Link from "next/link";
import { getLocale } from "next-intl/server";
import EmbirLogo from "@/components/brand/EmbirLogo";

const footerCopy = {
  fr: {
    tagline: "Plateforme de rencontre internationale pour toutes les orientations. France, Suisse, UK et USA. Gratuite au lancement, freemium plus tard, avec profils verifies et decouverte par compatibilite.",
    adult: "18+ UNIQUEMENT",
    navigation: "Navigation",
    freeLaunch: "Lancement gratuit",
    freemium: "Modele freemium",
    us: "Etats-Unis",
    uk: "Royaume-Uni",
    ch: "Suisse",
    orientations: "Orientations",
    safety: "Securite",
    about: "A propos",
    members: "Membres",
    legal: "Legal & securite",
    terms: "Conditions d'utilisation",
    privacy: "Confidentialite",
    age: "Verification d'age",
    moderation: "Moderation & signalement",
    support: "Support",
    rights: "Tous droits reserves.",
    regions: "France · Suisse · UK · USA · toutes orientations",
  },
  en: {
    tagline: "International dating platform for all orientations across France, Switzerland, the UK and the USA. Free at launch, freemium later, with verified profiles and compatibility-first discovery.",
    adult: "18+ ONLY",
    navigation: "Navigation",
    freeLaunch: "Free launch",
    freemium: "Freemium model",
    us: "United States",
    uk: "United Kingdom",
    ch: "Switzerland",
    orientations: "Orientations",
    safety: "Safety",
    about: "About",
    members: "Members",
    legal: "Legal & Safety",
    terms: "Terms of Service",
    privacy: "Privacy Policy",
    age: "Age Verification",
    moderation: "Moderation & Reporting",
    support: "Support",
    rights: "All rights reserved.",
    regions: "France · Switzerland · UK · USA · all orientations",
  },
};

export default async function Footer() {
  const locale = await getLocale();
  const isFr = locale === "fr";
  const copy = isFr ? footerCopy.fr : footerCopy.en;
  const prefix = isFr ? "/fr" : "";

  return (
    <footer className="bg-[#070409] border-t border-white/6 py-12 mt-20 relative">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff1f5a]/35 via-[#ff5e36]/35 to-transparent opacity-80" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <EmbirLogo size="sm" className="mb-2" />
            <p className="mt-4 text-sm text-[var(--color-premium-gray)] leading-relaxed">
              {copy.tagline}
            </p>
            <p className="mt-3 text-xs uppercase tracking-[0.18em] text-white/35">
              COURTIA (courtiark.fr) · Embir (embir.xyz)
            </p>
            <p className="mt-4 text-xs font-bold text-red-400">{copy.adult}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4 text-white">{copy.navigation}</h3>
            <ul className="space-y-2 text-sm text-[var(--color-premium-gray)]">
              <li><Link href={prefix || "/"} prefetch={false} className="hover:text-[#ff5e36]">{isFr ? "Accueil" : "Home"}</Link></li>
              <li><Link href={isFr ? "/fr/application-rencontre-gratuite" : "/free-dating-app"} prefetch={false} className="hover:text-[#ff5e36]">{copy.freeLaunch}</Link></li>
              <li><Link href={isFr ? "/fr/modele-freemium" : "/freemium-model"} prefetch={false} className="hover:text-[#ff5e36]">{copy.freemium}</Link></li>
              <li><Link href="/us" prefetch={false} className="hover:text-[#ff5e36]">{copy.us}</Link></li>
              <li><Link href="/uk" prefetch={false} className="hover:text-[#ff5e36]">{copy.uk}</Link></li>
              <li><Link href={isFr ? "/fr/suisse" : "/switzerland"} prefetch={false} className="hover:text-[#ff5e36]">{copy.ch}</Link></li>
              <li><Link href={isFr ? "/fr/rencontre-lgbt" : "/lgbtq-dating-app"} prefetch={false} className="hover:text-[#ff5e36]">{copy.orientations}</Link></li>
              <li><Link href={isFr ? "/fr/profils-verifies" : "/verified-dating-app"} prefetch={false} className="hover:text-[#ff5e36]">{copy.safety}</Link></li>
              <li><Link href={`${prefix}/about`} prefetch={false} className="hover:text-[#ff5e36]">{copy.about}</Link></li>
              <li><Link href={`${prefix}/membres`} prefetch={false} className="hover:text-[#ff5e36]">{copy.members}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4 text-white">{copy.legal}</h3>
            <ul className="space-y-2 text-sm text-[var(--color-premium-gray)]">
              <li><Link href={`${prefix}/legal/cgu`} prefetch={false} className="hover:text-[#ff5e36]">{copy.terms}</Link></li>
              <li><Link href={`${prefix}/legal/confidentialite`} prefetch={false} className="hover:text-[#ff5e36]">{copy.privacy}</Link></li>
              <li><Link href={`${prefix}/legal/18-plus`} prefetch={false} className="hover:text-[#ff5e36]">{copy.age}</Link></li>
              <li><Link href={`${prefix}/legal/moderation`} prefetch={false} className="hover:text-[#ff5e36]">{copy.moderation}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4 text-white">{copy.support}</h3>
            <ul className="space-y-2 text-sm text-[var(--color-premium-gray)]">
              <li><a href="mailto:contact@embir.xyz" className="hover:text-[#ff5e36]">contact@embir.xyz</a></li>
              <li><Link href={`${prefix}/faq`} prefetch={false} className="hover:text-[#ff5e36]">FAQ</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 text-center text-xs text-[var(--color-premium-gray)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 embir.xyz · COURTIA (courtiark.fr). {copy.rights}</p>
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff1f5a]/70" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5e36]/70" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffa333]/70" />
            <span className="text-white/30">•</span>
            <p>{copy.regions}</p>
          </div>
          <a href="https://fazier.com" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://fazier.com/api/v1/public/badges/launch_badges.svg"
              alt="Launched on Fazier"
              width="105"
              height="auto"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
