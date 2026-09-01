'use client';

import React, { useState } from 'react';
import { SentinelFlaggedClaim } from '@/lib/types';
import { CheckCircle2, XCircle, HelpCircle, X } from 'lucide-react';

interface OfficerActionModalProps {
  claim: SentinelFlaggedClaim;
  actionType: 'approved' | 'rejected' | 'more_info_requested';
  onClose: () => void;
  onConfirm: (claimId: string, action: 'approved' | 'rejected' | 'more_info_requested', notes: string) => void;
}

export const OfficerActionModal: React.FC<OfficerActionModalProps> = ({
  claim,
  actionType,
  onClose,
  onConfirm
}) => {
  const [notes, setNotes] = useState<string>('');

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(claim.claim_id, actionType, notes);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 border border-slate-200 shadow-2xl relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-xl ${
              actionType === 'approved'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                : actionType === 'rejected'
                ? 'bg-rose-50 text-rose-700 border border-rose-300'
                : 'bg-amber-50 text-amber-700 border border-amber-300'
            }`}
          >
            {actionType === 'approved' && <CheckCircle2 className="w-6 h-6" />}
            {actionType === 'rejected' && <XCircle className="w-6 h-6" />}
            {actionType === 'more_info_requested' && <HelpCircle className="w-6 h-6" />}
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700">SentinelAI Audit</span>
            <h3 className="text-lg font-bold text-slate-900 capitalize">
              Confirm {actionType.replace('_', ' ')}
            </h3>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
          <div className="flex justify-between text-slate-800 font-mono">
            <span>Claim ID: {claim.claim_id}</span>
            <span>Trainee: {claim.trainee_name}</span>
          </div>
          <p className="text-slate-600">Flag Reason: <strong className="text-rose-700">{claim.flag_reason}</strong></p>
        </div>

        <form onSubmit={handleConfirm} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              District Officer Justification / Audit Notes (Required)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
              rows={3}
              placeholder="Enter official audit remarks before recording decision..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 py-2.5 font-bold text-xs rounded-xl shadow transition-all ${
                actionType === 'approved'
                  ? 'bg-slate-900 hover:bg-slate-800 text-white'
                  : actionType === 'rejected'
                  ? 'bg-slate-900 hover:bg-slate-800 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              Confirm Action
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
