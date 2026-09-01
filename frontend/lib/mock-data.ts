import {
  TraineeProfile,
  CheckInOutcome,
  EvidenceSubmission,
  SkillGapData,
  SentinelFlaggedClaim,
  IncentiveItem,
  ProviderStats,
  CandidateTrainee,
  TrainingCenterPerformance
} from './types';

export const MOCK_TRAINEE: TraineeProfile = {
  trainee_id: 'TR-884920',
  vid: '9823-4412-8801',
  full_name: 'Ananya Sharma',
  phone: '+91 98765 43210',
  district: 'Patna',
  sector: 'Electronics & Hardware',
  training_center: 'Patna Skill Development Institute #4',
  completion_date: '2026-03-15',
  consent_given: true,
  trust_tier: 3,
  verification_status: 'verified',
  trainee_type: 'formal'
};

export const MOCK_CHECKINS: CheckInOutcome[] = [
  {
    id: 'chk-30',
    trainee_id: 'TR-884920',
    milestone_days: 30,
    status: 'done',
    checkin_date: '2026-04-15',
    due_date: '2026-04-15',
    employment_status: 'employed',
    outcome_path: {
      employer_name: 'Apex Micro-Electronics Pvt Ltd',
      designation: 'Assembly Technician',
      monthly_salary_inr: 18500,
    },
    submitted_via: 'whatsapp'
  },
  {
    id: 'chk-90',
    trainee_id: 'TR-884920',
    milestone_days: 90,
    status: 'pending',
    due_date: '2026-06-15',
    submitted_via: 'web'
  },
  {
    id: 'chk-180',
    trainee_id: 'TR-884920',
    milestone_days: 180,
    status: 'pending',
    due_date: '2026-09-15',
    submitted_via: 'web'
  },
  {
    id: 'chk-365',
    trainee_id: 'TR-884920',
    milestone_days: 365,
    status: 'pending',
    due_date: '2027-03-15',
    submitted_via: 'web'
  }
];

export const MOCK_EVIDENCE: EvidenceSubmission[] = [
  {
    id: 'ev-1',
    trainee_id: 'TR-884920',
    evidence_type: 'pay_slip',
    file_name: 'Apex_PaySlip_April2026.pdf',
    upload_timestamp: '2026-04-16 10:30 AM',
    status: 'verified',
    tier_granted: 3
  },
  {
    id: 'ev-2',
    trainee_id: 'TR-884920',
    evidence_type: 'offer_letter',
    file_name: 'Apex_OfferLetter_Signed.pdf',
    upload_timestamp: '2026-03-20 02:15 PM',
    status: 'verified',
    tier_granted: 2
  }
];

export const MOCK_SKILL_GAPS: SkillGapData[] = [
  { district: 'Patna', sector: 'Electronics', gap_frequency: 85, top_gaps: ['Micro-soldering', 'PCB Diagnostics', 'Punctuality'] },
  { district: 'Patna', sector: 'Automotive', gap_frequency: 60, top_gaps: ['EV Engine Maintenance', 'Tool Safety'] },
  { district: 'Patna', sector: 'Healthcare', gap_frequency: 40, top_gaps: ['Patient Communication', 'Record keeping'] },
  { district: 'Gaya', sector: 'Electronics', gap_frequency: 90, top_gaps: ['Circuit Testing', 'Soft Skills'] },
  { district: 'Gaya', sector: 'Retail', gap_frequency: 55, top_gaps: ['POS Handling', 'Customer Service'] },
  { district: 'Gaya', sector: 'IT-eFS', gap_frequency: 70, top_gaps: ['Data Entry Speed', 'Excel Formulas'] },
  { district: 'Muzaffarpur', sector: 'Automotive', gap_frequency: 75, top_gaps: ['Diagnostic Scanners', 'Hydraulic Lift Operation'] },
  { district: 'Muzaffarpur', sector: 'Healthcare', gap_frequency: 65, top_gaps: ['ECG Operation', 'English Communication'] },
  { district: 'Bhagalpur', sector: 'Textiles', gap_frequency: 88, top_gaps: ['Automated Looms', 'Quality Control'] },
  { district: 'Darbhanga', sector: 'Agriculture', gap_frequency: 50, top_gaps: ['Drone Operation', 'Soil Sensor Calibration'] }
];

export const MOCK_SENTINEL_CLAIMS: SentinelFlaggedClaim[] = [
  {
    claim_id: 'FLG-9921',
    trainee_id: 'TR-77102',
    trainee_name: 'Rahul Verma',
    district: 'Patna',
    training_center: 'Apex Skill Hub #2',
    flag_reason: 'Duplicate salary slip hash across 4 distinct trainees',
    risk_score: 92,
    evidence_tier: 1,
    centre_flag_status: 'under_audit',
    outcome_anomalies: [
      'Identical salary bank statement PDF checksums',
      'All 4 trainees reported exact salary ₹24,500/mo on same day',
      'Employer GSTIN matches dissolved entity'
    ],
    submission_date: '2026-08-25',
    status: 'pending_review'
  },
  {
    claim_id: 'FLG-9924',
    trainee_id: 'TR-66381',
    trainee_name: 'Pooja Kumari',
    district: 'Gaya',
    training_center: 'Gaya Tech Vocational Center',
    flag_reason: 'Rapid completion anomaly (30 & 90 day outcomes submitted in 3 days)',
    risk_score: 78,
    evidence_tier: 0,
    centre_flag_status: 'suspicious',
    outcome_anomalies: [
      'Outcome timeline date mismatch with course end date',
      'IP address geo-location mismatch (Delhi IP for Gaya center)'
    ],
    submission_date: '2026-08-26',
    status: 'pending_review'
  },
  {
    claim_id: 'FLG-9930',
    trainee_id: 'TR-55419',
    trainee_name: 'Manish Kumar',
    district: 'Muzaffarpur',
    training_center: 'North Bihar Skill Academy',
    flag_reason: 'UPI Merchant QR mismatch with declared retail business',
    risk_score: 65,
    evidence_tier: 2,
    centre_flag_status: 'normal',
    outcome_anomalies: [
      'UPI QR name registered to individual savings account',
      'Reported revenue band (>₹50,000) inconsistent with center average'
    ],
    submission_date: '2026-08-27',
    status: 'pending_review'
  }
];

export const MOCK_INCENTIVES: IncentiveItem[] = [
  {
    id: 'inc-1',
    candidate_id: 'TR-884920',
    incentive_type: 'skill_passport',
    title: 'Verified Digital Skill Passport',
    description: 'Tamper-proof digital badge certifying completed outcome and Tier 3 verified employment.',
    trigger_event: 'Tier 3 Trust Verified',
    status: 'unlocked',
    unlocked_date: '2026-04-16'
  },
  {
    id: 'inc-2',
    candidate_id: 'TR-884920',
    incentive_type: 'scheme_priority',
    title: 'PM Mudra Loan Priority Access',
    description: 'Fast-track collateral-free loan processing up to ₹1,00,000 for self-employed/entrepreneurial growth.',
    trigger_event: '90-Day Retention Verified',
    status: 'unlocked',
    unlocked_date: '2026-06-16'
  },
  {
    id: 'inc-3',
    candidate_id: 'TR-884920',
    incentive_type: 'micro_voucher',
    title: 'Advanced Skill-Up MicroVoucher (₹1,500)',
    description: 'Voucher code for advanced specialization course at partner centers.',
    trigger_event: '180-Day Retention Milestone',
    status: 'locked',
    redemption_code: 'VOUCH-SKILL-90-88492'
  }
];

export const MOCK_PROVIDERS: ProviderStats[] = [
  {
    provider_id: 'PRV-101',
    provider_name: 'Apex Skill Development Pvt Ltd',
    district: 'Patna',
    total_candidates: 1250,
    placement_rate: 88,
    retention_30_rate: 85,
    retention_90_rate: 81,
    retention_180_rate: 76,
    retention_365_rate: 72,
    average_starting_income_inr: 16500,
    average_current_income_inr: 21500,
    pqr_score: 94,
    rank: 1
  },
  {
    provider_id: 'PRV-102',
    provider_name: 'Gaya Vocational & Technical Society',
    district: 'Gaya',
    total_candidates: 940,
    placement_rate: 82,
    retention_30_rate: 80,
    retention_90_rate: 74,
    retention_180_rate: 70,
    retention_365_rate: 65,
    average_starting_income_inr: 14200,
    average_current_income_inr: 18000,
    pqr_score: 87,
    rank: 2
  },
  {
    provider_id: 'PRV-103',
    provider_name: 'North Bihar Youth Livelihood Trust',
    district: 'Muzaffarpur',
    total_candidates: 810,
    placement_rate: 75,
    retention_30_rate: 72,
    retention_90_rate: 68,
    retention_180_rate: 61,
    retention_365_rate: 55,
    average_starting_income_inr: 13500,
    average_current_income_inr: 16200,
    pqr_score: 79,
    rank: 3
  }
];

export const MOCK_CANDIDATE_TRAINEES: CandidateTrainee[] = [
  {
    id: 'TR-884920',
    name: 'Ananya Sharma',
    trainee_type: 'formal',
    district: 'Patna',
    sector: 'Electronics & Hardware',
    training_center: 'Patna Skill Development Institute #4',
    trust_tier: 3,
    verification_status: 'verified',
    skills: ['Micro-soldering', 'PCB Diagnostics', 'Circuit Testing', 'Quality Control'],
    phone: '+91 98765 43210',
    experience_months: 6,
    availability: 'Immediate'
  },
  {
    id: 'TR-771092',
    name: 'Rohan Gupta',
    trainee_type: 'formal',
    district: 'Patna',
    sector: 'Electronics & Hardware',
    training_center: 'Apex Skill Hub #2',
    trust_tier: 4,
    verification_status: 'verified',
    skills: ['Micro-soldering', 'SMT Assembly', 'Wiring & Safety'],
    phone: '+91 98123 45678',
    experience_months: 12,
    availability: 'Immediate'
  },
  {
    id: 'TR-553102',
    name: 'Priyanka Das',
    trainee_type: 'formal',
    district: 'Gaya',
    sector: 'IT-eFS',
    training_center: 'Gaya Tech Vocational Center',
    trust_tier: 3,
    verification_status: 'verified',
    skills: ['Data Entry Speed', 'Excel Formulas', 'Customer Service', 'Soft Skills'],
    phone: '+91 97654 32109',
    experience_months: 3,
    availability: 'Within 15 Days'
  },
  {
    id: 'TR-664210',
    name: 'Vikram Singh',
    trainee_type: 'informal',
    district: 'Muzaffarpur',
    sector: 'Automotive',
    training_center: 'North Bihar Skill Academy',
    trust_tier: 2,
    verification_status: 'verified',
    skills: ['Diagnostic Scanners', 'Hydraulic Lift Operation', 'Tool Safety', 'EV Engine Maintenance'],
    phone: '+91 96543 21098',
    experience_months: 8,
    availability: 'Immediate'
  },
  {
    id: 'TR-339811',
    name: 'Sunita Devi',
    trainee_type: 'informal',
    district: 'Bhagalpur',
    sector: 'Textiles & Apparel',
    training_center: 'Bhagalpur Micro-Skill Center',
    trust_tier: 4,
    verification_status: 'verified',
    skills: ['Automated Looms', 'Quality Control', 'Tailoring & Stitching', 'Garment Patterning'],
    phone: '+91 95432 10987',
    experience_months: 18,
    availability: 'Within 30 Days'
  },
  {
    id: 'TR-994301',
    name: 'Amitabh Kumar',
    trainee_type: 'formal',
    district: 'Patna',
    sector: 'Solar & Renewable Energy',
    training_center: 'Patna Skill Development Institute #4',
    trust_tier: 3,
    verification_status: 'verified',
    skills: ['Solar Panel Installation', 'Grid Inverter Wiring', 'Wiring & Safety', 'Quality Control'],
    phone: '+91 94321 09876',
    experience_months: 5,
    availability: 'Immediate'
  }
];

export const MOCK_CENTER_PERFORMANCE: TrainingCenterPerformance[] = [
  {
    center_id: 'CTR-Patna-04',
    center_name: 'Patna Skill Development Institute #4',
    district: 'Patna',
    sector: 'Electronics & Hardware',
    total_trainees: 450,
    trainee_satisfaction_score: 94,
    placement_rate: 89,
    retention_180_rate: 82,
    avg_starting_salary_inr: 18500,
    sentinel_flags_count: 0,
    performance_rating: 'Top Performing',
    trainee_feedback_summary: '96% of trainees reported excellent practical lab equipment, high instructor availability, and timely job placement support.'
  },
  {
    center_id: 'CTR-Gaya-02',
    center_name: 'Gaya Tech Vocational Center',
    district: 'Gaya',
    sector: 'IT & ITES',
    total_trainees: 320,
    trainee_satisfaction_score: 88,
    placement_rate: 82,
    retention_180_rate: 74,
    avg_starting_salary_inr: 15800,
    sentinel_flags_count: 1,
    performance_rating: 'High Retention',
    trainee_feedback_summary: 'Strong digital literacy modules and Soft Skills training; 88% trainees verified steady wage payments.'
  },
  {
    center_id: 'CTR-Muz-01',
    center_name: 'North Bihar Skill Academy',
    district: 'Muzaffarpur',
    sector: 'Automotive',
    total_trainees: 280,
    trainee_satisfaction_score: 79,
    placement_rate: 74,
    retention_180_rate: 65,
    avg_starting_salary_inr: 14500,
    sentinel_flags_count: 1,
    performance_rating: 'Satisfactory',
    trainee_feedback_summary: 'Good automotive workshop facilities; trainees suggested more frequent local employer placement drives.'
  },
  {
    center_id: 'CTR-Bha-03',
    center_name: 'Bhagalpur Micro-Skill Center',
    district: 'Bhagalpur',
    sector: 'Apparel & Handloom',
    total_trainees: 210,
    trainee_satisfaction_score: 91,
    placement_rate: 86,
    retention_180_rate: 79,
    avg_starting_salary_inr: 16200,
    sentinel_flags_count: 0,
    performance_rating: 'Top Performing',
    trainee_feedback_summary: 'Exceptional self-employment support for informal sector textile artisans and UPI digital payment onboarding.'
  },
  {
    center_id: 'CTR-Patna-02',
    center_name: 'Apex Skill Hub #2',
    district: 'Patna',
    sector: 'Healthcare & Logistics',
    total_trainees: 190,
    trainee_satisfaction_score: 64,
    placement_rate: 62,
    retention_180_rate: 51,
    avg_starting_salary_inr: 12000,
    sentinel_flags_count: 3,
    performance_rating: 'Needs Review',
    trainee_feedback_summary: 'Multiple trainee reports regarding delayed placement letters and duplicate salary slip verification flags.'
  }
];

