/**
 * Centralized Mock Data
 * Used as fallback when database is unavailable or in development mode
 */

import type { KpiResponse } from '@/lib/api/schemas/kpi';
import type { AppointmentsResponse } from '@/lib/api/schemas/appointments';
import type { EmployeesResponse } from '@/lib/api/schemas/employees';
import type { LeadsResponse } from '@/lib/api/schemas/leads';
import type { ActionNeededResponse } from '@/lib/api/schemas/tasks';

export const mockKpiData: KpiResponse = {
  drillbitBalance: {
    value: 1580000,
    delta: 80000,
    deltaPercentage: 5.33,
    isPositive: true,
  },
  roi: {
    value: 328,
    delta: 12,
    deltaPercentage: 3.8,
    isPositive: true,
  },
  revenue: {
    value: 484489,
    delta: 45000,
    deltaPercentage: 10.24,
    isPositive: true,
  },
  costs: {
    value: 52862,
    delta: 3200,
    deltaPercentage: 5.71,
    isPositive: true,
  },
};

export const mockAppointmentsData: AppointmentsResponse = {
  total: 331,
  delta: 12,
  deltaPercentage: 3.76,
  period: 'last 30 days',
  data: [
    { date: 'Mar 17', count: 45, revenue: 250000 },
    { date: 'Mar 24', count: 52, revenue: 320000 },
    { date: 'Mar 31', count: 48, revenue: 280000 },
    { date: 'Apr 7', count: 61, revenue: 420000 },
    { date: 'Apr 14', count: 58, revenue: 380000 },
    { date: 'Apr 17', count: 67, revenue: 480000 },
  ],
};

export const mockEmployeesData: EmployeesResponse = {
  employees: [
    {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Mason',
      initials: 'M',
      isAi: true,
      status: 'online',
      callsMinutes: 1240,
      messages: 342,
      tasksInProgress: 8,
      tasksFinished: 156,
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'Sarah Johnson',
      initials: 'SJ',
      isAi: false,
      status: 'away',
      callsMinutes: 980,
      messages: 189,
      tasksInProgress: 5,
      tasksFinished: 98,
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      name: 'Mike Chen',
      initials: 'MC',
      isAi: false,
      status: 'busy',
      callsMinutes: 1120,
      messages: 267,
      tasksInProgress: 6,
      tasksFinished: 112,
    },
  ],
  viewType: 'performance',
};

/**
 * Mock leads data - fallback only when database is unavailable
 * Real data should come from Supabase leads table aggregation
 * See: tooling/scripts/migrations/002_mock_data.sql for actual data
 */
export const mockLeadsData: LeadsResponse = {
  sources: [
    { source: 'Google', percentage: 37.4, count: 1500 },
    { source: 'Facebook', percentage: 21.6, count: 866 },
    { source: 'Angi Ads', percentage: 18.9, count: 758 },
    { source: 'Thumbtack', percentage: 12.7, count: 509 },
    { source: 'Phone Call', percentage: 9.4, count: 377 },
  ],
  total: 4010,
  viewType: 'conversion',
};

const now = new Date().toISOString();

export const mockTasksData: ActionNeededResponse = {
  tasks: [
    {
      id: '00000000-0000-0000-0000-000000000001',
      taskId: 'T-001',
      description: 'Follow up with customer about paint color selection',
      progress: { current: 1, total: 3 },
      status: 'in_progress',
      priority: 'medium',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      taskId: 'T-002',
      description: 'Schedule final walkthrough for Main Street project',
      progress: { current: 6, total: 8 },
      status: 'in_progress',
      priority: 'high',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      taskId: 'T-003',
      description: 'Send invoice for completed work',
      progress: { current: 0, total: 1 },
      status: 'pending',
      priority: 'medium',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: '00000000-0000-0000-0000-000000000004',
      taskId: 'T-004',
      description: 'Order materials for upcoming job',
      progress: { current: 2, total: 4 },
      status: 'in_progress',
      priority: 'medium',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: '00000000-0000-0000-0000-000000000005',
      taskId: 'T-005',
      description: 'Update customer portal with project photos',
      progress: { current: 0, total: 2 },
      status: 'pending',
      priority: 'low',
      createdAt: now,
      updatedAt: now,
    },
  ],
  total: 5,
};

