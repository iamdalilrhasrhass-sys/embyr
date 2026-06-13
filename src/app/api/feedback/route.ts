import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { type, message, userEmail, pageUrl } = await req.json();

    if (!type || !message) {
      return NextResponse.json({ error: 'Type and message required' }, { status: 400 });
    }

    const validTypes = ['bug', 'suggestion', 'technical', 'other'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    await prisma.feedback.create({
      data: {
        type,
        message: message.substring(0, 2000),
        userEmail: userEmail?.substring(0, 255),
        pageUrl: pageUrl?.substring(0, 500),
        userAgent: req.headers.get('user-agent')?.substring(0, 500) || '',
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json({ error: 'Internal' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || 'new';
  const limit = parseInt(searchParams.get('limit') || '50');

  const feedback = await prisma.feedback.findMany({
    where: { status },
    orderBy: { createdAt: 'desc' },
    take: Math.min(limit, 100),
  });

  return NextResponse.json({ feedback, total: feedback.length });
}
