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
    delta: 15308,
    deltaPercentage: 0.97,
    isPositive: true,
  },
  roi: {
    value: 328,
    delta: 132,
    deltaPercentage: 132,
    isPositive: true,
  },
  revenue: {
    value: 484489,
    delta: 211402,
    deltaPercentage: 48.2,
    isPositive: true,
  },
  costs: {
    value: 52862,
    delta: -24402,
    deltaPercentage: -61.9,
    isPositive: false,
  },
};

export const mockAppointmentsData: AppointmentsResponse = {
  total: 567,
  delta: 86,
  deltaPercentage: 17.9,
  period: 'last 30 days',
  data: [
    { date: 'Mar 17', count: 45, revenue: 380000, costs: 18000 },
    { date: 'Mar 24', count: 52, revenue: 720000, costs: 22000 },
    { date: 'Mar 31', count: 48, revenue: 560000, costs: 20000 },
    { date: 'Apr 3', count: 55, revenue: 1000000, costs: 24000 },
    { date: 'Apr 10', count: 61, revenue: 890000, costs: 28000 },
    { date: 'Apr 17', count: 67, revenue: 640000, costs: 32000 },
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
      taskId: 'T-38452',
      description: 'Check for any damaged pipes connected to the main water line',
      progress: { current: 1, total: 3 },
      status: 'in_progress',
      priority: 'medium',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      taskId: 'T-38449',
      description: 'Inspect the faucet handle for any issues with the mechanism',
      progress: { current: 6, total: 8 },
      status: 'in_progress',
      priority: 'high',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      taskId: 'T-38448',
      description: 'Onsite estimate',
      progress: { current: 0, total: 1 },
      status: 'completed',
      priority: 'medium',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: '00000000-0000-0000-0000-000000000004',
      taskId: 'T-38447',
      description: 'Quote review',
      progress: { current: 0, total: 1 },
      status: 'completed',
      priority: 'medium',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: '00000000-0000-0000-0000-000000000005',
      taskId: 'T-38446',
      description: 'Schedule final walkthrough for Main Street project',
      progress: { current: 2, total: 4 },
      status: 'in_progress',
      priority: 'medium',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: '00000000-0000-0000-0000-000000000006',
      taskId: 'T-38445',
      description: 'Follow up with customer about paint color selection',
      progress: { current: 0, total: 1 },
      status: 'pending',
      priority: 'low',
      createdAt: now,
      updatedAt: now,
    },
  ],
  total: 6,
};

