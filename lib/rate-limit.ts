const WINDOW_MS = 60_000;
const MAX_REQUESTS = 3;
const MAX_TRACKED_IPS = 1_000;

type Bucket = { count: number; resetAt: number };

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
};

const buckets = new Map<string, Bucket>();

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
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return {
      allowed: true,
      limit: MAX_REQUESTS,
      remaining: MAX_REQUESTS - 1,
      retryAfterSeconds: 0,
    };
  }

  if (bucket.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      limit: MAX_REQUESTS,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return {
    allowed: true,
    limit: MAX_REQUESTS,
    remaining: MAX_REQUESTS - bucket.count,
    retryAfterSeconds: 0,
  };
}
