export const dynamic = 'force-dynamic';
export const metadata = { title: 'Achievements' };

const ALL_ACHIEVEMENTS = [
  { type: 'profile_complete', name: 'Newcomer', description: 'Complete your profile', icon: '🌟' },
  { type: 'first_message', name: 'Ice Breaker', description: 'Send your first message', icon: '💬' },
  { type: 'verified', name: 'Trusted Member', description: 'Verify your identity', icon: '✅' },
  { type: 'popular', name: 'Popular', description: 'Get 50 profile views', icon: '🎯' },
  { type: 'connector', name: 'Connector', description: 'Refer 5 friends', icon: '🤝' },
  { type: 'photographer', name: 'Photographer', description: 'Upload 5 photos', icon: '📸' },
  { type: 'active', name: 'Active', description: 'Login 7 days in a row', icon: '🔥' },
];

export default function AchievementsPage() {
  return (
    <main className="min-h-screen bg-[#06030F] text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black mb-2">Achievements</h1>
        <p className="text-white/40 mb-8">Unlock badges as you use Embir</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ALL_ACHIEVEMENTS.map((a) => (
            <div key={a.type} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 flex items-center gap-4 opacity-40">
              <span className="text-4xl">{a.icon}</span>
              <div>
                <p className="font-bold">{a.name}</p>
                <p className="text-white/30 text-sm">{a.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
