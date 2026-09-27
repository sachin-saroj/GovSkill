import React from 'react';
import { AssessmentHistoryItem } from '@/types';
import Card from '@/components/ui/Card';
import { History, Award, AlertCircle, FileQuestion, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface AssessmentHistoryTableProps {
  history: AssessmentHistoryItem[];
}

export const AssessmentHistoryTable: React.FC<AssessmentHistoryTableProps> = ({ history }) => {
  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return isoStr;
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-[#0E50B0]" />
          <h3 className="font-sans font-black text-xl uppercase tracking-tight text-[#09090B]">
            Assessment Attempt History
          </h3>
        </div>
        <span className="text-[11px] font-mono uppercase font-bold text-[#71717A]">
          {history.length} {history.length === 1 ? 'Recorded Attempt' : 'Recorded Attempts'}
        </span>
      </div>

      {history.length === 0 ? (
        <Card className="p-6 rounded-none text-center border border-[#E4E4E7] bg-white shadow-none">
          <div className="max-w-md mx-auto space-y-2">
            <div className="inline-flex p-3 bg-[#FAFAFA] text-[#71717A] border border-[#E4E4E7]">
              <FileQuestion className="h-6 w-6" />
            </div>
            <h4 className="font-sans font-bold text-base uppercase tracking-tight text-[#09090B]">No Assessment Records Found</h4>
            <p className="text-caption text-[#71717A]">
              Complete official module lessons and take the end-of-module quiz to record your verified competency score.
            </p>
          </div>
        </Card>
      ) : (
        <div className="border border-[#E4E4E7] bg-white shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-caption border-collapse">
              <thead className="bg-[#FAFAFA] border-b border-[#E4E4E7] text-[#71717A] font-mono font-bold uppercase tracking-[0.15em] text-[10px]">
                <tr>
                  <th scope="col" className="px-4 py-3 border-r border-[#E4E4E7]">Date & Time</th>
                  <th scope="col" className="px-4 py-3 border-r border-[#E4E4E7]">Module</th>
                  <th scope="col" className="px-4 py-3 border-r border-[#E4E4E7]">Attempt</th>
                  <th scope="col" className="px-4 py-3 text-center border-r border-[#E4E4E7]">Score</th>
                  <th scope="col" className="px-4 py-3 text-center border-r border-[#E4E4E7]">Growth Delta</th>
                  <th scope="col" className="px-4 py-3 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4E7] font-normal">
                {history.map((item) => {
                  const delta = item.improvement_from_previous;

                  return (
                    <tr key={item.attempt_id} className="hover:bg-[#FAFAFA] transition-colors">
                      <td className="px-4 py-3 text-[#71717A] whitespace-nowrap font-mono text-xs border-r border-[#E4E4E7]">
                        {formatDate(item.submitted_at)}
                      </td>
                      <td className="px-4 py-3 text-[#09090B] font-bold max-w-[220px] truncate text-caption border-r border-[#E4E4E7]">
                        {item.module_title}
                      </td>
                      <td className="px-4 py-3 text-[#71717A] border-r border-[#E4E4E7]">
                        <span className="inline-block px-2 py-0.5 bg-[#FAFAFA] text-[10px] font-mono font-bold text-[#09090B] border border-[#E4E4E7]">
                          #{item.attempt_number}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-mono font-bold text-[#09090B] text-caption border-r border-[#E4E4E7]">
                        {item.score} / {item.total} ({item.score_percentage}%)
                      </td>
                      <td className="px-4 py-3 text-center border-r border-[#E4E4E7]">
                        {delta !== undefined && delta !== null ? (
                          delta > 0 ? (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                              <TrendingUp className="h-3 w-3 text-emerald-700" />
                              <span>+{delta}%</span>
                            </span>
                          ) : delta < 0 ? (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold bg-orange-50 text-[#AF411E] border border-orange-200 font-mono">
                              <TrendingDown className="h-3 w-3 text-[#AF411E]" />
                              <span>{delta}%</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-medium bg-[#FAFAFA] text-[#71717A] font-mono border border-[#E4E4E7]">
                              <Minus className="h-3 w-3 text-[#71717A]" />
                              <span>0%</span>
                            </span>
                          )
                        ) : (
                          <span className="text-caption text-[#71717A] font-mono text-[11px]">
                            Initial Attempt
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {item.passed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-mono uppercase font-bold tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <Award className="h-3 w-3 text-emerald-700" />
                            <span>Passed (&ge;75%)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-mono uppercase font-bold tracking-wider bg-orange-50 text-[#AF411E] border border-orange-200">
                            <AlertCircle className="h-3 w-3 text-[#AF411E]" />
                            <span>Below 75% Standard</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentHistoryTable;
