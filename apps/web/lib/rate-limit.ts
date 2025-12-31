import { NextResponse, type NextRequest } from 'next/server';

/**
 * Rate limit result returned by the limiter
 */
export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  limit: number;
};

/**
 * Rate limit configuration
 */
export type RateLimitConfig = {
  windowMs: number;
  maxRequests: number;
};

/**
 * Abstract interface for rate limit storage
 * Supports both in-memory and Redis implementations
 */
export interface RateLimitStore {
  increment(key: string, windowMs: number): Promise<{ count: number; resetAt: number }>;
  get(key: string): Promise<{ count: number; resetAt: number } | null>;
}

/**
 * In-memory rate limit store (default)
 * Suitable for development and single-instance deployments
 * Resets on server restart
 */
class InMemoryRateLimitStore implements RateLimitStore {
  private store = new Map<string, { count: number; resetAt: number }>();

  async increment(key: string, windowMs: number): Promise<{ count: number; resetAt: number }> {
    const now = Date.now();
    const record = this.store.get(key);

    // Clean up expired entries periodically
    if (this.store.size > 10000) {
      this.cleanup();
    }

    if (!record || now > record.resetAt) {
      // New window
      const resetAt = now + windowMs;
      this.store.set(key, { count: 1, resetAt });
      return { count: 1, resetAt };
    }

    // Increment existing window
    record.count++;
    return { count: record.count, resetAt: record.resetAt };
  }

  async get(key: string): Promise<{ count: number; resetAt: number } | null> {
    const record = this.store.get(key);
    if (!record || Date.now() > record.resetAt) {
      return null;
    }
    return record;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.store.entries()) {
      if (now > record.resetAt) {
        this.store.delete(key);
      }
    }
  }
}

// Global store instance
const store: RateLimitStore = new InMemoryRateLimitStore();

/**
 * Get identifier for rate limiting
 * Uses user ID if available, otherwise falls back to IP address
 */
export function getIdentifier(request: NextRequest, userId?: string): string {
  if (userId) {
    return `user:${userId}`;
  }

  // Extract IP from various headers (handle proxies)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwardedFor?.split(',')[0]?.trim() || realIp || request.ip || 'unknown';
  
  return `ip:${ip}`;
}

/**
 * Create a rate limiter with the given configuration
 */
export function createRateLimiter(config: RateLimitConfig) {
  return async (identifier: string): Promise<RateLimitResult> => {
    const { count, resetAt } = await store.increment(identifier, config.windowMs);
    const allowed = count <= config.maxRequests;
    const remaining = Math.max(0, config.maxRequests - count);

    return {
      allowed,
      remaining,
      resetAt,
      limit: config.maxRequests,
    };
  };
}

// Pre-configured rate limiters

/**
 * General API rate limiter
 * 60 requests per minute per user/IP
 */
export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60,
});

/**
 * Auth endpoints rate limiter (stricter)
 * 5 requests per 15 minutes per IP
 * Helps prevent brute force and credential stuffing
 */
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
});

/**
 * Expensive query rate limiter
 * 10 requests per minute per user
 * For database-heavy operations like KPI, analytics
 */
export const expensiveQueryRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10,
});

/**
 * Create a standardized rate limit exceeded response
 */
export function createRateLimitResponse(result: RateLimitResult): NextResponse {
  const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);
  
  return NextResponse.json(
    {
      ok: false,
      error: {
        code: 'rate_limit_exceeded',
        message: 'Too many requests. Please try again later.',
        details: {
          retryAfter,
          resetAt: result.resetAt,
        },
      },
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfter),
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(result.resetAt),
      },
    }
  );
}

/**
 * Add rate limit headers to a successful response
 */
export function addRateLimitHeaders(
  response: NextResponse,
  result: RateLimitResult
): NextResponse {
  response.headers.set('X-RateLimit-Limit', String(result.limit));
  response.headers.set('X-RateLimit-Remaining', String(result.remaining));
  response.headers.set('X-RateLimit-Reset', String(result.resetAt));
  return response;
}

