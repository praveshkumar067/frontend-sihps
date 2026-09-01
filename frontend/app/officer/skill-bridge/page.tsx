'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { SkillGapData } from '@/lib/types';
import { SkillGapHeatmap } from '@/components/employer/SkillGapHeatmap';
import { MapPin, ShieldCheck } from 'lucide-react';

export default function OfficerSkillBridgePage() {
  const [heatmapData, setHeatmapData] = useState<SkillGapData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchHeatmap = async () => {
    try {
      const data = await api.getSkillGapDistribution();
      setHeatmapData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeatmap();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="dash-card p-6 bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-md mb-2">
            <MapPin className="w-3.5 h-3.5" /> SkillBridge Module (Role: District Officer Protected)
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">District × Sector Skill Gap Analytics</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time heatmaps based on employer feedback to direct government training curriculum interventions.
          </p>
        </div>
      </div>

      <SkillGapHeatmap data={heatmapData} />
    </div>
  );
}
