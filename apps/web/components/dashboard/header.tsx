'use client';

import { Bell, Download, Plus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from '@/app/actions/auth';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function Header() {
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
    <header className="flex items-center justify-between border-b border-[#E5E7EB] bg-white px-6 py-4">
      <div>
        <h1 className="text-xl font-semibold text-[#111827]">
          Welcome, {userEmail || 'User'}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Bell className="h-5 w-5 text-[#6B7280]" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Button variant="ghost" className="h-9 gap-2 text-[#6B7280]">
          <Download className="h-4 w-4" />
          <span>Export</span>
        </Button>
        <Button className="h-9 gap-2 bg-[#111827] text-white hover:bg-[#111827]/90">
          <Plus className="h-4 w-4" />
          <span>Add new</span>
        </Button>
        <Button
          variant="ghost"
          className="h-9 gap-2 text-[#6B7280]"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </Button>
      </div>
    </header>
  );
}

