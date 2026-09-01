'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { Role, TraineeType } from '@/lib/types';
import {
  ShieldCheck,
  UserCheck,
  Building2,
  Lock,
  ArrowRight,
  Briefcase,
  Store
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginAsRole, giveConsent } = useAuth();

  const [selectedRole, setSelectedRole] = useState<Role>('trainee');
  const [traineeType, setTraineeType] = useState<TraineeType>('formal');
  const [vidInput, setVidInput] = useState<string>('9823-4412-8801');
  const [employerName, setEmployerName] = useState<string>('Apex Micro-Electronics Pvt Ltd');
  const [officerId, setOfficerId] = useState<string>('OFF-77201 (Patna District)');
  const [consentChecked, setConsentChecked] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const formatVid = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 12);
    const parts = [];
    for (let i = 0; i < digits.length; i += 4) {
      parts.push(digits.slice(i, i + 4));
    }
    return parts.join('-');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedRole === 'trainee') {
      const rawDigits = vidInput.replace(/\D/g, '');
      if (rawDigits.length !== 12) {
        setError('Please enter a valid 12-digit Aadhaar Virtual ID (VID)');
        return;
      }
      if (!consentChecked) {
        setError('Please accept the consent terms to proceed');
        return;
      }
      await loginAsRole('trainee', { vid: vidInput, traineeType });
      giveConsent();
      router.push('/trainee');
    } else if (selectedRole === 'employer') {
      if (!employerName.trim()) {
        setError('Please enter your company name');
        return;
      }
      await loginAsRole('employer', { name: employerName });
      router.push('/employer');
    } else if (selectedRole === 'officer') {
      await loginAsRole('officer', { name: officerId });
      router.push('/officer');
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      {/* Header Branding */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 text-white shadow-xl mb-4">
          <ShieldCheck className="w-10 h-10 stroke-[2.5]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Lifelong Livelihood Support Platform
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto font-medium">
          Role-Based Access Control Authentication (PS 26135)
        </p>
      </div>

      <div className="dash-card p-6 sm:p-8 bg-white border border-slate-300 shadow-md space-y-6">
        {/* Role Selector Tabs */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block text-center">
            Select Authentication Access Role
          </label>
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 border border-slate-300 rounded-xl">
            <button
              type="button"
              onClick={() => setSelectedRole('trainee')}
              className={`py-2.5 px-2 rounded-lg text-xs font-extrabold transition-all flex flex-col items-center gap-1 ${
                selectedRole === 'trainee'
                  ? 'bg-slate-900 text-white shadow'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Trainee
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('employer')}
              className={`py-2.5 px-2 rounded-lg text-xs font-extrabold transition-all flex flex-col items-center gap-1 ${
                selectedRole === 'employer'
                  ? 'bg-slate-900 text-white shadow'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Employer
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('officer')}
              className={`py-2.5 px-2 rounded-lg text-xs font-extrabold transition-all flex flex-col items-center gap-1 ${
                selectedRole === 'officer'
                  ? 'bg-slate-900 text-white shadow'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <Lock className="w-4 h-4" />
              District Officer
            </button>
          </div>
        </div>

        {/* Dynamic Form per Selected Role */}
        <form onSubmit={handleLogin} className="space-y-5">
          {selectedRole === 'trainee' && (
            <>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-md">
                  <Lock className="w-3.5 h-3.5" /> Layer 2 Trainee Login
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">Trainee Aadhaar VID Authentication</h2>
                <p className="text-xs text-slate-600">
                  Select your trainee sector classification and enter your 12-digit Aadhaar Virtual ID.
                </p>
              </div>

              {/* Trainee Sub-Type Selection (Formal vs Informal) */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-slate-800 block">Select Trainee Employment Sector Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTraineeType('formal')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2 transition-all ${
                      traineeType === 'formal'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-sm ring-2 ring-indigo-500/20'
                        : 'border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${traineeType === 'formal' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-extrabold">Formal Trainee</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal leading-tight">
                      Salaried job, formal payslips, corporate placement & wage contracts.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTraineeType('informal')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2 transition-all ${
                      traineeType === 'informal'
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 shadow-sm ring-2 ring-emerald-500/20'
                        : 'border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${traineeType === 'informal' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                        <Store className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-extrabold">Informal Trainee</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal leading-tight">
                      Self-employed, micro-enterprise, UPI QR earnings & geotagged proof.
                    </p>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">12-Digit Virtual ID (VID)</label>
                <input
                  type="text"
                  value={vidInput}
                  onChange={(e) => setVidInput(formatVid(e.target.value))}
                  placeholder="9823-4412-8801"
                  maxLength={14}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-slate-900 rounded-xl px-4 py-3 text-base text-slate-900 font-mono font-bold tracking-wider focus:outline-none transition-all"
                />
              </div>

              <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-slate-900 rounded"
                />
                <span className="text-xs text-slate-800 font-medium">
                  I consent to sharing periodic employment retention status in exchange for Verified Skill Passport credentials and loan priority access.
                </span>
              </label>
            </>
          )}

          {selectedRole === 'employer' && (
            <>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-md">
                  <Building2 className="w-3.5 h-3.5" /> SkillBridge Employer Authentication
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">Employer Portal Login</h2>
                <p className="text-xs text-slate-600">
                  Access employer candidate skill-matching and performance feedback forms.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">Registered Employer / Company Name</label>
                <input
                  type="text"
                  value={employerName}
                  onChange={(e) => setEmployerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-slate-900 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:outline-none"
                  required
                />
              </div>
            </>
          )}

          {selectedRole === 'officer' && (
            <>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-md">
                  <Lock className="w-3.5 h-3.5" /> SentinelAI District Officer Access
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">District Officer Authentication</h2>
                <p className="text-xs text-slate-600">
                  Review fraud flag anomaly queues, Skill Bridge analytics, and Training Center reports.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">District Officer ID / Credential</label>
                <input
                  type="text"
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-slate-900 rounded-xl px-4 py-3 text-sm text-slate-900 font-mono font-bold focus:outline-none"
                  required
                />
              </div>
            </>
          )}

          {error && <p className="text-xs font-bold text-rose-600">{error}</p>}

          <button
            type="submit"
            className="w-full py-3.5 px-4 font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow flex items-center justify-center gap-2 transition-all"
          >
            Authenticate as {selectedRole === 'trainee' ? `${traineeType.toUpperCase()} TRAINEE` : selectedRole.toUpperCase()} <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

