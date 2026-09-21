'use client';

import React from 'react';
import { EmployerFeedbackForm } from '@/components/employer/EmployerFeedbackForm';
import { Building2 } from 'lucide-react';

export default function EmployerHomePage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-md mb-2">
            <Building2 className="w-3.5 h-3.5" /> SkillBridge Module (Role: Employer Protected)
          </div>
          <h1 className="text-2xl font-extrabold text-white">Employer Performance Rating & Feedback Portal</h1>
          <p className="text-xs text-slate-400 mt-1">
            Authenticated employer feedback submission updating district skill gap distributions.
          </p>
        </div>
      </div>

      <EmployerFeedbackForm />
    </div>
  );
}
