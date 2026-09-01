'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { api } from '@/lib/api';
import { IncentiveItem } from '@/lib/types';
import { SkillPassportBadge } from '@/components/rewards/SkillPassportBadge';
import { Gift, Lock, Unlock, CheckCircle2, Building, Sparkles } from 'lucide-react';

export default function TraineeRewardsPage() {
  const { user } = useAuth();
  const [incentives, setIncentives] = useState<IncentiveItem[]>([]);
  const trainee = user?.traineeProfile;

  useEffect(() => {
    const fetchIncentives = async () => {
      if (!trainee) return;
      try {
        const data = await api.getIncentiveLedger(trainee.trainee_id);
        setIncentives(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchIncentives();
  }, [user]);

  if (!trainee) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-400 bg-brand-500/10 border border-brand-500/20 px-2.5 py-1 rounded-md mb-2">
            <Gift className="w-3.5 h-3.5" /> Incentive Layer (Trainee Role)
          </div>
          <h1 className="text-2xl font-extrabold text-white">Beneficiary Rewards & Scheme Access</h1>
          <p className="text-xs text-slate-400 mt-1">
            "What's in it for me" — Unlocking micro-loans, vouchers, and certified skill credentials.
          </p>
        </div>
      </div>

      <SkillPassportBadge trainee={trainee} />

      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Building className="w-5 h-5 text-blue-400" />
          Scheme Priority Access Eligibility
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400">PM Mudra Loan Priority Clearance</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ELIGIBLE
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Collateral-free micro-business loan up to ₹1,00,000 for self-employed entrepreneurs with Tier 3 verification.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400">PMKVY Equipment Subsidy</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ELIGIBLE
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Direct 30% credit subsidy on tool kits and diagnostic equipment for certified hardware technicians.
            </p>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          Up-skilling MicroVouchers & Milestone Rewards
        </h3>

        <div className="space-y-3">
          {incentives.map((item) => {
            const isUnlocked = item.status === 'unlocked' || item.status === 'claimed';
            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isUnlocked
                    ? 'bg-slate-900/80 border-slate-700 hover:border-brand-500/50'
                    : 'bg-slate-950/40 border-slate-800 opacity-70'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2.5 rounded-xl mt-0.5 ${
                      isUnlocked
                        ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isUnlocked ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-200">{item.title}</h4>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Trigger: {item.trigger_event}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{item.description}</p>
                    {isUnlocked && item.redemption_code && (
                      <div className="inline-block mt-1 font-mono text-xs text-brand-300 bg-brand-500/10 px-2.5 py-1 rounded border border-brand-500/20">
                        Code: {item.redemption_code}
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-full sm:w-auto text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border inline-flex items-center gap-1 ${
                      isUnlocked
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-500 border-slate-700'
                    }`}
                  >
                    {isUnlocked ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    {item.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
