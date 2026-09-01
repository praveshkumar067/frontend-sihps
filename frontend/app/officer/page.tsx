'use client';

import React, { useState, useEffect } from 'react';
import { SentinelFlaggedClaim } from '@/lib/types';
import { api } from '@/lib/api';
import { OfficerActionModal } from '@/components/sentinel/OfficerActionModal';
import { Lock, ShieldAlert, Filter, AlertTriangle, CheckCircle2, XCircle, HelpCircle, Search } from 'lucide-react';

export default function OfficerSentinelPage() {
  const [claims, setClaims] = useState<SentinelFlaggedClaim[]>([]);
  const [districtFilter, setDistrictFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedClaim, setSelectedClaim] = useState<SentinelFlaggedClaim | null>(null);
  const [modalAction, setModalAction] = useState<'approved' | 'rejected' | 'more_info_requested' | null>(null);

  const fetchClaims = async () => {
    try {
      const data = await api.getSentinelFlaggedQueue();
      setClaims(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleOpenModal = (claim: SentinelFlaggedClaim, action: 'approved' | 'rejected' | 'more_info_requested') => {
    setSelectedClaim(claim);
    setModalAction(action);
  };

  const handleConfirmAction = async (claimId: string, action: 'approved' | 'rejected' | 'more_info_requested', notes: string) => {
    try {
      const updated = await api.updateClaimStatus(claimId, action, notes);
      setClaims(claims.map(c => c.claim_id === claimId ? updated : c));
    } catch (err) {
      console.error(err);
    } finally {
      setSelectedClaim(null);
      setModalAction(null);
    }
  };

  const filteredClaims = claims.filter(claim => {
    const matchesDistrict = districtFilter === 'All' || claim.district === districtFilter;
    const matchesStatus = statusFilter === 'All' || claim.status === statusFilter;
    const matchesSearch = claim.claim_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          claim.trainee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          claim.flag_reason.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDistrict && matchesStatus && matchesSearch;
  });

  const districts = ['All', ...Array.from(new Set(claims.map(c => c.district)))];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="dash-card p-6 bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md mb-2">
            <Lock className="w-3.5 h-3.5" /> SentinelAI Internal Officer Interface (Role: Officer)
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">District Officer Fraud & Anomaly Queue</h1>
          <p className="text-xs text-slate-500 mt-1">
            Reviewing flagged claim hashes, centre anomaly scores, and suspicious salary slip patterns.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span className="text-slate-700">Pending Flags: <strong className="text-rose-700">{claims.filter(c => c.status === 'pending_review').length}</strong></span>
        </div>
      </div>

      <div className="dash-card p-4 bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px] bg-slate-50 border border-slate-300 px-3 py-2 rounded-xl">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search claim ID, trainee name, or flag keyword..."
            className="bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none w-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 px-3 py-2 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-600 font-medium">District:</span>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="bg-transparent text-slate-900 font-semibold focus:outline-none"
            >
              {districts.map(d => (
                <option key={d} value={d} className="bg-white text-slate-900">{d}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 px-3 py-2 rounded-xl text-xs">
            <span className="text-slate-600 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-900 font-semibold focus:outline-none"
            >
              <option value="All" className="bg-white text-slate-900">All Statuses</option>
              <option value="pending_review" className="bg-white text-slate-900">Pending Review</option>
              <option value="approved" className="bg-white text-slate-900">Approved</option>
              <option value="rejected" className="bg-white text-slate-900">Rejected</option>
              <option value="more_info_requested" className="bg-white text-slate-900">More Info</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredClaims.map((claim) => {
          const isPending = claim.status === 'pending_review';
          return (
            <div
              key={claim.claim_id}
              className="dash-card p-6 bg-white border border-slate-200 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 font-mono">{claim.claim_id}</h3>
                      <span className="text-xs text-slate-500">• Trainee: <strong className="text-slate-800">{claim.trainee_name}</strong></span>
                      <span className="text-xs font-mono text-indigo-700">({claim.trainee_id})</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      District: <strong className="text-slate-800">{claim.district}</strong> | Centre: <strong className="text-slate-800">{claim.training_center}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-xs font-bold text-rose-700 font-mono">
                      Risk Score: {claim.risk_score}/100
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">
                      Centre Flag: {claim.centre_flag_status}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                      claim.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : claim.status === 'rejected'
                        ? 'bg-rose-50 text-rose-700 border-rose-300'
                        : claim.status === 'more_info_requested'
                        ? 'bg-amber-50 text-amber-700 border-amber-300'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    {claim.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <p className="text-xs text-rose-800 font-bold flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  Primary Anomaly: {claim.flag_reason}
                </p>
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Detected Anomaly Vectors:</span>
                  <ul className="list-disc pl-4 text-xs text-slate-600 space-y-0.5">
                    {claim.outcome_anomalies.map((anom, idx) => (
                      <li key={idx}>{anom}</li>
                    ))}
                  </ul>
                </div>
                {claim.officer_notes && (
                  <div className="pt-2 mt-2 border-t border-slate-200 text-xs text-emerald-800">
                    <strong>Officer Remarks:</strong> {claim.officer_notes}
                  </div>
                )}
              </div>

              {isPending && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    onClick={() => handleOpenModal(claim, 'approved')}
                    className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve Claim
                  </button>
                  <button
                    onClick={() => handleOpenModal(claim, 'more_info_requested')}
                    className="px-4 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <HelpCircle className="w-3.5 h-3.5" /> Request More Info
                  </button>
                  <button
                    onClick={() => handleOpenModal(claim, 'rejected')}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject Claim
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedClaim && modalAction && (
        <OfficerActionModal
          claim={selectedClaim}
          actionType={modalAction}
          onClose={() => { setSelectedClaim(null); setModalAction(null); }}
          onConfirm={handleConfirmAction}
        />
      )}
    </div>
  );
}
