import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, properties, timestamp, page, language, referrer } = body;

    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor?.split(',')[0]?.trim() || 'unknown';
    const userAgent = req.headers.get('user-agent') || '';

    await prisma.analyticsEvent.create({
      data: {
        eventName: event,
        properties: properties || {},
        page,
        language: language || 'en',
        referrer: referrer || '',
        ipAddress: ip,
        userAgent: userAgent.substring(0, 500),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Analytics track error:', error);
    return NextResponse.json({ ok: false, error: 'Internal' }, { status: 500 });
  }
}
