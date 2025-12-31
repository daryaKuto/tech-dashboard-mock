import { NextResponse } from 'next/server';
import { getEmployees } from '@/lib/services/employees';
import { createApiResponse, createApiError, formatZodError } from '@/lib/api/types';
import { employeesResponseSchema } from '@/lib/api/schemas/employees';
import { getAuthContext, unauthorizedResponse } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/employees
 * Fetch employee performance data
 * Query params: viewType (performance | overtime)
 */
export async function GET(request: Request) {
  try {
    await getAuthContext();
    
    const { searchParams } = new URL(request.url);
    const viewType = (searchParams.get('viewType') || 'performance') as 'performance' | 'overtime';
    
    const data = await getEmployees(viewType);
    
    const validated = employeesResponseSchema.safeParse(data);
    if (!validated.success) {
      return NextResponse.json(formatZodError(validated.error), { status: 500 });
    }

    return NextResponse.json(createApiResponse(validated.data));
  } catch (error) {
    console.error('[API /employees] Error:', error);
    
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
        createApiError('employees_fetch_error', error.message),
        { status: 500 }
      );
    }

    return NextResponse.json(
      createApiError('employees_fetch_error', 'Failed to fetch employees data'),
      { status: 500 }
    );
  }
}
