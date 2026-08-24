import React from 'react';
import { Sparkles, Award, CheckCircle2, Shield, User, Clock, CheckCheck, Target } from 'lucide-react';
import Card from '@/components/ui/Card';
import { CompetencySummary } from '@/types';

interface CompetencyOverviewProps {
  userEmail?: string;
  userRole?: string;
  overallScore: number;
  certifiedCount: number;
  totalCount: number;
  summary?: CompetencySummary;
}

export const CompetencyOverview: React.FC<CompetencyOverviewProps> = ({
  userRole = 'employee',
  overallScore,
  certifiedCount,
  totalCount,
  summary,
}) => {
  const readinessLevel = summary?.readiness_level || (
    overallScore === 100
      ? 'Full Operational Readiness'
      : overallScore >= 50
      ? 'Substantial Readiness'
      : overallScore > 0
      ? 'Developing Competency'
      : 'Initial Onboarding'
  );

  const learningStatus = summary?.learning_status || (
    certifiedCount === totalCount && totalCount > 0
      ? 'Certified'
      : certifiedCount > 0
      ? 'In Progress'
      : 'Getting Started'
  );

  const modulesCompleted = summary?.modules_completed ?? certifiedCount;
  const modulesRemaining = summary?.modules_remaining ?? Math.max(0, totalCount - certifiedCount);

  return (
    <div className="space-y-6">
      {/* Civic Hero Competency Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-civic-950 via-civic-900 to-civic-800 p-6 sm:p-8 text-white shadow-civic-lg border border-civic-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-civic-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 -mb-10 w-48 h-48 bg-saffron-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-civic-800/80 border border-civic-700 text-xs font-semibold text-saffron-400">
              <Sparkles className="h-3.5 w-3.5 text-saffron-400" />
              <span>Competency Intelligence Dashboard</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              My Skill Progress & Credentials
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Real-time competency assessment, verified certifications, and targeted learning recommendations for local government personnel.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 bg-civic-950/80 px-2.5 py-1 rounded-md border border-civic-800">
                <User className="h-3.5 w-3.5 text-slate-400" />
                <span className="font-semibold text-slate-200">Local Office Staff</span>
              </div>
              <div className="flex items-center gap-1.5 bg-civic-950/80 px-2.5 py-1 rounded-md border border-civic-800">
                <Shield className="h-3.5 w-3.5 text-saffron-400" />
                <span className="capitalize font-semibold text-slate-200">{userRole} Track</span>
              </div>
              <div className="flex items-center gap-1.5 bg-civic-950/80 px-2.5 py-1 rounded-md border border-civic-800 text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span className="font-semibold">{readinessLevel}</span>
              </div>
            </div>
          </div>

          {/* Metric Scorecard Widget */}
          <div className="bg-civic-950/90 p-5 rounded-2xl border border-civic-700/80 text-center shrink-0 lg:min-w-[260px] shadow-civic-md">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Overall Competency
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-civic-800 text-saffron-300 border border-civic-700">
                {learningStatus}
              </span>
            </div>
            <div className="text-4xl font-extrabold text-white tracking-tight mb-1">
              {overallScore}%
            </div>
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-400 mb-3">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>{certifiedCount} of {totalCount} Modules Certified</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
              <div
                className="h-2 bg-gradient-to-r from-emerald-500 to-civic-400 transition-all duration-500 rounded-full"
                style={{ width: `${Math.max(5, Math.min(100, overallScore))}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              {modulesRemaining > 0
                ? `${modulesRemaining} module${modulesRemaining === 1 ? '' : 's'} remaining for 100% certification`
                : 'All curriculum standards met'}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3.5 border-slate-200 bg-white flex items-center gap-3 shadow-civic-xs">
          <div className="h-9 w-9 rounded-lg bg-civic-100 text-civic-800 flex items-center justify-center shrink-0 font-bold text-xs">
            <Award className="h-4 w-4 text-civic-700" />
          </div>
          <div className="min-w-0">
            <p className="font-extrabold text-base text-slate-900 leading-none">{certifiedCount} / {totalCount}</p>
            <p className="text-[11px] text-slate-500 font-medium pt-1">Certifications</p>
          </div>
        </Card>

        <Card className="p-3.5 border-slate-200 bg-white flex items-center gap-3 shadow-civic-xs">
          <div className="h-9 w-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-xs">
            <CheckCheck className="h-4 w-4 text-emerald-700" />
          </div>
          <div className="min-w-0">
            <p className="font-extrabold text-base text-slate-900 leading-none">{modulesCompleted} / {totalCount}</p>
            <p className="text-[11px] text-slate-500 font-medium pt-1">Lessons Completed</p>
          </div>
        </Card>

        <Card className="p-3.5 border-slate-200 bg-white flex items-center gap-3 shadow-civic-xs">
          <div className="h-9 w-9 rounded-lg bg-saffron-100 text-saffron-900 flex items-center justify-center shrink-0 font-bold text-xs">
            <Clock className="h-4 w-4 text-saffron-700" />
          </div>
          <div className="min-w-0">
            <p className="font-extrabold text-base text-slate-900 leading-none">{modulesRemaining}</p>
            <p className="text-[11px] text-slate-500 font-medium pt-1">Modules Remaining</p>
          </div>
        </Card>

        <Card className="p-3.5 border-slate-200 bg-white flex items-center gap-3 shadow-civic-xs">
          <div className="h-9 w-9 rounded-lg bg-civic-50 text-civic-800 flex items-center justify-center shrink-0 font-bold text-xs">
            <Target className="h-4 w-4 text-civic-700" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-xs text-slate-900 truncate">{readinessLevel}</p>
            <p className="text-[11px] text-slate-500 font-medium pt-0.5">Readiness Status</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CompetencyOverview;
