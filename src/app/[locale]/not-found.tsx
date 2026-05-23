import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 noise-overlay" />
      <div className="absolute inset-0 soft-grid-bg" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-premium-rose/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-premium-purple/10 rounded-full blur-[100px] animate-pulse" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* Large 404 */}
        <div className="mb-8 relative">
          <h1 className="text-[180px] md:text-[220px] font-bold leading-none">
            <span className="text-gradient">4</span>
            <span className="text-white/10" style={{ textShadow: "0 0 80px rgba(244,63,143,0.3)" }}>0</span>
            <span className="text-gradient">4</span>
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-premium-rose/40 to-transparent" />
          </div>
        </div>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-light mb-4 text-premium-white">
          Page introuvable
        </h2>
        <p className="text-premium-gray text-lg md:text-xl mb-10 max-w-md mx-auto leading-relaxed">
          Cette page n&apos;existe pas ou a été déplacée. 
          La nuit porte conseil, mais ici il n&apos;y a que le silence.
        </p>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <span className="w-12 h-px bg-gradient-to-r from-transparent to-premium-rose/50" />
          <span className="w-2 h-2 rounded-full bg-premium-rose/60" />
          <span className="w-12 h-px bg-gradient-to-l from-transparent to-premium-purple/50" />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="group relative px-8 py-3.5 bg-gradient-premium rounded-full text-white font-medium shadow-lg shadow-premium-rose/20 hover:shadow-premium-rose/40 transition-all duration-500 hover:scale-105"
          >
            <span className="relative z-10">Retour à l&apos;accueil</span>
            <div className="absolute inset-0 rounded-full bg-gradient-premium opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
          </Link>
          <Link
            href="/profiles"
            className="px-8 py-3.5 glass-card rounded-full text-premium-white font-medium hover:bg-white/10 hover:border-premium-rose/30 transition-all duration-500 group"
          >
            <span>Explorer les profils</span>
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* Decorative dots */}
        <div className="flex justify-center gap-2 mt-12">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-premium-rose/30"
              style={{ animation: `pulse 2s ease-in-out ${i * 0.3}s infinite` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
