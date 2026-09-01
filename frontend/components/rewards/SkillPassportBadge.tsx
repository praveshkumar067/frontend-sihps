'use client';

import React, { useState } from 'react';
import { TraineeProfile } from '@/lib/types';
import { Award, ShieldCheck, Share2, QrCode, ExternalLink, X, CheckCircle2 } from 'lucide-react';

interface SkillPassportBadgeProps {
  trainee: TraineeProfile;
}

export const SkillPassportBadge: React.FC<SkillPassportBadgeProps> = ({ trainee }) => {
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const shareUrl = `https://livelihood.gov.in/verify/passport/${trainee.trainee_id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="dash-card p-6 bg-white border border-slate-200 relative overflow-hidden space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/20">
              <Award className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-700">
                  State Certified Digital Credentials
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-300 px-2 py-0.5 rounded-full font-bold">
                  VERIFIED
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">Verified Digital Skill Passport</h2>
            </div>
          </div>

          <button
            onClick={() => setShowShareModal(true)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition-all"
          >
            <Share2 className="w-4 h-4" /> Share Passport Badge
          </button>
        </div>

        {/* Digital Passport Card */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900">{trainee.full_name}</h3>
              <p className="text-xs text-slate-500 font-mono">Trainee ID: {trainee.trainee_id} • District: {trainee.district}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-700 font-mono">Trust Tier {trainee.trust_tier}</span>
              <p className="text-[10px] text-slate-500">Issued by Bihar Skill Development Mission</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white border border-slate-200">
              <span className="text-slate-500 text-[10px] font-medium uppercase tracking-wider block">Certified Sector</span>
              <strong className="text-slate-900">{trainee.sector}</strong>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200">
              <span className="text-slate-500 text-[10px] font-medium uppercase tracking-wider block">Completion Date</span>
              <strong className="text-slate-900">{trainee.completion_date}</strong>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200">
              <span className="text-slate-500 text-[10px] font-medium uppercase tracking-wider block">Training Institute</span>
              <strong className="text-slate-900 truncate block">{trainee.training_center}</strong>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Tamper-proof Cryptographic Verification Active
            </span>
            <span className="font-mono text-slate-500">VID: {trainee.vid.slice(0, 4)}-XXXX-XXXX</span>
          </div>
        </div>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 border border-slate-200 shadow-2xl relative space-y-5">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-700">Passport Sharing</span>
              <h3 className="text-lg font-bold text-slate-900">Share Your Verified Skill Credential</h3>
              <p className="text-xs text-slate-500">Share with prospective employers via WhatsApp, LinkedIn, or QR code.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-3">
              <div className="w-24 h-24 bg-white p-2 rounded-xl border border-slate-300 mx-auto flex items-center justify-center">
                <QrCode className="w-20 h-20 text-slate-900" />
              </div>
              <p className="text-[11px] text-slate-600 font-mono">{shareUrl}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCopy}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                {copied ? 'Link Copied!' : 'Copy Verification Link'}
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Check out my Verified Skill Passport on the Lifelong Livelihood Platform: ${shareUrl}`)}`}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5 text-center"
              >
                <ExternalLink className="w-4 h-4" /> Share on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
