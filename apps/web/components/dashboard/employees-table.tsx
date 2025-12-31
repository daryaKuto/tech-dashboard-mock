'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarStatus } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn, getAvatarColor } from '@/lib/utils';
import { mockEmployeesData } from '@/lib/data/mock';
import type { EmployeePerformance, EmployeesResponse } from '@/lib/api/schemas/employees';
import type { ApiResponse } from '@/lib/api/types';

export function EmployeesTable() {
  const [viewType, setViewType] = useState<'performance' | 'overtime'>('performance');
  const [employees, setEmployees] = useState<EmployeePerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/employees?viewType=${viewType}`);
        if (!response.ok) throw new Error('Failed to fetch');
        
        const result: ApiResponse<EmployeesResponse> = await response.json();
        if (result.ok) {
          setEmployees(result.data.employees);
        }
      } catch {
        setEmployees(mockEmployeesData.employees);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [viewType]);

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#111827]">Employees</h3>
        <div className="flex gap-1 rounded-lg bg-[#F3F4F6] p-1">
          <button
            onClick={() => setViewType('performance')}
            className={cn(
              'rounded-md px-3 py-1 text-xs font-medium transition-colors',
              viewType === 'performance'
                ? 'bg-white text-[#111827]'
                : 'text-[#6B7280] hover:text-[#111827]'
            )}
          >
            Performance
          </button>
          <button
            onClick={() => setViewType('overtime')}
            className={cn(
              'rounded-md px-3 py-1 text-xs font-medium transition-colors',
              viewType === 'overtime'
                ? 'bg-white text-[#111827]'
                : 'text-[#6B7280] hover:text-[#111827]'
            )}
          >
            Overtime
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E5E7EB]">
              <th className="pb-3 text-left text-xs font-medium uppercase tracking-wide text-[#6B7280]">
                Employee
              </th>
              <th className="pb-3 text-right text-xs font-medium uppercase tracking-wide text-[#6B7280]">
                Calls (mins)
              </th>
              <th className="pb-3 text-right text-xs font-medium uppercase tracking-wide text-[#6B7280]">
                Messages
              </th>
              <th className="pb-3 text-right text-xs font-medium uppercase tracking-wide text-[#6B7280]">
                Tasks in progress
              </th>
              <th className="pb-3 text-right text-xs font-medium uppercase tracking-wide text-[#6B7280]">
                Tasks finished
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {employees.map((employee) => {
              const avatarColors = getAvatarColor(employee.id);
              return (
                <tr key={employee.id}>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 relative">
                        <AvatarFallback className={cn(avatarColors.bg, avatarColors.text, 'text-xs font-medium')}>
                          {employee.initials}
                        </AvatarFallback>
                        <AvatarStatus status={employee.status} />
                      </Avatar>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'text-sm font-medium',
                            employee.isAi ? 'font-bold text-[#111827]' : 'text-[#111827]'
                          )}
                        >
                          {employee.name}
                        </span>
                        {employee.isAi && (
                          <Badge
                            variant="secondary"
                            className="h-4 px-1.5 text-xs bg-[#F3F4F6] text-[#111827]"
                          >
                            AI
                          </Badge>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-right text-sm text-[#111827]">
                    {employee.callsMinutes.toLocaleString()}
                  </td>
                  <td className="py-3 text-right text-sm text-[#111827]">
                    {employee.messages}
                  </td>
                  <td className="py-3 text-right text-sm text-[#111827]">
                    {employee.tasksInProgress}
                  </td>
                  <td className="py-3 text-right text-sm text-[#111827]">
                    {employee.tasksFinished}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
