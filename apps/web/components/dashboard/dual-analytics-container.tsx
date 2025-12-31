'use client';

import { AppointmentsChart } from './appointments-chart';
import { LeadsChart } from './leads-chart';

/**
 * Dual-Card Analytics Container
 * Groups Appointments and Leads cards into a single horizontal section
 * with proper alignment and spacing
 * 
 * Layout:
 * - Grid columns: 2fr 1.6fr (left card wider)
 * - Column gap: 24px
 * - Margin-top: 24px
 * - Responsive: stacks on mobile
 */
export function DualAnalyticsContainer() {
  return (
    <div className="mt-6 grid w-full grid-cols-1 gap-6 lg:grid-cols-[2fr_1.6fr]">
      <AppointmentsChart />
      <LeadsChart />
    </div>
  );
}

