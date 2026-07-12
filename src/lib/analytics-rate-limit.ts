const WINDOW_MS = 60_000;
const MAX_EVENTS = 120;
const MAX_KEYS = 20_000;

interface Counter {
  count: number;
  resetsAt: number;
}

const counters = new Map<string, Counter>();

export function consumeAnalyticsEvent(key: string, now = Date.now()): {
  allowed: boolean;
  retryAfterSeconds: number;
} {
  for (const [entryKey, counter] of counters) {
    if (counter.resetsAt <= now) counters.delete(entryKey);
  }
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
  if (counter.count > MAX_EVENTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((counter.resetsAt - now) / 1000)),
    };
  }
  return { allowed: true, retryAfterSeconds: 0 };
}
