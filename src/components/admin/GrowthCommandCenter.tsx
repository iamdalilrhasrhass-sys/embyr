import type { GrowthMetrics } from "@/lib/growth-metrics";

interface GrowthCommandCenterProps {
  growth: GrowthMetrics;
}

export function GrowthCommandCenter({ growth }: GrowthCommandCenterProps) {
  const measurementCopy = growth.measurement.state === "ready"
    ? "Mesure exploitable"
    : growth.measurement.state === "blocked"
      ? "Mesure bloquée"
      : "Mesure en calibration";
  const measurementTone = growth.measurement.state === "ready"
    ? "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-200"
    : growth.measurement.state === "blocked"
      ? "border-red-400/20 bg-red-400/[0.06] text-red-200"
      : "border-amber-300/20 bg-amber-300/[0.06] text-amber-100";

  return (
    <section aria-labelledby="growth-objective" className="mt-9 space-y-6">
      <div className="overflow-hidden rounded-3xl border border-[#d4a574]/20 bg-[radial-gradient(circle_at_top_right,rgba(255,94,54,0.16),transparent_42%),rgba(255,255,255,0.025)] p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4a574]">Objectif opérationnel vérifiable</p>
            <h2 id="growth-objective" className="mt-3 text-3xl font-semibold sm:text-4xl">2 500 membres réels en Romandie</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/50">
              Comptage strict : inscription volontaire, email vérifié, consentements valides, zone, intention, préférences essentielles, source connue et absence de doublon. Les démos, tests, équipes et comptes supprimés ne comptent jamais.
            </p>
          </div>
          <div className="shrink-0 text-left lg:text-right">
            <p className="font-mono text-5xl font-semibold text-white">{growth.objective.qualifiedInTargetZones}<span className="text-2xl text-white/25"> / {growth.objective.target}</span></p>
            <p className="mt-2 text-sm text-white/45">{growth.objective.remaining} membres qualifiés restants</p>
          </div>
        </div>

        <div className="mt-7 h-3 overflow-hidden rounded-full bg-white/[0.07]" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={growth.objective.progress} aria-label="Progression vers 2 500 membres qualifiés">
          <div className="h-full rounded-full bg-gradient-to-r from-[#ff5e36] via-[#ff1f5a] to-[#d4a574]" style={{ width: `${growth.objective.progress}%` }} />
        </div>
        <div className="mt-3 flex flex-wrap justify-between gap-3 text-xs text-white/40">
          <span>{growth.objective.progress}% accompli</span>
          <span>{growth.objective.realRegistrationsGlobal} inscriptions humaines · {growth.objective.emailVerifiedGlobal} emails vérifiés · {growth.objective.qualifiedGlobal} membres qualifiés globalement</span>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.06] bg-black/15 p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-white/35">Comptes en base</p>
            <p className="mt-2 font-mono text-2xl">{growth.objective.allNonDeletedUsers}</p>
          </div>
          <div className="rounded-2xl border border-white/[0.06] bg-black/15 p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-white/35">Inscriptions humaines</p>
            <p className="mt-2 font-mono text-2xl">{growth.objective.realRegistrationsGlobal}</p>
          </div>
          <div className="rounded-2xl border border-white/[0.06] bg-black/15 p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-white/35">Emails vérifiés</p>
            <p className="mt-2 font-mono text-2xl">{growth.objective.emailVerifiedGlobal}</p>
          </div>
          <div className="rounded-2xl border border-white/[0.06] bg-black/15 p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-white/35">Qualifiés globalement</p>
            <p className="mt-2 font-mono text-2xl">{growth.objective.qualifiedGlobal}</p>
          </div>
          <div className="rounded-2xl border border-white/[0.06] bg-black/15 p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-white/35">Activés en zones</p>
            <p className="mt-2 font-mono text-2xl">{growth.objective.activationQualified}</p>
          </div>
          <div className="rounded-2xl border border-white/[0.06] bg-black/15 p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-white/35">Démos exclues</p>
            <p className="mt-2 font-mono text-2xl">{growth.objective.excludedDemoProfiles}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {growth.pacing.map((pace) => (
            <div key={pace.days} className="rounded-2xl bg-white/[0.035] p-4">
              <p className="text-xs text-white/35">Scénario {pace.days} jours</p>
              <p className="mt-2 font-mono text-2xl text-[#d4a574]">{pace.dailyQualifiedUsersNeeded}/jour</p>
              <p className="mt-1 text-xs text-white/30">membres qualifiés nets nécessaires</p>
            </div>
          ))}
        </div>
      </div>

      <div className={`rounded-2xl border p-5 ${measurementTone}`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-70">Qualité des données</p>
            <h3 className="mt-2 text-xl font-semibold">{measurementCopy}</h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed opacity-70">
              La nouvelle base commence au {new Date(growth.measurement.baselineAt).toLocaleString("fr-CH")}. Un statut « prêt » exige au moins 50 événements de parcours récents, 90 % d’acteurs identifiables, 90 % d’identifiants d’idempotence et aucun utilisateur orphelin. Les requêtes API techniques sont suivies séparément et ne faussent pas cette qualité.
            </p>
          </div>
          <span className="w-fit rounded-full border border-current/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]">{growth.measurement.state}</span>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div><p className="text-xs opacity-55">Événements nouvelle base</p><p className="mt-1 font-mono text-xl">{growth.measurement.postBaselineEvents}</p></div>
          <div><p className="text-xs opacity-55">Événements techniques séparés</p><p className="mt-1 font-mono text-xl">{growth.measurement.excludedOperationalEvents}</p></div>
          <div><p className="text-xs opacity-55">Couverture acteurs</p><p className="mt-1 font-mono text-xl">{growth.measurement.actorCoverage}%</p></div>
          <div><p className="text-xs opacity-55">Couverture idempotence</p><p className="mt-1 font-mono text-xl">{growth.measurement.idempotencyCoverage}%</p></div>
          <div><p className="text-xs opacity-55">Attribution inscriptions</p><p className="mt-1 font-mono text-xl">{growth.measurement.signupAttributionCoverage === null ? "—" : `${growth.measurement.signupAttributionCoverage}%`}</p></div>
          <div><p className="text-xs opacity-55">Orphelins récents</p><p className="mt-1 font-mono text-xl">{growth.measurement.orphanPostBaselineEvents}</p></div>
          <div><p className="text-xs opacity-55">Doublons email normalisés</p><p className="mt-1 font-mono text-xl">{growth.measurement.duplicateEmailGroups}</p></div>
          <div><p className="text-xs opacity-55">Événements legacy non attribuables</p><p className="mt-1 font-mono text-xl">{growth.measurement.legacyUnidentifiableEvents}</p></div>
          <div><p className="text-xs opacity-55">Dernier événement</p><p className="mt-1 font-mono text-sm">{growth.measurement.latestEventAt ? new Date(growth.measurement.latestEventAt).toLocaleString("fr-CH") : "aucun"}</p></div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_1.9fr]">
        <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6" aria-labelledby="density-title">
          <h3 id="density-title" className="text-xl font-semibold">Densité locale</h3>
          <p className="mt-2 text-xs leading-relaxed text-white/35">Les zones s’ouvrent par densité, pas par dispersion. Aucun faux compteur local.</p>
          <div className="mt-5 space-y-5">
            {growth.density.map((zone) => (
              <div key={zone.key}>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-white/65">{zone.label}</span>
                  <span className="font-mono text-[#d4a574]">{zone.current} / {zone.target}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#ff5e36] to-[#d4a574]" style={{ width: `${zone.progress}%` }} />
                </div>
                <p className="mt-2 text-[11px] text-white/30">{zone.onboarded} onboardés · {zone.signaled} signaux · {zone.recommended} recommandés</p>
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-x-auto rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6" aria-labelledby="stages-title">
          <h3 id="stages-title" className="text-xl font-semibold">Objectifs du funnel 2 500</h3>
          <p className="mt-2 text-xs leading-relaxed text-white/35">Seuils de pilotage provisoires, dérivés du cadre 1 000 × 2,5. Ils seront révisés uniquement avec une cohorte réelle suffisante.</p>
          <table className="mt-5 w-full min-w-[680px] text-left text-sm">
            <thead className="text-white/35">
              <tr><th className="pb-3">Étape</th><th>Réel</th><th>Cible</th><th>Progression</th></tr>
            </thead>
            <tbody>
              {growth.stages.map((stage) => (
                <tr key={stage.key} className="border-t border-white/[0.05]">
                  <td className="py-3 text-white/65">{stage.label}</td>
                  <td className="font-mono text-white">{stage.current}</td>
                  <td className="font-mono text-white/45">{stage.target}</td>
                  <td className="w-44">
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full bg-[#d4a574]" style={{ width: `${stage.progress}%` }} /></div>
                      <span className="w-12 text-right font-mono text-xs text-[#d4a574]">{stage.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6" aria-labelledby="campaign-links-title">
          <h3 id="campaign-links-title" className="text-xl font-semibold">Liens de campagne normalisés</h3>
          <p className="mt-2 text-xs leading-relaxed text-white/35">Même convention UTM sur tous les canaux. Les liens n’intègrent ni email, ni nom, ni code de parrainage personnel.</p>
          <div className="mt-5 space-y-3">
            {growth.campaignLinks.map((link) => (
              <a key={link.label} href={link.url} target="_blank" rel="noreferrer" className="block min-h-11 rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3 hover:border-[#d4a574]/30 hover:bg-[#d4a574]/[0.04]">
                <span className="block text-sm text-white/70">{link.label}</span>
                <span className="mt-1 block break-all font-mono text-[11px] text-[#d4a574]/70">{link.url}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6" aria-labelledby="definitions-title">
          <h3 id="definitions-title" className="text-xl font-semibold">Contrat de comptage</h3>
          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-white/50">
            {growth.definitions.map((definition) => <li key={definition} className="border-l border-[#d4a574]/30 pl-4">{definition}</li>)}
          </ul>
        </section>
      </div>
    </section>
  );
}
