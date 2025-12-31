'use client';

import { Sidebar, SidebarProvider, useSidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { toggle } = useSidebar();

  return (
    <div className="flex min-h-screen bg-[#FAFAF9]">
      <Sidebar />
      <div className="flex flex-1 flex-col lg:ml-[240px]">
        <Header onMenuClick={toggle} />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
}

