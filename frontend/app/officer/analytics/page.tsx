'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { ProviderStats } from '@/lib/types';
import { PQRLeaderboard } from '@/components/provider/PQRLeaderboard';
import { BarChart3, TrendingUp, Users, DollarSign, Award, Filter, Download } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';

export default function OfficerAnalyticsPage() {
  const [providers, setProviders] = useState<ProviderStats[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const data = await api.getProviderLeaderboard();
        setProviders(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProviders();
  }, []);

  const filteredProviders = selectedDistrict === 'All'
    ? providers
    : providers.filter(p => p.district === selectedDistrict);

  const avgPlacement = Math.round(providers.reduce((acc, p) => acc + p.placement_rate, 0) / (providers.length || 1));
  const avgRetention180 = Math.round(providers.reduce((acc, p) => acc + p.retention_180_rate, 0) / (providers.length || 1));
  const avgStartSalary = Math.round(providers.reduce((acc, p) => acc + p.average_starting_income_inr, 0) / (providers.length || 1));
  const avgCurrentSalary = Math.round(providers.reduce((acc, p) => acc + p.average_current_income_inr, 0) / (providers.length || 1));

  const retentionTrendData = [
    { milestone: '30 Days', retention: 85 },
    { milestone: '90 Days', retention: 78 },
    { milestone: '180 Days', retention: 72 },
    { milestone: '365 Days', retention: 66 }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="dash-card p-6 bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md mb-2">
            <BarChart3 className="w-3.5 h-3.5" /> Provider Analytics & State Dashboard (Role: District Officer)
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Government & Provider Quality Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">
            State-level monitoring of 180-day employment retention, wage growth trends, and provider quality rankings.
          </p>
        </div>

        <button className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5">
          <Download className="w-4 h-4" /> Export State Analytics (CSV)
        </button>
      </div>

      {/* 4 Stat Cards Row (Matching Screenshot 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="dash-card p-4 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Overall Placement Rate</span>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">{avgPlacement}%</div>
            <span className="text-[10px] text-emerald-600 font-bold">State target: 70% met</span>
          </div>
        </div>

        <div className="dash-card p-4 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">180-Day Retention Rate</span>
            <div className="text-2xl font-extrabold text-emerald-600 font-mono">{avgRetention180}%</div>
            <span className="text-[10px] text-slate-500">Verified via 180-day check-ins</span>
          </div>
        </div>

        <div className="dash-card p-4 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Avg Starting Salary</span>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">₹{avgStartSalary.toLocaleString()}</div>
            <span className="text-[10px] text-slate-500">At 30-day milestone</span>
          </div>
        </div>

        <div className="dash-card p-4 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Avg Current Income</span>
            <div className="text-2xl font-extrabold text-purple-700 font-mono">₹{avgCurrentSalary.toLocaleString()}</div>
            <span className="text-[10px] text-emerald-600 font-bold">+26% average wage growth</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="dash-card p-6 bg-white space-y-4">
          <h4 className="text-sm font-bold text-slate-900">Statewide Retention Decay Curve (30 to 365 Days)</h4>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={retentionTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="milestone" stroke="#64748b" tick={{ fill: '#475569', fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#475569', fontSize: 11 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="retention" stroke="#16a34a" strokeWidth={3} dot={{ fill: '#16a34a', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dash-card p-6 bg-white space-y-4">
          <h4 className="text-sm font-bold text-slate-900">Provider Starting vs Current Income Comparison (INR)</h4>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredProviders}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="district" stroke="#64748b" tick={{ fill: '#475569', fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#475569', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px' }} />
                <Bar dataKey="average_starting_income_inr" name="Starting Income" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="average_current_income_inr" name="Current Income" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <PQRLeaderboard providers={filteredProviders} />
    </div>
  );
}
