'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { api } from '@/lib/api';
import { EvidenceSubmission } from '@/lib/types';
import { TrustLevelBadge } from '@/components/evidence/TrustLevelBadge';
import { EvidenceUpload } from '@/components/evidence/EvidenceUpload';
import { FileCheck } from 'lucide-react';

export default function TraineeEvidencePage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<EvidenceSubmission[]>([]);
  const trainee = user?.traineeProfile;

  const fetchEvidence = async () => {
    if (!trainee) return;
    try {
      const data = await api.getEvidenceList(trainee.trainee_id);
      setSubmissions(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvidence();
  }, [user]);

  const currentTier = trainee ? trainee.trust_tier : 3;
  const verificationStatus = trainee ? trainee.verification_status : 'verified';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md mb-2">
            <FileCheck className="w-3.5 h-3.5" /> TrustLevel Module (Trainee Role)
          </div>
          <h1 className="text-2xl font-extrabold text-white">Evidence Upload & Trust Status</h1>
          <p className="text-xs text-slate-400 mt-1">
            Build your verified livelihood score from Tier 0 (Self-Declared) to Tier 5 (Fully Verified Gold Standard).
          </p>
        </div>
      </div>

      <TrustLevelBadge currentTier={currentTier} verificationStatus={verificationStatus} />
      <EvidenceUpload submissions={submissions} onUploaded={fetchEvidence} />
    </div>
  );
}
