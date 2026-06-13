import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email-local';
import { welcomeEmail, profileReminderEmail, weeklyDigestEmail } from '@/emails/templates';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { type, userId, data } = await req.json();
    
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.email) {
      return NextResponse.json({ error: 'User not found or no email' }, { status: 404 });
    }

    let subject: string;
    let html: string;

    switch (type) {
      case 'welcome':
        subject = 'Welcome to Embir!';
        html = welcomeEmail((user as any).name || 'there');
        break;
      case 'profile-reminder':
        subject = `Your profile is ${data?.completionPercent || 50}% complete`;
        html = profileReminderEmail((user as any).name || 'there', data?.completionPercent || 50);
        break;
      case 'weekly-digest':
        subject = 'Your Weekly Embir Digest';
        html = weeklyDigestEmail((user as any).name || 'there', data?.newMatches || 0, data?.topArticles || []);
        break;
      default:
        return NextResponse.json({ error: 'Invalid email type' }, { status: 400 });
    }

    const result = await sendEmail(user.email, subject, html);

    if (result.success) {
      await prisma.emailLog.create({
        data: { userId, type, subject, status: 'sent' },
      }).catch(() => {});
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Email send error:', error);
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
