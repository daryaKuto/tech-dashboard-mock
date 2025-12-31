import { createBrowserClient } from '@supabase/ssr';
import { env } from '../env';

/**
 * Browser Supabase client
 * Safe to use in client components - uses anon key
 * RLS policies enforce security
 */
export function createClient() {
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

