'use client';

import React, { useState } from 'react';
import { Building2, Send, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';

export const EmployerFeedbackForm: React.FC<{ onSubmitted?: () => void }> = ({ onSubmitted }) => {
  const [employerName, setEmployerName] = useState<string>('Apex Micro-Electronics Ltd');
  const [rating, setRating] = useState<'Excellent' | 'Good' | 'Satisfactory' | 'Needs Improvement'>('Excellent');
  const [selectedGaps, setSelectedGaps] = useState<string[]>(['Soft Skills', 'Micro-soldering']);
  const [comments, setComments] = useState<string>('Great practical dexterity, slightly needs improvement in punctuality on morning shifts.');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const AVAILABLE_GAPS = [
    'Soft Skills',
    'Micro-soldering',
    'Circuit Diagnostics',
    'Punctuality & Discipline',
    'English Communication',
    'Tool Handling & Safety',
    'Documentation & Reporting'
  ];

  const toggleGap = (gap: string) => {
    if (selectedGaps.includes(gap)) {
      setSelectedGaps(selectedGaps.filter(g => g !== gap));
    } else {
      setSelectedGaps([...selectedGaps, gap]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.submitEmployerFeedback({
        employer_name: employerName,
        performance_rating: rating,
        skill_gaps: selectedGaps,
        comments
      });
      setSubmitted(true);
      if (onSubmitted) onSubmitted();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dash-card p-6 bg-white border border-slate-200 space-y-6">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md">
          <Building2 className="w-3.5 h-3.5" /> SkillBridge Employer Feedback
        </div>
        <h3 className="text-xl font-extrabold text-slate-900">Trainee Performance Rating & Skill Gap Feedback</h3>
        <p className="text-xs text-slate-500">
          Simulating WhatsApp interactive quick-buttons for employer performance rating and skill gap reporting.
        </p>
      </div>

      {submitted ? (
        <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h4 className="text-lg font-bold text-slate-900">Feedback Successfully Recorded!</h4>
          <p className="text-xs text-slate-600">
            Thank you for validating trainee outcomes. Your feedback updates the District Skill Gap Heatmap.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-300"
          >
            Submit Another Feedback
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Employer / Company Name</label>
            <input
              type="text"
              value={employerName}
              onChange={(e) => setEmployerName(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">
              Trainee Performance Rating (Interactive Buttons)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Excellent', 'Good', 'Satisfactory', 'Needs Improvement'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRating(r)}
                  className={`py-3 px-2 rounded-xl text-xs font-bold border text-center transition-all ${
                    rating === r
                      ? r === 'Excellent'
                        ? 'bg-slate-900 border-slate-800 text-white shadow'
                        : r === 'Good'
                        ? 'bg-slate-900 border-slate-800 text-white shadow'
                        : r === 'Satisfactory'
                        ? 'bg-slate-900 border-amber-700 text-white shadow'
                        : 'bg-slate-900 border-slate-800 text-white shadow'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {r === 'Excellent' && '🌟 '}
                  {r === 'Good' && '👍 '}
                  {r === 'Satisfactory' && '👌 '}
                  {r === 'Needs Improvement' && '⚠️ '}
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">
              Identify Observed Skill Gaps (Multi-select Chips)
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_GAPS.map((gap) => {
                const isSelected = selectedGaps.includes(gap);
                return (
                  <button
                    key={gap}
                    type="button"
                    onClick={() => toggleGap(gap)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {gap}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Additional Remarks (Optional)</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Submitting...' : 'Submit Employer Feedback (POST /api/module4/employer_feedback)'}
          </button>
        </form>
      )}
    </div>
  );
};
