import { createHash } from 'node:crypto';
import type { NextRequest } from 'next/server';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_KEYS = 20_000;

interface Counter {
  count: number;
  resetsAt: number;
}

const counters = new Map<string, Counter>();

function requestKey(req: NextRequest, scope: string): string {
  const address =
    req.headers.get('x-forwarded-for')?.split(',', 1)[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';
  const digest = createHash('sha256').update(address).digest('hex');
  return `${scope}:${digest}`;
}

export function consumePublicForm(
  req: NextRequest,
  scope: string,
  maxAttempts: number,
  now = Date.now(),
): { allowed: boolean; retryAfterSeconds: number } {
  for (const [key, counter] of counters) {
    if (counter.resetsAt <= now) counters.delete(key);
  }

  const key = requestKey(req, scope);
  if (counters.size >= MAX_KEYS && !counters.has(key)) {
    const oldestKey = counters.keys().next().value as string | undefined;
    if (oldestKey) counters.delete(oldestKey);
  }

  const counter = counters.get(key);
  if (!counter) {
    counters.set(key, { count: 1, resetsAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }
  counter.count += 1;
  if (counter.count > maxAttempts) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((counter.resetsAt - now) / 1000)),
    };
  }
  return { allowed: true, retryAfterSeconds: 0 };
}
