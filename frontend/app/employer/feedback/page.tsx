'use client';

import React from 'react';
import { EmployerFeedbackForm } from '@/components/employer/EmployerFeedbackForm';
import { Building2, MessageSquarePlus } from 'lucide-react';

export default function EmployerFeedbackPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-md mb-2">
            <MessageSquarePlus className="w-3.5 h-3.5" /> SkillBridge Feedback Submission
          </div>
          <h1 className="text-2xl font-extrabold text-white">Candidate Skill & Performance Evaluation</h1>
          <p className="text-xs text-slate-400 mt-1">
            Protected employer feedback portal for evaluating hired candidates and signaling sector skill gaps.
          </p>
        </div>
      </div>

      <EmployerFeedbackForm />
    </div>
  );
}
