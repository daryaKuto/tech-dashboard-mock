'use client';

import { Bell, Download, Plus, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from '@/app/actions/auth';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || 'User');
      }
    }
    getUser();
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="flex items-center justify-between border-b border-[#E5E7EB] bg-white px-4 py-3 lg:px-6 lg:py-4">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5 text-[#6B7280]" />
          <span className="sr-only">Open menu</span>
        </Button>
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-[#111827] lg:text-xl">
            <span className="whitespace-nowrap">
              <span className="hidden sm:inline">Welcome, </span>
              <span className="inline">{userEmail || 'User'}</span>
            </span>
          </h1>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3">
        <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
          <Bell className="h-5 w-5 text-[#6B7280]" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Button variant="ghost" className="h-9 shrink-0 gap-2 whitespace-nowrap text-[#6B7280] hidden md:flex">
          <Download className="h-4 w-4 shrink-0" />
          <span className="hidden lg:inline">Export</span>
        </Button>
        <Button className="h-9 shrink-0 gap-2 whitespace-nowrap bg-[#111827] text-white hover:bg-[#111827]/90 px-2 sm:px-3 md:px-4">
          <Plus className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Add new</span>
        </Button>
        <Button
          variant="ghost"
          className="h-9 shrink-0 gap-2 whitespace-nowrap text-[#6B7280] px-2 md:px-3"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span className="hidden md:inline">Sign Out</span>
          <span className="sr-only md:hidden">Sign Out</span>
        </Button>
      </div>
    </header>
  );
}

