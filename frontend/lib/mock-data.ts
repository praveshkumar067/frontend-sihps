import {
  TrainingCenterProfile,
  CheckInOutcome,
  EvidenceSubmission,
  SkillGapData,
  SentinelFlaggedClaim,
  IncentiveItem,
  ProviderStats,
  CandidateTrainingCenter,
  TrainingCenterPerformance,
  InviteRecord
} from './types';

export const MOCK_TRAINING_CENTER: TrainingCenterProfile = {
  training_center_id: 'TC-884920',
  vid: '9823-4412-8801',
  full_name: 'Ananya Sharma',
  phone: '+91 98765 43210',
  district: 'Pune',
  sector: 'Electronics & Hardware',
  training_center: 'Pune Skill Development Institute #4',
  completion_date: '2026-03-15',
  consent_given: true,
  trust_tier: 3,
  verification_status: 'verified',
  training_center_type: 'formal'
};

export const MOCK_CHECKINS: CheckInOutcome[] = [
  {
    id: 'chk-30',
    training_center_id: 'TC-884920',
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
    training_center_id: 'TC-884920',
    milestone_days: 90,
    status: 'pending',
    due_date: '2026-06-15',
    submitted_via: 'web'
  },
  {
    id: 'chk-180',
    training_center_id: 'TC-884920',
    milestone_days: 180,
    status: 'pending',
    due_date: '2026-09-15',
    submitted_via: 'web'
  },
  {
    id: 'chk-365',
    training_center_id: 'TC-884920',
    milestone_days: 365,
    status: 'pending',
    due_date: '2027-03-15',
    submitted_via: 'web'
  }
];

export const MOCK_EVIDENCE: EvidenceSubmission[] = [
  {
    id: 'ev-1',
    training_center_id: 'TC-884920',
    evidence_type: 'pay_slip',
    file_name: 'Apex_PaySlip_April2026.pdf',
    upload_timestamp: '2026-04-16 10:30 AM',
    status: 'verified',
    tier_granted: 3
  },
  {
    id: 'ev-2',
    training_center_id: 'TC-884920',
    evidence_type: 'offer_letter',
    file_name: 'Apex_OfferLetter_Signed.pdf',
    upload_timestamp: '2026-03-20 02:15 PM',
    status: 'verified',
    tier_granted: 2
  }
];

export const MOCK_SKILL_GAPS: SkillGapData[] = [
  { district: 'Pune', sector: 'Electronics', gap_frequency: 85, top_gaps: ['Micro-soldering', 'PCB Diagnostics', 'Punctuality'] },
  { district: 'Pune', sector: 'Automotive', gap_frequency: 60, top_gaps: ['EV Engine Maintenance', 'Tool Safety'] },
  { district: 'Pune', sector: 'Healthcare', gap_frequency: 40, top_gaps: ['Patient Communication', 'Record keeping'] },
  { district: 'Nagpur', sector: 'Electronics', gap_frequency: 90, top_gaps: ['Circuit Testing', 'Soft Skills'] },
  { district: 'Nagpur', sector: 'Retail', gap_frequency: 55, top_gaps: ['POS Handling', 'Customer Service'] },
  { district: 'Nagpur', sector: 'IT-eFS', gap_frequency: 70, top_gaps: ['Data Entry Speed', 'Excel Formulas'] },
  { district: 'Nashik', sector: 'Automotive', gap_frequency: 75, top_gaps: ['Diagnostic Scanners', 'Hydraulic Lift Operation'] },
  { district: 'Nashik', sector: 'Healthcare', gap_frequency: 65, top_gaps: ['ECG Operation', 'English Communication'] },
  { district: 'Chhatrapati Sambhajinagar', sector: 'Textiles', gap_frequency: 88, top_gaps: ['Automated Looms', 'Quality Control'] },
  { district: 'Solapur', sector: 'Agriculture', gap_frequency: 50, top_gaps: ['Drone Operation', 'Soil Sensor Calibration'] }
];

export const MOCK_SENTINEL_CLAIMS: SentinelFlaggedClaim[] = [
  {
    claim_id: 'FLG-9921',
    training_center_id: 'TC-77102',
    training_center_name: 'Rahul Verma',
    district: 'Pune',
    training_center: 'Pune Skill Hub #2',
    flag_reason: 'Duplicate salary slip hash across 4 distinct training centers',
    risk_score: 92,
    evidence_tier: 1,
    centre_flag_status: 'under_audit',
    outcome_anomalies: [
      'Identical salary bank statement PDF checksums',
      'All 4 training centers reported exact salary ₹24,500/mo on same day',
      'Employer GSTIN matches dissolved entity'
    ],
    submission_date: '2026-08-25',
    status: 'pending_review'
  },
  {
    claim_id: 'FLG-9924',
    training_center_id: 'TC-66381',
    training_center_name: 'Pooja Kumari',
    district: 'Nagpur',
    training_center: 'Nagpur Tech Vocational Center',
    flag_reason: 'Rapid completion anomaly (30 & 90 day outcomes submitted in 3 days)',
    risk_score: 78,
    evidence_tier: 0,
    centre_flag_status: 'suspicious',
    outcome_anomalies: [
      'Outcome timeline date mismatch with course end date',
      'IP address geo-location mismatch (Mumbai IP for Nagpur center)'
    ],
    submission_date: '2026-08-26',
    status: 'pending_review'
  },
  {
    claim_id: 'FLG-9930',
    training_center_id: 'TC-55419',
    training_center_name: 'Manish Kumar',
    district: 'Nashik',
    training_center: 'North Maharashtra Skill Academy',
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
    candidate_id: 'TC-884920',
    incentive_type: 'skill_passport',
    title: 'Verified Digital Skill Passport',
    description: 'Tamper-proof digital badge certifying completed outcome and Tier 3 verified employment.',
    trigger_event: 'Tier 3 Trust Verified',
    status: 'unlocked',
    unlocked_date: '2026-04-16'
  },
  {
    id: 'inc-2',
    candidate_id: 'TC-884920',
    incentive_type: 'scheme_priority',
    title: 'PM Mudra Loan Priority Access',
    description: 'Fast-track collateral-free loan processing up to ₹1,00,000 for self-employed/entrepreneurial growth.',
    trigger_event: '90-Day Retention Verified',
    status: 'unlocked',
    unlocked_date: '2026-06-16'
  },
  {
    id: 'inc-3',
    candidate_id: 'TC-884920',
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
    district: 'Pune',
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
    provider_name: 'Nagpur Vocational & Technical Society',
    district: 'Nagpur',
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
    provider_name: 'Maharashtra Youth Livelihood Trust',
    district: 'Nashik',
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

export const MOCK_CANDIDATE_TRAINING_CENTERS: CandidateTrainingCenter[] = [
  {
    id: 'TC-884920',
    name: 'Ananya Sharma',
    training_center_type: 'formal',
    district: 'Pune',
    sector: 'Electronics & Hardware',
    training_center: 'Pune Skill Development Institute #4',
    trust_tier: 3,
    verification_status: 'verified',
    skills: ['Micro-soldering', 'PCB Diagnostics', 'Circuit Testing', 'Quality Control'],
    phone: '+91 98765 43210',
    experience_months: 6,
    availability: 'Immediate'
  },
  {
    id: 'TC-771092',
    name: 'Rohan Gupta',
    training_center_type: 'formal',
    district: 'Pune',
    sector: 'Electronics & Hardware',
    training_center: 'Pune Skill Hub #2',
    trust_tier: 4,
    verification_status: 'verified',
    skills: ['Micro-soldering', 'SMT Assembly', 'Wiring & Safety'],
    phone: '+91 98123 45678',
    experience_months: 12,
    availability: 'Immediate'
  },
  {
    id: 'TC-553102',
    name: 'Priyanka Das',
    training_center_type: 'formal',
    district: 'Nagpur',
    sector: 'IT-eFS',
    training_center: 'Nagpur Tech Vocational Center',
    trust_tier: 3,
    verification_status: 'verified',
    skills: ['Data Entry Speed', 'Excel Formulas', 'Customer Service', 'Soft Skills'],
    phone: '+91 97654 32109',
    experience_months: 3,
    availability: 'Within 15 Days'
  },
  {
    id: 'TC-664210',
    name: 'Vikram Singh',
    training_center_type: 'informal',
    district: 'Nashik',
    sector: 'Automotive',
    training_center: 'North Maharashtra Skill Academy',
    trust_tier: 2,
    verification_status: 'verified',
    skills: ['Diagnostic Scanners', 'Hydraulic Lift Operation', 'Tool Safety', 'EV Engine Maintenance'],
    phone: '+91 96543 21098',
    experience_months: 8,
    availability: 'Immediate'
  },
  {
    id: 'TC-339811',
    name: 'Sunita Devi',
    training_center_type: 'informal',
    district: 'Chhatrapati Sambhajinagar',
    sector: 'Textiles & Apparel',
    training_center: 'Chhatrapati Sambhajinagar Micro-Skill Center',
    trust_tier: 4,
    verification_status: 'verified',
    skills: ['Automated Looms', 'Quality Control', 'Tailoring & Stitching', 'Garment Patterning'],
    phone: '+91 95432 10987',
    experience_months: 18,
    availability: 'Within 30 Days'
  },
  {
    id: 'TC-994301',
    name: 'Amitabh Kumar',
    training_center_type: 'formal',
    district: 'Pune',
    sector: 'Solar & Renewable Energy',
    training_center: 'Pune Skill Development Institute #4',
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
    center_id: 'CTR-Pune-04',
    center_name: 'Pune Skill Development Institute #4',
    district: 'Pune',
    sector: 'Electronics & Hardware',
    total_training_centers: 450,
    training_center_satisfaction_score: 94,
    placement_rate: 89,
    retention_180_rate: 82,
    avg_starting_salary_inr: 18500,
    sentinel_flags_count: 0,
    performance_rating: 'Top Performing',
    training_center_feedback_summary: '96% of training centers reported excellent practical lab equipment, high instructor availability, and timely job placement support.'
  },
  {
    center_id: 'CTR-Nagpur-02',
    center_name: 'Nagpur Tech Vocational Center',
    district: 'Nagpur',
    sector: 'IT & ITES',
    total_training_centers: 320,
    training_center_satisfaction_score: 88,
    placement_rate: 82,
    retention_180_rate: 74,
    avg_starting_salary_inr: 15800,
    sentinel_flags_count: 1,
    performance_rating: 'High Retention',
    training_center_feedback_summary: 'Strong digital literacy modules and Soft Skills training; 88% training centers verified steady wage payments.'
  },
  {
    center_id: 'CTR-Nashik-01',
    center_name: 'North Maharashtra Skill Academy',
    district: 'Nashik',
    sector: 'Automotive',
    total_training_centers: 280,
    training_center_satisfaction_score: 79,
    placement_rate: 74,
    retention_180_rate: 65,
    avg_starting_salary_inr: 14500,
    sentinel_flags_count: 1,
    performance_rating: 'Satisfactory',
    training_center_feedback_summary: 'Good automotive workshop facilities; training centers suggested more frequent local employer placement drives.'
  },
  {
    center_id: 'CTR-CS-03',
    center_name: 'Chhatrapati Sambhajinagar Micro-Skill Center',
    district: 'Chhatrapati Sambhajinagar',
    sector: 'Apparel & Handloom',
    total_training_centers: 210,
    training_center_satisfaction_score: 91,
    placement_rate: 86,
    retention_180_rate: 79,
    avg_starting_salary_inr: 16200,
    sentinel_flags_count: 0,
    performance_rating: 'Top Performing',
    training_center_feedback_summary: 'Exceptional self-employment support for informal sector textile artisans and UPI digital payment onboarding.'
  },
  {
    center_id: 'CTR-Pune-02',
    center_name: 'Pune Skill Hub #2',
    district: 'Pune',
    sector: 'Healthcare & Logistics',
    total_training_centers: 190,
    training_center_satisfaction_score: 64,
    placement_rate: 62,
    retention_180_rate: 51,
    avg_starting_salary_inr: 12000,
    sentinel_flags_count: 3,
    performance_rating: 'Needs Review',
    training_center_feedback_summary: 'Multiple reports regarding delayed placement letters and duplicate salary slip verification flags.'
  }
];

export const MOCK_INVITES: InviteRecord[] = [
  {
    id: 'inv-101',
    token: 'inv-8f92a10b-3341',
    recipientName: 'Kavita Patel',
    recipientPhone: '+919876543210',
    recipientEmail: 'kavita.patel@example.com',
    customMessage: 'Please complete your registration with Pune Skill Center so we can finalize your outcome record.',
    status: 'sent',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString()
  },
  {
    id: 'inv-102',
    token: 'inv-4b12c89d-7721',
    recipientName: 'Suresh More',
    recipientPhone: '+919812345678',
    recipientEmail: 'suresh.more@example.com',
    customMessage: 'Welcome to the skill program. Click link to complete registration.',
    status: 'opened',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6).toISOString()
  },
  {
    id: 'inv-103',
    token: 'inv-9e33f11a-5542',
    recipientName: 'Aarti Deshmukh',
    recipientPhone: '+919765432109',
    recipientEmail: 'aarti.d@example.com',
    customMessage: 'Registration invite for Solar Technician course.',
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString()
  },
  {
    id: 'inv-104',
    token: 'inv-2c44e99b-1102',
    recipientName: 'Ramesh Jadhav',
    recipientPhone: '+919654321098',
    recipientEmail: 'ramesh.j@example.com',
    customMessage: 'Expiring invite link.',
    status: 'expired',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
  }
];
