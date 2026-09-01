'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, BarChart3, MapPin, Award } from 'lucide-react';

export const OfficerNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Sentinel Queue', href: '/officer', icon: ShieldCheck },
    { label: 'PQR Leaderboard', href: '/officer/analytics', icon: BarChart3 },
    { label: 'Skill Bridge', href: '/officer/skill-bridge', icon: MapPin },
    { label: 'Center Reports', href: '/officer/center-performance', icon: Award },
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
              className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all ${
                isActive
                  ? 'text-amber-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg transition-colors ${
                  isActive ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : ''
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

