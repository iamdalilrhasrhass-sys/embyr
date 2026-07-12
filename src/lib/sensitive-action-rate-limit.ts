interface Counter {
  count: number;
  resetsAt: number;
}
const MAX_KEYS = 20_000;
const counters = new Map<string, Counter>();

function cleanup(now: number) {
  for (const [key, counter] of counters) {
    if (counter.resetsAt <= now) counters.delete(key);
  }
}

export function consumeSensitiveAction(
  scope: string,
  identity: string,
  maxAttempts: number,
  windowMs = 15 * 60 * 1000,
  now = Date.now(),
): { allowed: boolean; retryAfterSeconds: number } {
  cleanup(now);
  const key = `${scope}:${identity}`;
  if (counters.size >= MAX_KEYS && !counters.has(key)) {
    const oldestKey = counters.keys().next().value as string | undefined;
    if (oldestKey) counters.delete(oldestKey);
  }

  const counter = counters.get(key);
  if (!counter) {
    counters.set(key, { count: 1, resetsAt: now + windowMs });
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

export function clearSensitiveActions(scope: string, identity: string) {
  counters.delete(`${scope}:${identity}`);
}
