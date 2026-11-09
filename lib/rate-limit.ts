const MAX_REQUESTS_PER_DAY = 5;
const MAX_TRACKED_IPS = 1_000;
const DAY_MS = 24 * 60 * 60 * 1000;
// WIB (UTC+7). Makes "besok" mean the next midnight in Jakarta time.
const TIMEZONE_OFFSET_MS = 7 * 60 * 60 * 1000;

type Bucket = { count: number; resetAt: number };

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
};

const buckets = new Map<string, Bucket>();

function nextResetAt(now: number): number {
  return Math.floor((now + TIMEZONE_OFFSET_MS) / DAY_MS + 1) * DAY_MS - TIMEZONE_OFFSET_MS;
}

function prune(now: number): void {
  for (const [ip, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(ip);
  }
}

/**
 * Demo-only limiter. State lives in the server process memory, so it resets
 * when the process restarts and is not shared between serverless instances.
 */
export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();

  if (buckets.size >= MAX_TRACKED_IPS) prune(now);

  const bucket = buckets.get(ip);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(ip, { count: 1, resetAt: nextResetAt(now) });
    return {
      allowed: true,
      limit: MAX_REQUESTS_PER_DAY,
      remaining: MAX_REQUESTS_PER_DAY - 1,
      retryAfterSeconds: 0,
    };
  }

  if (bucket.count >= MAX_REQUESTS_PER_DAY) {
    return {
      allowed: false,
      limit: MAX_REQUESTS_PER_DAY,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return {
    allowed: true,
    limit: MAX_REQUESTS_PER_DAY,
    remaining: MAX_REQUESTS_PER_DAY - bucket.count,
    retryAfterSeconds: 0,
  };
}
