'use client';

import React from 'react';
import { CheckInOutcome } from '@/lib/types';
import { CheckCircle2, Clock, AlertCircle, MessageSquare, Building2, Briefcase } from 'lucide-react';

interface CheckInHistoryProps {
  checkins: CheckInOutcome[];
}

export const CheckInHistory: React.FC<CheckInHistoryProps> = ({ checkins }) => {
  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Check-in Timeline History</h3>
          <p className="text-xs text-slate-400">Vertical outcome progression across 30, 90, 180, and 365-day milestones</p>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          WhatsApp Sync Active
        </span>
      </div>

      <div className="relative pl-6 space-y-8 timeline-line">
        {checkins.map((chk) => {
          const isDone = chk.status === 'done';
          const isPending = chk.status === 'pending';
          const isOverdue = chk.status === 'overdue';

          return (
            <div key={chk.id} className="relative group">
              {/* Milestone Circle Icon */}
              <div
                className={`absolute -left-[31px] top-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-transform group-hover:scale-110 ${
                  isDone
                    ? 'bg-brand-600 border-brand-400 text-white shadow-md shadow-brand-500/30'
                    : isOverdue
                    ? 'bg-slate-900 border-rose-400 text-white'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isOverdue ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <span>{chk.milestone_days}d</span>
                )}
              </div>

              {/* Content Card */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-200">
                      {chk.milestone_days}-Day Milestone Outcome
                    </h4>
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        isDone
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : isOverdue
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {chk.status}
                    </span>
                  </div>

                  <span className="text-xs text-slate-400 font-mono">
                    {isDone ? `Submitted: ${chk.checkin_date}` : `Due: ${chk.due_date}`}
                  </span>
                </div>

                {isDone && chk.outcome_path && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {chk.outcome_path.employer_name && (
                      <div className="flex items-center gap-2 text-slate-300">
                        <Building2 className="w-3.5 h-3.5 text-brand-400" />
                        <span>Employer: <strong className="text-white">{chk.outcome_path.employer_name}</strong></span>
                      </div>
                    )}
                    {chk.outcome_path.monthly_salary_inr && (
                      <div className="flex items-center gap-2 text-slate-300">
                        <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Salary: <strong className="text-white">₹{chk.outcome_path.monthly_salary_inr.toLocaleString()}/mo</strong></span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-slate-400 col-span-full">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                      <span>Source: Verified via {chk.submitted_via === 'whatsapp' ? 'WhatsApp Bot' : 'Web Dashboard'}</span>
                    </div>
                  </div>
                )}

                {isPending && (
                  <p className="text-xs text-slate-400 mt-1">
                    Pending submission. Complete this check-in to advance your Trust Tier level.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
