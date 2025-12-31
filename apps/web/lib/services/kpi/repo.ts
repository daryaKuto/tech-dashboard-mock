import { createClient } from '@/lib/supabase/server';
import { mockKpiData } from '@/lib/data/mock';
import type { KpiResponse } from '@/lib/api/schemas/kpi';

/**
 * KPI Repository - Data access layer for KPI metrics
 */
export async function getKpiMetrics(): Promise<KpiResponse> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
    if (isDevelopment) {
      return mockKpiData;
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
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

  const { data: currentMetrics, error: currentError } = await supabase
    .from('kpi_metrics')
    .select('metric_name, value, recorded_at')
    .eq('organization_id', orgId)
    .gte('recorded_at', lastMonth.toISOString())
    .order('recorded_at', { ascending: false });

  if (currentError) {
    throw new Error(`Failed to fetch KPI metrics: ${currentError.message}`);
  }

  const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());
  const { data: previousMetrics, error: prevError } = await supabase
    .from('kpi_metrics')
    .select('metric_name, value, recorded_at')
    .eq('organization_id', orgId)
    .gte('recorded_at', twoMonthsAgo.toISOString())
    .lt('recorded_at', lastMonth.toISOString())
    .order('recorded_at', { ascending: false });

  if (prevError) {
    throw new Error(`Failed to fetch previous KPI metrics: ${prevError.message}`);
  }

  const currentMap = new Map<string, number>();
  const metricNames = ['drillbit_balance', 'roi', 'revenue', 'costs'];
  
  metricNames.forEach((name) => {
    const latest = currentMetrics
      ?.filter((m) => m.metric_name === name)
      .sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime())[0];
    if (latest) {
      currentMap.set(name, Number(latest.value));
    }
  });

  const previousMap = new Map<string, number>();
  metricNames.forEach((name) => {
    const latest = previousMetrics
      ?.filter((m) => m.metric_name === name)
      .sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime())[0];
    if (latest) {
      previousMap.set(name, Number(latest.value));
    }
  });

  const drillbitBalance = currentMap.get('drillbit_balance') ?? mockKpiData.drillbitBalance.value;
  const drillbitBalancePrev = previousMap.get('drillbit_balance') ?? (drillbitBalance - mockKpiData.drillbitBalance.delta);
  const drillbitDelta = drillbitBalance - drillbitBalancePrev;
  const drillbitDeltaPct = drillbitBalancePrev > 0 
    ? (drillbitDelta / drillbitBalancePrev) * 100 
    : 0;

  const roi = currentMap.get('roi') ?? mockKpiData.roi.value;
  const roiPrev = previousMap.get('roi') ?? (roi - mockKpiData.roi.delta);
  const roiDelta = roi - roiPrev;
  const roiDeltaPct = roiPrev > 0 ? (roiDelta / roiPrev) * 100 : 0;

  const revenue = currentMap.get('revenue') ?? mockKpiData.revenue.value;
  const revenuePrev = previousMap.get('revenue') ?? (revenue - mockKpiData.revenue.delta);
  const revenueDelta = revenue - revenuePrev;
  const revenueDeltaPct = revenuePrev > 0 ? (revenueDelta / revenuePrev) * 100 : 0;

  const costs = currentMap.get('costs') ?? mockKpiData.costs.value;
  const costsPrev = previousMap.get('costs') ?? (costs + mockKpiData.costs.delta);
  const costsDelta = costsPrev - costs;
  const costsDeltaPct = costsPrev > 0 ? (costsDelta / costsPrev) * 100 : 0;

  return {
    drillbitBalance: {
      value: drillbitBalance,
      delta: drillbitDelta,
      deltaPercentage: drillbitDeltaPct,
      isPositive: drillbitDelta >= 0,
    },
    roi: {
      value: roi,
      delta: roiDelta,
      deltaPercentage: roiDeltaPct,
      isPositive: roiDelta >= 0,
    },
    revenue: {
      value: revenue,
      delta: revenueDelta,
      deltaPercentage: revenueDeltaPct,
      isPositive: revenueDelta >= 0,
    },
    costs: {
      value: costs,
      delta: costsDelta,
      deltaPercentage: costsDeltaPct,
      isPositive: costsDelta >= 0,
    },
  };
}

