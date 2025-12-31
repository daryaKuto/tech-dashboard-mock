import { createClient } from '@/lib/supabase/server';
import { mockLeadsData } from '@/lib/data/mock';
import type { LeadsResponse, LeadSource } from '@/lib/api/schemas/leads';

// Development organization ID - matches the mock data SQL
const DEV_ORG_ID = 'a0000000-0000-0000-0000-000000000001';

/**
 * Leads Repository - Data access layer for leads
 * Aggregates lead counts by source from the database
 */
export async function getLeadsData(viewType: 'conversion' | 'location' = 'conversion'): Promise<LeadsResponse> {
  const supabase = await createClient();
  const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
  
  // Determine organization ID
  let orgId: string | null = null;
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    // Authenticated user - get their organization
    const { data: userData } = await supabase
      .from('users')
      .select('organization_id')
      .eq('id', user.id)
      .single();

    if (userData?.organization_id) {
      orgId = userData.organization_id;
    }
  }
  
  // In development, use dev org ID if no user org found
  if (!orgId && isDevelopment) {
    orgId = DEV_ORG_ID;
  }
  
  if (!orgId) {
    throw new Error('Unauthorized');
  }

  // Query leads from database and aggregate by source
  const { data: leads, error } = await supabase
    .from('leads')
    .select('source')
    .eq('organization_id', orgId);

  if (error) {
    console.error('[Leads Repo] Database error:', error.message);
    // Fall back to mock data if database query fails
    if (isDevelopment) {
      return { ...mockLeadsData, viewType };
    }
    throw new Error(`Failed to fetch leads: ${error.message}`);
  }

  // Aggregate leads by source
  const sourceMap = new Map<string, number>();
  let total = 0;

  leads?.forEach((lead) => {
    const count = sourceMap.get(lead.source) || 0;
    sourceMap.set(lead.source, count + 1);
    total++;
  });

  // Convert to sorted array with percentages
  const sources: LeadSource[] = Array.from(sourceMap.entries())
    .map(([source, count]) => ({
      source,
      percentage: total > 0 ? Math.round((count / total) * 1000) / 10 : 0, // Round to 1 decimal
      count,
    }))
    .sort((a, b) => b.count - a.count);

  // Fall back to mock data if no leads in database
  if (sources.length === 0) {
    if (isDevelopment) {
      return { ...mockLeadsData, viewType };
    }
    return { sources: [], total: 0, viewType };
  }

  return {
    sources,
    total,
    viewType,
  };
}
