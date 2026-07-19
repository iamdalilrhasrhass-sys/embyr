import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Analytics Dashboard — Embir",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AnalyticsDashboard({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const isAuthed = Boolean(await requireAdmin());
  const loginFailed = (await searchParams).error === "1";

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
              autoComplete="current-password"
              aria-label="Admin password"
              placeholder="Enter admin password"
              className="w-full rounded-xl border border-white/[0.10] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-embir-rose/50 focus:outline-none"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-embir-rose py-3 text-sm font-bold text-embir-void hover:bg-embir-blush"
            >
              Access Dashboard
            </button>
          </form>
          {loginFailed && <p className="mt-4 text-xs text-red-400" role="alert">Invalid password</p>}
        </div>
      </main>
    );
  }

  const [totalEvents, anonymousVisitors, pageViews, signupViews, signups, eventsByType, topPages, dailyStats] = await Promise.all([
    prisma.analyticsEvent.count(),
    prisma.analyticsEvent.groupBy({
      by: ["anonymousId"],
      where: { anonymousId: { not: null } },
    }).then((rows) => rows.length),
    prisma.analyticsEvent.count({ where: { eventName: "page_view" } }),
    prisma.analyticsEvent.count({ where: { eventName: "signup_page_view" } }),
    prisma.analyticsEvent.count({ where: { eventName: "signup_completed" } }),
    prisma.analyticsEvent.groupBy({ by: ["eventName"], _count: { eventName: true }, orderBy: { _count: { eventName: "desc" } } }),
    prisma.analyticsEvent.groupBy({ by: ["page"], _count: { page: true }, where: { eventName: "page_view" }, orderBy: { _count: { page: "desc" } }, take: 20 }),
    prisma.$queryRaw`SELECT DATE("occurredAt") as date, COUNT(*)::int as events, COUNT(DISTINCT "anonymousId")::int as visitors FROM "AnalyticsEvent" GROUP BY 1 ORDER BY 1 DESC LIMIT 10` as Promise<{date: Date, events: number, visitors: number}[]>,
  ]);

  const conversionRate = pageViews > 0 ? ((signups / pageViews) * 100).toFixed(2) : "0";

  return (
    <main className="emb-page min-h-screen px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-5xl">
        <h1 className="font-serif text-4xl font-light tracking-[-0.03em] text-white sm:text-6xl">Analytics Dashboard</h1>
        <p className="mt-4 text-sm text-white/35">Internal analytics — restricted access</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-4">
          {[
            ["Total Events", totalEvents.toString()],
            ["Unique Visitors", anonymousVisitors.toString()],
            ["Page Views", pageViews.toString()],
            ["Signup Rate", `${conversionRate}%`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-center">
              <p className="text-3xl font-bold text-embir-rose">{value}</p>
              <p className="mt-1 text-xs text-white/45">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <h2 className="font-serif text-2xl text-white">Events by Type</h2>
            <div className="mt-4 space-y-2">
              {eventsByType.map((event) => (
                <div key={event.eventName} className="flex justify-between text-sm">
                  <span className="text-white/60">{event.eventName}</span>
                  <span className="font-mono text-embir-rose">{event._count.eventName}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <h2 className="font-serif text-2xl text-white">Daily Traffic</h2>
            <div className="mt-4 space-y-2">
              {dailyStats.map((day) => (
                <div key={day.date.toString()} className="flex justify-between text-sm">
                  <span className="text-white/60">{new Date(day.date).toLocaleDateString("en-GB")}</span>
                  <span className="font-mono text-embir-rose">{day.events} events · {day.visitors} visitors</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <h2 className="font-serif text-2xl text-white">Top Pages</h2>
          <div className="mt-4 space-y-1.5">
            {topPages.map((page) => (
              <div key={page.page || "unknown"} className="flex justify-between text-sm">
                <span className="text-white/60 truncate max-w-md">{page.page}</span>
                <span className="font-mono text-embir-rose">{page._count.page}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-embir-rose-deep/10 bg-embir-rose-deep/[0.03] p-6">
          <h2 className="font-serif text-xl text-white">Funnel</h2>
          <div className="mt-3 flex items-center gap-3 text-sm">
            <span className="text-white/60">{pageViews} views</span>
            <span className="text-white/20">→</span>
            <span className="text-white/60">{signupViews} signup page</span>
            <span className="text-white/20">→</span>
            <span className="text-embir-rose font-bold">{signups} conversions</span>
            <span className="text-white/35">({conversionRate}%)</span>
          </div>
        </div>
      </article>
    </main>
  );
}
