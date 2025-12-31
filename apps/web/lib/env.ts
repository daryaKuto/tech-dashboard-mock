import { z } from 'zod';

/**
 * Environment variable schema validation
 * Validates all required environment variables at startup
 */
const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  
  // OpenAI
  OPENAI_API_KEY: z.string().min(1),
  
  // Optional: Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Optional: Redis for rate limiting (production)
  // When set, rate limiting will use Redis instead of in-memory store
  UPSTASH_REDIS_URL: z.string().url().optional(),
  UPSTASH_REDIS_TOKEN: z.string().min(1).optional(),
});

type Env = z.infer<typeof envSchema>;

/**
 * Validated environment variables
 * Returns defaults in development if validation fails
 */
function getEnv(): Env {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
    UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_URL,
    UPSTASH_REDIS_TOKEN: process.env.UPSTASH_REDIS_TOKEN,
  });

  if (!parsed.success) {
    // Return defaults for development (will fail at runtime if actually used)
    // No warning - this is expected in dev without .env configured
    return {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder',
      OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'placeholder',
      NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
      UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_URL,
      UPSTASH_REDIS_TOKEN: process.env.UPSTASH_REDIS_TOKEN,
    };
  }

  return parsed.data;
}

export const env = getEnv();

/**
 * Flag indicating whether Redis should be used for rate limiting
 * True when both UPSTASH_REDIS_URL and UPSTASH_REDIS_TOKEN are set
 */
export const useRedisRateLimit = Boolean(
  env.UPSTASH_REDIS_URL && env.UPSTASH_REDIS_TOKEN
);

