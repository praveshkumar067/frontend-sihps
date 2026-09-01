'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { api } from '@/lib/api';
import { CheckInOutcome } from '@/lib/types';
import { NextCheckinCard } from '@/components/checkins/NextCheckinCard';
import { CheckInHistory } from '@/components/checkins/CheckInHistory';
import { CalendarCheck } from 'lucide-react';

export default function TraineeCheckInsPage() {
  const { user } = useAuth();
  const [checkins, setCheckins] = useState<CheckInOutcome[]>([]);
  const trainee = user?.traineeProfile;

  const fetchCheckins = async () => {
    if (!trainee) return;
    try {
      const data = await api.getCheckIns(trainee.trainee_id);
      setCheckins(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCheckins();
  }, [user]);

  const pendingCheckin = checkins.find(c => c.status === 'pending') || checkins[0];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-400 bg-brand-500/10 border border-brand-500/20 px-2.5 py-1 rounded-md mb-2">
            <CalendarCheck className="w-3.5 h-3.5" /> StayConnect Module (Trainee Role)
          </div>
          <h1 className="text-2xl font-extrabold text-white">Periodic Outcome Check-ins</h1>
          <p className="text-xs text-slate-400 mt-1">
            Tracking post-training employment retention across 30, 90, 180, and 365-day milestones.
          </p>
        </div>
      </div>

      {pendingCheckin && (
        <NextCheckinCard checkin={pendingCheckin} onSubmitted={fetchCheckins} />
      )}

      <CheckInHistory checkins={checkins} />
    </div>
  );
}
