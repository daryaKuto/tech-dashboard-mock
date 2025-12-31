'use client';

import { useEffect, useState } from 'react';
import {
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import { mockAppointmentsData } from '@/lib/data/mock';
import type { AppointmentsResponse } from '@/lib/api/schemas/appointments';
import type { ApiResponse } from '@/lib/api/types';

export function AppointmentsChart() {
  const [data, setData] = useState<AppointmentsResponse['data']>([]);
  const [total, setTotal] = useState(567);
  const [delta, setDelta] = useState(86);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/appointments');
        if (!response.ok) throw new Error('Failed to fetch');
        
        const result: ApiResponse<AppointmentsResponse> = await response.json();
        if (result.ok) {
          setData(result.data.data);
          setTotal(result.data.total);
          setDelta(result.data.delta);
        }
      } catch {
        setData(mockAppointmentsData.data);
        setTotal(mockAppointmentsData.total);
        setDelta(mockAppointmentsData.delta);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const chartData = data.map((d) => ({
    date: d.date,
    appointments: d.count,
    revenue: d.revenue,
    costs: d.costs || 0,
  }));

  // #region agent log
  fetch('http://127.0.0.1:7245/ingest/35a4f109-9d2a-402c-853d-9cb202e24d3a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'appointments-chart.tsx:53',message:'Chart data prepared',data:{chartDataLength:chartData.length,samplePoint:chartData[0],revenueRange:[Math.min(...chartData.map(d=>d.revenue)),Math.max(...chartData.map(d=>d.revenue))],appointmentsRange:[Math.min(...chartData.map(d=>d.appointments)),Math.max(...chartData.map(d=>d.appointments))]},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion

  return (
    <div className="h-[340px] rounded-[12px] border border-[#E5E7EB] bg-white p-4">
      {/* Header Row */}
      <div className="mb-4">
        <h3 className="text-[16px] font-semibold text-[#111827]">Appointments</h3>
        {loading ? (
          <div className="mt-1 h-8 w-32 animate-pulse rounded bg-[#E5E7EB]" />
        ) : (
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-[28px] font-bold text-[#111827]">{total}</span>
            <span className="text-[13px] text-[#16A34A]">
              ▲ {delta} last week
            </span>
          </div>
        )}
      </div>

      {/* Legend Row - Centered */}
      <div className="mb-3 flex items-center justify-center gap-4 text-[12px] text-[#6B7280]">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-[#DCFCE7]"></div>
          <span>Revenue</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-0.5 w-4 bg-[#FB923C]"></div>
          <span>Appointments</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-0.5 w-4 border-b border-dashed border-[#9CA3AF]"></div>
          <span>Costs</span>
        </div>
      </div>

      {/* Chart Area */}
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
          />
          {/* Left Y-axis - Appointments count */}
          <YAxis
            yAxisId="left"
            orientation="left"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={{ stroke: '#E5E7EB' }}
            domain={[0, 600]}
            ticks={[0, 300, 600]}
            tickCount={3}
            allowDecimals={false}
            width={40}
          />
          {/* Right Y-axis - Revenue scale */}
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            domain={[0, 1000000]}
            ticks={[0, 250000, 500000, 750000, 1000000]}
            tickFormatter={(value) => {
              if (value === 0) return '$0';
              if (value === 1000000) return '$1M';
              return `$${(value / 1000).toFixed(0)}k`;
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          {/* Revenue Bars */}
          <Bar
            yAxisId="right"
            dataKey="revenue"
            fill="#DCFCE7"
            radius={[4, 4, 0, 0]}
          />
          {/* Orange Line - traces top of revenue bars */}
          {/* #region agent log */}
          {(() => {
            const barAxis = 'right';
            const barDataKey = 'revenue';
            const lineAxis = 'right';
            const lineDataKey = 'revenue';
            fetch('http://127.0.0.1:7245/ingest/35a4f109-9d2a-402c-853d-9cb202e24d3a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'appointments-chart.tsx:148',message:'Orange line configuration - should match bars',data:{barAxis,barDataKey,lineAxis,lineDataKey,axesMatch:barAxis===lineAxis,dataKeysMatch:barDataKey===lineDataKey},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
            return null;
          })()}
          {/* #endregion */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="revenue"
            stroke="#FB923C"
            strokeWidth={2}
            dot={false}
          />
          {/* Invisible appointments line to keep left Y-axis visible */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="appointments"
            stroke="transparent"
            strokeWidth={0}
            dot={false}
            activeDot={false}
          />
          {/* Costs Dashed Line */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="costs"
            stroke="#9CA3AF"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={false}
            opacity={0.6}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
