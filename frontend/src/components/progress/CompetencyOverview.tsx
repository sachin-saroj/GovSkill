import React from 'react';
import { Sparkles, Award, CheckCircle2, Shield, User } from 'lucide-react';
import Card from '@/components/ui/Card';

interface CompetencyOverviewProps {
  userEmail?: string;
  userRole?: string;
  overallScore: number;
  certifiedCount: number;
  totalCount: number;
}

export const CompetencyOverview: React.FC<CompetencyOverviewProps> = ({
  userRole = 'employee',
  overallScore,
  certifiedCount,
  totalCount,
}) => {
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
              <span>Digital Skill Competency Dashboard</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              My Skill Progress
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Track your completed lessons, quiz scores, and verified digital skill certifications for local government operations.
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
            </div>
          </div>

          {/* Metric Scorecard Widget */}
          <div className="bg-civic-950/90 p-5 rounded-2xl border border-civic-700/80 text-center shrink-0 lg:min-w-[240px] shadow-civic-md">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Overall Competency
            </span>
            <div className="text-4xl font-extrabold text-white tracking-tight mb-1">
              {overallScore}%
            </div>
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-400 mb-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>{certifiedCount} of {totalCount} Modules Certified</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 bg-gradient-to-r from-emerald-500 to-civic-400 transition-all duration-500 rounded-full"
                style={{ width: `${Math.max(5, Math.min(100, overallScore))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4-Step Learning Roadmap Pill Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3.5 border-slate-200 bg-white flex items-center gap-3 shadow-civic-xs">
          <div className="h-8 w-8 rounded-lg bg-civic-100 text-civic-800 flex items-center justify-center shrink-0 font-bold text-xs">
            1
          </div>
          <div className="min-w-0">
            <p className="font-bold text-xs text-slate-900 truncate">Read Curriculum</p>
            <p className="text-[10px] text-slate-500">Official modules</p>
          </div>
        </Card>

        <Card className="p-3.5 border-slate-200 bg-white flex items-center gap-3 shadow-civic-xs">
          <div className="h-8 w-8 rounded-lg bg-civic-100 text-civic-800 flex items-center justify-center shrink-0 font-bold text-xs">
            2
          </div>
          <div className="min-w-0">
            <p className="font-bold text-xs text-slate-900 truncate">Consult AI Tutor</p>
            <p className="text-[10px] text-slate-500">Grounded assistance</p>
          </div>
        </Card>

        <Card className="p-3.5 border-slate-200 bg-white flex items-center gap-3 shadow-civic-xs">
          <div className="h-8 w-8 rounded-lg bg-civic-100 text-civic-800 flex items-center justify-center shrink-0 font-bold text-xs">
            3
          </div>
          <div className="min-w-0">
            <p className="font-bold text-xs text-slate-900 truncate">Take Quiz</p>
            <p className="text-[10px] text-slate-500">Server evaluated</p>
          </div>
        </Card>

        <Card className="p-3.5 border-emerald-200 bg-emerald-50/40 flex items-center gap-3 shadow-civic-xs">
          <div className="h-8 w-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
            <Award className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-xs text-emerald-900 truncate">Get Certified</p>
            <p className="text-[10px] text-emerald-700">Official credentials</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CompetencyOverview;
