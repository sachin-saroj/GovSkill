import React from 'react';
import { QuizAttempt } from '@/types';
import Card from '@/components/ui/Card';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

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
  return (
    <Card className="p-0 overflow-hidden border-slate-200 shadow-civic-sm bg-white rounded-civic-xl">
      {/* Table Header Controls */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div>
          <h2 className="text-section-heading font-semibold text-slate-900">
            Employee Quiz Performance Log
          </h2>
          <p className="text-caption text-slate-500 font-normal">
            Official server-evaluated attempt logs and competency achievements
          </p>
        </div>

        <div className="flex items-center gap-2 text-caption text-slate-600 font-semibold">
          <span>Offset: {offset}</span>
          <button
            type="button"
            disabled={offset === 0 || isLoading}
            onClick={onPrevPage}
            aria-label="Previous page"
            className="p-1.5 border border-slate-300 rounded-civic-md hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-civic-xs cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={attempts.length < limit || isLoading}
            onClick={onNextPage}
            aria-label="Next page"
            className="p-1.5 border border-slate-300 rounded-civic-md hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-civic-xs cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-caption text-slate-500 flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-civic-700" />
          <span className="font-medium">Loading attempt logs...</span>
        </div>
      ) : attempts.length === 0 ? (
        <div className="p-12 text-center text-caption text-slate-500 font-normal">
          No employee quiz attempts recorded yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-caption text-slate-900">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-micro font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Employee Email</th>
                <th className="px-6 py-3.5">Module Title</th>
                <th className="px-6 py-3.5">Score</th>
                <th className="px-6 py-3.5">Percentage</th>
                <th className="px-6 py-3.5">Submitted At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {attempts.map((att, idx) => {
                const pct = att.total > 0 ? Math.round((att.score / att.total) * 100) : 0;
                const isPass = pct >= 75;

                return (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-slate-900">
                      {att.user_email}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {att.module_title}
                    </td>
                    <td className="px-6 py-4 font-semibold text-civic-900 font-mono">
                      {att.score} / {att.total}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-micro font-semibold border shadow-civic-xs ${
                          isPass
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-saffron-50 text-saffron-900 border-saffron-200'
                        }`}
                      >
                        {pct}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-normal">
                      {att.submitted_at ? new Date(att.submitted_at).toLocaleString() : 'Recent'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default EmployeeReadinessTable;
