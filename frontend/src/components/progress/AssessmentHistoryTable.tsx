import React from 'react';
import { AssessmentHistoryItem } from '@/types';
import Card from '@/components/ui/Card';
import { History, Award, AlertCircle, FileQuestion } from 'lucide-react';

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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-civic-700" />
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
            Assessment Attempt History
          </h3>
        </div>
        <span className="text-xs font-semibold text-slate-500">
          {history.length} {history.length === 1 ? 'Recorded Attempt' : 'Recorded Attempts'}
        </span>
      </div>

      {history.length === 0 ? (
        <Card className="p-8 text-center border-slate-200 bg-white">
          <div className="max-w-md mx-auto space-y-2">
            <div className="inline-flex p-3 rounded-full bg-slate-100 text-slate-400">
              <FileQuestion className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No Assessment Records Found</h4>
            <p className="text-xs text-slate-500">
              Complete official module lessons and take the end-of-module quiz to record your verified competency score.
            </p>
          </div>
        </Card>
      ) : (
        <Card className="border border-slate-200 overflow-hidden bg-white shadow-civic-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th scope="col" className="px-4 py-3">Date & Time</th>
                  <th scope="col" className="px-4 py-3">Module</th>
                  <th scope="col" className="px-4 py-3">Attempt</th>
                  <th scope="col" className="px-4 py-3 text-center">Score</th>
                  <th scope="col" className="px-4 py-3 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {history.map((item) => (
                  <tr key={item.attempt_id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                      {formatDate(item.submitted_at)}
                    </td>
                    <td className="px-4 py-3 text-slate-900 font-semibold max-w-[240px] truncate">
                      {item.module_title}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-[11px] font-mono">
                        #{item.attempt_number}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-slate-900">
                      {item.score} / {item.total} ({item.score_percentage}%)
                    </td>
                    <td className="px-4 py-3 text-right">
                      {item.passed ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                          <Award className="h-3 w-3 text-emerald-600" />
                          <span>Passed (Certified)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                          <AlertCircle className="h-3 w-3 text-amber-600" />
                          <span>Below Threshold</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AssessmentHistoryTable;
