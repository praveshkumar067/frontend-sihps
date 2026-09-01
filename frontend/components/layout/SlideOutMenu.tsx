'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import {
  X,
  UserCheck,
  CalendarCheck,
  FileCheck,
  Wallet,
  Gift,
  Building2,
  BarChart3,
  ShieldAlert,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Award,
  Users
} from 'lucide-react';

interface SlideOutMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SlideOutMenu: React.FC<SlideOutMenuProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { user, logout } = useAuth();

  if (!isOpen) return null;

  const role = user?.role || 'trainee';
  const traineeType = user?.trainee_type || user?.traineeProfile?.trainee_type || 'formal';

  const handleLogout = () => {
    logout();
    onClose();
    router.push('/login');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="fixed inset-0 drawer-overlay" onClick={onClose} />

      {/* Slide-out Panel */}
      <div className="relative w-full max-w-sm h-full drawer-panel z-10 flex flex-col justify-between overflow-y-auto border-l border-slate-200 bg-white">
        {/* Panel Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {role === 'trainee' && `${traineeType === 'formal' ? 'Formal' : 'Informal'} Trainee Menu`}
                {role === 'employer' && 'Employer Menu'}
                {role === 'officer' && 'District Officer Menu'}
              </h2>
              <span className="text-[10px] text-slate-500 font-mono capitalize">
                Authenticated Role: {role} {role === 'trainee' ? `(${traineeType})` : ''}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Role-Filtered Navigation */}
        <div className="p-4 space-y-6 flex-1 text-xs">
          {/* TRAINEE ROLE MENU */}
          {role === 'trainee' && (
            <div className="space-y-2">
              <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Trainee Navigation ({traineeType.toUpperCase()})
              </h3>
              <div className="space-y-1">
                <Link
                  href="/trainee"
                  onClick={onClose}
                  className="flex items-center justify-between p-2.5 rounded-lg text-slate-800 hover:bg-slate-100 font-semibold transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>Trainee Home Dashboard</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <Link
                  href="/trainee/checkins"
                  onClick={onClose}
                  className="flex items-center justify-between p-2.5 rounded-lg text-slate-800 hover:bg-slate-100 font-semibold transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <CalendarCheck className="w-4 h-4 text-blue-600" />
                    <span>StayConnect Check-ins</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <Link
                  href="/trainee/evidence"
                  onClick={onClose}
                  className="flex items-center justify-between p-2.5 rounded-lg text-slate-800 hover:bg-slate-100 font-semibold transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <FileCheck className="w-4 h-4 text-indigo-600" />
                    <span>TrustLevel Evidence Upload</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                {/* Hide LivelihoodLens Informal Income for Formal Trainees */}
                {traineeType === 'informal' && (
                  <Link
                    href="/trainee/income"
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-lg text-slate-800 hover:bg-slate-100 font-semibold transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Wallet className="w-4 h-4 text-emerald-600" />
                      <span>LivelihoodLens Informal Income</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                )}

                <Link
                  href="/trainee/rewards"
                  onClick={onClose}
                  className="flex items-center justify-between p-2.5 rounded-lg text-slate-800 hover:bg-slate-100 font-semibold transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Gift className="w-4 h-4 text-amber-600" />
                    <span>Skill Passport & Rewards</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </div>
            </div>
          )}

          {/* EMPLOYER ROLE MENU */}
          {role === 'employer' && (
            <div className="space-y-2">
              <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Employer Navigation Modules
              </h3>
              <div className="space-y-1">
                <Link
                  href="/employer"
                  onClick={onClose}
                  className="flex items-center justify-between p-2.5 rounded-lg text-slate-800 hover:bg-slate-100 font-semibold transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>Employer Feedback Form</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <Link
                  href="/employer/candidates"
                  onClick={onClose}
                  className="flex items-center justify-between p-2.5 rounded-lg text-slate-800 hover:bg-slate-100 font-semibold transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span>Trainee Skill Match</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </div>
            </div>
          )}

          {/* OFFICER ROLE MENU */}
          {role === 'officer' && (
            <div className="space-y-2">
              <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                District Officer Modules
              </h3>
              <div className="space-y-1">
                <Link
                  href="/officer"
                  onClick={onClose}
                  className="flex items-center justify-between p-2.5 rounded-lg text-slate-800 hover:bg-slate-100 font-semibold transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>SentinelAI Fraud Anomaly Queue</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <Link
                  href="/officer/analytics"
                  onClick={onClose}
                  className="flex items-center justify-between p-2.5 rounded-lg text-slate-800 hover:bg-slate-100 font-semibold transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <BarChart3 className="w-4 h-4 text-amber-600" />
                    <span>Provider Quality Leaderboard (PQR)</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <Link
                  href="/officer/skill-bridge"
                  onClick={onClose}
                  className="flex items-center justify-between p-2.5 rounded-lg text-slate-800 hover:bg-slate-100 font-semibold transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    <span>Skill Bridge Heatmap</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <Link
                  href="/officer/center-performance"
                  onClick={onClose}
                  className="flex items-center justify-between p-2.5 rounded-lg text-slate-800 hover:bg-slate-100 font-semibold transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span>Training Center Performance</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </div>
            </div>
          )}

          {/* SYSTEM PREFERENCES */}
          <div className="space-y-2 pt-4 border-t border-slate-200">
            <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              System Preferences
            </h3>
            <div className="space-y-1">
              <div className="flex items-center justify-between p-2.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>System Preferences</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                  <span>Help & Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

