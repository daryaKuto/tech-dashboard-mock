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
  }));

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-3 sm:p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-[#111827] sm:text-lg">Appointments</h3>
          {loading ? (
            <div className="mt-1 h-8 w-32 animate-pulse rounded bg-[#E5E7EB]" />
          ) : (
            <div className="mt-1 flex flex-wrap items-baseline gap-2">
              <span className="text-2xl font-bold text-[#111827] sm:text-3xl">{total}</span>
              <span className="text-xs font-medium text-[#16A34A] sm:text-sm">
                {delta >= 0 ? '+' : ''}
                {delta} last week
              </span>
            </div>
          )}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200} className="sm:h-[240px]">
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis
            yAxisId="left"
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
            domain={[250000, 1000000]}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
            }}
          />
          <Bar
            yAxisId="left"
            dataKey="appointments"
            fill="#DCFCE7"
            radius={[4, 4, 0, 0]}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="revenue"
            stroke="#FB923C"
            strokeWidth={2}
            dot={{ fill: '#FB923C', r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
