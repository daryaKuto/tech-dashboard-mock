import { createClient } from '@/lib/supabase/server';
import { mockAppointmentsData } from '@/lib/data/mock';
import type { AppointmentsResponse, AppointmentDataPoint } from '@/lib/api/schemas/appointments';

/**
 * Appointments Repository - Data access layer for appointments/jobs
 */
export async function getAppointmentsData(): Promise<AppointmentsResponse> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
    if (isDevelopment) {
      return mockAppointmentsData;
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
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('id, scheduled_at, revenue, created_at')
    .eq('organization_id', orgId)
    .gte('scheduled_at', thirtyDaysAgo.toISOString())
    .order('scheduled_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch appointments: ${error.message}`);
  }

  const dataMap = new Map<string, { count: number; revenue: number }>();

  jobs?.forEach((job) => {
    if (!job.scheduled_at) return;
    
    const date = new Date(job.scheduled_at);
    const dateKey = date.toISOString().split('T')[0];
    
    const existing = dataMap.get(dateKey) || { count: 0, revenue: 0 };
    dataMap.set(dateKey, {
      count: existing.count + 1,
      revenue: existing.revenue + (Number(job.revenue) || 0),
    });
  });

  const data: AppointmentDataPoint[] = Array.from(dataMap.entries())
    .map(([date, stats]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: stats.count,
      revenue: stats.revenue,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const total = jobs?.length || 0;
  
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 14);

  const { data: lastWeekJobs } = await supabase
    .from('jobs')
    .select('id')
    .eq('organization_id', orgId)
    .gte('scheduled_at', lastWeek.toISOString())
    .lt('scheduled_at', sevenDaysAgo.toISOString());

  const lastWeekTotal = lastWeekJobs?.length || 0;
  const delta = total - lastWeekTotal;
  const deltaPercentage = lastWeekTotal > 0 ? (delta / lastWeekTotal) * 100 : 0;

  return {
    total,
    delta,
    deltaPercentage,
    period: 'last 30 days',
    data: data.length > 0 ? data : mockAppointmentsData.data,
  };
}

