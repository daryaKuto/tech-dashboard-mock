'use client';

import { useState } from 'react';
import { Info, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  ComposedChart,
  Bar,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { cn } from '@/lib/utils';

const businessValueData = [
  { month: 'Jan', value: 200000 },
  { month: 'Feb', value: 380000 },
  { month: 'Mar', value: 320000 },
  { month: 'Apr', value: 520000 },
  { month: 'May', value: 480000 },
  { month: 'Jun', value: 680000 },
  { month: 'Jul', value: 750000 },
  { month: 'Aug', value: 720000 },
  { month: 'Sep', value: 850000 },
  { month: 'Oct', value: 920000 },
  { month: 'Nov', value: 890000 },
  { month: 'Dec', value: 953800 },
];

export function InsightColumn() {
  const [timeRange, setTimeRange] = useState<'all' | 'avg' | '30days'>('all');

  return (
    <div className="w-[320px] min-h-screen space-y-6">
      {/* Time Range Filter */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setTimeRange('all')}
          className={cn(
            'h-8 rounded-full border px-3 text-[13px] font-medium transition-colors',
            timeRange === 'all'
              ? 'border-[#E5E7EB] bg-[#F3F4F6] text-[#111827]'
              : 'border-[#E5E7EB] bg-white text-[#6B7280]'
          )}
        >
          All time
        </button>
        <button
          onClick={() => setTimeRange('avg')}
          className={cn(
            'h-8 rounded-full border px-3 text-[13px] font-medium transition-colors',
            timeRange === 'avg'
              ? 'border-[#E5E7EB] bg-[#F3F4F6] text-[#111827]'
              : 'border-[#E5E7EB] bg-white text-[#6B7280]'
          )}
        >
          Avg. per month
        </button>
        <button
          onClick={() => setTimeRange('30days')}
          className={cn(
            'h-8 rounded-full border px-3 text-[13px] font-medium transition-colors',
            timeRange === '30days'
              ? 'border-[#E5E7EB] bg-[#F3F4F6] text-[#111827]'
              : 'border-[#E5E7EB] bg-white text-[#6B7280]'
          )}
        >
          Last 30 days
        </button>
      </div>

      {/* Drillbit Business Value Card */}
      <div 
        className="relative flex flex-col overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white p-4"
        style={{ 
          height: '170px',
        }}
      >
        {/* Subtle accent outline - gradient-like edge highlight */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-[12px]"
          style={{
            borderTop: '1px solid rgba(251, 146, 60, 0.3)',
            borderLeft: '1px solid rgba(251, 146, 60, 0.3)',
            borderRight: '1px solid rgba(139, 92, 246, 0.3)',
            borderBottom: '1px solid rgba(139, 92, 246, 0.3)',
          }}
        />
        {/* Background Pattern - Diagonal dotted lines */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, #E5E7EB 8px, #E5E7EB 9px)',
            backgroundSize: '16px 16px',
            opacity: 0.25,
          }}
        />
        
        <div className="relative z-10 flex flex-1 flex-col">
          {/* Card Header */}
          <div className="flex items-center">
            <h4 className="text-sm font-semibold text-[#111827]" style={{ fontSize: '14px', fontWeight: 600 }}>
              Drillbit Business Value
            </h4>
            <div 
              className="ml-1.5 flex items-center justify-center rounded-full border"
              style={{ 
                width: '16px', 
                height: '16px',
                borderColor: '#D1D5DB',
                backgroundColor: 'transparent',
              }}
            >
              <Info className="h-3 w-3 text-[#6B7280]" />
            </div>
          </div>

          {/* Primary Metric Row */}
          <div className="mt-2 flex items-baseline gap-2">
            <span 
              className="font-bold text-[#111827]"
              style={{ 
                fontSize: '28px', 
                fontWeight: 700,
                letterSpacing: '-0.01em',
              }}
            >
              $953,800
            </span>
            <span 
              className="font-medium text-[#16A34A]"
              style={{ fontSize: '13px', fontWeight: 500 }}
            >
              ▲ $84,402 this month
            </span>
          </div>

          {/* Chart Area - Takes ~45% of card height, anchored to bottom */}
          <div className="mt-auto" style={{ height: '45%', minHeight: '70px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart 
                data={businessValueData} 
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              >
                <XAxis dataKey="month" hide />
                <YAxis hide />
                <Bar
                  dataKey="value"
                  fill="#DCFCE7"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#16A34A"
                  strokeWidth={2}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Revenue Performance Card */}
      <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-4">
        <h4 className="mb-3 text-sm font-semibold text-[#111827]">Revenue Performance</h4>
        
        {/* Highlight Message */}
        <div className="mb-4 flex items-start gap-3">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-[#A855F7] text-xs text-white">M</AvatarFallback>
          </Avatar>
          <p className="text-sm leading-5 text-[#6B7280]">
            <span className="font-semibold text-[#16A34A]">Mason generated 12× more revenue</span> than your average team member
          </p>
        </div>

        {/* Metrics List */}
        <div className="mb-3 space-y-2 border-t border-[#E5E7EB] pt-3">
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#6B7280]">Total Mason (AI) Revenue</span>
            <span className="text-sm font-semibold text-[#16A34A]">$208,450</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#6B7280]">Per employee revenue</span>
            <span className="text-sm text-[#111827]">$16,130</span>
          </div>
        </div>

        {/* Expand Link */}
        <button className="flex items-center gap-1 text-[13px] text-[#6B7280] transition-colors hover:underline">
          Additional Statistics
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Productivity Metrics Card */}
      <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-4">
        <h4 className="mb-3 text-sm font-semibold text-[#111827]">Productivity Metrics</h4>
        
        {/* Highlight Message */}
        <div className="mb-4 flex items-start gap-3">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-[#A855F7] text-xs text-white">M</AvatarFallback>
          </Avatar>
          <p className="text-sm leading-5 text-[#6B7280]">
            <span className="font-semibold text-[#16A34A]">Mason booked 50× more jobs</span> than your whole team
          </p>
        </div>

        {/* Metrics List */}
        <div className="mb-3 space-y-2 border-t border-[#E5E7EB] pt-3">
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#6B7280]">AI jobs booked</span>
            <span className="text-sm font-semibold text-[#16A34A]">1,130</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#6B7280]">Employees jobs booked</span>
            <span className="text-sm text-[#111827]">40</span>
          </div>
        </div>

        {/* Expand Link */}
        <button className="flex items-center gap-1 text-[13px] text-[#6B7280] transition-colors hover:underline">
          Additional Statistics
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Cost Efficiency Card (Partially Visible / Teaser) */}
      <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-4 opacity-40">
        <h4 className="mb-3 text-sm font-semibold text-[#111827]">Cost Efficiency</h4>
        <div className="flex items-start gap-3">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-[#A855F7] text-xs text-white">M</AvatarFallback>
          </Avatar>
          <p className="text-sm leading-5 text-[#6B7280]">
            <span className="font-semibold text-[#16A34A]">Mason delivered an hourly ROI of 4050%!</span>
          </p>
        </div>
      </div>
    </div>
  );
}
