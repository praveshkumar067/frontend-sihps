import React from 'react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { TraineeHeader } from '@/components/layout/TraineeHeader';
import { TraineeBottomNav } from '@/components/layout/TraineeBottomNav';
import { OfflineBanner } from '@/components/layout/OfflineBanner';

export default function TraineeLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['trainee']}>
      <TraineeHeader />
      <OfflineBanner />
      <div className="max-w-7xl mx-auto px-4 py-6 pb-28">
        {children}
      </div>
      <TraineeBottomNav />
    </RoleGuard>
  );
}
