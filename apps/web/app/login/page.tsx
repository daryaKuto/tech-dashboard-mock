'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      // Redirect to dashboard
      router.push('/');
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAF9]">
      <div className="w-full max-w-md rounded-xl border border-[#E5E7EB] bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-[#111827]">
          ThatOnePainter Dashboard
        </h1>
        <p className="mb-6 text-sm text-[#6B7280]">
          Sign in to access your dashboard
        </p>

        <form onSubmit={handleSignIn} className="space-y-4" suppressHydrationWarning>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#111827]"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading}
              className="w-full"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[#111827]"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              className="w-full"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p className="mt-6 text-xs text-center text-[#6B7280]">
          Don't have an account?{' '}
          <Link
            href="/signup"
            className="font-medium text-[#111827] hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

