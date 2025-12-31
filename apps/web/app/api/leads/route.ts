import { NextRequest, NextResponse } from 'next/server';
import { getLeads } from '@/lib/services/leads';
import { createApiResponse, createApiError, formatZodError } from '@/lib/api/types';
import { leadsResponseSchema } from '@/lib/api/schemas/leads';
import { getAuthContext, unauthorizedResponse } from '@/lib/auth';
import { expensiveQueryRateLimiter, createRateLimitResponse } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/**
 * GET /api/leads
 * Fetch leads by source data
 * Query params: viewType (conversion | location)
 * Rate limited: 10 requests per minute per user
 */
export async function GET(request: NextRequest) {
  try {
    const authContext = await getAuthContext();
    
    const rateLimitIdentifier = `user:${authContext.userId}:leads`;
    const rateLimitResult = await expensiveQueryRateLimiter(rateLimitIdentifier);
    
    if (!rateLimitResult.allowed) {
      console.warn(`[Rate Limit] Leads query blocked for user: ${authContext.userId}`);
      return createRateLimitResponse(rateLimitResult);
    }
    
    const { searchParams } = new URL(request.url);
    const viewType = (searchParams.get('viewType') || 'conversion') as 'conversion' | 'location';
    
    const data = await getLeads(viewType);
    
    const validated = leadsResponseSchema.safeParse(data);
    if (!validated.success) {
      return NextResponse.json(formatZodError(validated.error), { status: 500 });
    }

    return NextResponse.json(createApiResponse(validated.data));
  } catch (error) {
    console.error('[API /leads] Error:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return unauthorizedResponse();
    }
    
    if (error instanceof Error && error.message === 'User organization not found') {
      return NextResponse.json(
        createApiError('organization_not_found', error.message),
        { status: 404 }
      );
    }
    
    if (error instanceof Error) {
      return NextResponse.json(
        createApiError('leads_fetch_error', error.message),
        { status: 500 }
      );
    }

    return NextResponse.json(
      createApiError('leads_fetch_error', 'Failed to fetch leads data'),
      { status: 500 }
    );
  }
}
