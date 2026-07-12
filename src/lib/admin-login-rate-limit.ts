const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

interface AttemptWindow {
  count: number;
  resetsAt: number;
}

const attempts = new Map<string, AttemptWindow>();

export function consumeAdminLoginAttempt(key: string, now = Date.now()): {
  allowed: boolean;
  retryAfterSeconds: number;
} {
  for (const [entryKey, entry] of attempts) {
    if (entry.resetsAt <= now) attempts.delete(entryKey);
  }

  const current = attempts.get(key);
  if (!current || current.resetsAt <= now) {
    attempts.set(key, { count: 1, resetsAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  current.count += 1;
  if (current.count > MAX_ATTEMPTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetsAt - now) / 1000)),
    };
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

export function clearAdminLoginAttempts(key: string): void {
  attempts.delete(key);
}
