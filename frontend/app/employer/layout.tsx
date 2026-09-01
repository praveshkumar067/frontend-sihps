import React from 'react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { EmployerHeader } from '@/components/layout/EmployerHeader';
import { OfflineBanner } from '@/components/layout/OfflineBanner';

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['employer']}>
      <EmployerHeader />
      <OfflineBanner />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </div>
    </RoleGuard>
  );
}
