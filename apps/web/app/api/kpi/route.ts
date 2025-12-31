import { NextRequest, NextResponse } from 'next/server';
import { getKpiData } from '@/lib/services/kpi';
import { createApiResponse, createApiError, formatZodError } from '@/lib/api/types';
import { kpiResponseSchema } from '@/lib/api/schemas/kpi';
import { getAuthContext, unauthorizedResponse } from '@/lib/auth';
import { expensiveQueryRateLimiter, createRateLimitResponse } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/**
 * GET /api/kpi
 * Fetch KPI metrics
 * Rate limited: 10 requests per minute per user
 */
export async function GET(request: NextRequest) {
  try {
    const authContext = await getAuthContext();
    
    const rateLimitIdentifier = `user:${authContext.userId}:kpi`;
    const rateLimitResult = await expensiveQueryRateLimiter(rateLimitIdentifier);
    
    if (!rateLimitResult.allowed) {
      console.warn(`[Rate Limit] KPI query blocked for user: ${authContext.userId}`);
      return createRateLimitResponse(rateLimitResult);
    }
    
    const data = await getKpiData();
    
    const validated = kpiResponseSchema.safeParse(data);
    if (!validated.success) {
      console.error('[API /kpi] Validation error:', validated.error);
      return NextResponse.json(formatZodError(validated.error), { status: 500 });
    }

    return NextResponse.json(createApiResponse(validated.data));
  } catch (error) {
    console.error('[API /kpi] Error:', error);
    
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
        createApiError('kpi_fetch_error', error.message),
        { status: 500 }
      );
    }

    return NextResponse.json(
      createApiError('kpi_fetch_error', 'Failed to fetch KPI data'),
      { status: 500 }
    );
  }
}
