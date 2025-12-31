import { createClient } from './supabase/server';
import { NextResponse } from 'next/server';

/**
 * Auth context for authenticated requests
 */
export type AuthContext = {
  userId: string;
  organizationId: string;
};

/**
 * Mock auth context for development mode
 * Matches the mock data in the database
 */
const MOCK_AUTH_CONTEXT: AuthContext = {
  userId: 'dev-user-001',
  organizationId: 'org-001',
};

/**
 * Check if running in development mode
 */
function isDevelopment(): boolean {
  const nodeEnv = process.env.NODE_ENV;
  return !nodeEnv || nodeEnv === 'development';
}

/**
 * Get authenticated user context
 * Returns user ID and organization ID if authenticated
 * In development mode, returns mock auth context
 * Throws error if not authenticated (production only)
 */
export async function getAuthContext(): Promise<AuthContext> {
  // In development mode, return mock auth context
  if (isDevelopment()) {
    return MOCK_AUTH_CONTEXT;
  }

  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  const { data: userData } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', user.id)
    .single();

  if (!userData?.organization_id) {
    throw new Error('User organization not found');
  }

  return {
    userId: user.id,
    organizationId: userData.organization_id,
  };
}

/**
 * Create unauthorized response
 */
export function unauthorizedResponse() {
  return NextResponse.json(
    { ok: false, error: { code: 'unauthorized', message: 'Authentication required' } },
    { status: 401 }
  );
}
