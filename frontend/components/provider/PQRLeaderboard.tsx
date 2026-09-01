'use client';

import React, { useState } from 'react';
import { ProviderStats } from '@/lib/types';
import { Award, TrendingUp, Users, DollarSign, Building2, Eye, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';

interface PQRLeaderboardProps {
  providers: ProviderStats[];
}

export const PQRLeaderboard: React.FC<PQRLeaderboardProps> = ({ providers }) => {
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const sorted = [...providers].sort((a, b) => b.pqr_score - a.pqr_score);

  return (
    <div className="dash-card bg-white overflow-hidden space-y-4">
      {/* Table Header */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
            PQR Rating Framework
          </span>
          <h3 className="text-lg font-extrabold text-slate-900 mt-1">
            Provider Quality Rating (PQR) Leaderboard
          </h3>
          <p className="text-xs text-slate-500">
            Ranked strictly by 180-day outcome retention rate & wage growth (NOT raw enrollment volume).
          </p>
        </div>
      </div>

      {/* Enterprise Data Table */}
      <div className="overflow-x-auto">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Training Provider Name</th>
              <th>District</th>
              <th>Placement %</th>
              <th>180-Day Retention %</th>
              <th>Starting → Current Income</th>
              <th className="text-right">PQR Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => {
              const incomeGrowth = Math.round(((p.average_current_income_inr - p.average_starting_income_inr) / p.average_starting_income_inr) * 100);
              return (
                <tr key={p.provider_id}>
                  <td>
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold ${
                        p.rank === 1
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : p.rank === 2
                          ? 'bg-slate-200 text-slate-800 border border-slate-300'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      #{p.rank}
                    </span>
                  </td>
                  <td className="font-bold text-slate-900">
                    {p.provider_name}
                    <span className="block text-[10px] text-slate-500 font-mono font-normal">
                      ID: {p.provider_id} • {p.total_candidates} candidates
                    </span>
                  </td>
                  <td className="text-slate-700 font-medium">{p.district}</td>
                  <td className="text-slate-800 font-mono font-semibold">{p.placement_rate}%</td>
                  <td>
                    <span className="text-emerald-700 font-mono font-bold">{p.retention_180_rate}%</span>
                  </td>
                  <td className="font-mono text-slate-700">
                    ₹{p.average_starting_income_inr.toLocaleString()} → <strong className="text-slate-900">₹{p.average_current_income_inr.toLocaleString()}</strong>
                    <span className="text-[10px] text-emerald-600 font-bold ml-1.5">(+{incomeGrowth}%)</span>
                  </td>
                  <td className="text-right">
                    <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                      {p.pqr_score} / 100
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button className="p-1 text-slate-500 hover:text-indigo-600 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-slate-500 hover:text-slate-800 rounded">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className="bg-slate-50 border border-slate-300 rounded px-2 py-1 font-semibold text-slate-800"
          >
            <option value="10">10</option>
            <option value="25">25</option>
          </select>
          <span>Showing 1 to {sorted.length} of {sorted.length} providers</span>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-1 rounded bg-slate-100 text-slate-400 disabled:opacity-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-7 h-7 rounded bg-slate-900 text-white font-bold text-xs">1</button>
          <button className="p-1 rounded bg-slate-100 text-slate-400">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
