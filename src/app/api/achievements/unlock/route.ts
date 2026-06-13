import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const ACHIEVEMENTS: Record<string, { name: string; description: string; icon: string }> = {
  profile_complete: { name: 'Newcomer', description: 'Complete your profile', icon: '🌟' },
  first_message: { name: 'Ice Breaker', description: 'Send your first message', icon: '💬' },
  verified: { name: 'Trusted Member', description: 'Verify your identity', icon: '✅' },
  popular: { name: 'Popular', description: 'Get 50 profile views', icon: '🎯' },
  connector: { name: 'Connector', description: 'Refer 5 friends', icon: '🤝' },
  photographer: { name: 'Photographer', description: 'Upload 5 photos', icon: '📸' },
  active: { name: 'Active', description: 'Login 7 days in a row', icon: '🔥' },
};

export async function POST(req: NextRequest) {
  try {
    const { userId, type } = await req.json();

    const achievement = ACHIEVEMENTS[type];
    if (!achievement) {
      return NextResponse.json({ error: 'Invalid achievement' }, { status: 400 });
    }

    const existing = await prisma.achievement.findFirst({ where: { userId, type } });
    if (existing) {
      return NextResponse.json({ message: 'Already unlocked', achievement: existing });
    }

    const created = await prisma.achievement.create({
      data: { userId, type, ...achievement },
    });

    return NextResponse.json({ success: true, achievement: created });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
