import { getActionNeededTasks } from './repo';
import type { ActionNeededResponse } from '@/lib/api/schemas/tasks';

/**
 * Tasks Service - Business logic layer for tasks
 */
export async function getActionNeeded(): Promise<ActionNeededResponse> {
  try {
    return await getActionNeededTasks();
  } catch (error) {
    console.error('[Tasks Service] Error fetching tasks:', error);
    
    if (error instanceof Error) {
      throw new Error(`Failed to get tasks: ${error.message}`);
    }
    throw new Error('Failed to get tasks: Unknown error');
  }
}

