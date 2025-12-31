import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { env } from '../env';

/**
 * Service role Supabase client
 * SERVER-ONLY - Never import in client components
 * Bypasses RLS - use only for admin operations, webhooks, background jobs
 */
export function createClient() {
  return createSupabaseClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

