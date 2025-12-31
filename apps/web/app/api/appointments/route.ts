import { NextResponse } from 'next/server';
import { getAppointments } from '@/lib/services/appointments';
import { createApiResponse, createApiError, formatZodError } from '@/lib/api/types';
import { appointmentsResponseSchema } from '@/lib/api/schemas/appointments';
import { getAuthContext, unauthorizedResponse } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/appointments
 * Fetch appointments data for chart
 */
export async function GET() {
  try {
    await getAuthContext();
    
    const data = await getAppointments();
    
    const validated = appointmentsResponseSchema.safeParse(data);
    if (!validated.success) {
      return NextResponse.json(formatZodError(validated.error), { status: 500 });
    }

    return NextResponse.json(createApiResponse(validated.data));
  } catch (error) {
    console.error('[API /appointments] Error:', error);
    
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
        createApiError('appointments_fetch_error', error.message),
        { status: 500 }
      );
    }

    return NextResponse.json(
      createApiError('appointments_fetch_error', 'Failed to fetch appointments data'),
      { status: 500 }
    );
  }
}
