'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { InviteRecord } from '@/lib/types';
import {
  Send,
  UserPlus,
  Share2,
  Copy,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  ExternalLink,
  Phone,
  Mail,
  MessageSquare,
  RefreshCw,
  Trash2,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function TrainingCenterInvitesPage() {
  const [invites, setInvites] = useState<InviteRecord[]>([]);
  const [recipientName, setRecipientName] = useState<string>('');
  const [recipientPhone, setRecipientPhone] = useState<string>('');
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>(
    'Greetings! Please complete your registration details for your training center outcome record using this secure link.'
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [lastCreated, setLastCreated] = useState<InviteRecord | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [origin, setOrigin] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
    loadInvites();
  }, []);

  const loadInvites = async () => {
    try {
      const data = await api.getInvites();
      setInvites(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim()) return;

    setLoading(true);
    try {
      const record = await api.createInvite({
        recipientName,
        recipientPhone,
        recipientEmail,
        customMessage
      });
      setLastCreated(record);
      setRecipientName('');
      setRecipientPhone('');
      setRecipientEmail('');
      loadInvites();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (id: string) => {
    try {
      await api.revokeInvite(id);
      loadInvites();
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = (inviteUrl: string, token: string) => {
    navigator.clipboard.writeText(inviteUrl);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const getWhatsAppUrl = (invite: InviteRecord) => {
    const inviteUrl = `${origin}/invite/${invite.token}`;
    const cleanPhone = invite.recipientPhone ? invite.recipientPhone.replace(/\D/g, '') : '';
    const text = `${invite.customMessage || 'Please complete your registration:'}\n\n👉 Registration Link: ${inviteUrl}`;
    return cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="dash-card p-6 bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-md mb-2">
            <Send className="w-3.5 h-3.5" /> Registration Link Invites (Training Center)
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Send Registration Link to Recipient</h1>
          <p className="text-xs text-slate-500 mt-1">
            If someone is unable to fill out their own details, send them a unique, expiring registration link via WhatsApp, SMS, or Email.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-slate-700">Token Expiry: <strong className="text-slate-900">7 Days</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Create Invite Form */}
        <div className="dash-card p-6 bg-white border border-slate-200 space-y-5 lg:col-span-1 h-fit">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-indigo-600" />
              Generate New Registration Link
            </h2>
            <p className="text-xs text-slate-500">
              Fill in the recipient's details to construct a personalized invite URL.
            </p>
          </div>

          <form onSubmit={handleCreateInvite} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Recipient Name *</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Ramesh Deshmukh"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone Number (WhatsApp / SMS)
              </label>
              <input
                type="tel"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address (Optional)
              </label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="e.g. ramesh@example.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> Custom Prefilled Message
              </label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={3}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Generating Unique Token...' : 'Generate & Send Registration Link'}
            </button>
          </form>

          {/* Last Created Quick Card */}
          {lastCreated && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 space-y-3">
              <div className="flex items-center justify-between text-xs text-emerald-900 font-bold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Link Created Successfully!
                </span>
                <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-emerald-200">
                  {lastCreated.token}
                </span>
              </div>

              <div className="text-xs text-slate-700 space-y-1">
                <p>Recipient: <strong>{lastCreated.recipientName}</strong></p>
                <p className="font-mono text-[11px] text-slate-500 break-all bg-white p-2 rounded border border-slate-200">
                  {`${origin}/invite/${lastCreated.token}`}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={getWhatsAppUrl(lastCreated)}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow text-center flex items-center justify-center gap-1 transition-all"
                >
                  <Send className="w-3.5 h-3.5" /> WhatsApp
                </a>

                <button
                  onClick={() => copyToClipboard(`${origin}/invite/${lastCreated.token}`, lastCreated.token)}
                  className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow text-center flex items-center justify-center gap-1 transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedToken === lastCreated.token ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Training Center Invites Dashboard Table */}
        <div className="dash-card p-6 bg-white border border-slate-200 space-y-4 lg:col-span-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">Training Center Sent Invites Directory</h2>
              <p className="text-xs text-slate-500">Track and manage invite link delivery and completion status.</p>
            </div>
            <button
              onClick={loadInvites}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh List
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>Recipient</th>
                  <th>Status</th>
                  <th>Contact</th>
                  <th>Created / Expires</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invites.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-500 text-xs">
                      No registration invites generated yet. Use the form to send your first invite link.
                    </td>
                  </tr>
                ) : (
                  invites.map((invite) => {
                    const inviteUrl = `${origin}/invite/${invite.token}`;
                    return (
                      <tr key={invite.id}>
                        <td>
                          <div className="font-bold text-slate-900">{invite.recipientName}</div>
                          <div className="text-[10px] font-mono text-slate-400">{invite.token}</div>
                        </td>
                        <td>
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              invite.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : invite.status === 'opened'
                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                : invite.status === 'sent'
                                ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                                : 'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}
                          >
                            {invite.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                            {invite.status === 'opened' && <Eye className="w-3 h-3 text-blue-600" />}
                            {invite.status === 'sent' && <Clock className="w-3 h-3 text-indigo-600" />}
                            {invite.status === 'expired' && <XCircle className="w-3 h-3 text-rose-600" />}
                            {invite.status}
                          </span>
                        </td>
                        <td className="text-xs text-slate-600">
                          {invite.recipientPhone || invite.recipientEmail || <span className="text-slate-400 italic">No contact info</span>}
                        </td>
                        <td className="text-[11px] font-mono text-slate-500">
                          <div>Created: {new Date(invite.createdAt).toLocaleDateString()}</div>
                          <div className="text-[10px] text-slate-400">Expires: {new Date(invite.expiresAt).toLocaleDateString()}</div>
                        </td>
                        <td>
                          <div className="flex items-center gap-1.5">
                            {/* Copy Link */}
                            <button
                              onClick={() => copyToClipboard(inviteUrl, invite.token)}
                              className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                              title="Copy Link"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            {/* Send via WhatsApp */}
                            <a
                              href={getWhatsAppUrl(invite)}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                              title="Send via WhatsApp"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </a>

                            {/* Preview Recipient Link */}
                            <a
                              href={`/invite/${invite.token}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
                              title="Test / Open Link"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>

                            {/* Revoke */}
                            {invite.status !== 'completed' && invite.status !== 'expired' && (
                              <button
                                onClick={() => handleRevoke(invite.id)}
                                className="p-1.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                                title="Revoke Invite"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
