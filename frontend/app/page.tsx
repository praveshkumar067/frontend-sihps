'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { ShieldCheck } from 'lucide-react';

export default function RootPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login');
    } else {
      if (user.role === 'trainee') router.push('/trainee');
      else if (user.role === 'employer') router.push('/employer');
      else if (user.role === 'officer') router.push('/officer');
      else router.push('/login');
    }
  }, [user, isAuthenticated, router]);

  return (
    <div className="max-w-md mx-auto py-24 text-center space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-brand-500/20">
        <ShieldCheck className="w-8 h-8 stroke-[2.5]" />
      </div>
      <h2 className="text-xl font-bold text-white">Lifelong Livelihood Support Platform</h2>
      <p className="text-xs text-slate-400">Verifying session role and redirecting to role dashboard...</p>
    </div>
  );
}
