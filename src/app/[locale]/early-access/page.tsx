import type { Metadata } from "next";
import EmbirLogo from "@/components/brand/EmbirLogo";
import ScrollReveal from "@/components/motion/ScrollReveal";
import Particles3D from "@/components/ui/Particles3D";
import EarlyAccessForm from "@/components/early-access-form";

export const metadata: Metadata = {
  title: "Early Access Founders",
  description: "Join the founding community of Embir. Create your personal universe and meet compatible people in your area. Free at launch.",
};

export default function EarlyAccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#0a0614]">
      <div className="emb-liquid-mesh" />
      <div className="emb-hero-orb emb-hero-orb-1" />
      <div className="emb-hero-orb emb-hero-orb-2" />
      <Particles3D count={50} className="absolute inset-0 z-[1]" />
      <div className="absolute inset-0 noise-overlay z-[2] pointer-events-none" />

      <ScrollReveal direction="up" className="w-full max-w-lg z-10 py-12">
        <div className="emb-glass-extreme w-full p-8 md:p-10 rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.6)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#d4a574]/10 rounded-full blur-[60px] pointer-events-none" />

          <div className="mb-8 flex justify-center relative z-10">
            <EmbirLogo size="md" />
          </div>

          <div className="relative z-10">
            <div className="mb-8 text-center">
              <h1 className="text-4xl md:text-5xl font-serif text-white mb-4 leading-tight">
                Rejoins l'accès <span className="text-[#d4a574] italic">fondateur</span>.
              </h1>
              <p className="text-white/50 text-sm leading-relaxed max-w-sm mx-auto">
                Crée ton univers avant tout le monde. Indique tes préférences pour être invité(e) quand des profils compatibles rejoignent ta zone.
              </p>
            </div>

            <EarlyAccessForm />
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
