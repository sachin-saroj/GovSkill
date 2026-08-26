import React, { useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Award,
  CheckCircle2,
  Shield,
  User,
  Clock,
  CheckCheck,
  Target,
  Info,
  TrendingUp,
  AlertCircle,
  X,
  BookOpen,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { CompetencySummary } from '@/types';
import { fadeUpVariants } from '@/lib/motion';

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
  const shouldReduceMotion = useReducedMotion();
  const [showCalculationModal, setShowCalculationModal] = useState(false);

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
  const strongest = summary?.strongest_competency;
  const weakest = summary?.weakest_competency;
  const avgScore = summary?.average_assessment_score ?? 0;
  const explanation = summary?.readiness_explanation;

  return (
    <motion.div variants={fadeUpVariants} className="space-y-6">
      {/* Civic Hero Competency Banner */}
      <div className="relative overflow-hidden rounded-civic-2xl bg-gradient-to-r from-civic-950 via-civic-900 to-civic-800 p-8 text-white shadow-civic-xl border border-civic-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-civic-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 -mb-10 w-48 h-48 bg-saffron-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-civic-800/80 border border-civic-700 text-micro font-semibold uppercase tracking-wider text-saffron-400 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-saffron-400" />
                <span>Competency Intelligence Dashboard</span>
              </div>
              <button
                type="button"
                onClick={() => setShowCalculationModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-civic-900/90 hover:bg-civic-800 border border-civic-700/80 text-caption font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="View how operational scores and readiness tiers are calculated"
              >
                <Info className="h-3.5 w-3.5 text-civic-400" />
                <span>How is this calculated?</span>
              </button>
            </div>

            <h1 className="text-page-title font-semibold tracking-tight text-white">
              My Skill Progress & Credentials
            </h1>

            <p className="text-body text-slate-300 leading-relaxed font-normal">
              {explanation ||
                'Real-time competency assessment, verified certifications, and targeted learning recommendations for local government personnel.'}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-caption text-slate-300">
              <div className="flex items-center gap-1.5 bg-civic-950/80 px-3 py-1 rounded-civic-md border border-civic-800">
                <User className="h-3.5 w-3.5 text-slate-400" />
                <span className="font-semibold text-slate-200">Local Office Staff</span>
              </div>
              <div className="flex items-center gap-1.5 bg-civic-950/80 px-3 py-1 rounded-civic-md border border-civic-800">
                <Shield className="h-3.5 w-3.5 text-saffron-400" />
                <span className="capitalize font-semibold text-slate-200">{userRole} Track</span>
              </div>
              <div className="flex items-center gap-1.5 bg-civic-950/80 px-3 py-1 rounded-civic-md border border-civic-800 text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span className="font-semibold">{readinessLevel}</span>
              </div>
            </div>

            {/* Competency Insights Strip (Strongest / Weakest) */}
            {(strongest || weakest || avgScore > 0) && (
              <div className="flex flex-wrap items-center gap-2 pt-2 text-caption">
                {strongest && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-civic-md bg-emerald-950/80 border border-emerald-800/80 text-emerald-300">
                    <TrendingUp className="h-3 w-3 text-emerald-400" />
                    <span><strong className="text-white font-semibold">Strongest:</strong> {strongest}</span>
                  </div>
                )}
                {weakest && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-civic-md bg-amber-950/80 border border-amber-800/80 text-amber-300">
                    <AlertCircle className="h-3 w-3 text-amber-400" />
                    <span><strong className="text-white font-semibold">Priority Focus:</strong> {weakest}</span>
                  </div>
                )}
                {avgScore > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-civic-md bg-civic-950/80 border border-civic-800 text-slate-300">
                    <span><strong className="text-white font-semibold">Avg Score:</strong> {avgScore}%</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Metric Scorecard Widget */}
          <motion.div
            whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
            className="bg-civic-950/90 p-6 rounded-civic-xl border border-civic-700/80 text-center shrink-0 lg:min-w-[260px] shadow-civic-md backdrop-blur-md"
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-micro font-semibold uppercase tracking-wider text-slate-400">
                Certification Coverage
              </span>
              <span className="text-micro font-semibold uppercase px-2 py-0.5 rounded-full bg-civic-800 text-saffron-300 border border-civic-700">
                {learningStatus}
              </span>
            </div>
            <div className="text-3xl font-bold text-white tracking-tight mb-1 font-mono">
              {overallScore}%
            </div>
            <div className="flex items-center justify-center gap-1.5 text-caption font-semibold text-emerald-400 mb-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>{certifiedCount} of {totalCount} Modules Certified</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
              <motion.div
                initial={shouldReduceMotion ? { width: `${Math.max(5, overallScore)}%` } : { width: '0%' }}
                animate={{ width: `${Math.max(5, Math.min(100, overallScore))}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-2 bg-gradient-to-r from-emerald-500 to-civic-400 rounded-full"
              />
            </div>
            <div className="flex items-center justify-between text-caption text-slate-400">
              <span>
                {modulesRemaining > 0
                  ? `${modulesRemaining} module${modulesRemaining === 1 ? '' : 's'} remaining`
                  : 'All modules certified'}
              </span>
              {avgScore > 0 && (
                <span className="font-mono text-slate-300">
                  {avgScore}% avg
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-200 bg-white flex items-center gap-3 shadow-civic-xs rounded-civic-xl hover:border-slate-300 transition-colors">
          <div className="h-10 w-10 rounded-civic-md bg-civic-100 text-civic-800 flex items-center justify-center shrink-0">
            <Award className="h-4 w-4 text-civic-700" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-section-heading text-slate-900 leading-none">{certifiedCount} / {totalCount}</p>
            <p className="text-caption text-slate-500 font-medium pt-1">Certifications</p>
          </div>
        </Card>

        <Card className="p-4 border-slate-200 bg-white flex items-center gap-3 shadow-civic-xs rounded-civic-xl hover:border-slate-300 transition-colors">
          <div className="h-10 w-10 rounded-civic-md bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <CheckCheck className="h-4 w-4 text-emerald-700" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-section-heading text-slate-900 leading-none">{modulesCompleted} / {totalCount}</p>
            <p className="text-caption text-slate-500 font-medium pt-1">Lessons Completed</p>
          </div>
        </Card>

        <Card className="p-4 border-slate-200 bg-white flex items-center gap-3 shadow-civic-xs rounded-civic-xl hover:border-slate-300 transition-colors">
          <div className="h-10 w-10 rounded-civic-md bg-saffron-100 text-saffron-900 flex items-center justify-center shrink-0">
            <Clock className="h-4 w-4 text-saffron-700" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-section-heading text-slate-900 leading-none">{modulesRemaining}</p>
            <p className="text-caption text-slate-500 font-medium pt-1">Modules Remaining</p>
          </div>
        </Card>

        <Card className="p-4 border-slate-200 bg-white flex items-center gap-3 shadow-civic-xs rounded-civic-xl hover:border-slate-300 transition-colors">
          <div className="h-10 w-10 rounded-civic-md bg-civic-50 text-civic-800 flex items-center justify-center shrink-0">
            <Target className="h-4 w-4 text-civic-700" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-caption text-slate-900 truncate">{readinessLevel}</p>
            <p className="text-caption text-slate-500 font-medium pt-0.5">Readiness Tier</p>
          </div>
        </Card>
      </div>

      {/* Transparent Calculation Explainer Modal */}
      <AnimatePresence>
        {showCalculationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-civic-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-civic-md bg-civic-100 text-civic-800">
                    <Info className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-section-heading">Competency Scoring Standards</h3>
                    <p className="text-caption text-slate-500">How your operational readiness is calculated</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCalculationModal(false)}
                  className="p-1.5 rounded-civic-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 text-body text-slate-600 leading-relaxed">
                <div className="p-4 bg-civic-50 rounded-civic-xl border border-civic-100 space-y-1">
                  <p className="font-semibold text-civic-900 flex items-center gap-1.5 text-caption">
                    <Award className="h-4 w-4 text-civic-700" />
                    Certification Threshold: 75%
                  </p>
                  <p className="text-caption text-slate-600">
                    To earn a verified operational credential for any module, staff must achieve 75% or higher on the server-evaluated end-of-module assessment.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-1.5 text-caption">
                    <Target className="h-4 w-4 text-civic-700" />
                    Readiness Tiers
                  </h4>
                  <ul className="space-y-2">
                    <li className="p-3 rounded-civic-md bg-slate-50 border border-slate-200/70 text-caption">
                      <strong className="text-slate-900 block font-semibold">Initial Onboarding (0–24%)</strong>
                      Staff has enrolled and is beginning curriculum reading.
                    </li>
                    <li className="p-3 rounded-civic-md bg-slate-50 border border-slate-200/70 text-caption">
                      <strong className="text-slate-900 block font-semibold">Developing Competency (25–49%)</strong>
                      At least one core module certified or multiple curriculum lessons completed.
                    </li>
                    <li className="p-3 rounded-civic-md bg-slate-50 border border-slate-200/70 text-caption">
                      <strong className="text-slate-900 block font-semibold">Substantial Readiness (50–74%)</strong>
                      At least 50% of local government administrative skills certified.
                    </li>
                    <li className="p-3 rounded-civic-md bg-emerald-50 border border-emerald-200/80 text-caption">
                      <strong className="text-emerald-900 block font-semibold">Full Operational Readiness (75–100%)</strong>
                      All prescribed government skills certified and compliant with administrative standards.
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-amber-50 rounded-civic-xl border border-amber-200/60 flex items-start gap-2 text-caption">
                  <BookOpen className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                  <p className="text-amber-900">
                    <strong className="font-semibold">Zero-Guessing Guarantee:</strong> All competency metrics, gap percentages, and score deltas are computed deterministically from stored assessment attempts.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowCalculationModal(false)}
                  size="sm"
                >
                  Close Explainer
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CompetencyOverview;
