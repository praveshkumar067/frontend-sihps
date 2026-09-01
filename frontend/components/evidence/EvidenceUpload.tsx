'use client';

import React, { useState, useEffect } from 'react';
import { EvidenceSubmission, EvidenceType } from '@/lib/types';
import { Upload, FileText, CheckCircle2, Clock, XCircle, FilePlus } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/context/AuthContext';

interface EvidenceUploadProps {
  submissions: EvidenceSubmission[];
  onUploaded: () => void;
}

export const EvidenceUpload: React.FC<EvidenceUploadProps> = ({ submissions, onUploaded }) => {
  const { user } = useAuth();
  const traineeType = user?.trainee_type || user?.traineeProfile?.trainee_type || 'formal';

  const defaultType: EvidenceType = traineeType === 'informal' ? 'shopfront_photo' : 'pay_slip';
  const [evidenceType, setEvidenceType] = useState<EvidenceType>(defaultType);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    setEvidenceType(traineeType === 'informal' ? 'shopfront_photo' : 'pay_slip');
  }, [traineeType]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('evidence_type', evidenceType);
    formData.append('file', file);

    try {
      await api.uploadEvidence(formData);
      setFile(null);
      onUploaded();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleUploadSubmit} className="dash-card p-6 bg-white border border-slate-200 space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">Trust Verification</span>
          <h3 className="text-lg font-bold text-slate-900">Upload Supporting Evidence Document</h3>
          <p className="text-xs text-slate-600">
            {traineeType === 'informal'
              ? 'Upload shopfront photos, UPI QR proofs, or bank statements to elevate your Trust Tier.'
              : 'Upload pay slips, offer letters, or bank statements to elevate your Trust Tier.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Document Type</label>
            <select
              value={evidenceType}
              onChange={(e) => setEvidenceType(e.target.value as EvidenceType)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500 font-medium"
            >
              {traineeType === 'formal' ? (
                <>
                  <option value="pay_slip">📄 Salary Pay Slip</option>
                  <option value="offer_letter">📜 Signed Offer Letter</option>
                  <option value="bank_statement">🏦 Bank Account Statement</option>
                </>
              ) : (
                <>
                  <option value="shopfront_photo">📸 Shopfront Photo (Self-employed)</option>
                  <option value="upi_qr">💳 UPI Merchant QR Proof</option>
                  <option value="bank_statement">🏦 Bank Account Statement</option>
                </>
              )}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Select File (PDF / Image)</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg"
              className="w-full bg-slate-50 border border-slate-300 text-slate-600 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-800"
            />
          </div>
        </div>

        {file && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-800">
            <div className="flex items-center gap-2">
              <FilePlus className="w-4 h-4 text-blue-600" />
              <span className="font-mono truncate max-w-xs">{file.name}</span>
              <span className="text-[10px] text-slate-500">({(file.size / 1024).toFixed(1)} KB)</span>
            </div>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="text-slate-500 hover:text-rose-600"
            >
              Remove
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={!file || uploading}
          className={`w-full py-3 rounded-xl font-bold text-xs shadow transition-all flex items-center justify-center gap-2 ${
            file && !uploading
              ? 'bg-slate-900 hover:bg-slate-800 text-white'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Upload className="w-4 h-4" />
          {uploading ? 'Uploading...' : 'Submit Evidence (POST /api/module3/verification)'}
        </button>
      </form>

      <div className="dash-card p-6 bg-white border border-slate-200 space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Submitted Verification Documents</h3>

        {submissions.length === 0 ? (
          <p className="text-xs text-slate-500">No evidence documents submitted yet.</p>
        ) : (
          <div className="space-y-2">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-200 text-slate-700">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 font-mono">{sub.file_name}</h4>
                    <p className="text-[11px] text-slate-500 capitalize mt-0.5">
                      Type: {sub.evidence_type.replace('_', ' ')} • {sub.upload_timestamp}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border flex items-center gap-1 ${
                      sub.status === 'verified'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : sub.status === 'pending'
                        ? 'bg-amber-50 text-amber-700 border-amber-300'
                        : 'bg-rose-50 text-rose-700 border-rose-300'
                    }`}
                  >
                    {sub.status === 'verified' && <CheckCircle2 className="w-3 h-3" />}
                    {sub.status === 'pending' && <Clock className="w-3 h-3" />}
                    {sub.status === 'rejected' && <XCircle className="w-3 h-3" />}
                    {sub.status}
                  </span>

                  {sub.tier_granted !== undefined && (
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                      +Tier {sub.tier_granted}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
