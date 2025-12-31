import { KpiCards } from '@/components/dashboard/kpi-cards';
import { AppointmentsChart } from '@/components/dashboard/appointments-chart';
import { LeadsChart } from '@/components/dashboard/leads-chart';
import { ActionNeeded } from '@/components/dashboard/action-needed';
import { EmployeesTable } from '@/components/dashboard/employees-table';
import { InsightColumn } from '@/components/dashboard/insight-column';

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px]">
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
        {/* Left Column - Main Content */}
        <div className="col-span-1 space-y-4 lg:col-span-8 lg:space-y-6">
          {/* KPI Cards */}
          <div>
            <KpiCards />
          </div>
          
          {/* Charts Container - Stack on mobile, side-by-side on desktop */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
            <AppointmentsChart />
            <LeadsChart />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
            <ActionNeeded />
            <EmployeesTable />
          </div>
        </div>

        {/* Right Column - Insights */}
        <div className="col-span-1 lg:col-span-4">
          <InsightColumn />
        </div>
      </div>
    </div>
  );
}

