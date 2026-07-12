import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Feedback — Embir Admin',
  robots: { index: false, follow: false },
};

const statuses = ['new', 'in_progress', 'resolved', 'all'] as const;
type FeedbackStatus = (typeof statuses)[number];

async function getFeedback(status: FeedbackStatus) {
  return prisma.feedback.findMany({
    where: status !== 'all' ? { status } : {},
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true,
      type: true,
      message: true,
      userEmail: true,
      pageUrl: true,
      status: true,
      createdAt: true,
    },
  });
}

export default async function AdminFeedback({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const admin = await requireAdmin();
  if (!admin) redirect('/analytics-dashboard');

  const requestedStatus = (await searchParams).status;
  const statusFilter: FeedbackStatus = statuses.includes(requestedStatus as FeedbackStatus)
    ? (requestedStatus as FeedbackStatus)
    : 'new';
  const items = await getFeedback(statusFilter);

  const counts = await Promise.all([
    prisma.feedback.count({ where: { status: 'new' } }),
    prisma.feedback.count({ where: { status: 'in_progress' } }),
    prisma.feedback.count({ where: { status: 'resolved' } }),
  ]);

  return (
    <main className="min-h-screen bg-[#06030F] text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black">Feedback</h1>
            <p className="text-white/40 mt-1">{counts[0]} new · {counts[1]} in progress · {counts[2]} resolved</p>
          </div>
          <Link href="/admin/analytics" className="px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20">← Analytics</Link>
        </div>

        <div className="flex gap-2 mb-6">
          {['new', 'in_progress', 'resolved', 'all'].map((s) => (
            <Link
              key={s}
              href={`/admin/feedback?status=${s}`}
              className={`px-4 py-1.5 rounded-lg text-xs capitalize transition-colors ${
                statusFilter === s ? 'bg-white/20 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              {s.replace('_', ' ')}
            </Link>
          ))}
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
              <div className="flex items-start justify-between mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  item.type === 'bug' ? 'bg-red-500/20 text-red-300' :
                  item.type === 'suggestion' ? 'bg-blue-500/20 text-blue-300' :
                  item.type === 'technical' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-white/10 text-white/50'
                }`}>{item.type}</span>
                <span className="text-white/20 text-xs">{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-white/70 text-sm mb-2">{item.message}</p>
              <p className="text-white/30 text-xs">
                {item.pageUrl && <span className="mr-4 truncate inline-block max-w-[200px]">{item.pageUrl}</span>}
                {item.userEmail && <span>{item.userEmail}</span>}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
