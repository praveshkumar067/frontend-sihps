'use client';

import React, { useState, useEffect } from 'react';
import { CheckInOutcome, EmploymentStatus } from '@/lib/types';
import { CalendarCheck, Clock, ArrowRight, MessageSquare, X } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/context/AuthContext';

interface NextCheckinCardProps {
  checkin: CheckInOutcome;
  onSubmitted: () => void;
}

export const NextCheckinCard: React.FC<NextCheckinCardProps> = ({ checkin, onSubmitted }) => {
  const { user } = useAuth();
  const traineeType = user?.trainee_type || user?.traineeProfile?.trainee_type || 'formal';

  const defaultStatus: EmploymentStatus = traineeType === 'informal' ? 'self-employed' : 'employed';
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [employmentStatus, setEmploymentStatus] = useState<EmploymentStatus>(defaultStatus);
  const [employerName, setEmployerName] = useState<string>('Apex Micro-Electronics');
  const [designation, setDesignation] = useState<string>('Technician');
  const [salary, setSalary] = useState<number>(18500);
  const [businessType, setBusinessType] = useState<string>('Electronics Repair Shop');
  const [courseName, setCourseName] = useState<string>('Advanced EV Assembly');
  const [unemployedReason, setUnemployedReason] = useState<string>('Actively applying');
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    setEmploymentStatus(traineeType === 'informal' ? 'self-employed' : 'employed');
  }, [traineeType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.submitCheckIn({
        trainee_id: checkin.trainee_id,
        milestone_days: checkin.milestone_days,
        employment_status: employmentStatus,
        outcome_path: {
          employer_name: employmentStatus === 'employed' ? employerName : undefined,
          designation: employmentStatus === 'employed' ? designation : undefined,
          monthly_salary_inr: employmentStatus === 'employed' ? salary : undefined,
          business_type: employmentStatus === 'self-employed' ? businessType : undefined,
          course_name: employmentStatus === 'further-training' ? courseName : undefined,
          unemployed_reason: employmentStatus === 'unemployed' ? unemployedReason : undefined,
        }
      });
      setIsOpen(false);
      onSubmitted();
    } catch (err) {
      console.error('Checkin submission error', err);
    } finally {
      setSubmitting(false);
    }
  };

  const statusOptions = traineeType === 'formal'
    ? [
        { id: 'employed', label: '💼 Salaried Employment (Formal)' },
        { id: 'unemployed', label: '🔍 Job Seeking' },
        { id: 'further-training', label: '🎓 Further Education' },
      ]
    : [
        { id: 'self-employed', label: '🏪 Self-Employed / Gig Worker' },
        { id: 'unemployed', label: '🔍 Seeking Enterprise Support' },
        { id: 'further-training', label: '🎓 Skill Upgrade Training' },
      ];

  return (
    <>
      <div className="dash-card p-6 bg-white border border-slate-200 relative overflow-hidden space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {checkin.milestone_days}-Day Milestone Check-in
              </span>
              <span className="text-xs text-slate-500 font-mono">Due: {checkin.due_date}</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {checkin.milestone_days}-Day Livelihood Status Verification
            </h3>
            <p className="text-xs text-slate-600">
              Submit your current employment updates to maintain Verified Skill Passport status & unlock rewards.
            </p>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow flex items-center justify-center gap-2 transition-all"
          >
            <CalendarCheck className="w-4 h-4" /> Start Check-in <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Prefer WhatsApp? <strong>WhatsApp Bot fallback active</strong></span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">POST /api/module2/outcome</span>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 border border-slate-200 shadow-2xl relative space-y-5">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700">StayConnect Flow</span>
              <h2 className="text-xl font-bold text-slate-900">Submit {checkin.milestone_days}-Day Check-in</h2>
              <p className="text-xs text-slate-500">Select your current employment status as of today.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Employment Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status.id}
                      type="button"
                      onClick={() => setEmploymentStatus(status.id as EmploymentStatus)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                        employmentStatus === status.id
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {employmentStatus === 'employed' && (
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Employer Name</label>
                    <input
                      type="text"
                      value={employerName}
                      onChange={(e) => setEmployerName(e.target.value)}
                      required
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-700">Designation</label>
                      <input
                        type="text"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        required
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-700">Monthly Salary (₹ INR)</label>
                      <input
                        type="number"
                        value={salary}
                        onChange={(e) => setSalary(Number(e.target.value))}
                        required
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {employmentStatus === 'self-employed' && (
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Business / Venture Type</label>
                    <input
                      type="text"
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      required
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {employmentStatus === 'further-training' && (
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Advanced Course Name</label>
                    <input
                      type="text"
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                      required
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {employmentStatus === 'unemployed' && (
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">Primary Seeking Reason / Skill Needed</label>
                    <input
                      type="text"
                      value={unemployedReason}
                      onChange={(e) => setUnemployedReason(e.target.value)}
                      required
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2"
              >
                {submitting ? 'Submitting...' : 'Confirm & Complete Check-in'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
