'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, Users, UserCog, MessageSquare, CheckSquare2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
};

const navItems: NavItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/jobs', label: 'Jobs', icon: Briefcase, badge: 24 },
  { href: '/customers', label: 'Customers', icon: Users },
  { href: '/employees', label: 'Employees', icon: UserCog },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare2, badge: 18 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] border-r border-[#E5E7EB] bg-white">
      <div className="flex h-full flex-col">
        {/* Branding */}
        <div className="flex items-center gap-3 border-b border-[#E5E7EB] px-6 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-[#111827]">
            <Home className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[#111827]">ThatOnePainter</span>
            <span className="text-xs text-[#6B7280]">Alex Seutin</span>
          </div>
        </div>

        {/* Search */}
        <div className="border-b border-[#E5E7EB] px-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
            <Input
              type="search"
              placeholder="Search..."
              className="h-9 pl-9 text-sm placeholder:text-[#9CA3AF]"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[#F3F4F6] text-[#111827]'
                    : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]'
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5',
                    isActive ? 'text-[#111827]' : 'text-[#9CA3AF]'
                  )}
                />
                <span className="flex-1">{item.label}</span>
                {item.badge !== undefined && (
                  <Badge
                    variant="secondary"
                    className={cn(
                      'h-5 min-w-5 px-1.5 text-xs',
                      isActive ? 'bg-white text-[#111827]' : 'bg-[#E5E7EB] text-[#6B7280]'
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

