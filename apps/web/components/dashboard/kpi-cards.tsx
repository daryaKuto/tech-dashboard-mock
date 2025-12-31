import { cn } from '@/lib/utils';
import type { KpiResponse } from '@/lib/api/schemas/kpi';
import { getKpiData } from '@/lib/services/kpi';
import { mockKpiData } from '@/lib/data/mock';

type MetricItemProps = {
  label: string;
  value: string;
  delta?: {
    value: number;
    percentage: number;
    isPositive: boolean;
    isCosts?: boolean;
  };
};

function TriangleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 8 8"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 0L8 8H0L4 0Z" />
    </svg>
  );
}

function MetricItem({ label, value, delta }: MetricItemProps) {
  const formatDelta = () => {
    if (!delta) return null;
    
    const isCosts = delta.isCosts ?? false;
    const isDecrease = isCosts && delta.value < 0;
    const absValue = Math.abs(delta.value);
    let deltaText = '';
    
    if (label === 'ROI') {
      deltaText = `${delta.isPositive ? '+' : ''}${delta.percentage.toFixed(0)}%`;
    } else if (label === 'Drillbit Balance') {
      deltaText = `$${absValue.toLocaleString()}`;
    } else if (label === 'Revenue') {
      deltaText = `$${absValue.toLocaleString()} (${delta.isPositive ? '+' : ''}${delta.percentage.toFixed(1)}%)`;
    } else if (label === 'Costs') {
      deltaText = `-$${absValue.toLocaleString()} (${delta.percentage.toFixed(1)}%)`;
    }
    
    return (
      <span className="ml-2 inline-flex items-baseline text-[13px] font-medium leading-none text-[#16A34A]">
        <TriangleIcon
          className={cn(
            'mr-0.5 h-2.5 w-2.5',
            isDecrease ? 'rotate-180' : ''
          )}
        />
        {deltaText}
      </span>
    );
  };

  return (
    <div className="flex min-w-[200px] flex-col items-start">
      <div className="relative mb-1.5">
        <span className="text-[13px] font-medium leading-none tracking-[0.02em] text-[#6B7280]">
          {label}
        </span>
        <div className="absolute bottom-[-2px] left-0 right-0 h-px border-b border-dotted border-[#D1D5DB]" />
      </div>
      
      <div className="flex items-baseline">
        <span className="text-[28px] font-bold leading-8 tracking-[-0.01em] text-[#111827]">
          {value}
        </span>
        {formatDelta()}
      </div>
    </div>
  );
}

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  return `$${value.toLocaleString()}`;
}

function transformKpiToProps(data: KpiResponse) {
  return [
    {
      label: 'Drillbit Balance',
      value: formatCurrency(data.drillbitBalance.value),
      delta: {
        value: data.drillbitBalance.delta,
        percentage: data.drillbitBalance.deltaPercentage,
        isPositive: data.drillbitBalance.isPositive,
        isCosts: false,
      },
    },
    {
      label: 'ROI',
      value: `${data.roi.value}%`,
      delta: {
        value: data.roi.delta,
        percentage: data.roi.deltaPercentage,
        isPositive: data.roi.isPositive,
        isCosts: false,
      },
    },
    {
      label: 'Revenue',
      value: formatCurrency(data.revenue.value),
      delta: {
        value: data.revenue.delta,
        percentage: data.revenue.deltaPercentage,
        isPositive: data.revenue.isPositive,
        isCosts: false,
      },
    },
    {
      label: 'Costs',
      value: formatCurrency(data.costs.value),
      delta: {
        value: data.costs.delta,
        percentage: data.costs.deltaPercentage,
        isPositive: data.costs.isPositive,
        isCosts: true,
      },
    },
  ];
}

export async function KpiCards() {
  let kpis;
  
  try {
    const data = await getKpiData();
    kpis = transformKpiToProps(data);
  } catch {
    kpis = transformKpiToProps(mockKpiData);
  }

  return (
    <div className="flex w-full items-start justify-between gap-8 border-b border-[#E5E7EB] bg-white px-6 py-4">
      {kpis.map((kpi) => (
        <MetricItem key={kpi.label} {...kpi} />
      ))}
    </div>
  );
}
