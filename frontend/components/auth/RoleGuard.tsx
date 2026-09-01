'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { Role } from '@/lib/types';
import { ShieldAlert } from 'lucide-react';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      // Security redirect to authorized role dashboard
      if (user.role === 'trainee') router.push('/trainee');
      else if (user.role === 'employer') router.push('/employer');
      else if (user.role === 'officer') router.push('/officer');
      else router.push('/login');
    }
  }, [user, isAuthenticated, allowedRoles, router]);

  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6 animate-pulse" />
        </div>
        <h3 className="text-lg font-bold text-white">Security RoleGuard Enforcing Access Control</h3>
        <p className="text-xs text-slate-400">Verifying session permissions and redirecting to authorized role group...</p>
      </div>
    );
  }

  return <>{children}</>;
};
