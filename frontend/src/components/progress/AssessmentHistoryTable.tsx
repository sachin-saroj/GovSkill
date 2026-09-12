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
          <History className="h-4 w-4 text-civic-700" />
          <h3 className="text-section-heading font-semibold text-slate-900 tracking-tight">
            Assessment Attempt History
          </h3>
        </div>
        <span className="text-caption font-medium text-slate-500">
          {history.length} {history.length === 1 ? 'Recorded Attempt' : 'Recorded Attempts'}
        </span>
      </div>

      {history.length === 0 ? (
        <Card className="p-6 rounded-2xl text-center border border-[#D9CFBB] bg-[#EDE4D0] shadow-sm">
          <div className="max-w-md mx-auto space-y-2">
            <div className="inline-flex p-3 rounded-full bg-[#E0D5BE] text-[#6B6357]">
              <FileQuestion className="h-6 w-6" />
            </div>
            <h4 className="font-serif font-bold text-base text-[#0A0A0A]">No Assessment Records Found</h4>
            <p className="text-caption text-[#6B6357]">
              Complete official module lessons and take the end-of-module quiz to record your verified competency score.
            </p>
          </div>
        </Card>
      ) : (
        <Card className="border border-[#D9CFBB] overflow-hidden bg-[#EDE4D0] shadow-sm rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-caption">
              <thead className="bg-[#E4D9C3] border-b border-[#D9CFBB] text-[#6B6357] font-mono font-medium uppercase tracking-[0.14em] text-[10px]">
                <tr>
                  <th scope="col" className="px-4 py-3">Date & Time</th>
                  <th scope="col" className="px-4 py-3">Module</th>
                  <th scope="col" className="px-4 py-3">Attempt</th>
                  <th scope="col" className="px-4 py-3 text-center">Score</th>
                  <th scope="col" className="px-4 py-3 text-center">Growth Delta</th>
                  <th scope="col" className="px-4 py-3 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9CFBB]/60 font-medium">
                {history.map((item) => {
                  const delta = item.improvement_from_previous;

                  return (
                    <tr key={item.attempt_id} className="hover:bg-[#EFE6D2]/60 transition-colors">
                      <td className="px-4 py-3 text-[#6B6357] whitespace-nowrap font-mono text-[12px]">
                        {formatDate(item.submitted_at)}
                      </td>
                      <td className="px-4 py-3 text-[#0A0A0A] font-semibold max-w-[220px] truncate text-caption">
                        {item.module_title}
                      </td>
                      <td className="px-4 py-3 text-[#6B6357]">
                        <span className="inline-block px-2 py-0.5 rounded bg-[#E0D5BE] text-[10px] font-mono font-semibold text-[#0A0A0A]">
                          #{item.attempt_number}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-mono font-semibold text-[#0A0A0A] text-caption">
                        {item.score} / {item.total} ({item.score_percentage}%)
                      </td>
                      <td className="px-4 py-3 text-center">
                        {delta !== undefined && delta !== null ? (
                          delta > 0 ? (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#2A5B4A]/10 text-[#2A5B4A] border border-[#2A5B4A]/30 font-mono">
                              <TrendingUp className="h-3 w-3 text-[#2A5B4A]" />
                              <span>+{delta}%</span>
                            </span>
                          ) : delta < 0 ? (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#C97B5A]/10 text-[#C97B5A] border border-[#C97B5A]/30 font-mono">
                              <TrendingDown className="h-3 w-3 text-[#C97B5A]" />
                              <span>{delta}%</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E0D5BE] text-[#6B6357] font-mono">
                              <Minus className="h-3 w-3 text-[#6B6357]" />
                              <span>0%</span>
                            </span>
                          )
                        ) : (
                          <span className="text-caption text-[#6B6357] font-mono text-[11px]">
                            Initial Attempt
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {item.passed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#2A5B4A]/10 text-[#2A5B4A] border border-[#2A5B4A]/30">
                            <Award className="h-3 w-3 text-[#2A5B4A]" />
                            <span>Passed (&ge;75%)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#C97B5A]/10 text-[#C97B5A] border border-[#C97B5A]/30">
                            <AlertCircle className="h-3 w-3 text-[#C97B5A]" />
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
        </Card>
      )}
    </div>
  );
};

export default AssessmentHistoryTable;
