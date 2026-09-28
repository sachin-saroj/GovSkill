import React, { useState, useMemo } from 'react';
import { QuizAttempt } from '@/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  Filter,
  UserCheck,
  Calendar,
  FileText,
  ShieldCheck,
} from 'lucide-react';

interface EmployeeReadinessTableProps {
  attempts: QuizAttempt[];
  isLoading: boolean;
  offset: number;
  limit: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export const EmployeeReadinessTable: React.FC<EmployeeReadinessTableProps> = ({
  attempts,
  isLoading,
  offset,
  limit,
  onPrevPage,
  onNextPage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'passed' | 'review'>('all');
  const [selectedAttemptIndex, setSelectedAttemptIndex] = useState<number>(0);

  // Client-side search and status filtering for current page
  const filteredAttempts = useMemo(() => {
    return attempts.filter((att) => {
      const matchesSearch =
        searchQuery === '' ||
        att.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        att.module_title.toLowerCase().includes(searchQuery.toLowerCase());

      const pct = att.total > 0 ? (att.score / att.total) * 100 : 0;
      const isPass = pct >= 75;

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'passed' && isPass) ||
        (statusFilter === 'review' && !isPass);

      return matchesSearch && matchesStatus;
    });
  }, [attempts, searchQuery, statusFilter]);

  const selectedAttempt = filteredAttempts[selectedAttemptIndex] || filteredAttempts[0] || null;

  return (
    <div className="space-y-6">
      {/* Section Header with Controls */}
      <div className="bg-surface rounded-2xl border border-border-warm p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-warm/70 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 rounded-full bg-civic" />
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-ink-muted">
                Audit Registry • Evaluation Logs
              </span>
            </div>
            <h2 className="font-sans font-bold text-xl uppercase tracking-tight text-ink">
              Employee Quiz Performance Log
            </h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Official server-evaluated attempt logs and competency achievements
            </p>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2 text-xs font-mono text-ink-muted font-bold self-start sm:self-auto">
            <span className="px-2.5 py-1 bg-surface-light border border-border-warm rounded-full">
              Offset: {offset}
            </span>
            <button
              type="button"
              disabled={offset === 0 || isLoading}
              onClick={onPrevPage}
              aria-label="Previous page"
              className="p-2 rounded-full border border-border-warm bg-surface-light text-ink hover:bg-surface-elevated disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={attempts.length < limit || isLoading}
              onClick={onNextPage}
              aria-label="Next page"
              className="p-2 rounded-full border border-border-warm bg-surface-light text-ink hover:bg-surface-elevated disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedAttemptIndex(0);
              }}
              placeholder="Filter by officer email or module title..."
              className="w-full pl-9 pr-3 py-1.5 text-xs font-sans text-ink bg-surface-light border border-border-warm rounded-full focus:outline-none focus:ring-1 focus:ring-ink"
            />
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <Filter className="h-3 w-3 text-ink-muted mr-1" />
            <span className="text-[10px] font-mono uppercase text-ink-muted mr-1 hidden sm:inline">Status:</span>
            <button
              type="button"
              onClick={() => {
                setStatusFilter('all');
                setSelectedAttemptIndex(0);
              }}
              className={`px-3 py-1 text-xs font-mono font-bold rounded-full transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-ink text-on-ink'
                  : 'bg-surface-light text-ink-muted hover:text-ink border border-border-warm'
              }`}
            >
              All ({attempts.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter('passed');
                setSelectedAttemptIndex(0);
              }}
              className={`px-3 py-1 text-xs font-mono font-bold rounded-full transition-all cursor-pointer ${
                statusFilter === 'passed'
                  ? 'bg-sage text-white'
                  : 'bg-surface-light text-ink-muted hover:text-ink border border-border-warm'
              }`}
            >
              Passed
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter('review');
                setSelectedAttemptIndex(0);
              }}
              className={`px-3 py-1 text-xs font-mono font-bold rounded-full transition-all cursor-pointer ${
                statusFilter === 'review'
                  ? 'bg-rose text-white'
                  : 'bg-surface-light text-ink-muted hover:text-ink border border-border-warm'
              }`}
            >
              Review
            </button>
          </div>
        </div>
      </div>

      {/* MASTER -> DETAIL WORKSPACE */}
      {isLoading ? (
        <Card className="p-12 text-center text-xs font-mono text-ink-muted flex items-center justify-center gap-2 bg-surface rounded-2xl border-border-warm shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin text-ink" />
          <span>Loading attempt logs...</span>
        </Card>
      ) : attempts.length === 0 ? (
        <Card className="p-12 text-center text-xs font-sans text-ink-muted bg-surface rounded-2xl border-border-warm shadow-sm">
          No employee quiz attempts recorded yet.
        </Card>
      ) : filteredAttempts.length === 0 ? (
        <Card className="p-8 text-center text-xs font-sans text-ink-muted bg-surface rounded-2xl border-border-warm shadow-sm">
          No attempts match your filter criteria. Try clearing search or status filters.
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* MASTER: Log Table (7 cols on lg) */}
          <div className="lg:col-span-7 bg-surface rounded-2xl border border-border-warm overflow-hidden shadow-sm">
            <div className="px-5 py-3 border-b border-border-warm/70 bg-surface-light flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-ink-muted">
                Attempt Records ({filteredAttempts.length})
              </span>
              <span className="text-[10px] font-mono text-ink-muted">
                Select row to inspect dossier
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-ink border-collapse">
                <thead className="bg-surface-light/60 border-b border-border-warm/70 text-[10px] font-mono font-bold text-ink-muted uppercase tracking-[0.12em]">
                  <tr>
                    <th className="px-4 py-3 border-r border-border-warm/50">Employee Email</th>
                    <th className="px-4 py-3 border-r border-border-warm/50">Module Title</th>
                    <th className="px-4 py-3 border-r border-border-warm/50">Score</th>
                    <th className="px-4 py-3 border-r border-border-warm/50">Percentage</th>
                    <th className="px-4 py-3">Submitted At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-warm/50 font-normal">
                  {filteredAttempts.map((att, idx) => {
                    const pct = att.total > 0 ? Math.round((att.score / att.total) * 100) : 0;
                    const isPass = pct >= 75;
                    const isSelected = selectedAttempt === att;

                    return (
                      <tr
                        key={idx}
                        onClick={() => setSelectedAttemptIndex(idx)}
                        className={`transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-surface-elevated border-l-4 border-l-ink font-medium shadow-xs'
                            : 'hover:bg-surface-light/80'
                        }`}
                      >
                        <td className="px-4 py-3.5 font-mono text-xs text-ink border-r border-border-warm/50 truncate max-w-[170px]" title={att.user_email}>
                          {att.user_email}
                        </td>
                        <td className="px-4 py-3.5 text-ink font-sans border-r border-border-warm/50">
                          {att.module_title}
                        </td>
                        <td className="px-4 py-3.5 font-mono font-bold text-ink border-r border-border-warm/50 whitespace-nowrap">
                          {att.score} / {att.total}
                        </td>
                        <td className="px-4 py-3.5 border-r border-border-warm/50 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold rounded-full border ${
                              isPass
                                ? 'bg-sage/15 text-sage border-sage/30'
                                : 'bg-rose/15 text-rose border-rose/30'
                            }`}
                          >
                            {pct}%
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-ink-muted font-mono text-[11px] whitespace-nowrap">
                          {att.submitted_at ? new Date(att.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* DETAIL: Selected Attempt Dossier (5 cols on lg) */}
          <div className="lg:col-span-5 bg-surface rounded-2xl border border-border-warm p-6 space-y-5 shadow-sm sticky top-6">
            <div className="flex items-center justify-between border-b border-border-warm/70 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-civic" />
                <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-ink">
                  Attempt Dossier Record
                </h3>
              </div>
              {selectedAttempt && (
                <Badge
                  variant={
                    selectedAttempt.total > 0 && (selectedAttempt.score / selectedAttempt.total) >= 0.75
                      ? 'success'
                      : 'warning'
                  }
                  size="sm"
                  className="rounded-full font-mono text-[10px] uppercase tracking-wider"
                >
                  {selectedAttempt.total > 0 && (selectedAttempt.score / selectedAttempt.total) >= 0.75
                    ? 'Evaluated: Pass'
                    : 'Needs Intervention'}
                </Badge>
              )}
            </div>

            {selectedAttempt ? (
              <div className="space-y-4">
                {/* Officer Information Card */}
                <div className="p-4 bg-surface-light rounded-xl border border-border-warm space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
                    <UserCheck className="h-3.5 w-3.5 text-civic" />
                    <span>Officer Identity</span>
                  </div>
                  <p className="font-mono text-sm font-bold text-ink break-all">
                    Account: {selectedAttempt.user_email}
                  </p>
                  <p className="text-[11px] text-ink-muted font-sans">
                    Authenticated Municipal Personnel Account
                  </p>
                </div>

                {/* Module & Performance Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 bg-surface-light rounded-xl border border-border-warm space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted block">
                      Curriculum Module
                    </span>
                    <p className="font-sans font-bold text-xs text-ink line-clamp-2">
                      Course: {selectedAttempt.module_title}
                    </p>
                  </div>

                  <div className="p-3.5 bg-surface-light rounded-xl border border-border-warm space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted block">
                      Score Achieved
                    </span>
                    <p className="font-mono font-bold text-base text-ink">
                      Score: {selectedAttempt.score} / {selectedAttempt.total}
                    </p>
                    <span className="text-[10px] font-mono text-ink-muted">
                      ({selectedAttempt.total > 0 ? Math.round((selectedAttempt.score / selectedAttempt.total) * 100) : 0}%)
                    </span>
                  </div>
                </div>

                {/* Audit Timestamp & Verification */}
                <div className="p-3.5 bg-surface-light rounded-xl border border-border-warm flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 text-ink-muted">
                    <Calendar className="h-3.5 w-3.5 text-ink-muted" />
                    <span>Timestamp:</span>
                  </div>
                  <span className="text-ink font-bold">
                    {selectedAttempt.submitted_at
                      ? new Date(selectedAttempt.submitted_at).toLocaleString()
                      : 'Recently submitted'}
                  </span>
                </div>

                {/* Supervisory Governance Guidance */}
                <div className="p-4 bg-surface-elevated rounded-xl border border-border-warm text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-ink">
                    <ShieldCheck className="h-3.5 w-3.5 text-civic" />
                    <span>Supervisory Guidance</span>
                  </div>
                  <p className="text-ink-muted text-[11px] leading-relaxed">
                    {selectedAttempt.total > 0 && (selectedAttempt.score / selectedAttempt.total) >= 0.75
                      ? 'The officer has satisfied the 75% statutory proficiency threshold for this module. Verified certificate issuance is eligible.'
                      : 'The score is below the 75% threshold. Recommend remedial review of training lessons and targeted AI tutor assistance.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-ink-muted">
                Select an attempt row from the table to view the officer dossier.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeReadinessTable;
