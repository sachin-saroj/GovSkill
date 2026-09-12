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
    <Card className="p-0 overflow-hidden border-[#D9CFBB] shadow-xs bg-[#EDE4D0] rounded-2xl">
      {/* Table Header Controls */}
      <div className="px-6 py-4 border-b border-[#D9CFBB] bg-[#EDE4D0] flex items-center justify-between">
        <div>
          <h2 className="font-serif text-lg font-normal text-[#0A0A0A] tracking-tight">
            Employee Quiz Performance Log
          </h2>
          <p className="text-xs text-[#6B6357] font-sans font-normal">
            Official server-evaluated attempt logs and competency achievements
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#6B6357] font-semibold">
          <span>Offset: {offset}</span>
          <button
            type="button"
            disabled={offset === 0 || isLoading}
            onClick={onPrevPage}
            aria-label="Previous page"
            className="p-1.5 border border-[#D9CFBB] bg-[#F5EFE0] text-[#0A0A0A] rounded-full hover:bg-[#EDE4D0] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={attempts.length < limit || isLoading}
            onClick={onNextPage}
            aria-label="Next page"
            className="p-1.5 border border-[#D9CFBB] bg-[#F5EFE0] text-[#0A0A0A] rounded-full hover:bg-[#EDE4D0] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs font-mono text-[#6B6357] flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-[#0A0A0A]" />
          <span>Loading attempt logs...</span>
        </div>
      ) : attempts.length === 0 ? (
        <div className="p-12 text-center text-xs font-sans text-[#6B6357] font-normal">
          No employee quiz attempts recorded yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#0A0A0A]">
            <thead className="bg-[#F5EFE0] border-b border-[#D9CFBB] text-[10px] font-mono font-semibold text-[#6B6357] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Employee Email</th>
                <th className="px-6 py-3.5">Module Title</th>
                <th className="px-6 py-3.5">Score</th>
                <th className="px-6 py-3.5">Percentage</th>
                <th className="px-6 py-3.5">Submitted At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9CFBB]/60 font-normal">
              {attempts.map((att, idx) => {
                const pct = att.total > 0 ? Math.round((att.score / att.total) * 100) : 0;
                const isPass = pct >= 75;

                return (
                  <tr key={idx} className="hover:bg-[#F5EFE0]/60 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-[#0A0A0A]">
                      {att.user_email}
                    </td>
                    <td className="px-6 py-4 text-[#0A0A0A] font-sans font-medium">
                      {att.module_title}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-[#0A0A0A]">
                      {att.score} / {att.total}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                          isPass
                            ? 'bg-[#EDE4D0] text-[#2A5B4A] border-[#2A5B4A]/40'
                            : 'bg-[#EDE4D0] text-[#C97B5A] border-[#C97B5A]/40'
                        }`}
                      >
                        {pct}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#6B6357] font-mono text-xs">
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
