import {
  TrainingCenterProfile,
  CheckInOutcome,
  EvidenceSubmission,
  EmployerFeedback,
  SkillGapData,
  SentinelFlaggedClaim,
  LivelihoodLensReport,
  IncentiveItem,
  ProviderStats,
  CandidateTrainingCenter,
  TrainingCenterPerformance,
  InviteRecord
} from '../types';

import {
  MOCK_TRAINING_CENTER,
  MOCK_CHECKINS,
  MOCK_EVIDENCE,
  MOCK_SKILL_GAPS,
  MOCK_SENTINEL_CLAIMS,
  MOCK_INCENTIVES,
  MOCK_PROVIDERS,
  MOCK_CANDIDATE_TRAINING_CENTERS,
  MOCK_CENTER_PERFORMANCE,
  MOCK_INVITES
} from '../mock-data';

const API_BASE = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_API_BASE || '') : '';

// LocalStorage key for client side persistence of invites
const INVITES_STORAGE_KEY = 'livelihood_invites';

const getStoredInvites = (): InviteRecord[] => {
  if (typeof window === 'undefined') return MOCK_INVITES;
  const saved = localStorage.getItem(INVITES_STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(INVITES_STORAGE_KEY, JSON.stringify(MOCK_INVITES));
    return MOCK_INVITES;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return MOCK_INVITES;
  }
};

const saveStoredInvites = (invites: InviteRecord[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(INVITES_STORAGE_KEY, JSON.stringify(invites));
  }
};

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
  // Training Center Login & Profile
  async loginVID(vid: string): Promise<TrainingCenterProfile> {
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/api/auth/login-vid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ vid })
      });
      return res.json();
    }
    return { ...MOCK_TRAINING_CENTER, vid };
  },

  // Check-ins (Module 2) - Training Center Role
  async getCheckIns(trainingCenterId: string): Promise<CheckInOutcome[]> {
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/api/module2/checkins?training_center_id=${trainingCenterId}`, {
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
      training_center_id: data.training_center_id || MOCK_TRAINING_CENTER.training_center_id,
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

  // Evidence Verification (Module 3) - Training Center Role
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
      training_center_id: MOCK_TRAINING_CENTER.training_center_id,
      evidence_type: evidenceType,
      file_name: fileName,
      upload_timestamp: new Date().toLocaleString(),
      status: 'pending',
      tier_granted: 3
    };
  },

  async getEvidenceList(trainingCenterId: string): Promise<EvidenceSubmission[]> {
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/api/module3/verification?training_center_id=${trainingCenterId}`, {
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
  async getSkillMatchingCandidates(skills: string[] = []): Promise<CandidateTrainingCenter[]> {
    if (API_BASE) {
      const res = await fetch(`${API_BASE}/api/employer/candidates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ skills })
      });
      return res.json();
    }
    if (!skills || skills.length === 0) return MOCK_CANDIDATE_TRAINING_CENTERS;
    return MOCK_CANDIDATE_TRAINING_CENTERS.filter(c =>
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

  // LivelihoodLens Informal Income (Module 6) - Training Center Role
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
      training_center_id: MOCK_TRAINING_CENTER.training_center_id,
      business_type: report.business_type || 'Micro Retail',
      monthly_revenue_band: report.monthly_revenue_band || '₹10,000 - ₹20,000',
      verification_method: report.verification_method || 'geotagged_photo',
      photo_url: report.photo_url,
      upi_merchant_id: report.upi_merchant_id,
      submitted_at: new Date().toISOString(),
      status: 'submitted'
    };
  },

  // Incentive Ledger (Module 7) - Training Center Role
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
  },

  // --- INVITE MANAGEMENT API (New Feature) ---
  async getInvites(): Promise<InviteRecord[]> {
    try {
      const res = await fetch('/api/invites');
      if (res.ok) {
        return res.json();
      }
    } catch (e) {
      // Fallback to local storage
    }
    return getStoredInvites();
  },

  async createInvite(data: { recipientName: string; recipientPhone?: string; recipientEmail?: string; customMessage?: string }): Promise<InviteRecord> {
    try {
      const res = await fetch('/api/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const record = await res.json();
        // Also update local cache
        const invites = getStoredInvites();
        invites.unshift(record);
        saveStoredInvites(invites);
        return record;
      }
    } catch (e) {
      // Fallback
    }

    // Client-side fallback token generation
    const randomHex = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 6);
    const token = `inv-${randomHex}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const record: InviteRecord = {
      id: `inv-${Date.now()}`,
      token,
      recipientName: data.recipientName,
      recipientPhone: data.recipientPhone,
      recipientEmail: data.recipientEmail,
      customMessage: data.customMessage,
      status: 'sent',
      createdAt: now.toISOString(),
      expiresAt
    };

    const currentInvites = getStoredInvites();
    currentInvites.unshift(record);
    saveStoredInvites(currentInvites);
    return record;
  },

  async getInviteByToken(token: string): Promise<{ valid: boolean; invite?: InviteRecord; reason?: string }> {
    try {
      const res = await fetch(`/api/invites/${token}`);
      if (res.ok) {
        return res.json();
      }
    } catch (e) {
      // Fallback
    }

    const invites = getStoredInvites();
    const invite = invites.find(i => i.token === token);

    if (!invite) {
      return { valid: false, reason: 'Invite link not found.' };
    }

    const isExpired = new Date(invite.expiresAt).getTime() < Date.now();
    if (isExpired || invite.status === 'expired') {
      invite.status = 'expired';
      saveStoredInvites(invites);
      return { valid: false, invite, reason: 'This invitation link has expired.' };
    }

    if (invite.status === 'completed') {
      return { valid: false, invite, reason: 'This invitation link has already been used to complete registration.' };
    }

    // If status was sent, update to opened
    if (invite.status === 'sent') {
      invite.status = 'opened';
      saveStoredInvites(invites);
    }

    return { valid: true, invite };
  },

  async completeInvite(token: string, regData: any): Promise<{ success: boolean; invite?: InviteRecord }> {
    try {
      const res = await fetch(`/api/invites/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'complete', regData })
      });
      if (res.ok) {
        return res.json();
      }
    } catch (e) {
      // Fallback
    }

    const invites = getStoredInvites();
    const invite = invites.find(i => i.token === token);
    if (invite) {
      invite.status = 'completed';
      saveStoredInvites(invites);
      return { success: true, invite };
    }
    return { success: false };
  },

  async revokeInvite(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/invites`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        return true;
      }
    } catch (e) {
      // Fallback
    }

    const invites = getStoredInvites();
    const updated = invites.map(inv => inv.id === id ? { ...inv, status: 'expired' as const } : inv);
    saveStoredInvites(updated);
    return true;
  }
};
