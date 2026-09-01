'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { TrainingCenterPerformance } from '@/lib/types';
import {
  Award,
  Filter,
  Download,
  Building2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Users,
  Search,
  Star,
  MessageSquare,
  DollarSign
} from 'lucide-react';

export default function OfficerCenterPerformancePage() {
  const [centers, setCenters] = useState<TrainingCenterPerformance[]>([]);
  const [districtFilter, setDistrictFilter] = useState<string>('All');
  const [ratingFilter, setRatingFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const data = await api.getTrainingCenterPerformance();
        setCenters(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCenters();
  }, []);

  const filteredCenters = centers.filter(c => {
    const matchesDistrict = districtFilter === 'All' || c.district === districtFilter;
    const matchesRating = ratingFilter === 'All' || c.performance_rating === ratingFilter;
    const matchesSearch = c.center_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.sector.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDistrict && matchesRating && matchesSearch;
  });

  const avgSatisfaction = Math.round(centers.reduce((acc, c) => acc + c.trainee_satisfaction_score, 0) / (centers.length || 1));
  const avgPlacement = Math.round(centers.reduce((acc, c) => acc + c.placement_rate, 0) / (centers.length || 1));
  const avgRetention = Math.round(centers.reduce((acc, c) => acc + c.retention_180_rate, 0) / (centers.length || 1));
  const totalAuditFlags = centers.reduce((acc, c) => acc + c.sentinel_flags_count, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="dash-card p-6 bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-md mb-2">
            <Award className="w-3.5 h-3.5" /> District Officer Analytics & Compliance (Role: Officer)
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Training Center Performance & Trainee Feedback Report</h1>
          <p className="text-xs text-slate-500 mt-1">
            Evaluating training centers based on trainee survey satisfaction, 180-day retention outcomes, and fraud audit flags.
          </p>
        </div>

        <button className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 shrink-0 transition-colors">
          <Download className="w-4 h-4 text-purple-400" /> Export Center Report (CSV)
        </button>
      </div>

      {/* 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="dash-card p-4 flex items-center gap-3.5 bg-white">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Avg Trainee Satisfaction</span>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">{avgSatisfaction}%</div>
            <span className="text-[10px] text-emerald-600 font-bold">Based on post-checkin surveys</span>
          </div>
        </div>

        <div className="dash-card p-4 flex items-center gap-3.5 bg-white">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">180-Day Retention Avg</span>
            <div className="text-2xl font-extrabold text-blue-700 font-mono">{avgRetention}%</div>
            <span className="text-[10px] text-slate-500">Verified outcomes</span>
          </div>
        </div>

        <div className="dash-card p-4 flex items-center gap-3.5 bg-white">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Average Placement Rate</span>
            <div className="text-2xl font-extrabold text-emerald-700 font-mono">{avgPlacement}%</div>
            <span className="text-[10px] text-emerald-600 font-bold">Above state threshold</span>
          </div>
        </div>

        <div className="dash-card p-4 flex items-center gap-3.5 bg-white">
          <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Sentinel Audit Flags</span>
            <div className="text-2xl font-extrabold text-rose-700 font-mono">{totalAuditFlags} Flags</div>
            <span className="text-[10px] text-rose-600 font-bold">Requires officer audit</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="dash-card p-4 bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px] bg-slate-50 border border-slate-300 px-3 py-2 rounded-xl">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search training center name, district, or sector..."
            className="bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none w-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 px-3 py-2 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-600 font-medium">District:</span>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="bg-transparent text-slate-900 font-semibold focus:outline-none"
            >
              <option value="All">All Districts</option>
              <option value="Patna">Patna</option>
              <option value="Gaya">Gaya</option>
              <option value="Muzaffarpur">Muzaffarpur</option>
              <option value="Bhagalpur">Bhagalpur</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 px-3 py-2 rounded-xl">
            <span className="text-slate-600 font-medium">Rating:</span>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="bg-transparent text-slate-900 font-semibold focus:outline-none"
            >
              <option value="All">All Performance Levels</option>
              <option value="Top Performing">Top Performing</option>
              <option value="High Retention">High Retention</option>
              <option value="Satisfactory">Satisfactory</option>
              <option value="Needs Review">Needs Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* Centers Directory & Trainee Reports Table */}
      <div className="space-y-4">
        {filteredCenters.map((center, index) => {
          const isTop = center.performance_rating === 'Top Performing';
          const isNeedsReview = center.performance_rating === 'Needs Review';
          return (
            <div
              key={center.center_id}
              className={`dash-card p-6 bg-white border ${
                isNeedsReview ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
              } space-y-4`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                    isTop
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : isNeedsReview
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'bg-slate-100 text-slate-800 border border-slate-300'
                  }`}>
                    #{index + 1}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-extrabold text-slate-900">{center.center_name}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${
                        isTop
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : isNeedsReview
                          ? 'bg-rose-50 text-rose-800 border-rose-300'
                          : 'bg-indigo-50 text-indigo-800 border-indigo-300'
                      }`}>
                        {isTop ? '🏆 Top Performing' : isNeedsReview ? '⚠️ Audit Required' : center.performance_rating}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      District: <strong className="text-slate-800">{center.district}</strong> • Sector: <strong className="text-slate-800">{center.sector}</strong> • Total Trainees: <strong className="text-slate-800">{center.total_trainees}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Trainee Satisfaction</span>
                    <strong className="text-base text-purple-700 font-extrabold">{center.trainee_satisfaction_score}%</strong>
                  </div>
                  <div className="text-right border-l border-slate-200 pl-4">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">180d Retention</span>
                    <strong className="text-base text-emerald-700 font-extrabold">{center.retention_180_rate}%</strong>
                  </div>
                  <div className="text-right border-l border-slate-200 pl-4">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Avg Salary</span>
                    <strong className="text-base text-slate-900 font-extrabold">₹{center.avg_starting_salary_inr.toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              {/* Trainee Feedback Report Summary */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-indigo-600" />
                    Trainee Feedback & Report Summary
                  </span>
                  <span className={`font-mono text-[11px] font-bold ${center.sentinel_flags_count > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    Sentinel Anomaly Flags: {center.sentinel_flags_count}
                  </span>
                </div>
                <p className="text-slate-700 italic">
                  "{center.trainee_feedback_summary}"
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
