'use client';

import React, { useState } from 'react';
import { SkillGapData } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { MapPin, Tag, Filter } from 'lucide-react';

interface SkillGapHeatmapProps {
  data: SkillGapData[];
}

export const SkillGapHeatmap: React.FC<SkillGapHeatmapProps> = ({ data }) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');

  const districts = ['All', ...Array.from(new Set(data.map(d => d.district)))];

  const filteredData = selectedDistrict === 'All'
    ? data
    : data.filter(d => d.district === selectedDistrict);

  const getColorByIntensity = (val: number) => {
    if (val >= 80) return '#ef4444';
    if (val >= 60) return '#f97316';
    if (val >= 40) return '#eab308';
    return '#22c55e';
  };

  return (
    <div className="dash-card p-6 bg-white border border-slate-200 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700">SkillBridge Analytics</span>
          <h3 className="text-xl font-extrabold text-slate-900">District × Sector Skill Gap Heatmap</h3>
          <p className="text-xs text-slate-500">
            Real-time aggregate feedback signals provided by employers to align vocational curricula.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 p-1.5 rounded-xl">
          <Filter className="w-4 h-4 text-slate-500 ml-1" />
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="bg-transparent text-xs text-slate-800 font-semibold focus:outline-none pr-2"
          >
            {districts.map(d => (
              <option key={d} value={d} className="bg-white text-slate-900">
                District: {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredData.map((item, idx) => {
          const color = getColorByIntensity(item.gap_frequency);
          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  {item.district} • <span className="text-indigo-700">{item.sector}</span>
                </div>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-extrabold text-white shadow-sm"
                  style={{ backgroundColor: color }}
                >
                  {item.gap_frequency}% Gap
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-medium">Top Reported Skill Gaps:</span>
                <div className="flex flex-wrap gap-1">
                  {item.top_gaps.map((gap, gIdx) => (
                    <span
                      key={gIdx}
                      className="text-[10px] bg-white text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold"
                    >
                      <Tag className="w-2.5 h-2.5 text-slate-400" /> {gap}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 border-t border-slate-200 space-y-3">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Aggregated Gap Frequency Distribution
        </h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="sector"
                stroke="#64748b"
                tick={{ fill: '#475569', fontSize: 10 }}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis stroke="#64748b" tick={{ fill: '#475569', fontSize: 10 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '12px' }}
              />
              <Bar dataKey="gap_frequency" radius={[6, 6, 0, 0]}>
                {filteredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColorByIntensity(entry.gap_frequency)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
