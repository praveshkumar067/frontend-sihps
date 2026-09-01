'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { api } from '@/lib/api';
import { CheckInOutcome } from '@/lib/types';
import { NextCheckinCard } from '@/components/checkins/NextCheckinCard';
import { TrustLevelBadge } from '@/components/evidence/TrustLevelBadge';
import {
  UserCheck,
  CalendarCheck,
  FileCheck,
  Wallet,
  Gift,
  ArrowRight,
  Award,
  TrendingUp,
  Filter,
  Search,
  Download,
  Eye,
  MoreVertical,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function TraineeHomePage() {
  const { user } = useAuth();
  const [checkins, setCheckins] = useState<CheckInOutcome[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedMilestone, setSelectedMilestone] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const trainee = user?.traineeProfile;

  const loadData = async () => {
    if (!trainee) return;
    try {
      const data = await api.getCheckIns(trainee.trainee_id);
      setCheckins(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  if (!trainee) return null;

  const activeCheckin = checkins.find(c => c.status === 'pending') || checkins[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & Welcome Card */}
      <div className="dash-card p-6 bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-indigo-600/20 shrink-0">
            <UserCheck className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                {trainee.sector}
              </span>
              <span className={`text-xs font-extrabold px-2 py-0.5 rounded border uppercase tracking-wider ${
                (trainee.trainee_type || user?.trainee_type) === 'informal'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-indigo-50 text-indigo-800 border-indigo-300'
              }`}>
                {(trainee.trainee_type || user?.trainee_type) === 'informal' ? 'Informal Trainee' : 'Formal Trainee'}
              </span>
              <span className="text-xs font-mono text-slate-500">ID: {trainee.trainee_id}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Welcome back, {trainee.full_name}!
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              District: <strong className="text-slate-700">{trainee.district}</strong> • Center: <strong className="text-slate-700">{trainee.training_center}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            href="/trainee/rewards"
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all"
          >
            <Award className="w-4 h-4" /> View Skill Passport
          </Link>
        </div>
      </div>

      {/* 5 Statistic Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1 */}
        <div className="dash-card p-4 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Trust Tier</span>
            <div className="text-xl font-extrabold text-slate-900">Tier {trainee.trust_tier} / 5</div>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> Verified Status
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="dash-card p-4 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Completed Check-ins</span>
            <div className="text-xl font-extrabold text-slate-900">
              {checkins.filter(c => c.status === 'done').length} / {checkins.length}
            </div>
            <span className="text-[10px] text-blue-600 font-bold">30d & 90d Milestones</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="dash-card p-4 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Documents Uploaded</span>
            <div className="text-xl font-extrabold text-slate-900">2 Verified</div>
            <span className="text-[10px] text-emerald-600 font-bold">
              {(trainee.trainee_type || user?.trainee_type) === 'informal' ? 'UPI QR & Shop Photo' : 'Pay Slip & Offer Letter'}
            </span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="dash-card p-4 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">
              {(trainee.trainee_type || user?.trainee_type) === 'informal' ? 'Monthly Revenue' : 'Monthly Salary'}
            </span>
            <div className="text-xl font-extrabold text-slate-900">
              {(trainee.trainee_type || user?.trainee_type) === 'informal' ? '₹15,000–₹25k' : '₹18,500/mo'}
            </div>
            <span className="text-[10px] text-amber-700 font-bold">
              {(trainee.trainee_type || user?.trainee_type) === 'informal' ? 'Self-Employed Micro-Biz' : 'Salaried Employment'}
            </span>
          </div>
        </div>

        {/* Card 5 */}
        <div className="dash-card p-4 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Unlocked Incentives</span>
            <div className="text-xl font-extrabold text-slate-900">2 Schemes</div>
            <span className="text-[10px] text-pink-600 font-bold">PM Mudra Eligible</span>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Filter Sidebar (Left) + Padded Table View (Right) (Matching Screenshot 3 & 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Filter Sidebar */}
        <div className="dash-card p-5 space-y-4 h-fit bg-white">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <Filter className="w-4 h-4 text-indigo-600" />
              <span>Filter Outcome Records</span>
            </div>
            <button
              onClick={() => { setSelectedDistrict('All'); setSelectedMilestone('All'); setSearchTerm(''); }}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Reset
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Academic Year / Batch</label>
              <select className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-indigo-500">
                <option value="2025-26">2025–26 Livelihood Batch</option>
                <option value="2024-25">2024–25 Legacy Batch</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">District / Region</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                <option value="All">All Districts</option>
                <option value="Patna">Patna</option>
                <option value="Gaya">Gaya</option>
                <option value="Muzaffarpur">Muzaffarpur</option>
                <option value="Bhagalpur">Bhagalpur</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Milestone Phase</label>
              <select
                value={selectedMilestone}
                onChange={(e) => setSelectedMilestone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                <option value="All">All Milestones</option>
                <option value="30">30-Day Milestone</option>
                <option value="90">90-Day Milestone</option>
                <option value="180">180-Day Milestone</option>
                <option value="365">365-Day Milestone</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Search Candidate / ID</label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 px-3 py-2 rounded-lg">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search name or ID..."
                  className="bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none w-full"
                />
              </div>
            </div>

            <button
              type="button"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow transition-all flex items-center justify-center gap-2 mt-2"
            >
              <Filter className="w-3.5 h-3.5" /> Apply Filters
            </button>
          </div>
        </div>

        {/* Right Main Table & Content Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active Checkin Banner */}
          {activeCheckin && (
            <NextCheckinCard checkin={activeCheckin} onSubmitted={loadData} />
          )}

          {/* Enterprise Data Table (Matching Screenshot 3 & 4) */}
          <div className="dash-card bg-white overflow-hidden space-y-4">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Check-in Milestone Verification Directory</h3>
                <p className="text-xs text-slate-500">View and manage post-training livelihood outcome records.</p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" /> Export Report
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="enterprise-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Milestone</th>
                    <th>Status</th>
                    <th>Due / Submitted Date</th>
                    <th>Employment Path</th>
                    <th>Salary / Revenue</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {checkins.map((chk, idx) => (
                    <tr key={chk.id}>
                      <td className="font-bold text-slate-400">{idx + 1}</td>
                      <td className="font-bold text-slate-900 font-mono">{chk.milestone_days}-Day Check-in</td>
                      <td>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            chk.status === 'done'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : chk.status === 'overdue'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {chk.status === 'done' && <CheckCircle2 className="w-3 h-3" />}
                          {chk.status === 'pending' && <Clock className="w-3 h-3" />}
                          {chk.status}
                        </span>
                      </td>
                      <td className="font-mono text-slate-600">{chk.checkin_date || chk.due_date}</td>
                      <td className="font-medium text-slate-800">
                        {chk.outcome_path?.employer_name || chk.outcome_path?.business_type || ((trainee.trainee_type || user?.trainee_type) === 'informal' ? 'Micro Retail Enterprise' : 'Salaried Assembly Tech')}
                      </td>
                      <td className="font-mono font-bold text-emerald-700">
                        {chk.outcome_path?.monthly_salary_inr 
                          ? `₹${chk.outcome_path.monthly_salary_inr.toLocaleString()}/mo` 
                          : chk.outcome_path?.monthly_revenue_band || ((trainee.trainee_type || user?.trainee_type) === 'informal' ? '₹15,000–₹25k' : '₹18,500/mo')}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button className="p-1 text-slate-500 hover:text-indigo-600 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-slate-500 hover:text-slate-800 rounded">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span>Rows per page:</span>
                <select className="bg-slate-50 border border-slate-300 rounded px-2 py-1 font-semibold text-slate-800">
                  <option value="10">10</option>
                  <option value="25">25</option>
                </select>
                <span>Showing 1 to {checkins.length} of {checkins.length} records</span>
              </div>

              <div className="flex items-center gap-1">
                <button className="p-1 rounded bg-slate-100 text-slate-400 hover:text-slate-700 disabled:opacity-50">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-7 h-7 rounded bg-slate-900 text-white font-bold text-xs">1</button>
                <button className="p-1 rounded bg-slate-100 text-slate-400 hover:text-slate-700">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TrustLevelBadge currentTier={trainee.trust_tier} verificationStatus={trainee.verification_status} />
    </div>
  );
}
