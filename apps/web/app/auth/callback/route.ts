import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

/**
 * Auth callback route for email confirmation
 * Handles the redirect after email confirmation
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Redirect to dashboard after successful email confirmation
      return redirect(next);
    }
  }

  // If there's an error or no code, redirect to login
  return redirect('/login?error=invalid_token');
}

