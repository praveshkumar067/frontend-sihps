'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { api } from '@/lib/api';
import { Wallet, ShieldCheck, Camera, QrCode, Send, CheckCircle2, FileCheck, ArrowLeft } from 'lucide-react';

export default function TraineeIncomePage() {
  const { user } = useAuth();
  const trainee = user?.traineeProfile;
  const isFormal = (trainee?.trainee_type || user?.trainee_type) === 'formal';

  const [businessType, setBusinessType] = useState<string>('Micro Retail / Kirana');
  const [revenueBand, setRevenueBand] = useState<string>('₹10,000 - ₹20,000');
  const [verificationPath, setVerificationPath] = useState<'geotagged_photo' | 'upi_qr'>('geotagged_photo');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [upiQrId, setUpiQrId] = useState<string>('merchant88492@upi');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (isFormal) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 space-y-6 text-center">
        <div className="dash-card p-8 bg-white border border-slate-200 shadow-md space-y-4">
          <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Wallet className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
              Formal Employee Access
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">Informal Income Module Not Applicable</h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed mt-2">
              LivelihoodLens Informal Income & Revenue Band tracking is designed exclusively for <strong>Informal & Self-Employed Trainees</strong>.
            </p>
            <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
              As a <strong>Formal Employee</strong>, your salary verification is managed via official pay slips, offer letters, and bank statements.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/trainee/evidence"
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2 transition-all"
            >
              <FileCheck className="w-4 h-4 text-emerald-400" /> Upload Salary Pay Slip
            </Link>
            <Link
              href="/trainee"
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }


  const REVENUE_BANDS = [
    'Below ₹5,000 / month',
    '₹5,000 - ₹10,000 / month',
    '₹10,000 - ₹20,000 / month',
    '₹20,000 - ₹50,000 / month',
    'Above ₹50,000 / month'
  ];

  const BUSINESS_TYPES = [
    'Micro Retail / Kirana',
    'Street Vendor / Food Stall',
    'Repair Services / Electrical',
    'Gig Delivery / Transport',
    'Handicraft / Artisan',
    'Agriculture / Dairy'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.submitLivelihoodLens({
        trainee_id: trainee?.trainee_id,
        business_type: businessType,
        monthly_revenue_band: revenueBand,
        verification_method: verificationPath,
        upi_merchant_id: verificationPath === 'upi_qr' ? upiQrId : undefined
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md mb-2">
            <Wallet className="w-3.5 h-3.5" /> LivelihoodLens Module (Trainee Role)
          </div>
          <h1 className="text-2xl font-extrabold text-white">Informal & Gig Worker Income Verification</h1>
          <p className="text-xs text-slate-400 mt-1">
            Privacy-first revenue band reporting designed for informal entrepreneurs and gig workers.
          </p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-5 border border-brand-500/30 bg-slate-900/80 flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="space-y-1 text-xs">
          <h3 className="font-bold text-white">Zero Raw Transaction Storage Privacy Guarantee</h3>
          <p className="text-slate-300">
            We <strong className="text-brand-300">never store exact rupee amounts or private bank statements</strong>. Revenue is captured strictly as broad range bands to protect your financial privacy.
          </p>
        </div>
      </div>

      {submitted ? (
        <div className="glass-panel rounded-2xl p-8 border border-emerald-500/30 text-center space-y-4">
          <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
          <h3 className="text-xl font-bold text-white">Informal Revenue Band Recorded!</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Your reported revenue band (<strong className="text-emerald-400">{revenueBand}</strong>) has been appended to your encrypted profile.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-5 py-2.5 bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-700"
          >
            Update Revenue Reporting
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Self-Employed Activity Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {BUSINESS_TYPES.map((bType) => (
                <button
                  key={bType}
                  type="button"
                  onClick={() => setBusinessType(bType)}
                  className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                    businessType === bType
                      ? 'bg-brand-500/20 text-brand-300 border-brand-500/50 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {bType}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">
              Monthly Revenue Range Band (No Free-Text Income Inputs)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {REVENUE_BANDS.map((band) => (
                <button
                  key={band}
                  type="button"
                  onClick={() => setRevenueBand(band)}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                    revenueBand === band
                      ? 'bg-slate-900 border-emerald-400 text-white shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {band}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-800/80">
            <label className="text-xs font-semibold text-slate-300">Choose Verification Pathway</label>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setVerificationPath('geotagged_photo')}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  verificationPath === 'geotagged_photo'
                    ? 'bg-brand-600 border-brand-400 text-white'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                <Camera className="w-4 h-4" /> Upload Shopfront Photo
              </button>

              <button
                type="button"
                onClick={() => setVerificationPath('upi_qr')}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  verificationPath === 'upi_qr'
                    ? 'bg-brand-600 border-brand-400 text-white'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                <QrCode className="w-4 h-4" /> Enter Merchant UPI QR ID
              </button>
            </div>

            {verificationPath === 'geotagged_photo' && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <label className="text-xs font-medium text-slate-300">Geotagged Shopfront / Workstation Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files && setPhotoFile(e.target.files[0])}
                  className="w-full bg-slate-900 text-xs text-slate-400 rounded-lg p-2 border border-slate-800 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-slate-800 file:text-slate-200"
                />
              </div>
            )}

            {verificationPath === 'upi_qr' && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <label className="text-xs font-medium text-slate-300">Merchant UPI VPA / QR ID</label>
                <input
                  type="text"
                  value={upiQrId}
                  onChange={(e) => setUpiQrId(e.target.value)}
                  placeholder="e.g. merchantname@paytm"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-brand-500"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Submitting to API...' : 'Submit Livelihood Revenue Report (POST /api/module6/livelihoodlens)'}
          </button>
        </form>
      )}
    </div>
  );
}
