'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { Home, CalendarCheck, FileCheck, Wallet, Gift, Send } from 'lucide-react';

export const TrainingCenterNav: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  const tcType = user?.training_center_type || user?.trainingCenterProfile?.training_center_type || 'formal';

  const navItems = [
    { label: 'Home', href: '/training-center', icon: Home },
    { label: 'Invites', href: '/training-center/invites', icon: Send },
    { label: 'Check-ins', href: '/training-center/checkins', icon: CalendarCheck },
    { label: 'Evidence', href: '/training-center/evidence', icon: FileCheck },
    ...(tcType === 'informal' ? [{ label: 'Income', href: '/training-center/income', icon: Wallet }] : []),
    { label: 'Rewards', href: '/training-center/rewards', icon: Gift },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-lg border-t border-slate-800 py-2 px-3">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${
                isActive
                  ? 'text-emerald-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg transition-colors ${
                  isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
