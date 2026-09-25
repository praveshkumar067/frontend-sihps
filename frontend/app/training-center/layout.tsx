import React from 'react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { TrainingCenterHeader } from '@/components/layout/TrainingCenterHeader';
import { TrainingCenterBottomNav } from '@/components/layout/TrainingCenterBottomNav';
import { OfflineBanner } from '@/components/layout/OfflineBanner';

export default function TrainingCenterLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['training-center']}>
      <TrainingCenterHeader />
      <OfflineBanner />
      <div className="max-w-7xl mx-auto px-4 py-6 pb-28">
        {children}
      </div>
      <TrainingCenterBottomNav />
    </RoleGuard>
  );
}
