'use client';

import { useState, useEffect } from 'react';
import { BarChart3, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockLeadsData } from '@/lib/data/mock';
import type { LeadsResponse, LeadSource } from '@/lib/api/schemas/leads';
import type { ApiResponse } from '@/lib/api/types';

const mockDataWithCounts: LeadSource[] = mockLeadsData.sources.map((s, i) => ({
  ...s,
  count: [1500, 866, 758, 509, 377][i] || 0,
}));

export function LeadsChart() {
  const [viewType, setViewType] = useState<'conversion' | 'location'>('conversion');
  const [leadsData, setLeadsData] = useState<LeadSource[]>(mockDataWithCounts);
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
        setLeadsData(mockDataWithCounts);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [viewType]);

  const maxValue = Math.max(...leadsData.map((lead) => lead.count || 0));
  const scaleMax = Math.max(1600, Math.ceil(maxValue / 400) * 400);

  return (
    <div className="w-full rounded-[12px] border border-[#E5E7EB] bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold leading-6 text-[#111827]">Leads</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewType('conversion')}
            className={cn(
              'inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-[13px] font-medium transition-opacity',
              viewType === 'conversion'
                ? 'border-[#E5E7EB] bg-[#F3F4F6] text-[#111827]'
                : 'border-[#E5E7EB] bg-white text-[#9CA3AF]'
            )}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Conversion (source)
          </button>
          <button
            onClick={() => setViewType('location')}
            className={cn(
              'inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-[13px] font-medium transition-opacity',
              viewType === 'location'
                ? 'border-[#E5E7EB] bg-[#F3F4F6] text-[#111827]'
                : 'border-[#E5E7EB] bg-white text-[#9CA3AF]'
            )}
          >
            <MapPin className="h-3.5 w-3.5" />
            Location
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="relative">
          <div 
            className="absolute left-[110px] right-[50px] top-0 bottom-[60px] pointer-events-none"
            style={{ maxWidth: '340px' }}
          >
            {[0, 400, 800, 1200, 1600].map((tick) => {
              if (tick > scaleMax) return null;
              const tickPercent = scaleMax > 0 ? (tick / scaleMax) * 100 : 0;
              return (
                <div
                  key={tick}
                  className="absolute top-0 bottom-0 w-px bg-[#E5E7EB] opacity-60"
                  style={{ left: `${tickPercent}%` }}
                />
              );
            })}
          </div>

          <div className="mb-2 space-y-3">
            {leadsData.map((lead) => {
              const count = lead.count || 0;
              const widthPercent = scaleMax > 0 ? (count / scaleMax) * 100 : 0;
              
              return (
                <div key={lead.source} className="relative flex items-center gap-3">
                  <div className="w-[110px]">
                    <span className="text-sm font-normal leading-7 text-[#6B7280]">
                      {lead.source}
                    </span>
                  </div>

                  <div className="relative flex-1" style={{ maxWidth: '340px' }}>
                    <div className="relative h-6 w-full overflow-hidden rounded-lg bg-[#FBE5DB]">
                      <div
                        className="relative h-6 rounded-lg bg-[#F4A261] transition-opacity hover:opacity-90"
                        style={{ width: `${widthPercent}%`, cursor: 'pointer' }}
                      >
                        {widthPercent > 12 && (
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-white">
                            {lead.percentage.toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="w-[50px] text-right">
                    <span className="text-[13px] font-medium text-[#6B7280]">
                      {count.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-2 border-t border-[#E5E7EB] pt-2 pb-2">
            <div className="flex justify-between" style={{ paddingLeft: '110px', paddingRight: '50px' }}>
              {[0, 400, 800, 1200, 1600].map((tick) => {
                if (tick > scaleMax) return null;
                return (
                  <span key={tick} className="text-xs text-[#9CA3AF]">
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
