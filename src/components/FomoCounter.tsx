/** Honest community invitation. Kept under the legacy export name for compatibility. */
export default function FomoCounter({ locale = "en" }: { locale?: string }) {
  const isFR = locale === "fr";
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#ff5e36]/20 bg-gradient-to-r from-[#ff5e36]/[0.08] via-[#d4a574]/[0.04] to-[#ff1f5a]/[0.08] p-5 sm:p-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-1 font-mono text-xs uppercase tracking-[0.2em] text-[#d4a574]/70">
            {isFR ? "Communauté Embir" : "Embir community"}
          </p>
          <p className="max-w-xl text-sm leading-relaxed text-white/55">
            {isFR
              ? "Invite uniquement des personnes que tu connais réellement. Embir n’affiche ni faux compteur ni rareté artificielle."
              : "Invite people you genuinely know. Embir displays no fake counters or artificial scarcity."}
          </p>
        </div>
        <a
          href={isFR ? "/fr/auth/register" : "/auth/register"}
          className="shrink-0 whitespace-nowrap rounded-full bg-[#d4a574] px-6 py-3 text-sm font-bold text-[#0a0614] transition-colors hover:bg-[#ff5e36]"
        >
          {isFR ? "Créer mon profil" : "Create my profile"}
        </a>
      </div>
    </div>
  );
}
