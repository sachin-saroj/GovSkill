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
    <Card className="p-0 overflow-hidden border border-[#E4E4E7] shadow-none bg-white rounded-none">
      {/* Table Header Controls */}
      <div className="px-6 py-4 border-b border-[#E4E4E7] bg-white flex items-center justify-between">
        <div>
          <h2 className="font-sans font-black text-lg uppercase tracking-tight text-[#09090B]">
            Employee Quiz Performance Log
          </h2>
          <p className="text-xs text-[#71717A] font-sans">
            Official server-evaluated attempt logs and competency achievements
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#71717A] font-bold">
          <span>Offset: {offset}</span>
          <button
            type="button"
            disabled={offset === 0 || isLoading}
            onClick={onPrevPage}
            aria-label="Previous page"
            className="p-1.5 border border-[#E4E4E7] bg-white text-[#09090B] hover:bg-[#FAFAFA] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-none cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={attempts.length < limit || isLoading}
            onClick={onNextPage}
            aria-label="Next page"
            className="p-1.5 border border-[#E4E4E7] bg-white text-[#09090B] hover:bg-[#FAFAFA] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-none cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs font-mono text-[#71717A] flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-[#09090B]" />
          <span>Loading attempt logs...</span>
        </div>
      ) : attempts.length === 0 ? (
        <div className="p-12 text-center text-xs font-sans text-[#71717A]">
          No employee quiz attempts recorded yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#09090B] border-collapse">
            <thead className="bg-[#FAFAFA] border-b border-[#E4E4E7] text-[10px] font-mono font-bold text-[#71717A] uppercase tracking-[0.15em]">
              <tr>
                <th className="px-6 py-3.5 border-r border-[#E4E4E7]">Employee Email</th>
                <th className="px-6 py-3.5 border-r border-[#E4E4E7]">Module Title</th>
                <th className="px-6 py-3.5 border-r border-[#E4E4E7]">Score</th>
                <th className="px-6 py-3.5 border-r border-[#E4E4E7]">Percentage</th>
                <th className="px-6 py-3.5">Submitted At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7] font-normal">
              {attempts.map((att, idx) => {
                const pct = att.total > 0 ? Math.round((att.score / att.total) * 100) : 0;
                const isPass = pct >= 75;

                return (
                  <tr key={idx} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-[#09090B] border-r border-[#E4E4E7]">
                      {att.user_email}
                    </td>
                    <td className="px-6 py-4 text-[#09090B] font-sans font-medium border-r border-[#E4E4E7]">
                      {att.module_title}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-[#09090B] border-r border-[#E4E4E7]">
                      {att.score} / {att.total}
                    </td>
                    <td className="px-6 py-4 border-r border-[#E4E4E7]">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold border ${
                          isPass
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-orange-50 text-[#AF411E] border-orange-200'
                        }`}
                      >
                        {pct}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#71717A] font-mono text-xs">
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
