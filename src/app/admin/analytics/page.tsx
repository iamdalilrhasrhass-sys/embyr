import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Analytics Dashboard — Embir Admin' };

async function getStats() {
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalEvents,
    last24hEvents,
    last7dEvents,
    signups24h,
    pageViews24h,
    blogReads24h,
    ctaClicks24h,
    topPages,
    languages,
    feedbackNew,
  ] = await Promise.all([
    prisma.analyticsEvent.count(),
    prisma.analyticsEvent.count({ where: { createdAt: { gte: last24h } } }),
    prisma.analyticsEvent.count({ where: { createdAt: { gte: last7d } } }),
    prisma.analyticsEvent.count({ where: { eventName: 'signup_complete', createdAt: { gte: last24h } } }),
    prisma.analyticsEvent.count({ where: { eventName: 'page_view', createdAt: { gte: last24h } } }),
    prisma.analyticsEvent.count({ where: { eventName: 'blog_article_read', createdAt: { gte: last24h } } }),
    prisma.analyticsEvent.count({ where: { eventName: 'cta_click', createdAt: { gte: last24h } } }),
    prisma.analyticsEvent.groupBy({ by: ['page'], _count: { page: true }, orderBy: { _count: { page: 'desc' } }, take: 10 }),
    prisma.analyticsEvent.groupBy({ by: ['language'], _count: { language: true }, orderBy: { _count: { language: 'desc' } }, take: 10 }),
    prisma.feedback.count({ where: { status: 'new' } }),
  ]);

  const conversionRate = pageViews24h > 0 ? ((signups24h / pageViews24h) * 100).toFixed(1) : '0';

  return {
    totalEvents, last24hEvents, last7dEvents, signups24h,
    pageViews24h, blogReads24h, ctaClicks24h, conversionRate,
    topPages, languages, feedbackNew,
  };
}

export default async function AdminAnalytics() {
  const stats = await getStats();

  return (
    <main className="min-h-screen bg-[#06030F] text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black">Analytics Dashboard</h1>
            <p className="text-white/40 mt-1">Real-time tracking for embir.xyz</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/feedback" className="px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors">
              Feedback ({stats.feedbackNew})
            </Link>
            <Link href="/" className="px-4 py-2 bg-white/5 rounded-lg text-sm hover:bg-white/20 transition-colors">
              ← Site
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Events 24h', value: stats.last24hEvents.toString() },
            { label: 'Page Views 24h', value: stats.pageViews24h.toString() },
            { label: 'Signups 24h', value: stats.signups24h.toString() },
            { label: 'Conversion Rate', value: `${stats.conversionRate}%` },
            { label: 'Blog Reads 24h', value: stats.blogReads24h.toString() },
            { label: 'CTA Clicks 24h', value: stats.ctaClicks24h.toString() },
            { label: 'Events 7d', value: stats.last7dEvents.toString() },
            { label: 'Total Events', value: stats.totalEvents.toString() },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{kpi.label}</p>
              <p className="text-2xl font-black">{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Top Pages & Languages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
            <h2 className="font-bold text-lg mb-4">Top 10 Pages</h2>
            <div className="space-y-2">
              {stats.topPages.map((p) => (
                <div key={p.page || 'unknown'} className="flex justify-between text-sm">
                  <span className="text-white/60 truncate max-w-[70%]">{p.page || '/'}</span>
                  <span className="text-white/80 font-mono">{p._count?.page ?? p._count ?? 0}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
            <h2 className="font-bold text-lg mb-4">Languages</h2>
            <div className="space-y-2">
              {stats.languages.map((l) => (
                <div key={l.language || 'unknown'} className="flex justify-between text-sm">
                  <span className="text-white/60">{l.language || 'unknown'}</span>
                  <span className="text-white/80 font-mono">{l._count?.language ?? l._count ?? 0}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
