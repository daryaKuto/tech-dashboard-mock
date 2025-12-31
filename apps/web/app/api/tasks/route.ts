import { NextResponse } from 'next/server';
import { getActionNeeded } from '@/lib/services/tasks';
import { createApiResponse, createApiError, formatZodError } from '@/lib/api/types';
import { actionNeededResponseSchema, type ActionNeededResponse } from '@/lib/api/schemas/tasks';
import { getAuthContext, unauthorizedResponse } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/tasks
 * Fetch action needed tasks
 */
export async function GET() {
  try {
    const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
    
    if (!isDevelopment) {
      await getAuthContext();
    }
    
    const data = await getActionNeeded();
    
    const validated = actionNeededResponseSchema.safeParse(data);
    if (!validated.success) {
      console.error('[API /tasks] Validation error:', validated.error);
      if (isDevelopment && data && typeof data === 'object' && 'tasks' in data) {
        return NextResponse.json(createApiResponse(data as ActionNeededResponse));
      }
      return NextResponse.json(formatZodError(validated.error), { status: 500 });
    }

    return NextResponse.json(createApiResponse(validated.data));
  } catch (error) {
    console.error('[API /tasks] Error:', error);
    
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
        createApiError('tasks_fetch_error', error.message),
        { status: 500 }
      );
    }

    return NextResponse.json(
      createApiError('tasks_fetch_error', 'Failed to fetch tasks data'),
      { status: 500 }
    );
  }
}
