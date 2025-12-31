import { getKpiMetrics } from './repo';
import type { KpiResponse } from '@/lib/api/schemas/kpi';

/**
 * KPI Service - Business logic layer for KPI metrics
 */
export async function getKpiData(): Promise<KpiResponse> {
  try {
    return await getKpiMetrics();
  } catch (error) {
    console.error('[KPI Service] Error fetching KPI data:', error);
    
    if (error instanceof Error) {
      throw new Error(`Failed to get KPI data: ${error.message}`);
    }
    throw new Error('Failed to get KPI data: Unknown error');
  }
}

