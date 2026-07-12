import { createHash, randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { parseAnalyticsEnvelope } from '@/lib/analytics-events';
import { consumeAnalyticsEvent } from '@/lib/analytics-rate-limit';
import { prisma } from '@/lib/prisma';

const MAX_BODY_BYTES = 16_384;

function boundedHeader(value: string | null, maxLength: number): string | undefined {
  if (!value) return undefined;
  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    // Keep the original value if an upstream header is not URI encoded.
  }
  const cleaned = decoded.replace(/[\u0000-\u001f\u007f]/g, '').trim();
  return cleaned && cleaned.length <= maxLength ? cleaned : undefined;
}

function coarseDeviceCategory(userAgent: string | null): 'bot' | 'mobile' | 'tablet' | 'desktop' | 'unknown' {
  if (!userAgent) return 'unknown';
  if (/bot|crawler|spider|slurp|headless/i.test(userAgent)) return 'bot';
  if (/ipad|tablet|kindle/i.test(userAgent)) return 'tablet';
  if (/mobile|iphone|ipod|android/i.test(userAgent)) return 'mobile';
  return 'desktop';
}

function isUniqueConstraintError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002';
}

function privacySafeRateLimitKey(req: NextRequest): string {
  const networkAddress =
    req.headers.get('x-forwarded-for')?.split(',', 1)[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';
  return createHash('sha256').update(networkAddress).digest('hex');
}

export async function POST(req: NextRequest) {
  try {
    const rateLimit = consumeAnalyticsEvent(privacySafeRateLimitKey(req));
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { ok: false, error: 'rate_limited' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } },
      );
    }

    const rawBody = await req.text();
    if (Buffer.byteLength(rawBody, 'utf8') > MAX_BODY_BYTES) {
      return NextResponse.json({ ok: false, error: 'payload_too_large' }, { status: 413 });
    }

    let body: unknown;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
    }

    const parsed = parseAnalyticsEnvelope(body);
    if (!parsed.ok) {
      return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
    }

    const eventId = parsed.value.eventId ?? randomUUID();
    const authenticatedUser = await getCurrentUser().catch(() => null);
    const country = boundedHeader(
      req.headers.get('x-vercel-ip-country') ?? req.headers.get('cf-ipcountry'),
      80,
    );
    const city = boundedHeader(req.headers.get('x-vercel-ip-city'), 100);

    try {
      await prisma.analyticsEvent.create({
        data: {
          eventId,
          eventName: parsed.value.event,
          eventVersion: parsed.value.eventVersion,
          occurredAt: parsed.value.occurredAt,
          properties: parsed.value.properties,
          userId: authenticatedUser?.id,
          page: parsed.value.page,
          language: parsed.value.language ?? 'en',
          sessionId: parsed.value.sessionId,
          anonymousId: parsed.value.anonymousId,
          country,
          city,
          deviceCategory: coarseDeviceCategory(req.headers.get('user-agent')),
          source: parsed.value.source,
          medium: parsed.value.medium,
          campaign: parsed.value.campaign,
          referrer: parsed.value.referrer,
          // Legacy columns stay intentionally empty: raw network identifiers are not analytics data.
          ipAddress: null,
          userAgent: null,
        },
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        return NextResponse.json(
          { ok: true, duplicate: true, eventId },
          { headers: { 'Cache-Control': 'no-store' } },
        );
      }
      throw error;
    }

    return NextResponse.json(
      { ok: true, eventId },
      { status: 201, headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    const code =
      typeof error === 'object' && error !== null && 'code' in error
        ? String(error.code)
        : 'unknown';
    console.warn(`Analytics event dropped (${code})`);
    return NextResponse.json(
      { ok: false, dropped: true },
      { status: 202, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
