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
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-rose-900/30">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-md mb-2">
            <Lock className="w-3.5 h-3.5" /> SentinelAI Internal Officer Interface (Role Protected)
          </div>
          <h1 className="text-2xl font-extrabold text-white">District Officer Fraud & Anomaly Queue</h1>
          <p className="text-xs text-slate-400 mt-1">
            Reviewing flagged claim hashes, centre anomaly scores, and suspicious salary slip patterns.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span className="text-slate-300">Pending Flags: <strong className="text-rose-400">{claims.filter(c => c.status === 'pending_review').length}</strong></span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px] bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search claim ID, trainee name, or flag keyword..."
            className="bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none w-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-medium">District:</span>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none"
            >
              {districts.map(d => (
                <option key={d} value={d} className="bg-slate-900 text-slate-200">{d}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs">
            <span className="text-slate-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none"
            >
              <option value="All" className="bg-slate-900 text-slate-200">All Statuses</option>
              <option value="pending_review" className="bg-slate-900 text-slate-200">Pending Review</option>
              <option value="approved" className="bg-slate-900 text-slate-200">Approved</option>
              <option value="rejected" className="bg-slate-900 text-slate-200">Rejected</option>
              <option value="more_info_requested" className="bg-slate-900 text-slate-200">More Info</option>
            </select>
          </div>
        </div>
      </div>

      {/* Flagged Claims Cards List */}
      <div className="space-y-4">
        {filteredClaims.map((claim) => {
          const isPending = claim.status === 'pending_review';
          return (
            <div
              key={claim.claim_id}
              className="glass-panel rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white font-mono">{claim.claim_id}</h3>
                      <span className="text-xs text-slate-400">• Trainee: <strong className="text-slate-200">{claim.trainee_name}</strong></span>
                      <span className="text-xs font-mono text-emerald-300">({claim.trainee_id})</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      District: <strong className="text-slate-200">{claim.district}</strong> | Centre: <strong className="text-slate-200">{claim.training_center}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-xs font-bold text-rose-400 font-mono">
                      Risk Score: {claim.risk_score}/100
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">
                      Centre Flag: {claim.centre_flag_status}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                      claim.status === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : claim.status === 'rejected'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : claim.status === 'more_info_requested'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {claim.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Flag Reason & Anomaly List */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                <p className="text-xs text-rose-300 font-semibold flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  Primary Anomaly: {claim.flag_reason}
                </p>
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Detected Anomaly Vectors:</span>
                  <ul className="list-disc pl-4 text-xs text-slate-400 space-y-0.5">
                    {claim.outcome_anomalies.map((anom, idx) => (
                      <li key={idx}>{anom}</li>
                    ))}
                  </ul>
                </div>
                {claim.officer_notes && (
                  <div className="pt-2 mt-2 border-t border-slate-800 text-xs text-emerald-300">
                    <strong>Officer Remarks:</strong> {claim.officer_notes}
                  </div>
                )}
              </div>

              {/* Action Buttons with Modal Trigger */}
              {isPending && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    onClick={() => handleOpenModal(claim, 'approved')}
                    className="px-4 py-2 bg-slate-900/20 hover:bg-slate-900/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve Claim
                  </button>
                  <button
                    onClick={() => handleOpenModal(claim, 'more_info_requested')}
                    className="px-4 py-2 bg-slate-900/20 hover:bg-slate-900/30 border border-amber-500/40 text-amber-300 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <HelpCircle className="w-3.5 h-3.5" /> Request More Info
                  </button>
                  <button
                    onClick={() => handleOpenModal(claim, 'rejected')}
                    className="px-4 py-2 bg-slate-900/20 hover:bg-slate-900/30 border border-rose-500/40 text-rose-300 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject Claim
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
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
