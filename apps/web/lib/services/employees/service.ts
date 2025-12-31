import { getEmployeesData } from './repo';
import type { EmployeesResponse } from '@/lib/api/schemas/employees';

/**
 * Employees Service - Business logic layer for employee performance
 */
export async function getEmployees(viewType: 'performance' | 'overtime' = 'performance'): Promise<EmployeesResponse> {
  try {
    return await getEmployeesData(viewType);
  } catch (error) {
    console.error('[Employees Service] Error fetching employees:', error);
    
    if (error instanceof Error) {
      throw new Error(`Failed to get employees: ${error.message}`);
    }
    throw new Error('Failed to get employees: Unknown error');
  }
}

