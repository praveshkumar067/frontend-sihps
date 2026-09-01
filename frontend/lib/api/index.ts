import {
  TraineeProfile,
  CheckInOutcome,
  EvidenceSubmission,
  EmployerFeedback,
  SkillGapData,
  SentinelFlaggedClaim,
  LivelihoodLensReport,
  IncentiveItem,
  ProviderStats,
  CandidateTrainee,
  TrainingCenterPerformance
} from '../types';

import {
  MOCK_TRAINEE,
  MOCK_CHECKINS,
  MOCK_EVIDENCE,
  MOCK_SKILL_GAPS,
  MOCK_SENTINEL_CLAIMS,
  MOCK_INCENTIVES,
  MOCK_PROVIDERS,
  MOCK_CANDIDATE_TRAINEES,
  MOCK_CENTER_PERFORMANCE
} from '../mock-data';

const API_BASE = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_API_BASE || '') : '';

// Helper to get auth headers from local session
const getAuthHeaders = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  const saved = localStorage.getItem('livelihood_user_session');
  if (!saved) return {};
  try {
    const session = JSON.parse(saved);
    return {
      'Authorization': `Bearer ${session.token}`,
      'X-Role': String(session.role)
    };
  } catch (e) {
    return {};
  }
};

export const api = {
  // Trainee Login & Profile
  async loginVID(vid: string): Promise<TraineeProfile> {
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/api/auth/login-vid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ vid })
      });
      return res.json();
    }
    return { ...MOCK_TRAINEE, vid };
  },

  // Check-ins (Module 2) - Trainee Role
  async getCheckIns(traineeId: string): Promise<CheckInOutcome[]> {
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/api/module2/checkins?trainee_id=${traineeId}`, {
        headers: getAuthHeaders()
      });
      return res.json();
    }
    return MOCK_CHECKINS;
  },

  async submitCheckIn(data: Partial<CheckInOutcome>): Promise<CheckInOutcome> {
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/api/module2/outcome`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(data)
      });
      return res.json();
    }
    const newCheckin: CheckInOutcome = {
      id: `chk-${Date.now()}`,
      trainee_id: data.trainee_id || MOCK_TRAINEE.trainee_id,
      milestone_days: data.milestone_days || 90,
      status: 'done',
      checkin_date: new Date().toISOString().split('T')[0],
      due_date: data.due_date || new Date().toISOString().split('T')[0],
      employment_status: data.employment_status,
      outcome_path: data.outcome_path,
      submitted_via: 'web'
    };
    return newCheckin;
  },

  // Evidence Verification (Module 3) - Trainee Role
  async uploadEvidence(formData: FormData): Promise<EvidenceSubmission> {
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/api/module3/verification`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData
      });
      return res.json();
    }
    const evidenceType = (formData.get('evidence_type') as any) || 'pay_slip';
    const fileName = (formData.get('file') as File)?.name || 'document_upload.pdf';
    return {
      id: `ev-${Date.now()}`,
      trainee_id: MOCK_TRAINEE.trainee_id,
      evidence_type: evidenceType,
      file_name: fileName,
      upload_timestamp: new Date().toLocaleString(),
      status: 'pending',
      tier_granted: 3
    };
  },

  async getEvidenceList(traineeId: string): Promise<EvidenceSubmission[]> {
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/api/module3/verification?trainee_id=${traineeId}`, {
        headers: getAuthHeaders()
      });
      return res.json();
    }
    return MOCK_EVIDENCE;
  },

  // SkillBridge Employer Feedback (Module 4) - Employer Role (Behind Employer Auth)
  async submitEmployerFeedback(feedback: Partial<EmployerFeedback>): Promise<{ success: boolean }> {
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/api/module4/employer_feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(feedback)
      });
      return res.json();
    }
    return { success: true };
  },

  async getSkillGapDistribution(): Promise<SkillGapData[]> {
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/api/module4/skill_gap_distribution`, {
        headers: getAuthHeaders()
      });
      return res.json();
    }
    return MOCK_SKILL_GAPS;
  },

  // Candidate Skill Match - Employer Role
  async getSkillMatchingCandidates(skills: string[] = []): Promise<CandidateTrainee[]> {
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/api/employer/candidates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ skills })
      });
      return res.json();
    }
    if (!skills || skills.length === 0) return MOCK_CANDIDATE_TRAINEES;
    return MOCK_CANDIDATE_TRAINEES.filter(c =>
      skills.some(s => c.skills.some(cs => cs.toLowerCase().includes(s.toLowerCase())))
    );
  },

  // SentinelAI Officer Review Queue (Module 5) - Officer Role
  async getSentinelFlaggedQueue(): Promise<SentinelFlaggedClaim[]> {
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/api/module5/sentinel/flagged_claims`, {
        headers: getAuthHeaders()
      });
      return res.json();
    }
    return MOCK_SENTINEL_CLAIMS;
  },

  async updateClaimStatus(
    claimId: string,
    action: 'approved' | 'rejected' | 'more_info_requested',
    notes?: string
  ): Promise<SentinelFlaggedClaim> {
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/api/module5/sentinel/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ claim_id: claimId, action, notes })
      });
      return res.json();
    }
    const claim = MOCK_SENTINEL_CLAIMS.find(c => c.claim_id === claimId);
    return {
      ...(claim || MOCK_SENTINEL_CLAIMS[0]),
      status: action,
      officer_notes: notes
    };
  },

  // LivelihoodLens Informal Income (Module 6) - Trainee Role
  async submitLivelihoodLens(report: Partial<LivelihoodLensReport>): Promise<LivelihoodLensReport> {
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/api/module6/livelihoodlens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(report)
      });
      return res.json();
    }
    return {
      id: `ll-${Date.now()}`,
      trainee_id: MOCK_TRAINEE.trainee_id,
      business_type: report.business_type || 'Micro Retail',
      monthly_revenue_band: report.monthly_revenue_band || '₹10,000 - ₹20,000',
      verification_method: report.verification_method || 'geotagged_photo',
      photo_url: report.photo_url,
      upi_merchant_id: report.upi_merchant_id,
      submitted_at: new Date().toISOString(),
      status: 'submitted'
    };
  },

  // Incentive Ledger (Module 7) - Trainee Role
  async getIncentiveLedger(candidateId: string): Promise<IncentiveItem[]> {
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/api/module7/incentive_ledger?candidate_id=${candidateId}`, {
        headers: getAuthHeaders()
      });
      return res.json();
    }
    return MOCK_INCENTIVES;
  },

  // Provider Portal (Module 8) - Officer Role
  async getProviderLeaderboard(): Promise<ProviderStats[]> {
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/api/module8/provider_leaderboard`, {
        headers: getAuthHeaders()
      });
      return res.json();
    }
    return MOCK_PROVIDERS;
  },

  // Training Center Performance Report - Officer Role
  async getTrainingCenterPerformance(): Promise<TrainingCenterPerformance[]> {
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/api/officer/center_performance`, {
        headers: getAuthHeaders()
      });
      return res.json();
    }
    return MOCK_CENTER_PERFORMANCE;
  }
};

