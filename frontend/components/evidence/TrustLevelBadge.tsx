'use client';

import React from 'react';
import { ShieldCheck, Award, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface TrustLevelBadgeProps {
  currentTier: number; // 0 to 5 scale
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

const TIER_DESCRIPTIONS: Record<number, { title: string; desc: string; nextRequirement: string }> = {
  0: {
    title: 'Tier 0: Self-Declared',
    desc: 'Basic trainee profile declared without supporting document proof.',
    nextRequirement: 'Upload an offer letter or job joining letter to reach Tier 1.'
  },
  1: {
    title: 'Tier 1: Document Uploaded',
    desc: 'Offer letter or basic joining document submitted.',
    nextRequirement: 'Upload your first month salary pay slip or bank statement to reach Tier 2.'
  },
  2: {
    title: 'Tier 2: Employer Confirmed',
    desc: 'Employer feedback rating submitted or offer letter validated.',
    nextRequirement: 'Submit 30-day salary evidence to reach Tier 3.'
  },
  3: {
    title: 'Tier 3: Income & Salary Verified',
    desc: 'Pay slip and outcome salary verified against state guidelines.',
    nextRequirement: 'Maintain 90-day retention & multi-source evidence for Tier 4.'
  },
  4: {
    title: 'Tier 4: Multi-Source Verified',
    desc: 'Verified by employer rating, salary slip, and cross-center check.',
    nextRequirement: 'Complete 180-day retention milestone for Tier 5 Full Status.'
  },
  5: {
    title: 'Tier 5: Fully Verified Gold Standard',
    desc: 'Highest trust level achieved! Maximum scheme priority access and instant loan clearance.',
    nextRequirement: 'You have reached the maximum trust tier!'
  }
};

export const TrustLevelBadge: React.FC<TrustLevelBadgeProps> = ({ currentTier, verificationStatus }) => {
  const current = TIER_DESCRIPTIONS[currentTier] || TIER_DESCRIPTIONS[0];
  const progressPercent = Math.min(100, Math.max(0, (currentTier / 5) * 100));

  return (
    <div className="dash-card p-6 bg-white border border-slate-200 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow">
            <Award className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">TrustLevel Scale</span>
            <h3 className="text-lg font-bold text-slate-900">Trust Tier {currentTier} of 5</h3>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1 ${
            verificationStatus === 'verified'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
              : verificationStatus === 'pending'
              ? 'bg-amber-50 text-amber-700 border-amber-300'
              : 'bg-rose-50 text-rose-700 border-rose-300'
          }`}
        >
          {verificationStatus === 'verified' && <CheckCircle2 className="w-3.5 h-3.5" />}
          {verificationStatus === 'pending' && <AlertCircle className="w-3.5 h-3.5" />}
          Status: {verificationStatus}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-500 font-semibold">
          <span>Tier 0 (Self)</span>
          <span>Tier 3 (Salary Verified)</span>
          <span>Tier 5 (Gold)</span>
        </div>

        <div className="relative w-full h-3 bg-slate-100 rounded-full border border-slate-200 p-0.5">
          <div
            className="h-full bg-slate-900 rounded-full transition-all duration-500 shadow"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="grid grid-cols-6 gap-1 pt-1 text-center">
          {[0, 1, 2, 3, 4, 5].map((tierNum) => {
            const isActive = tierNum <= currentTier;
            return (
              <div
                key={tierNum}
                className={`py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}
              >
                T{tierNum}
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          {current.title}
        </div>
        <p className="text-xs text-slate-600">{current.desc}</p>
        {currentTier < 5 && (
          <div className="pt-2 border-t border-slate-200 flex items-start gap-2 text-xs text-emerald-700 font-medium">
            <ArrowUpRight className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Next Step:</strong> {current.nextRequirement}</span>
          </div>
        )}
      </div>
    </div>
  );
};
