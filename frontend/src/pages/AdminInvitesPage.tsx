import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { getApiErrorMessage } from '@/lib/apiError';
import { UserPlus, AlertCircle, CheckCircle2, Trash2, Loader2, Mail } from 'lucide-react';

interface AdminInviteItem {
  id: string;
  email: string;
  created_at: string;
  expires_at: string;
  created_by_user_id: string;
  is_expired: boolean;
  is_used: boolean;
}

export const AdminInvitesPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [invites, setInvites] = useState<AdminInviteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchInvites = async () => {
    try {
      const res = await api.get<AdminInviteItem[]>('/auth/invites');
      setInvites(res.data);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to load administrator invitations.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return;

    setIsSubmitting(true);
    try {
      await api.post('/auth/invites', { email: cleanEmail });
      setSuccessMessage(`Invite sent to ${cleanEmail}`);
      setEmail('');
      await fetchInvites();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to send invite.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevoke = async (inviteId: string) => {
    setError(null);
    setSuccessMessage(null);
    setRevokingId(inviteId);

    try {
      await api.delete(`/auth/invites/${inviteId}`);
      await fetchInvites();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to revoke invite.'));
    } finally {
      setRevokingId(null);
    }
  };

  const formatTimestamp = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="h-2 w-2 rounded-full bg-black" />
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500">
            Administrative Governance • Access Management
          </span>
        </div>
        <h1 className="font-sans font-bold text-2xl sm:text-3xl tracking-tight text-zinc-900">
          Supervisor Invitations
        </h1>
        <p className="text-sm text-zinc-500 mt-1 max-w-2xl">
          Dispatch time-limited invitation links to onboard verified supervisors and department administrators.
        </p>
      </div>

      {/* Top Section — Invite Form */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-100 pb-4">
          <UserPlus className="h-5 w-5 text-zinc-700" />
          <h2 className="font-sans font-bold text-lg text-zinc-900">Invite New Administrator</h2>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSendInvite} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center pt-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="supervisor@domain.gov"
              required
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-full bg-[#111113] hover:bg-black text-white text-sm font-medium tracking-tight transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap min-h-[42px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Sending…</span>
              </>
            ) : (
              <span>Send Invite</span>
            )}
          </button>
        </form>
      </div>

      {/* Bottom Section — Invite List */}
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div>
            <h3 className="font-sans font-bold text-sm text-zinc-900 uppercase tracking-wider">
              Invitation Registry
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              History of generated administrator invites and current redemption status
            </p>
          </div>
          <span className="text-xs font-mono font-medium text-zinc-500">
            Total: {invites.length}
          </span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs font-mono text-zinc-500 flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-zinc-700" />
            <span>Loading invitations…</span>
          </div>
        ) : invites.length === 0 ? (
          <div className="p-12 text-center text-xs text-zinc-500 font-sans">
            No administrator invitations issued yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-800 border-collapse">
              <thead className="bg-zinc-50 border-b border-zinc-200/80 text-[11px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Email</th>
                  <th className="px-6 py-3.5">Created</th>
                  <th className="px-6 py-3.5">Expires</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-normal">
                {invites.map((inv) => {
                  const statusLabel = inv.is_used
                    ? 'Used'
                    : inv.is_expired
                    ? 'Expired'
                    : 'Pending';

                  const statusClass = inv.is_used
                    ? 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                    : inv.is_expired
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200';

                  const canRevoke = !inv.is_used && !inv.is_expired;

                  return (
                    <tr key={inv.id} className="hover:bg-zinc-50/70 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium text-zinc-900 select-all">
                        {inv.email}
                      </td>
                      <td className="px-6 py-4 text-zinc-500 font-mono">
                        {formatTimestamp(inv.created_at)}
                      </td>
                      <td className="px-6 py-4 text-zinc-500 font-mono">
                        {formatTimestamp(inv.expires_at)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${statusClass}`}
                        >
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {canRevoke ? (
                          <button
                            type="button"
                            onClick={() => handleRevoke(inv.id)}
                            disabled={revokingId === inv.id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {revokingId === inv.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                            <span>Revoke</span>
                          </button>
                        ) : (
                          <span className="text-zinc-400 font-mono text-[11px]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInvitesPage;
