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
          <History className="h-4 w-4 text-azure-700" />
          <h3 className="font-serif font-bold text-xl tracking-tight text-ink">
            Assessment Attempt History
          </h3>
        </div>
        <span className="text-[11px] font-mono uppercase font-bold text-ink-muted">
          {history.length} {history.length === 1 ? 'Recorded Attempt' : 'Recorded Attempts'}
        </span>
      </div>

      {history.length === 0 ? (
        <Card className="p-6 rounded-2xl text-center border border-border-warm bg-surface shadow-none">
          <div className="max-w-md mx-auto space-y-2">
            <div className="inline-flex p-3 bg-surface-light text-ink-muted border border-border-warm rounded-xl">
              <FileQuestion className="h-6 w-6" />
            </div>
            <h4 className="font-sans font-bold text-base tracking-tight text-ink">No Assessment Records Found</h4>
            <p className="text-caption text-ink-muted">
              Complete official module lessons and take the end-of-module quiz to record your verified competency score.
            </p>
          </div>
        </Card>
      ) : (
        <div className="border border-border-warm bg-surface rounded-2xl overflow-hidden shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-caption border-collapse">
              <thead className="bg-surface-light border-b border-border-warm text-ink-muted font-mono font-bold uppercase tracking-[0.14em] text-[10px]">
                <tr>
                  <th scope="col" className="px-4 py-3.5 border-r border-border-warm/60">Date & Time</th>
                  <th scope="col" className="px-4 py-3.5 border-r border-border-warm/60">Module</th>
                  <th scope="col" className="px-4 py-3.5 border-r border-border-warm/60">Attempt</th>
                  <th scope="col" className="px-4 py-3.5 text-center border-r border-border-warm/60">Score</th>
                  <th scope="col" className="px-4 py-3.5 text-center border-r border-border-warm/60">Growth Delta</th>
                  <th scope="col" className="px-4 py-3.5 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-warm/60 font-normal">
                {history.map((item) => {
                  const delta = item.improvement_from_previous;

                  return (
                    <tr key={item.attempt_id} className="hover:bg-surface-light/60 transition-colors">
                      <td className="px-4 py-3.5 text-ink-muted whitespace-nowrap font-mono text-xs border-r border-border-warm/60">
                        {formatDate(item.submitted_at)}
                      </td>
                      <td className="px-4 py-3.5 text-ink font-bold max-w-[220px] truncate text-caption border-r border-border-warm/60">
                        {item.module_title}
                      </td>
                      <td className="px-4 py-3.5 text-ink-muted border-r border-border-warm/60">
                        <span className="inline-block px-2.5 py-0.5 bg-surface-light text-[10px] font-mono font-bold text-ink border border-border-warm rounded-full">
                          #{item.attempt_number}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center font-mono font-bold text-ink text-caption border-r border-border-warm/60">
                        {item.score} / {item.total} ({item.score_percentage}%)
                      </td>
                      <td className="px-4 py-3.5 text-center border-r border-border-warm/60">
                        {delta !== undefined && delta !== null ? (
                          delta > 0 ? (
                            <span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 text-[10px] font-bold bg-sage-500/15 text-sage-800 border border-sage-500/30 font-mono rounded-full">
                              <TrendingUp className="h-3 w-3 text-sage-700" />
                              <span>+{delta}%</span>
                            </span>
                          ) : delta < 0 ? (
                            <span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 text-[10px] font-bold bg-rose-500/15 text-rose-800 border border-rose-500/30 font-mono rounded-full">
                              <TrendingDown className="h-3 w-3 text-rose-700" />
                              <span>{delta}%</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 text-[10px] font-medium bg-surface-light text-ink-muted font-mono border border-border-warm rounded-full">
                              <Minus className="h-3 w-3 text-ink-muted" />
                              <span>0%</span>
                            </span>
                          )
                        ) : (
                          <span className="text-caption text-ink-muted font-mono text-[11px]">
                            Initial Attempt
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        {item.passed ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 text-[10px] font-mono uppercase font-bold tracking-wider bg-sage-500/15 text-sage-800 border border-sage-500/30 rounded-full">
                            <Award className="h-3 w-3 text-sage-700" />
                            <span>Passed (&ge;75%)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 text-[10px] font-mono uppercase font-bold tracking-wider bg-rose-500/15 text-rose-800 border border-rose-500/30 rounded-full">
                            <AlertCircle className="h-3 w-3 text-rose-700" />
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
