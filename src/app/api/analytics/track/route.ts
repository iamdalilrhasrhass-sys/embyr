import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, properties, page, language, referrer } = body;

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
    const code =
      typeof error === 'object' && error !== null && 'code' in error
        ? String(error.code)
        : 'unknown';
    console.warn(`Analytics event dropped (${code})`);
    return NextResponse.json(
      { ok: false, dropped: true },
      { status: 202 },
    );
  }
}
