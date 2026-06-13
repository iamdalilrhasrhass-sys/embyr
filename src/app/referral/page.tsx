import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Invite Friends — Embir' };

export default async function ReferralPage() {
  const referralCode = 'EMBIR-XXXXXX'; // Default until session is wired

  return (
    <main className="min-h-screen bg-[#06030F] text-white p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-black mb-2">Invite Friends, Get Rewards</h1>
        <p className="text-white/40 mb-8">Share your link and earn premium access for each friend who joins.</p>

        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 mb-8">
          <p className="text-white/40 text-xs mb-3">YOUR REFERRAL LINK</p>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={`https://embir.xyz/signup?ref=${referralCode}`}
              className="flex-1 bg-white/[0.05] border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm text-white/60 font-mono focus:outline-none"
            />
            <button className="px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition-colors">
              Copy
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { label: 'Friends invited', value: '0', icon: '👥' },
            { label: 'Premium months earned', value: '0', icon: '⭐' },
            { label: 'Days of premium', value: '0', icon: '📅' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
              <p className="text-2xl mb-1">{stat.icon}</p>
              <p className="text-2xl font-black">{stat.value}</p>
              <p className="text-white/30 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
