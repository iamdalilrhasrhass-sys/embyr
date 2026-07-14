import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminMetrics } from "@/lib/admin-metrics";

export const dynamic = "force-dynamic";
export const metadata = { title: "Cockpit — Embir Admin", robots: { index: false, follow: false } };

function Metric({ label, value, detail }: { label: string; value: string | number; detail?: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-5">
      <p className="text-xs uppercase tracking-[0.14em] text-white/40">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
      {detail ? <p className="mt-1 text-xs text-white/35">{detail}</p> : null}
    </div>
  );
}

function Breakdown({ title, rows }: { title: string; rows: Array<{ label: string; total: number }> }) {
  return (
    <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-2">
        {rows.length === 0 ? <p className="text-sm text-white/35">Pas encore assez de données.</p> : rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 text-sm">
            <span className="min-w-0 truncate text-white/55">{row.label}</span>
            <span className="font-mono text-[#d4a574]">{row.total}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function AdminAnalytics() {
  const admin = await requireAdmin();
  if (!admin) redirect("/analytics-dashboard");
  const metrics = await getAdminMetrics();
  const change = (value: number | null) => value === null ? "nouvelle base" : `${value >= 0 ? "+" : ""}${value}% vs 30 j précédents`;

  return (
    <main className="min-h-screen bg-[#06030f] px-5 py-10 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#d4a574]">Embir · pilotage first-party</p>
            <h1 className="mt-2 text-4xl font-semibold">Cockpit opérateur</h1>
            <p className="mt-2 text-sm text-white/40">Trafic, activation, Connection OS, cohortes et santé technique.</p>
          </div>
          <nav className="flex gap-2 text-sm">
            <Link href="/admin/feedback" className="rounded-xl bg-white/[0.06] px-4 py-2 hover:bg-white/[0.10]">Feedback</Link>
            <Link href="/fr/admin" className="rounded-xl bg-white/[0.06] px-4 py-2 hover:bg-white/[0.10]">Modération</Link>
          </nav>
        </header>

        <section className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Visiteurs aujourd’hui" value={metrics.overview.visitorsToday} />
          <Metric label="Visiteurs 7 jours" value={metrics.overview.visitors7d} />
          <Metric label="Visiteurs 30 jours" value={metrics.overview.visitors30d} />
          <Metric label="Sessions 30 jours" value={metrics.overview.sessions30d} />
          <Metric label="Pages vues 30 jours" value={metrics.overview.pageViews30d} detail={change(metrics.overview.pageViewsChange)} />
          <Metric label="Inscriptions aujourd’hui" value={metrics.overview.signupsToday} />
          <Metric label="Inscriptions 7 jours" value={metrics.overview.signups7d} />
          <Metric label="Inscriptions 30 jours" value={metrics.overview.signups30d} detail={change(metrics.overview.signupsChange)} />
          <Metric label="Utilisateurs" value={metrics.overview.totalUsers} />
          <Metric label="Profils complétés" value={metrics.overview.completedProfiles} />
          <Metric label="DAU / WAU / MAU" value={`${metrics.overview.dau} / ${metrics.overview.wau} / ${metrics.overview.mau}`} />
          <Metric
            label="Visite → inscription"
            value={metrics.overview.visitToSignup === null ? "—" : `${metrics.overview.visitToSignup}%`}
            detail={metrics.overview.visitToSignup === null ? "fenêtre first-party en cours" : undefined}
          />
          <Metric label="Connexions réciproques" value={metrics.overview.reciprocalConnections} />
          <Metric label="Conversations" value={metrics.overview.conversationsStarted} />
          <Metric label="Rencontres proposées" value={metrics.overview.plansProposed} />
          <Metric label="Erreurs API 24 h" value={metrics.health.apiErrors24h} />
        </section>

        <section className="mt-9 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">
          <h2 className="text-xl font-semibold">Parcours acquisition → activation → relation · 30 jours</h2>
          <p className="mt-2 text-xs leading-relaxed text-white/35">Acteurs uniques par étape quand l’identifiant est disponible. Les passages anonyme → compte restent des volumes directionnels, pas une preuve causale.</p>
          <div className="mt-5 grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(135px,1fr))]">
            {metrics.funnel.map((stage) => (
              <div key={stage.label} className="rounded-xl bg-white/[0.035] p-4">
                <p className="break-words text-xs text-white/40">{stage.label}</p>
                <p className="mt-2 text-2xl font-semibold">{stage.total}</p>
                <p className="mt-1 text-[11px] text-[#d4a574]">{stage.conversionFromPrevious === null ? "point d’entrée" : `${stage.conversionFromPrevious}%`}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <Breakdown title="Acquisition" rows={metrics.acquisition} />
          <Breakdown title="Campagnes UTM" rows={metrics.campaigns} />
          <Breakdown title="Pages d’entrée" rows={metrics.topPages} />
          <Breakdown title="Étapes produit" rows={metrics.product} />
          <Breakdown title="Langues" rows={metrics.languages} />
          <Breakdown title="Appareils" rows={metrics.devices} />
          <Breakdown title="Pays (seuil ≥ 10)" rows={metrics.countries} />
          <Breakdown title="Villes (seuil ≥ 10)" rows={metrics.cities} />
          <Breakdown title="Intentions (seuil ≥ 10)" rows={metrics.intentions} />
        </div>

        <section className="mt-8 overflow-x-auto rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">
          <h2 className="text-xl font-semibold">Cohortes hebdomadaires</h2>
          <table className="mt-5 w-full min-w-[620px] text-left text-sm">
            <thead className="text-white/35"><tr><th className="pb-3">Semaine</th><th>Utilisateurs</th><th>D1</th><th>D7</th><th>D30</th></tr></thead>
            <tbody>{metrics.cohorts.map((cohort) => (
              <tr key={cohort.cohort} className="border-t border-white/[0.05]">
                <td className="py-3">{cohort.cohort}</td><td>{cohort.users}</td><td>{cohort.d1}%</td><td>{cohort.d7}%</td><td>{cohort.d30}%</td>
              </tr>
            ))}</tbody>
          </table>
        </section>

        <section className="mt-8 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">
          <h2 className="text-xl font-semibold">Santé technique</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Emails échoués" value={metrics.health.emailFailed} />
            <Metric label="Emails en attente" value={metrics.health.emailPending} />
            <Metric label="Notifications échouées" value={metrics.health.notificationFailed} />
            <Metric label="Process uptime" value={`${Math.floor(metrics.health.uptimeSeconds / 60)} min`} detail={`commit ${metrics.health.deployedCommit.slice(0, 12)}`} />
            <Metric
              label="Dernière sauvegarde"
              value={metrics.health.backup.status}
              detail={metrics.health.backup.completedAt ? new Date(metrics.health.backup.completedAt).toLocaleString("fr-CH") : "aucune preuve disponible"}
            />
            <Metric
              label="Dernière migration"
              value={metrics.health.migration.status}
              detail={metrics.health.migration.name ?? "aucune migration enregistrée"}
            />
          </div>
          <div className="mt-5 space-y-2">
            {metrics.health.jobs.length === 0 ? <p className="text-sm text-white/35">Aucun job exécuté.</p> : metrics.health.jobs.map((job) => (
              <div key={job.jobName} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/[0.03] px-4 py-3 text-sm">
                <span>{job.jobName}</span><span className="text-white/50">{job.status} · {job.processedCount} éléments · {job.startedAt.toISOString()}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
