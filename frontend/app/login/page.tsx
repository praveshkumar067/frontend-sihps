'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, TraineeRegData, EmployerRegData, OfficerRegData } from '@/lib/context/AuthContext';
import { Role, TraineeType } from '@/lib/types';
import {
  ShieldCheck,
  UserCheck,
  Building2,
  Lock,
  ArrowRight,
  Briefcase,
  Store,
  LogIn,
  UserPlus,
  Sparkles,
  CheckCircle2,
  Phone,
  MapPin,
  FileText
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginAsRole, registerAsRole, giveConsent } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<Role>('trainee');
  const [error, setError] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Login form state
  const [traineeType, setTraineeType] = useState<TraineeType>('formal');
  const [vidInput, setVidInput] = useState<string>('9823-4412-8801');
  const [employerName, setEmployerName] = useState<string>('Apex Micro-Electronics Pvt Ltd');
  const [officerId, setOfficerId] = useState<string>('OFF-77201 (Patna District)');
  const [consentChecked, setConsentChecked] = useState<boolean>(true);

  // Registration form state - Trainee
  const [regFullName, setRegFullName] = useState<string>('');
  const [regVid, setRegVid] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regTraineeType, setRegTraineeType] = useState<TraineeType>('formal');
  const [regSkillTrade, setRegSkillTrade] = useState<string>('Electrical & Electronics');
  const [regTcId, setRegTcId] = useState<string>('TC-PATNA-102');
  const [regStateDistrict, setRegStateDistrict] = useState<string>('Patna, Bihar');
  const [regConsent, setRegConsent] = useState<boolean>(true);

  // Registration form state - Employer
  const [regCompName, setRegCompName] = useState<string>('');
  const [regEmpType, setRegEmpType] = useState<string>('MSME / Electronics Manufacturing');
  const [regGstin, setRegGstin] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regEmpLocation, setRegEmpLocation] = useState<string>('');

  // Registration form state - Officer
  const [regOfficerName, setRegOfficerName] = useState<string>('');
  const [regOfficerDesignation, setRegOfficerDesignation] = useState<string>('District Nodal Officer');
  const [regOfficerCode, setRegOfficerCode] = useState<string>('');
  const [regJurisdiction, setRegJurisdiction] = useState<string>('Patna District, Bihar');

  useEffect(() => {
    const initialMode = searchParams.get('mode');
    if (initialMode === 'register') {
      setMode('register');
    }
  }, [searchParams]);

  const formatVid = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 12);
    const parts = [];
    for (let i = 0; i < digits.length; i += 4) {
      parts.push(digits.slice(i, i + 4));
    }
    return parts.join('-');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedRole === 'trainee') {
      const rawDigits = vidInput.replace(/\D/g, '');
      if (rawDigits.length !== 12) {
        setError('Please enter a valid 12-digit Aadhaar Virtual ID (VID)');
        return;
      }
      if (!consentChecked) {
        setError('Please accept the consent terms to proceed');
        return;
      }
      await loginAsRole('trainee', { vid: vidInput, traineeType });
      giveConsent();
      router.push('/trainee');
    } else if (selectedRole === 'employer') {
      if (!employerName.trim()) {
        setError('Please enter your company name');
        return;
      }
      await loginAsRole('employer', { name: employerName });
      router.push('/employer');
    } else if (selectedRole === 'officer') {
      if (!officerId.trim()) {
        setError('Please enter your Officer Credential / ID');
        return;
      }
      await loginAsRole('officer', { name: officerId });
      router.push('/officer');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedRole === 'trainee') {
      if (!regFullName.trim()) {
        setError('Please enter your full name');
        return;
      }
      const rawVid = regVid.replace(/\D/g, '');
      if (rawVid.length !== 12) {
        setError('Please enter a valid 12-digit Aadhaar Virtual ID (VID)');
        return;
      }
      if (!regConsent) {
        setError('Please accept the retention tracking consent terms');
        return;
      }
      const data: TraineeRegData = {
        fullName: regFullName,
        vid: regVid,
        phone: regPhone,
        traineeType: regTraineeType,
        skillTrade: regSkillTrade,
        tcId: regTcId,
        stateDistrict: regStateDistrict
      };
      await registerAsRole('trainee', data);
      giveConsent();
      setSuccessMsg('Registration successful! Redirecting to Trainee Dashboard...');
      setTimeout(() => router.push('/trainee'), 800);
    } else if (selectedRole === 'employer') {
      if (!regCompName.trim()) {
        setError('Please enter your registered organization / company name');
        return;
      }
      const data: EmployerRegData = {
        companyName: regCompName,
        employerType: regEmpType,
        registrationNumber: regGstin,
        contactEmail: regEmail,
        location: regEmpLocation
      };
      await registerAsRole('employer', data);
      setSuccessMsg('Employer registration successful! Redirecting to Employer Portal...');
      setTimeout(() => router.push('/employer'), 800);
    } else if (selectedRole === 'officer') {
      if (!regOfficerName.trim()) {
        setError('Please enter the officer name');
        return;
      }
      if (!regOfficerCode.trim()) {
        setError('Please enter the Government Officer ID / Code');
        return;
      }
      const data: OfficerRegData = {
        officerName: regOfficerName,
        designation: regOfficerDesignation,
        officerId: regOfficerCode,
        jurisdiction: regJurisdiction
      };
      await registerAsRole('officer', data);
      setSuccessMsg('District Officer registered! Redirecting to SentinelAI Dashboard...');
      setTimeout(() => router.push('/officer'), 800);
    }
  };

  const fillSampleRegistration = () => {
    if (selectedRole === 'trainee') {
      setRegFullName('Priya Sharma');
      setRegVid('9823-4412-8801');
      setRegPhone('+91 98765 43210');
      setRegTraineeType('formal');
      setRegSkillTrade('Solar PV Technician & Renewable Energy');
      setRegTcId('TC-PATNA-102');
      setRegStateDistrict('Patna District, Bihar');
    } else if (selectedRole === 'employer') {
      setRegCompName('SuryaTech Clean Energy Solutions Ltd');
      setRegEmpType('Renewable Energy & Solar Equipment Provider');
      setRegGstin('10AAACS8829K1Z4');
      setRegEmail('hr@suryatech.in');
      setRegEmpLocation('Patna Industrial Area, Bihar');
    } else if (selectedRole === 'officer') {
      setRegOfficerName('Rajesh Kumar Verma');
      setRegOfficerDesignation('Senior District Skill Development Officer');
      setRegOfficerCode('OFF-98402');
      setRegJurisdiction('Patna & Nalanda Districts, Bihar');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6">
      {/* Header Branding */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-900/20 mb-4 ring-4 ring-slate-200">
          <ShieldCheck className="w-10 h-10 stroke-[2.5]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Lifelong Livelihood Support Platform
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-md mx-auto font-medium">
          Verified Skill Passport & Employment Retention Platform (PS 26135)
        </p>
      </div>

      <div className="dash-card bg-white border border-slate-300 shadow-xl rounded-2xl overflow-hidden">
        {/* Mode Switcher Tabs: Login vs Register */}
        <div className="grid grid-cols-2 bg-slate-100 p-1.5 border-b border-slate-300">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
              setSuccessMsg('');
            }}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
              mode === 'login'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/60'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Sign In / Login
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
              setSuccessMsg('');
            }}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
              mode === 'register'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/60'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            New Registration / Sign Up
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Role Selector Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block text-center">
              Select User Portal Role
            </label>
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 border border-slate-300 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('trainee');
                  setError('');
                }}
                className={`py-2.5 px-2 rounded-lg text-xs font-extrabold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                  selectedRole === 'trainee'
                    ? 'bg-slate-900 text-white shadow'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                Trainee
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('employer');
                  setError('');
                }}
                className={`py-2.5 px-2 rounded-lg text-xs font-extrabold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                  selectedRole === 'employer'
                    ? 'bg-slate-900 text-white shadow'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Employer
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('officer');
                  setError('');
                }}
                className={`py-2.5 px-2 rounded-lg text-xs font-extrabold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                  selectedRole === 'officer'
                    ? 'bg-slate-900 text-white shadow'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <Lock className="w-4 h-4" />
                District Officer
              </button>
            </div>
          </div>

          {/* Alert Error / Success */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-600 inline-block shrink-0" />
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              {successMsg}
            </div>
          )}

          {/* LOGIN MODE FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              {selectedRole === 'trainee' && (
                <>
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-md">
                      <Lock className="w-3.5 h-3.5" /> Trainee Login Authentication
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900">Aadhaar VID Authentication</h2>
                    <p className="text-xs text-slate-600">
                      Select your employment classification and enter your 12-digit Aadhaar Virtual ID.
                    </p>
                  </div>

                  {/* Trainee Sub-Type Selection */}
                  <div className="space-y-2 pt-1">
                    <label className="text-xs font-bold text-slate-800 block">Employment Sector Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setTraineeType('formal')}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2 transition-all ${
                          traineeType === 'formal'
                            ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-sm ring-2 ring-indigo-500/20'
                            : 'border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg ${traineeType === 'formal' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                            <Briefcase className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-extrabold">Formal Trainee</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-normal leading-tight">
                          Salaried placement, wage contracts & corporate Retention Tracking.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTraineeType('informal')}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2 transition-all ${
                          traineeType === 'informal'
                            ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 shadow-sm ring-2 ring-emerald-500/20'
                            : 'border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg ${traineeType === 'informal' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                            <Store className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-extrabold">Informal Trainee</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-normal leading-tight">
                          Self-employed, micro-enterprise, UPI QR earnings & geotagged proof.
                        </p>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-800">12-Digit Virtual ID (VID)</label>
                    <input
                      type="text"
                      value={vidInput}
                      onChange={(e) => setVidInput(formatVid(e.target.value))}
                      placeholder="9823-4412-8801"
                      maxLength={14}
                      className="w-full bg-slate-50 border border-slate-300 focus:border-slate-900 rounded-xl px-4 py-3 text-base text-slate-900 font-mono font-bold tracking-wider focus:outline-none transition-all"
                    />
                  </div>

                  <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-slate-900 rounded"
                    />
                    <span className="text-xs text-slate-800 font-medium">
                      I consent to sharing periodic employment retention status in exchange for Verified Skill Passport credentials and loan priority access.
                    </span>
                  </label>
                </>
              )}

              {selectedRole === 'employer' && (
                <>
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-md">
                      <Building2 className="w-3.5 h-3.5" /> SkillBridge Employer Authentication
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900">Employer Portal Login</h2>
                    <p className="text-xs text-slate-600">
                      Access employer candidate skill-matching, job posting, and retention feedback forms.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-800">Registered Employer / Company Name</label>
                    <input
                      type="text"
                      value={employerName}
                      onChange={(e) => setEmployerName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 focus:border-slate-900 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:outline-none"
                      required
                    />
                  </div>
                </>
              )}

              {selectedRole === 'officer' && (
                <>
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-md">
                      <Lock className="w-3.5 h-3.5" /> SentinelAI District Officer Access
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900">District Officer Authentication</h2>
                    <p className="text-xs text-slate-600">
                      Review fraud flag anomaly queues, Skill Bridge analytics, and Training Center audits.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-800">District Officer ID / Credential</label>
                    <input
                      type="text"
                      value={officerId}
                      onChange={(e) => setOfficerId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 focus:border-slate-900 rounded-xl px-4 py-3 text-sm text-slate-900 font-mono font-bold focus:outline-none"
                      required
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-4 font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
              >
                Authenticate as {selectedRole === 'trainee' ? `${traineeType.toUpperCase()} TRAINEE` : selectedRole.toUpperCase()} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* REGISTER MODE FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-5">
              {/* Header text per role */}
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-md">
                  <UserPlus className="w-3.5 h-3.5" /> New Account Registration
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Register as {selectedRole === 'trainee' ? 'Trainee' : selectedRole === 'employer' ? 'Employer / Partner' : 'District Officer'}
                </h2>
                <p className="text-xs text-slate-600">
                  Create your profile to access Skill Passports, employment retention tools, or district dashboards.
                </p>
              </div>

              {/* TRAINEE REGISTRATION FORM */}
              {selectedRole === 'trainee' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Full Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Priya Sharma"
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 focus:border-slate-900 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">12-Digit Aadhaar VID *</label>
                      <input
                        type="text"
                        placeholder="9823-4412-8801"
                        value={regVid}
                        onChange={(e) => setRegVid(formatVid(e.target.value))}
                        maxLength={14}
                        className="w-full bg-slate-50 border border-slate-300 focus:border-slate-900 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-slate-900 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-500" /> Mobile Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 focus:border-slate-900 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" /> District & State
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Patna District, Bihar"
                        value={regStateDistrict}
                        onChange={(e) => setRegStateDistrict(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 focus:border-slate-900 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Sector Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-800 block">Employment Classification Sector</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRegTraineeType('formal')}
                        className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                          regTraineeType === 'formal'
                            ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-sm ring-2 ring-indigo-500/20'
                            : 'border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${regTraineeType === 'formal' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold">Formal Sector</p>
                          <p className="text-[10px] text-slate-500">Corporate placement & payslips</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRegTraineeType('informal')}
                        className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                          regTraineeType === 'informal'
                            ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 shadow-sm ring-2 ring-emerald-500/20'
                            : 'border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${regTraineeType === 'informal' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                          <Store className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold">Informal Sector</p>
                          <p className="text-[10px] text-slate-500">Self-employed & UPI earnings</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Certified Skill Trade / Specialization</label>
                      <select
                        value={regSkillTrade}
                        onChange={(e) => setRegSkillTrade(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 focus:border-slate-900 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none"
                      >
                        <option value="Electrical & Electronics">Electrical & Electronics</option>
                        <option value="Solar PV Technician & Renewable Energy">Solar PV Technician & Renewable Energy</option>
                        <option value="Automotive Technician">Automotive Technician</option>
                        <option value="Healthcare & Nursing Assistant">Healthcare & Nursing Assistant</option>
                        <option value="Micro-Enterprise & Retail Services">Micro-Enterprise & Retail Services</option>
                        <option value="Data Entry & IT Operations">Data Entry & IT Operations</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-slate-500" /> Training Center Code
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. TC-PATNA-102"
                        value={regTcId}
                        onChange={(e) => setRegTcId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 focus:border-slate-900 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={regConsent}
                      onChange={(e) => setRegConsent(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-slate-900 rounded"
                    />
                    <span className="text-xs text-slate-800 font-medium">
                      I agree to enroll in the Lifelong Livelihood Support Platform, share periodic proof of retention, and receive verified digital Skill Passports.
                    </span>
                  </label>
                </>
              )}

              {/* EMPLOYER REGISTRATION FORM */}
              {selectedRole === 'employer' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Organization / Company Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. SuryaTech Clean Energy Solutions Ltd"
                      value={regCompName}
                      onChange={(e) => setRegCompName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 focus:border-slate-900 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Industry Sector / Category</label>
                      <input
                        type="text"
                        placeholder="e.g. Manufacturing / Electronics"
                        value={regEmpType}
                        onChange={(e) => setRegEmpType(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 focus:border-slate-900 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">GSTIN / CIN Registration ID</label>
                      <input
                        type="text"
                        placeholder="e.g. 10AAACS8829K1Z4"
                        value={regGstin}
                        onChange={(e) => setRegGstin(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 focus:border-slate-900 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Official Contact Email</label>
                      <input
                        type="email"
                        placeholder="hr@company.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 focus:border-slate-900 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" /> Location / Operating Region
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Patna Industrial Complex"
                        value={regEmpLocation}
                        onChange={(e) => setRegEmpLocation(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 focus:border-slate-900 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* OFFICER REGISTRATION FORM */}
              {selectedRole === 'officer' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Officer Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Rajesh Kumar Verma"
                      value={regOfficerName}
                      onChange={(e) => setRegOfficerName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 focus:border-slate-900 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Government Designation</label>
                      <input
                        type="text"
                        placeholder="District Nodal Officer / Auditor"
                        value={regOfficerDesignation}
                        onChange={(e) => setRegOfficerDesignation(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 focus:border-slate-900 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Government Employee ID / Code *</label>
                      <input
                        type="text"
                        placeholder="OFF-98402"
                        value={regOfficerCode}
                        onChange={(e) => setRegOfficerCode(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 focus:border-slate-900 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-slate-900 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" /> District & State Jurisdiction
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Patna District, Bihar"
                      value={regJurisdiction}
                      onChange={(e) => setRegJurisdiction(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 focus:border-slate-900 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* Submit Registration Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
              >
                Register & Access {selectedRole === 'trainee' ? `${regTraineeType.toUpperCase()} PORTAL` : selectedRole.toUpperCase()} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick Demo Utilities Footer */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick Evaluation Helpers:
              </span>
              {mode === 'register' ? (
                <button
                  type="button"
                  onClick={fillSampleRegistration}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200"
                >
                  Pre-fill Demo Registration Data
                </button>
              ) : (
                <div className="flex items-center gap-2 text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('trainee');
                      setTraineeType('formal');
                      setVidInput('9823-4412-8801');
                    }}
                    className="text-slate-600 hover:text-slate-900 underline"
                  >
                    Demo Trainee
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('employer');
                      setEmployerName('Apex Micro-Electronics Pvt Ltd');
                    }}
                    className="text-slate-600 hover:text-slate-900 underline"
                  >
                    Demo Employer
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('officer');
                      setOfficerId('OFF-77201 (Patna District)');
                    }}
                    className="text-slate-600 hover:text-slate-900 underline"
                  >
                    Demo Officer
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto py-24 text-center">
        <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-3 animate-pulse">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <p className="text-xs font-bold text-slate-500">Loading authentication portal...</p>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
