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
    <Card className="border border-border-warm p-6 bg-surface space-y-5 rounded-2xl shadow-none">
      <div className="flex items-center justify-between pb-3 border-b border-border-warm">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-azure-700" />
          <h3 className="font-sans font-bold text-lg uppercase tracking-tight text-ink">
            Workforce Digital Readiness & Competency Signals
          </h3>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted font-bold">
          Live Operational Analytics
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Signal 1: Certification Completion Gauge */}
        <div className="space-y-2 bg-surface-light p-4 border border-border-warm rounded-xl">
          <div className="flex items-center justify-between text-xs">
            <span className="font-sans font-bold uppercase tracking-tight text-ink">Workforce Certification</span>
            <span className="font-mono font-bold text-ink">{certificationRate}% Target</span>
          </div>
          <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-border-warm">
            <div
              className="h-full bg-azure-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, Math.min(100, certificationRate))}%` }}
            />
          </div>
          <p className="text-xs text-ink-muted font-sans font-medium">
            {totalCertifications} certified credentials out of {totalEmployees} enrolled staff
          </p>
        </div>

        {/* Signal 2: Assessment Pass Rate */}
        <div className="space-y-2 bg-surface-light p-4 border border-border-warm rounded-xl">
          <div className="flex items-center justify-between text-xs">
            <span className="font-sans font-bold uppercase tracking-tight text-ink">Quiz Pass Success Rate</span>
            <span className="font-mono font-bold text-sage-900">{passRate}% Passed</span>
          </div>
          <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-border-warm">
            <div
              className="h-full bg-sage-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, Math.min(100, passRate))}%` }}
            />
          </div>
          <p className="text-xs text-ink-muted font-sans font-medium">
            {passCount} passed submissions across {totalAttempts} total attempts
          </p>
        </div>

        {/* Signal 3: Overall Average Assessment Score */}
        <div className="space-y-2 bg-surface-light p-4 border border-border-warm rounded-xl">
          <div className="flex items-center justify-between text-xs">
            <span className="font-sans font-bold uppercase tracking-tight text-ink">Average Quiz Performance</span>
            <span className="font-mono font-bold text-ink">{Math.round(avgScore)}% Average</span>
          </div>
          <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-border-warm">
            <div
              className="h-full bg-ink rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, Math.min(100, Math.round(avgScore)))}%` }}
            />
          </div>
          <p className="text-xs text-ink-muted font-sans font-medium">
            Based on all server-evaluated multiple-choice attempts
          </p>
        </div>
      </div>
    </Card>
  );
};

export default CompetencyInsights;
