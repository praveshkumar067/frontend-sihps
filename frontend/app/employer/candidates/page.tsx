'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { CandidateTrainee } from '@/lib/types';
import {
  Building2,
  Users,
  Search,
  CheckCircle2,
  Phone,
  Briefcase,
  Store,
  Filter,
  Award,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';

const PRESET_SKILLS = [
  'Micro-soldering',
  'PCB Diagnostics',
  'Circuit Testing',
  'Quality Control',
  'Wiring & Safety',
  'Solar Panel Installation',
  'Data Entry Speed',
  'Excel Formulas',
  'Diagnostic Scanners',
  'EV Engine Maintenance',
  'Automated Looms',
  'Soft Skills'
];

export default function EmployerCandidatesPage() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Micro-soldering', 'Quality Control']);
  const [districtFilter, setDistrictFilter] = useState<string>('All');
  const [candidates, setCandidates] = useState<CandidateTrainee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [contactedId, setContactedId] = useState<string | null>(null);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const data = await api.getSkillMatchingCandidates(selectedSkills);
      setCandidates(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCandidates();
  };

  const filteredCandidates = districtFilter === 'All'
    ? candidates
    : candidates.filter(c => c.district === districtFilter);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="dash-card p-6 bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md mb-2">
            <Building2 className="w-3.5 h-3.5" /> SkillBridge Employer Module (Role: Employer)
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Skill-Matched Trainee Talent Discovery</h1>
          <p className="text-xs text-slate-500 mt-1">
            Specify your required job skills to instantly search verified trainees trained in Bihar government centers.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono">
          <Users className="w-4 h-4 text-emerald-600" />
          <span className="text-slate-700">Candidates Found: <strong className="text-slate-900">{filteredCandidates.length}</strong></span>
        </div>
      </div>

      {/* Skill Selection Form (Interactive Chip Selector) */}
      <div className="dash-card p-6 bg-white border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">Select Required Skills for Candidate Matching</h3>
            <p className="text-xs text-slate-500">Click skill chips to filter candidates with matching certified competencies.</p>
          </div>
          {selectedSkills.length > 0 && (
            <button
              onClick={() => { setSelectedSkills([]); fetchCandidates(); }}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Clear Selected ({selectedSkills.length})
            </button>
          )}
        </div>

        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {PRESET_SKILLS.map((skill) => {
              const isSelected = selectedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                  }`}
                >
                  {isSelected ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
                  {skill}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-slate-600 font-semibold">Filter by District:</span>
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-900 font-semibold px-3 py-1.5 rounded-lg focus:outline-none"
              >
                <option value="All">All Districts</option>
                <option value="Patna">Patna</option>
                <option value="Gaya">Gaya</option>
                <option value="Muzaffarpur">Muzaffarpur</option>
                <option value="Bhagalpur">Bhagalpur</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2 transition-all"
            >
              <Search className="w-4 h-4 text-emerald-400" />
              {loading ? 'Searching...' : 'Find Matching Trainees'}
            </button>
          </div>
        </form>
      </div>

      {/* Trainees List Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-600" />
          Verified Trainee Talent Pool ({filteredCandidates.length})
        </h3>

        {filteredCandidates.length === 0 ? (
          <div className="dash-card p-12 text-center bg-white border border-slate-200 space-y-3">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-700">No Candidates Match Selected Skills</h4>
            <p className="text-xs text-slate-500">Try selecting different skill chips or clear district filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCandidates.map((cand) => (
              <div
                key={cand.id}
                className="dash-card p-5 bg-white border border-slate-200 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-extrabold text-slate-900">{cand.name}</h4>
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                          cand.trainee_type === 'formal'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {cand.trainee_type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        District: <strong className="text-slate-800">{cand.district}</strong> • Center: <strong className="text-slate-800">{cand.training_center}</strong>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Tier {cand.trust_tier} Verified
                      </span>
                    </div>
                  </div>

                  {/* Skills Chips */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Certified Competencies:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {cand.skills.map((sk) => {
                        const isMatch = selectedSkills.some(s => sk.toLowerCase().includes(s.toLowerCase()));
                        return (
                          <span
                            key={sk}
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                              isMatch
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {sk}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <div className="text-slate-500 font-mono">
                    Availability: <strong className="text-slate-800">{cand.availability}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    {contactedId === cand.id ? (
                      <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-xl font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Request Sent!
                      </span>
                    ) : (
                      <button
                        onClick={() => setContactedId(cand.id)}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" /> Contact Trainee
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
