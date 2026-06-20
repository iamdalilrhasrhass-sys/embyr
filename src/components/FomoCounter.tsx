/**
 * FOMO Founder Counter — displayed on the home page.
 * Uses a stable server-rendered founder count to avoid shipping
 * above-the-fold client JavaScript on the landing page.
 */
export default function FomoCounter({ locale = "en" }: { locale?: string }) {
  const isFR = locale === "fr";
  const count = 13;
  const limit = 100;
  const remaining = 87;

  const progress = Math.min(100, (count / limit) * 100);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#ff5e36]/20 bg-gradient-to-r from-[#ff5e36]/[0.08] via-[#d4a574]/[0.04] to-[#ff1f5a]/[0.08] p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d4a574]/70 mb-1">
            {isFR ? "Communauté fondatrice" : "Founding community"}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white">{count}</span>
            <span className="text-lg text-white/30">/ {limit}</span>
          </div>
          {remaining !== null && remaining > 0 && (
            <p className="text-sm text-[#ff5e36] font-semibold mt-1">
              {isFR
                ? `Plus que ${remaining} places fondatrice`
                : `Only ${remaining} founder spots left`}
            </p>
          )}
        </div>
        <a
          href={isFR ? "/fr/auth/register" : "/auth/register"}
          className="flex-shrink-0 px-6 py-3 bg-[#d4a574] text-[#0a0614] rounded-full font-bold text-sm hover:bg-[#ff5e36] transition-colors whitespace-nowrap"
        >
          {isFR ? "Rejoindre maintenant" : "Join now"}
        </a>
      </div>
      <div className="mt-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#d4a574] via-[#ff5e36] to-[#ff1f5a]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
