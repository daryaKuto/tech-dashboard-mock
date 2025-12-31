'use client';

import { useState, useEffect } from 'react';
import { BarChart3, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockLeadsData } from '@/lib/data/mock';
import type { LeadsResponse, LeadSource } from '@/lib/api/schemas/leads';
import type { ApiResponse } from '@/lib/api/types';

export function LeadsChart() {
  const [viewType, setViewType] = useState<'conversion' | 'location'>('conversion');
  const [leadsData, setLeadsData] = useState<LeadSource[]>(mockLeadsData.sources);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/leads?viewType=${viewType}`);
        if (!response.ok) throw new Error('Failed to fetch');
        
        const result: ApiResponse<LeadsResponse> = await response.json();
        if (result.ok) {
          setLeadsData(result.data.sources);
        }
      } catch {
        setLeadsData(mockLeadsData.sources);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [viewType]);

  const maxValue = Math.max(...leadsData.map((lead) => lead.count || 0));
  const scaleMax = Math.max(1600, Math.ceil(maxValue / 400) * 400);

  return (
    <div className="w-full rounded-[12px] border border-[#E5E7EB] bg-white p-3 sm:p-4">
      {/* Card Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-[16px] font-semibold leading-6 text-[#111827]">Leads</h3>
        
        {/* Segmented Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewType('conversion')}
            className={cn(
              'inline-flex h-8 items-center gap-1.5 rounded-lg border px-2 text-[12px] font-medium sm:px-3 sm:text-[13px]',
              viewType === 'conversion'
                ? 'border-[#E5E7EB] bg-[#F3F4F6] text-[#111827]'
                : 'border-[#E5E7EB] bg-white text-[#9CA3AF]'
            )}
          >
            <BarChart3 className={cn('h-3.5 w-3.5', viewType === 'conversion' ? 'text-[#111827]' : 'text-[#9CA3AF]')} />
            <span className="hidden sm:inline">Conversion (source)</span>
            <span className="sm:hidden">Conversion</span>
          </button>
          <button
            onClick={() => setViewType('location')}
            className={cn(
              'inline-flex h-8 items-center gap-1.5 rounded-lg border px-2 text-[12px] font-medium sm:px-3 sm:text-[13px]',
              viewType === 'location'
                ? 'border-[#E5E7EB] bg-[#F3F4F6] text-[#111827]'
                : 'border-[#E5E7EB] bg-white text-[#9CA3AF]'
            )}
          >
            <MapPin className={cn('h-3.5 w-3.5', viewType === 'location' ? 'text-[#111827]' : 'text-[#9CA3AF]')} />
            Location
          </button>
        </div>
      </div>

      {/* Chart Area - 16px top margin from header */}
      <div className="mt-4">
        <div className="relative">
          {/* Vertical Gridlines */}
          <div 
            className="pointer-events-none absolute bottom-[32px] left-[90px] right-[50px] top-0 sm:left-[122px] sm:right-[62px]"
          >
            {[0, 400, 800, 1200, 1600].map((tick) => {
              if (tick > scaleMax) return null;
              const tickPercent = scaleMax > 0 ? (tick / scaleMax) * 100 : 0;
              return (
                <div
                  key={tick}
                  className="absolute bottom-0 top-0 w-px bg-[#E5E7EB] opacity-60"
                  style={{ left: `${tickPercent}%` }}
                />
              );
            })}
          </div>

          {/* Data Rows - 12px gap between rows */}
          <div className="flex flex-col gap-3">
            {leadsData.map((lead) => {
              const count = lead.count || 0;
              const widthPercent = scaleMax > 0 ? (count / scaleMax) * 100 : 0;
              
              return (
                <div key={lead.source} className="flex items-center gap-2 sm:gap-3">
                  {/* Y-Axis Label - responsive width */}
                  <div className="w-[80px] flex-shrink-0 sm:w-[110px]">
                    <span className="text-xs font-normal leading-7 text-[#6B7280] sm:text-[14px]">
                      {lead.source}
                    </span>
                  </div>

                  {/* Bar Track - flexible width */}
                  <div className="relative min-w-0 flex-1">
                    {/* Track Background */}
                    <div className="relative h-6 w-full overflow-hidden rounded-lg bg-[#FBE5DB]">
                      {/* Fill Bar */}
                      <div
                        className="relative h-6 cursor-pointer rounded-lg bg-[#F4A261] transition-opacity hover:opacity-90"
                        style={{ width: `${widthPercent}%` }}
                      >
                        {/* Percentage Badge - inside bar, left-aligned with 8px padding */}
                        {widthPercent > 10 && (
                          <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-white sm:left-2 sm:text-[13px]">
                            {lead.percentage.toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right-Side Numeric Label - responsive width */}
                  <div className="w-[40px] flex-shrink-0 text-right sm:w-[50px]">
                    <span className="text-xs font-medium text-[#6B7280] sm:text-[13px]">
                      {count.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* X-Axis Scale - 8px bottom padding after axis */}
          <div className="mt-2 border-t border-[#E5E7EB] pb-2 pt-2">
            <div className="flex justify-between pl-[90px] pr-[50px] sm:pl-[122px] sm:pr-[62px]">
              {[0, 400, 800, 1200, 1600].map((tick) => {
                if (tick > scaleMax) return null;
                return (
                  <span key={tick} className="text-[12px] text-[#9CA3AF]">
                    {tick}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
