import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { consumePublicForm } from '@/lib/public-form-rate-limit';

function sanitizedPageUrl(value: unknown): string | undefined {
  if (typeof value !== 'string' || value.length > 500) return undefined;
  try {
    const url = new URL(value, 'https://embir.xyz');
    if (!['http:', 'https:'].includes(url.protocol)) return undefined;
    return `${url.origin}${url.pathname}`.slice(0, 300);
  } catch {
    return undefined;
  }
}

export async function POST(req: NextRequest) {
  try {
    const rateLimit = consumePublicForm(req, 'feedback', 10);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } },
      );
    }

    const body: unknown = await req.json();
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    const { type, message, userEmail, pageUrl } = body as Record<string, unknown>;

    if (typeof type !== 'string' || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Type and message required' }, { status: 400 });
    }

    const validTypes = ['bug', 'suggestion', 'technical', 'other'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
    const normalizedEmail = typeof userEmail === 'string' ? userEmail.trim().toLowerCase() : undefined;
    if (normalizedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    await prisma.feedback.create({
      data: {
        type,
        message: message.trim().substring(0, 2000),
        userEmail: normalizedEmail?.substring(0, 255),
        pageUrl: sanitizedPageUrl(pageUrl),
        userAgent: null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json({ error: 'Internal' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Accès administrateur requis' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const requestedStatus = searchParams.get('status') || 'new';
  const status = ['new', 'in_progress', 'resolved', 'dismissed'].includes(requestedStatus)
    ? requestedStatus
    : 'new';
  const requestedLimit = Number(searchParams.get('limit') || 50);
  const limit = Number.isInteger(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 100) : 50;

  const feedback = await prisma.feedback.findMany({
    where: { status },
    orderBy: { createdAt: 'desc' },
    take: limit,
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

  return NextResponse.json(
    { feedback, total: feedback.length },
    { headers: { 'Cache-Control': 'private, no-store' } },
  );
}
