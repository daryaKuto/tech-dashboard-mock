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
    <div className="h-[340px] rounded-[12px] border border-[#E5E7EB] bg-white p-4">
      {/* Header Row */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[16px] font-semibold text-[#111827]">Leads</h3>
        
        {/* Segmented Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewType('conversion')}
            className={cn(
              'inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium',
              viewType === 'conversion'
                ? 'bg-[#F3F4F6] text-[#111827]'
                : 'bg-white text-[#9CA3AF]'
            )}
          >
            <BarChart3 className={cn('h-3.5 w-3.5', viewType === 'conversion' ? 'text-[#111827]' : 'text-[#9CA3AF]')} />
            <span>Conversion (source)</span>
          </button>
          <button
            onClick={() => setViewType('location')}
            className={cn(
              'inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium',
              viewType === 'location'
                ? 'bg-[#F3F4F6] text-[#111827]'
                : 'bg-white text-[#9CA3AF]'
            )}
          >
            <MapPin className={cn('h-3.5 w-3.5', viewType === 'location' ? 'text-[#111827]' : 'text-[#9CA3AF]')} />
            <span>Location</span>
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative">
        {/* Vertical Gridlines */}
        <div 
          className="pointer-events-none absolute left-[90px] right-[40px] top-0"
          style={{ bottom: '40px' }}
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

        {/* Data Rows - increased height, reduced gap */}
        <div className="flex flex-col gap-1.5" style={{ marginTop: '45px' }}>
          {leadsData.map((lead) => {
            const count = lead.count || 0;
            // Track width based on count value relative to x-axis scale
            const trackWidthPercent = scaleMax > 0 ? (count / scaleMax) * 100 : 0;
            // Fill width is the percentage of the track width
            const fillWidthPercent = lead.percentage;
            
            return (
              <div key={lead.source} className="flex items-center gap-2" style={{ height: '36px' }}>
                {/* Y-Axis Label - 90px width */}
                <div className="w-[90px] flex-shrink-0">
                  <span className="text-[12px] font-normal text-[#6B7280] leading-[36px]">
                    {lead.source}
                  </span>
                </div>

                {/* Bar Track - flexible width */}
                <div className="relative min-w-0 flex-1">
                  {/* Track Background - sized to match count value on x-axis */}
                  <div 
                    className="relative overflow-hidden rounded-lg bg-[#FBE5DB]"
                    style={{ width: `${trackWidthPercent}%`, height: '32px' }}
                  >
                    {/* Fill Bar - covers only the percentage of the track */}
                    <div
                      className="relative cursor-pointer rounded-lg bg-[#F4A261] transition-opacity hover:opacity-90"
                      style={{ width: `${fillWidthPercent}%`, height: '32px' }}
                    >
                      {/* Percentage Badge - inside bar, left-aligned with 8px padding */}
                      {fillWidthPercent >= 8 && (
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-white">
                          {lead.percentage.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right-Side Numeric Label - 40px width */}
                <div className="w-[40px] flex-shrink-0 text-right">
                  <span className="text-[12px] font-medium text-[#6B7280]">
                    {count.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* X-Axis Scale */}
        <div className="mt-3 border-t border-[#E5E7EB] pt-2">
          <div className="flex justify-between pl-[90px] pr-[40px]">
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
  );
}
