import type { Metadata } from "next";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Analytics Dashboard — Embir",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("embir_admin_token")?.value;
  const secret = process.env.ADMIN_SECRET || "embir_dashboard_2026";
  return token === secret;
}

export default async function AnalyticsDashboard() {
  const isAuthed = await checkAuth();

  if (!isAuthed) {
    return (
      <main className="emb-page min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
          <h1 className="font-serif text-2xl text-white">Admin Access</h1>
          <p className="mt-3 text-sm text-white/45">This dashboard is restricted to Embir administrators.</p>
          <form method="POST" action="/api/admin/auth" className="mt-6 space-y-4">
            <input
              type="password"
              name="password"
              placeholder="Enter admin password"
              className="w-full rounded-xl border border-white/[0.10] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-[#d4a574]/50 focus:outline-none"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-[#d4a574] py-3 text-sm font-bold text-[#0a0614] hover:bg-[#e8c4a2]"
            >
              Access Dashboard
            </button>
          </form>
          {false && <p className="mt-4 text-xs text-red-400">Invalid password</p>}
        </div>
      </main>
    );
  }

  const [totalEvents, uniqueIPs, pageViews, signupViews, earlyAccess, eventsByType, topPages, dailyStats] = await Promise.all([
    prisma.analyticsEvent.count(),
    prisma.analyticsEvent.groupBy({ by: ["ipAddress"] }).then(r => r.length),
    prisma.analyticsEvent.count({ where: { eventName: "page_view" } }),
    prisma.analyticsEvent.count({ where: { eventName: "signup_page_view" } }),
    prisma.analyticsEvent.count({ where: { eventName: "early_access_signup" } }),
    prisma.analyticsEvent.groupBy({ by: ["eventName"], _count: true, orderBy: { _count: { eventName: "desc" } } }),
    prisma.analyticsEvent.groupBy({ by: ["page"], _count: true, where: { eventName: "page_view" }, orderBy: { _count: { page: "desc" } }, take: 20 }),
    prisma.$queryRaw`SELECT DATE("createdAt") as date, COUNT(*)::int as events, COUNT(DISTINCT "ipAddress")::int as unique_ips FROM "AnalyticsEvent" GROUP BY 1 ORDER BY 1 DESC LIMIT 10` as Promise<{date: Date, events: number, unique_ips: number}[]>,
  ]);

  const conversionRate = pageViews > 0 ? ((earlyAccess / pageViews) * 100).toFixed(2) : "0";

  return (
    <main className="emb-page min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-5xl">
        <h1 className="font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">Analytics Dashboard</h1>
        <p className="mt-4 text-sm text-white/35">Internal analytics — restricted access</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-4">
          {[
            ["Total Events", totalEvents.toString()],
            ["Unique Visitors", uniqueIPs.toString()],
            ["Page Views", pageViews.toString()],
            ["Signup Rate", `${conversionRate}%`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-center">
              <p className="text-3xl font-bold text-[#d4a574]">{value}</p>
              <p className="mt-1 text-xs text-white/45">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <h2 className="font-serif text-2xl text-white">Events by Type</h2>
            <div className="mt-4 space-y-2">
              {eventsByType.map((e: any) => (
                <div key={e.eventName} className="flex justify-between text-sm">
                  <span className="text-white/60">{e.eventName}</span>
                  <span className="font-mono text-[#d4a574]">{e._count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <h2 className="font-serif text-2xl text-white">Daily Traffic</h2>
            <div className="mt-4 space-y-2">
              {dailyStats.map((d: any) => (
                <div key={d.date.toString()} className="flex justify-between text-sm">
                  <span className="text-white/60">{new Date(d.date).toLocaleDateString("en-GB")}</span>
                  <span className="font-mono text-[#d4a574]">{d.events} events · {d.unique_ips} IPs</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <h2 className="font-serif text-2xl text-white">Top Pages</h2>
          <div className="mt-4 space-y-1.5">
            {topPages.map((p: any) => (
              <div key={p.page} className="flex justify-between text-sm">
                <span className="text-white/60 truncate max-w-md">{p.page}</span>
                <span className="font-mono text-[#d4a574]">{p._count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-[#ff5e36]/10 bg-[#ff5e36]/[0.03] p-6">
          <h2 className="font-serif text-xl text-white">Funnel</h2>
          <div className="mt-3 flex items-center gap-3 text-sm">
            <span className="text-white/60">{pageViews} views</span>
            <span className="text-white/20">→</span>
            <span className="text-white/60">{signupViews} signup page</span>
            <span className="text-white/20">→</span>
            <span className="text-[#d4a574] font-bold">{earlyAccess} conversions</span>
            <span className="text-white/35">({conversionRate}%)</span>
          </div>
        </div>
      </article>
    </main>
  );
}
