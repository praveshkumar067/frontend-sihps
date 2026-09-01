'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { SkillGapData } from '@/lib/types';
import { SkillGapHeatmap } from '@/components/employer/SkillGapHeatmap';

export default function EmployerHeatmapPage() {
  const [heatmapData, setHeatmapData] = useState<SkillGapData[]>([]);

  useEffect(() => {
    const fetchHeatmap = async () => {
      try {
        const data = await api.getSkillGapDistribution();
        setHeatmapData(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHeatmap();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <SkillGapHeatmap data={heatmapData} />
    </div>
  );
}
