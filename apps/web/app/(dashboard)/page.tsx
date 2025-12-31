import { KpiCards } from '@/components/dashboard/kpi-cards';
import { DualAnalyticsContainer } from '@/components/dashboard/dual-analytics-container';
import { ActionNeeded } from '@/components/dashboard/action-needed';
import { EmployeesTable } from '@/components/dashboard/employees-table';
import { InsightColumn } from '@/components/dashboard/insight-column';

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px]">
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
        {/* Left Column - Main Content */}
        <div className="col-span-1 space-y-4 lg:col-span-9 lg:space-y-6">
          {/* KPI Cards */}
          <div>
            <KpiCards />
          </div>
          
          {/* Dual-Card Analytics Container */}
          <DualAnalyticsContainer />
          
          {/* Action Needed & Employees */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
            <ActionNeeded />
            <EmployeesTable />
          </div>
        </div>

        {/* Right Column - Insights */}
        <div className="col-span-1 lg:col-span-3">
          <InsightColumn />
        </div>
      </div>
    </div>
  );
}

