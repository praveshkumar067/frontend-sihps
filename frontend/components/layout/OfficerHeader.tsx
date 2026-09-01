'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { SlideOutMenu } from './SlideOutMenu';
import { Lock, ShieldAlert, Bell, Menu, ChevronDown } from 'lucide-react';

export const OfficerHeader: React.FC = () => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  return (
    <>
      <header className="w-full bg-white text-slate-900 border-b-2 border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
              <Lock className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                SentinelAI District Officer Portal
                <span className="hidden sm:inline text-[10px] bg-slate-100 text-slate-700 border border-slate-300 px-1.5 py-0.5 rounded font-mono uppercase">
                  Role: Officer
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">Fraud & Anomaly Verification System • PS 26135</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            </button>

            {user && (
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">AD</div>
                <div className="text-xs">
                  <div className="font-extrabold text-slate-900 flex items-center gap-1">
                    {user.name.split(' ')[0]} <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">HOD / Officer</div>
                </div>
              </div>
            )}

            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors ml-1"
              title="Open Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <SlideOutMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};
