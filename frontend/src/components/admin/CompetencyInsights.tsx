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
    <Card className="border-[#D9CFBB] p-6 bg-[#EDE4D0] space-y-5 rounded-2xl shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-[#D9CFBB]">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[#2A5B4A]" />
          <h3 className="font-serif text-lg font-normal text-[#0A0A0A] tracking-tight">Workforce Digital Readiness & Competency Signals</h3>
        </div>
        <span className="text-xs font-mono text-[#6B6357]">
          Live Operational Analytics
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Signal 1: Certification Completion Gauge */}
        <div className="space-y-2 bg-[#F5EFE0] p-4 rounded-xl border border-[#D9CFBB]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-sans font-semibold text-[#0A0A0A]">Workforce Certification</span>
            <span className="font-mono font-bold text-[#0A0A0A]">{certificationRate}% Target</span>
          </div>
          <div className="w-full bg-[#EDE4D0] rounded-full h-2 overflow-hidden border border-[#D9CFBB]">
            <div
              className="h-2 bg-[#2A5B4A] rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, Math.min(100, certificationRate))}%` }}
            />
          </div>
          <p className="text-xs text-[#6B6357] font-sans font-normal">
            {totalCertifications} certified credentials out of {totalEmployees} enrolled staff
          </p>
        </div>

        {/* Signal 2: Assessment Pass Rate */}
        <div className="space-y-2 bg-[#F5EFE0] p-4 rounded-xl border border-[#D9CFBB]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-sans font-semibold text-[#0A0A0A]">Quiz Pass Success Rate</span>
            <span className="font-mono font-bold text-[#2A5B4A]">{passRate}% Passed</span>
          </div>
          <div className="w-full bg-[#EDE4D0] rounded-full h-2 overflow-hidden border border-[#D9CFBB]">
            <div
              className="h-2 bg-[#2A5B4A] rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, Math.min(100, passRate))}%` }}
            />
          </div>
          <p className="text-xs text-[#6B6357] font-sans font-normal">
            {passCount} passed submissions across {totalAttempts} total attempts
          </p>
        </div>

        {/* Signal 3: Overall Average Assessment Score */}
        <div className="space-y-2 bg-[#F5EFE0] p-4 rounded-xl border border-[#D9CFBB]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-sans font-semibold text-[#0A0A0A]">Average Quiz Performance</span>
            <span className="font-mono font-bold text-[#0A0A0A]">{Math.round(avgScore)}% Average</span>
          </div>
          <div className="w-full bg-[#EDE4D0] rounded-full h-2 overflow-hidden border border-[#D9CFBB]">
            <div
              className="h-2 bg-[#0A0A0A] rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, Math.min(100, Math.round(avgScore)))}%` }}
            />
          </div>
          <p className="text-xs text-[#6B6357] font-sans font-normal">
            Based on all server-evaluated multiple-choice attempts
          </p>
        </div>
      </div>
    </Card>
  );
};

export default CompetencyInsights;
