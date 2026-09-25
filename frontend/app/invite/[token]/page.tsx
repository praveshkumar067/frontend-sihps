'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { InviteRecord, TrainingCenterType } from '@/lib/types';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Briefcase,
  Store,
  Phone,
  MapPin,
  FileText,
  UserCheck,
  Sparkles,
  Lock
} from 'lucide-react';

export default function RecipientInvitePage({ params }: { params: { token: string } }) {
  const token = params.token;
  const [loading, setLoading] = useState<boolean>(true);
  const [inviteValid, setInviteValid] = useState<boolean>(false);
  const [invite, setInvite] = useState<InviteRecord | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  // Registration Form State
  const [fullName, setFullName] = useState<string>('');
  const [vid, setVid] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [tcType, setTcType] = useState<TrainingCenterType>('formal');
  const [skillTrade, setSkillTrade] = useState<string>('Electrical & Electronics');
  const [tcId, setTcId] = useState<string>('TC-PUNE-102');
  const [stateDistrict, setStateDistrict] = useState<string>('Pune, Maharashtra');
  const [consent, setConsent] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    validateToken();
  }, [token]);

  const validateToken = async () => {
    setLoading(true);
    try {
      const res = await api.getInviteByToken(token);
      if (res.valid && res.invite) {
        setInviteValid(true);
        setInvite(res.invite);
        setFullName(res.invite.recipientName || '');
        if (res.invite.recipientPhone) {
          setPhone(res.invite.recipientPhone);
        }
      } else {
        setInviteValid(false);
        setErrorMsg(res.reason || 'This invitation link is invalid or has expired.');
      }
    } catch (err) {
      setInviteValid(false);
      setErrorMsg('Failed to validate invitation token.');
    } finally {
      setLoading(false);
    }
  };

  const formatVid = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 12);
    const parts = [];
    for (let i = 0; i < digits.length; i += 4) {
      parts.push(digits.slice(i, i + 4));
    }
    return parts.join('-');
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      alert('Please enter your full name');
      return;
    }
    const cleanVid = vid.replace(/\D/g, '');
    if (cleanVid.length !== 12) {
      alert('Please enter a valid 12-digit Aadhaar Virtual ID (VID)');
      return;
    }
    if (!consent) {
      alert('Please accept the consent terms to proceed');
      return;
    }

    setSubmitting(true);
    try {
      const regData = {
        fullName,
        vid,
        phone,
        trainingCenterType: tcType,
        skillTrade,
        tcId,
        stateDistrict
      };

      await api.completeInvite(token, regData);
      setFormSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto animate-pulse">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-white">Validating Registration Link...</h2>
          <p className="text-xs text-slate-400">Verifying security token and training center invitation details...</p>
        </div>
      </div>
    );
  }

  if (!inviteValid || !invite) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-2xl p-8 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-white">Invitation Link Unavailable</h2>
            <p className="text-xs text-rose-400 font-semibold">{errorMsg}</p>
            <p className="text-xs text-slate-400 leading-relaxed pt-2">
              The invitation token (<code>{token}</code>) may have expired after 7 days, or has already been used to complete registration. Please request a new invite link from your Training Center institute.
            </p>
          </div>

          <div className="pt-2">
            <a
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all"
            >
              Go to Platform Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (formSubmitted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-slate-950 border border-emerald-500/30 rounded-2xl p-8 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              Registration Completed!
            </span>
            <h2 className="text-2xl font-extrabold text-white">Welcome, {fullName}!</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your registration details have been securely submitted on your behalf by your Training Center. Your outcome record and Skill Passport setup are now active!
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-left text-xs space-y-2 font-mono text-slate-300">
            <div><span className="text-slate-500">Name:</span> {fullName}</div>
            <div><span className="text-slate-500">Classification:</span> {tcType.toUpperCase()} TRAINING CENTER</div>
            <div><span className="text-slate-500">Trade:</span> {skillTrade}</div>
            <div><span className="text-slate-500">District:</span> {stateDistrict}</div>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/login"
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-indigo-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              Log into Training Center Portal <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 flex flex-col justify-center items-center">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 mb-2">
            <ShieldCheck className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Training Center Onboarding Registration
          </h1>
          <p className="text-xs sm:text-sm text-indigo-300 font-medium max-w-md mx-auto">
            Complete your registration details on behalf of your Training Center via this direct invitation link (No Login Required).
          </p>
        </div>

        {/* Invite Greeting Box */}
        {invite.customMessage && (
          <div className="p-4 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-xs text-indigo-200 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-semibold mb-0.5">Message from Training Center:</strong>
              "{invite.customMessage}"
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="space-y-1 pb-4 border-b border-slate-800">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
              <UserCheck className="w-3.5 h-3.5" /> Recipient Onboarding Form
            </div>
            <h2 className="text-xl font-extrabold text-white">Fill Out Registration Profile</h2>
            <p className="text-xs text-slate-400">
              Provide your verified Virtual ID and employment classification to activate your Skill Passport.
            </p>
          </div>

          <form onSubmit={handleSubmitRegistration} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200">Full Name *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200">12-Digit Aadhaar VID *</label>
                <input
                  type="text"
                  value={vid}
                  onChange={(e) => setVid(formatVid(e.target.value))}
                  placeholder="9823-4412-8801"
                  maxLength={14}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-white focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> Mobile Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> District & State
                </label>
                <input
                  type="text"
                  value={stateDistrict}
                  onChange={(e) => setStateDistrict(e.target.value)}
                  placeholder="e.g. Pune District, Maharashtra"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Sector Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200 block">Employment Classification Sector</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTcType('formal')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    tcType === 'formal'
                      ? 'border-indigo-500 bg-indigo-950/60 text-white shadow-sm ring-2 ring-indigo-500/30'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${tcType === 'formal' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold">Formal Sector</p>
                    <p className="text-[10px] text-slate-400">Corporate placement & payslips</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTcType('informal')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    tcType === 'informal'
                      ? 'border-emerald-500 bg-emerald-950/60 text-white shadow-sm ring-2 ring-emerald-500/30'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${tcType === 'informal' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold">Informal Sector</p>
                    <p className="text-[10px] text-slate-400">Self-employed & UPI earnings</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200">Certified Skill Trade</label>
                <select
                  value={skillTrade}
                  onChange={(e) => setSkillTrade(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white focus:outline-none"
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
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" /> Training Center Code
                </label>
                <input
                  type="text"
                  value={tcId}
                  onChange={(e) => setTcId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-white focus:outline-none"
                />
              </div>
            </div>

            <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-indigo-600 rounded"
              />
              <span className="text-xs text-slate-300 font-medium">
                I agree to complete enrollment with my Training Center, consent to outcome tracking, and receive verified digital Skill Passports.
              </span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 font-extrabold text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              {submitting ? 'Submitting Registration...' : 'Complete Registration via Invite Link'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
