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
    <Card className="border border-[#E4E4E7] p-6 bg-white space-y-5 rounded-none shadow-none">
      <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7]">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[#0E50B0]" />
          <h3 className="font-sans font-black text-lg uppercase tracking-tight text-[#09090B]">
            Workforce Digital Readiness & Competency Signals
          </h3>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A] font-bold">
          Live Operational Analytics
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Signal 1: Certification Completion Gauge */}
        <div className="space-y-2 bg-[#FAFAFA] p-4 border border-[#E4E4E7]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-sans font-bold uppercase tracking-tight text-[#09090B]">Workforce Certification</span>
            <span className="font-mono font-bold text-[#09090B]">{certificationRate}% Target</span>
          </div>
          <div className="w-full bg-[#E4E4E7] h-1.5 overflow-hidden">
            <div
              className="h-1.5 bg-[#0E50B0] transition-all duration-500"
              style={{ width: `${Math.max(5, Math.min(100, certificationRate))}%` }}
            />
          </div>
          <p className="text-xs text-[#52525B] font-sans font-medium">
            {totalCertifications} certified credentials out of {totalEmployees} enrolled staff
          </p>
        </div>

        {/* Signal 2: Assessment Pass Rate */}
        <div className="space-y-2 bg-[#FAFAFA] p-4 border border-[#E4E4E7]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-sans font-bold uppercase tracking-tight text-[#09090B]">Quiz Pass Success Rate</span>
            <span className="font-mono font-bold text-emerald-700">{passRate}% Passed</span>
          </div>
          <div className="w-full bg-[#E4E4E7] h-1.5 overflow-hidden">
            <div
              className="h-1.5 bg-emerald-600 transition-all duration-500"
              style={{ width: `${Math.max(5, Math.min(100, passRate))}%` }}
            />
          </div>
          <p className="text-xs text-[#52525B] font-sans font-medium">
            {passCount} passed submissions across {totalAttempts} total attempts
          </p>
        </div>

        {/* Signal 3: Overall Average Assessment Score */}
        <div className="space-y-2 bg-[#FAFAFA] p-4 border border-[#E4E4E7]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-sans font-bold uppercase tracking-tight text-[#09090B]">Average Quiz Performance</span>
            <span className="font-mono font-bold text-[#09090B]">{Math.round(avgScore)}% Average</span>
          </div>
          <div className="w-full bg-[#E4E4E7] h-1.5 overflow-hidden">
            <div
              className="h-1.5 bg-[#09090B] transition-all duration-500"
              style={{ width: `${Math.max(5, Math.min(100, Math.round(avgScore)))}%` }}
            />
          </div>
          <p className="text-xs text-[#52525B] font-sans font-medium">
            Based on all server-evaluated multiple-choice attempts
          </p>
        </div>
      </div>
    </Card>
  );
};

export default CompetencyInsights;
