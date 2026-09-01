'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { Home, CalendarCheck, FileCheck, Wallet, Gift } from 'lucide-react';

export const TraineeBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  const traineeType = user?.trainee_type || user?.traineeProfile?.trainee_type || 'formal';

  const navItems = [
    { label: 'Home', href: '/trainee', icon: Home },
    { label: 'Check-ins', href: '/trainee/checkins', icon: CalendarCheck },
    { label: 'Evidence', href: '/trainee/evidence', icon: FileCheck },
    ...(traineeType === 'informal' ? [{ label: 'Income', href: '/trainee/income', icon: Wallet }] : []),
    { label: 'Rewards', href: '/trainee/rewards', icon: Gift },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-slate-900 py-2 px-3 shadow-lg">
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
                  ? 'text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-900 font-medium'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg transition-colors ${
                  isActive ? 'bg-slate-900 text-white' : 'text-slate-500'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
