import { getLeadsData } from './repo';
import type { LeadsResponse } from '@/lib/api/schemas/leads';

/**
 * Leads Service - Business logic layer for leads
 */
export async function getLeads(viewType: 'conversion' | 'location' = 'conversion'): Promise<LeadsResponse> {
  try {
    return await getLeadsData(viewType);
  } catch (error) {
    console.error('[Leads Service] Error fetching leads:', error);
    
    if (error instanceof Error) {
      throw new Error(`Failed to get leads: ${error.message}`);
    }
    throw new Error('Failed to get leads: Unknown error');
  }
}

