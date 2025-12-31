import { getAppointmentsData } from './repo';
import type { AppointmentsResponse } from '@/lib/api/schemas/appointments';

/**
 * Appointments Service - Business logic layer for appointments
 */
export async function getAppointments(): Promise<AppointmentsResponse> {
  try {
    return await getAppointmentsData();
  } catch (error) {
    console.error('[Appointments Service] Error fetching appointments:', error);
    
    if (error instanceof Error) {
      throw new Error(`Failed to get appointments: ${error.message}`);
    }
    throw new Error('Failed to get appointments: Unknown error');
  }
}

