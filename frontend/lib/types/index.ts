export type Role = 'trainee' | 'employer' | 'officer' | 'provider';
export type TraineeType = 'formal' | 'informal';

export interface UserSession {
  id: string;
  vid?: string;
  role: Role;
  name: string;
  token: string;
  email?: string;
  district?: string;
  employer_id?: string;
  badge_id?: string;
  trainee_type?: TraineeType;
}

export interface TraineeProfile {
  trainee_id: string;
  vid: string;
  full_name: string;
  phone: string;
  district: string;
  sector: string;
  training_center: string;
  completion_date: string;
  consent_given: boolean;
  trust_tier: number; // 0 to 5
  verification_status: 'pending' | 'verified' | 'rejected';
  trainee_type?: TraineeType;
}

export type EmploymentStatus = 'employed' | 'self-employed' | 'unemployed' | 'further-training';

export interface CheckInOutcome {
  id: string;
  trainee_id: string;
  milestone_days: 30 | 90 | 180 | 365;
  status: 'done' | 'pending' | 'overdue';
  checkin_date?: string;
  due_date: string;
  employment_status?: EmploymentStatus;
  outcome_path?: {
    employer_name?: string;
    designation?: string;
    monthly_salary_inr?: number;
    business_type?: string;
    monthly_revenue_band?: string;
    training_institute?: string;
    course_name?: string;
    unemployed_reason?: string;
  };
  submitted_via: 'web' | 'whatsapp';
}

export type EvidenceType = 'pay_slip' | 'offer_letter' | 'bank_statement' | 'shopfront_photo' | 'upi_qr';

export interface EvidenceSubmission {
  id: string;
  trainee_id: string;
  evidence_type: EvidenceType;
  file_name: string;
  upload_timestamp: string;
  status: 'pending' | 'verified' | 'rejected';
  rejection_reason?: string;
  tier_granted?: number;
}

export interface EmployerFeedback {
  id: string;
  trainee_id?: string;
  employer_name: string;
  performance_rating: 'Excellent' | 'Good' | 'Satisfactory' | 'Needs Improvement';
  skill_gaps: string[];
  comments?: string;
  submitted_at: string;
}

export interface SkillGapData {
  district: string;
  sector: string;
  gap_frequency: number; // 0 - 100 scale for heatmap color intensity
  top_gaps: string[];
}

export interface SentinelFlaggedClaim {
  claim_id: string;
  trainee_id: string;
  trainee_name: string;
  district: string;
  training_center: string;
  flag_reason: string; // e.g. "Duplicate salary receipt hash", "IP cluster anomaly", "Rapid outcome completion"
  risk_score: number; // 0 - 100
  evidence_tier: number;
  centre_flag_status: 'normal' | 'suspicious' | 'under_audit';
  outcome_anomalies: string[];
  submission_date: string;
  status: 'pending_review' | 'approved' | 'rejected' | 'more_info_requested';
  officer_notes?: string;
}

export interface LivelihoodLensReport {
  id: string;
  trainee_id: string;
  business_type: string;
  monthly_revenue_band: string; // e.g. '₹0 - ₹5,000', '₹5,000 - ₹10,000', etc.
  verification_method: 'geotagged_photo' | 'upi_qr';
  photo_url?: string;
  upi_merchant_id?: string;
  submitted_at: string;
  status: 'submitted' | 'verified';
}

export interface IncentiveItem {
  id: string;
  candidate_id: string;
  incentive_type: 'skill_passport' | 'scheme_priority' | 'micro_voucher';
  title: string;
  description: string;
  trigger_event: string; // e.g. '30-Day Check-in', '90-Day Verification', 'Tier 3 Trust'
  status: 'locked' | 'unlocked' | 'claimed';
  redemption_code?: string;
  unlocked_date?: string;
}

export interface ProviderStats {
  provider_id: string;
  provider_name: string;
  district: string;
  total_candidates: number;
  placement_rate: number; // %
  retention_30_rate: number; // %
  retention_90_rate: number; // %
  retention_180_rate: number; // %
  retention_365_rate: number; // %
  average_starting_income_inr: number;
  average_current_income_inr: number;
  pqr_score: number; // Provider Quality Rating 0 - 100
  rank: number;
}

export interface CandidateTrainee {
  id: string;
  name: string;
  trainee_type: TraineeType;
  district: string;
  sector: string;
  training_center: string;
  trust_tier: number;
  verification_status: 'verified' | 'pending';
  skills: string[];
  phone: string;
  experience_months: number;
  availability: 'Immediate' | 'Within 15 Days' | 'Within 30 Days';
}

export interface TrainingCenterPerformance {
  center_id: string;
  center_name: string;
  district: string;
  sector: string;
  total_trainees: number;
  trainee_satisfaction_score: number; // 0 to 100
  placement_rate: number; // %
  retention_180_rate: number; // %
  avg_starting_salary_inr: number;
  sentinel_flags_count: number;
  performance_rating: 'Top Performing' | 'High Retention' | 'Satisfactory' | 'Needs Review';
  trainee_feedback_summary: string;
}

