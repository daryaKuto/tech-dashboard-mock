import { createClient } from '@/lib/supabase/server';
import { mockLeadsData } from '@/lib/data/mock';
import type { LeadsResponse, LeadSource } from '@/lib/api/schemas/leads';

/**
 * Leads Repository - Data access layer for leads
 */
export async function getLeadsData(viewType: 'conversion' | 'location' = 'conversion'): Promise<LeadsResponse> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
    if (isDevelopment) {
      return { ...mockLeadsData, viewType };
    }
    throw new Error('Unauthorized');
  }

  const { data: userData } = await supabase
    .from('users')
    .select('organization_id')
    .eq('id', user.id)
    .single();

  if (!userData?.organization_id) {
    throw new Error('User organization not found');
  }

  const orgId = userData.organization_id;

  const { data: leads, error } = await supabase
    .from('leads')
    .select('source, converted')
    .eq('organization_id', orgId);

  if (error) {
    throw new Error(`Failed to fetch leads: ${error.message}`);
  }

  const sourceMap = new Map<string, number>();
  let total = 0;

  leads?.forEach((lead) => {
    const count = sourceMap.get(lead.source) || 0;
    sourceMap.set(lead.source, count + 1);
    total++;
  });

  const sources: LeadSource[] = Array.from(sourceMap.entries())
    .map(([source, count]) => ({
      source,
      percentage: total > 0 ? (count / total) * 100 : 0,
      count,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  if (sources.length === 0) {
    return { ...mockLeadsData, viewType };
  }

  return {
    sources,
    total,
    viewType,
  };
}

