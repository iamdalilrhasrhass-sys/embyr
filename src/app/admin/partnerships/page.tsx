import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Partenariats permission-first — Embir Admin",
  robots: { index: false, follow: false },
};

const permissionLabels: Record<string, string> = {
  not_requested: "À préparer",
  permission_requested: "Autorisation demandée",
  permission_granted: "Autorisation accordée",
  permission_denied: "Refus",
  opted_out: "Opposition — ne plus contacter",
};

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-5">
      <p className="text-xs uppercase tracking-[0.14em] text-white/40">{label}</p>
      <p className="mt-2 font-mono text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}

export default async function AdminPartnershipsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/analytics-dashboard");
  const prospects = await prisma.prospect.findMany({
    orderBy: [{ nextFollowUpAt: "asc" }, { updatedAt: "desc" }],
    select: {
      id: true,
      pseudo: true,
      organizationType: true,
      city: true,
      publicUrl: true,
      publicContact: true,
      contactChannel: true,
      contactSourceUrl: true,
      status: true,
      permissionStatus: true,
      permissionRequestedAt: true,
      permissionGrantedAt: true,
      optedOutAt: true,
      nextFollowUpAt: true,
      lastContactedAt: true,
      campaign: true,
      internalNotes: true,
    },
  });
  const count = (permissionStatus: string) =>
    prospects.filter((prospect) => prospect.permissionStatus === permissionStatus).length;

  return (
    <main className="min-h-screen bg-[#06030f] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#d4a574]">Embir · acquisition responsable</p>
            <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Partenariats Lausanne</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/45">
              Contacts professionnels publics uniquement. Une demande d’autorisation précède tout partage promotionnel ; un refus ou une opposition arrête définitivement le contact.
            </p>
          </div>
          <Link href="/admin/analytics" className="min-h-11 rounded-xl bg-white/[0.07] px-4 py-3 text-sm hover:bg-white/[0.11]">
            Retour au Command Center
          </Link>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Metric label="Prospects vérifiés" value={prospects.length} />
          <Metric label="À préparer" value={count("not_requested")} />
          <Metric label="Demandes envoyées" value={count("permission_requested")} />
          <Metric label="Autorisations" value={count("permission_granted")} />
          <Metric label="Oppositions / refus" value={count("opted_out") + count("permission_denied")} />
        </section>

        <section className="mt-8 overflow-x-auto rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-6">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="text-white/35">
              <tr>
                <th className="pb-3">Organisation</th>
                <th className="pb-3">Contact public</th>
                <th className="pb-3">Autorisation</th>
                <th className="pb-3">Prochaine action</th>
                <th className="pb-3">Campagne</th>
              </tr>
            </thead>
            <tbody>
              {prospects.map((prospect) => (
                <tr key={prospect.id} className="border-t border-white/[0.06] align-top">
                  <td className="py-4 pr-5">
                    <p className="font-medium">{prospect.pseudo}</p>
                    <p className="mt-1 text-xs text-white/35">{[prospect.organizationType, prospect.city, prospect.status].filter(Boolean).join(" · ")}</p>
                    {prospect.publicUrl ? <a className="mt-1 block text-xs text-[#d4a574] hover:underline" href={prospect.publicUrl} target="_blank" rel="noreferrer">Site officiel</a> : null}
                  </td>
                  <td className="py-4 pr-5">
                    <p>{prospect.publicContact ?? "—"}</p>
                    <p className="text-xs text-white/35">{prospect.contactChannel ?? "canal non défini"}</p>
                    {prospect.contactSourceUrl ? <a className="text-xs text-[#d4a574] hover:underline" href={prospect.contactSourceUrl} target="_blank" rel="noreferrer">Preuve publique</a> : null}
                  </td>
                  <td className="py-4 pr-5">
                    <span className="inline-flex rounded-full bg-white/[0.07] px-3 py-1 text-xs">{permissionLabels[prospect.permissionStatus] ?? prospect.permissionStatus}</span>
                    {prospect.optedOutAt ? <p className="mt-1 text-xs text-red-300">Contact interdit</p> : null}
                  </td>
                  <td className="py-4 pr-5 text-xs text-white/55">
                    {prospect.nextFollowUpAt ? prospect.nextFollowUpAt.toLocaleString("fr-CH") : "Aucune relance planifiée"}
                    {prospect.lastContactedAt ? <p className="mt-1 text-white/30">Dernier contact : {prospect.lastContactedAt.toLocaleDateString("fr-CH")}</p> : null}
                  </td>
                  <td className="py-4 text-xs text-white/45">
                    <p>{prospect.campaign ?? "—"}</p>
                    {prospect.internalNotes ? <p className="mt-1 max-w-xs line-clamp-3">{prospect.internalNotes}</p> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {prospects.length === 0 ? <p className="py-10 text-center text-sm text-white/35">Aucun prospect public qualifié pour le moment.</p> : null}
        </section>
      </div>
    </main>
  );
}
