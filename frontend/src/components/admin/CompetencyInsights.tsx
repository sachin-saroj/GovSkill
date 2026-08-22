import React from 'react';
import Card from '@/components/ui/Card';
import { TrendingUp } from 'lucide-react';

interface CompetencyInsightsProps {
  totalEmployees: number;
  totalCertifications: number;
  certificationRate: number;
  totalAttempts: number;
  passCount: number;
  avgScore: number;
}

export const CompetencyInsights: React.FC<CompetencyInsightsProps> = ({
  totalEmployees,
  totalCertifications,
  certificationRate,
  totalAttempts,
  passCount,
  avgScore,
}) => {
  const passRate = totalAttempts > 0 ? Math.round((passCount / totalAttempts) * 100) : 0;

  return (
    <Card className="border-slate-200 shadow-civic-sm p-6 bg-white space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-civic-700" />
          <h3 className="text-sm font-bold text-slate-900">Workforce Digital Readiness & Competency Signals</h3>
        </div>
        <span className="text-[11px] font-semibold text-slate-500">
          Live Operational Analytics
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Signal 1: Certification Completion Gauge */}
        <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">Workforce Certification</span>
            <span className="font-extrabold text-civic-900">{certificationRate}% Target</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 bg-gradient-to-r from-civic-700 to-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, Math.min(100, certificationRate))}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            {totalCertifications} certified credentials out of {totalEmployees} enrolled staff
          </p>
        </div>

        {/* Signal 2: Assessment Pass Rate */}
        <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">Quiz Pass Success Rate</span>
            <span className="font-extrabold text-emerald-700">{passRate}% Passed</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 bg-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, Math.min(100, passRate))}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            {passCount} passed submissions across {totalAttempts} total attempts
          </p>
        </div>

        {/* Signal 3: Overall Average Assessment Score */}
        <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">Average Quiz Performance</span>
            <span className="font-extrabold text-slate-900">{Math.round(avgScore)}% Average</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 bg-civic-800 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, Math.min(100, Math.round(avgScore)))}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Based on all server-evaluated multiple-choice attempts
          </p>
        </div>
      </div>
    </Card>
  );
};

export default CompetencyInsights;
