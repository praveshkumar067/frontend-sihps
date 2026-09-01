import React from 'react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { OfficerHeader } from '@/components/layout/OfficerHeader';
import { OfflineBanner } from '@/components/layout/OfflineBanner';

export default function OfficerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['officer']}>
      <OfficerHeader />
      <OfflineBanner />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </div>
    </RoleGuard>
  );
}
