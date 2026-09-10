import React, { useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Award,
  CheckCircle2,
  Shield,
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
      {/* 1. Calm Page Title Header */}
      <div className="border-b border-slate-200/90 pb-5 space-y-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-micro font-semibold uppercase tracking-wider text-civic-700 bg-civic-50 px-2.5 py-0.5 rounded-full border border-civic-200">
                <Sparkles className="h-3.5 w-3.5 text-saffron-600" />
                <span>My Skill Progress & Credentials</span>
              </span>
              <span className="inline-flex items-center gap-1 text-micro font-semibold uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                <Shield className="h-3 w-3 text-civic-700" />
                <span className="capitalize">{userRole} Track</span>
              </span>
            </div>
            <h1 className="text-page-title font-semibold tracking-tight text-slate-900">
              My Skills
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setShowCalculationModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-caption font-semibold text-slate-700 hover:text-slate-900 transition-colors shadow-civic-xs cursor-pointer"
            title="View how operational scores and readiness tiers are calculated"
          >
            <Info className="h-3.5 w-3.5 text-civic-700" />
            <span>How is this calculated?</span>
          </button>
        </div>
        <p className="text-body text-slate-600 font-normal">
          Official local government administrative digital skill profile, verified certifications, and targeted learning recommendations.
        </p>
      </div>

      {/* 2. Primary Competency Hero Card */}
      <Card className="p-6 sm:p-8 bg-white border border-slate-200 shadow-civic-xs rounded-civic-xl space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Visual Dominance: Large Score & Readiness Tier */}
          <div className="lg:col-span-5 space-y-3 border-b lg:border-b-0 lg:border-r border-slate-100 pb-6 lg:pb-0 lg:pr-8">
            <div className="flex items-center gap-2">
              <span className="text-micro font-semibold uppercase tracking-wider text-slate-500">
                Overall Competency
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-micro font-semibold uppercase tracking-wider bg-civic-50 text-civic-800 border border-civic-200">
                {learningStatus}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-5xl sm:text-6xl font-bold text-slate-900 font-mono tracking-tight">
                {overallScore}%
              </span>
              <div className="space-y-0.5">
                <span className="text-caption font-semibold text-emerald-700 block">
                  {certifiedCount} of {totalCount} Certified
                </span>
                <span className="text-caption text-slate-500 font-normal block">
                  {modulesRemaining > 0 ? `${modulesRemaining} remaining` : 'All certified'}
                </span>
              </div>
            </div>

            {/* Subtle Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <motion.div
                initial={shouldReduceMotion ? { width: `${Math.max(5, overallScore)}%` } : { width: '0%' }}
                animate={{ width: `${Math.max(5, Math.min(100, overallScore))}%` }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="h-2.5 bg-gradient-to-r from-civic-700 to-emerald-600 rounded-full"
              />
            </div>

            <div className="flex items-center gap-2 pt-1 text-caption">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="font-semibold text-slate-800">
                Readiness Level: <strong className="text-emerald-800 font-semibold">{readinessLevel}</strong>
              </span>
            </div>
          </div>

          {/* Supporting Overview Metadata & Track Information */}
          <div className="lg:col-span-7 space-y-4">
            <p className="text-body text-slate-700 leading-relaxed font-normal">
              {explanation ||
                'Real-time competency assessment, verified certifications, and targeted learning recommendations for local government personnel.'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-civic-lg bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-micro font-semibold uppercase text-slate-500 flex items-center gap-1">
                  <Award className="h-3 w-3 text-civic-700" /> Certified
                </span>
                <p className="text-section-heading font-semibold text-slate-900 leading-none">
                  {certifiedCount} / {totalCount}
                </p>
                <span className="text-micro text-slate-400 font-normal">Modules verified</span>
              </div>

              <div className="p-3 rounded-civic-lg bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-micro font-semibold uppercase text-slate-500 flex items-center gap-1">
                  <CheckCheck className="h-3 w-3 text-emerald-600" /> Curriculum
                </span>
                <p className="text-section-heading font-semibold text-slate-900 leading-none">
                  {modulesCompleted} / {totalCount}
                </p>
                <span className="text-micro text-slate-400 font-normal">Lessons read</span>
              </div>

              <div className="p-3 rounded-civic-lg bg-slate-50 border border-slate-200/80 space-y-1 col-span-2 sm:col-span-1">
                <span className="text-micro font-semibold uppercase text-slate-500 flex items-center gap-1">
                  <Clock className="h-3 w-3 text-saffron-600" /> Pending
                </span>
                <p className="text-section-heading font-semibold text-slate-900 leading-none">
                  {modulesRemaining}
                </p>
                <span className="text-micro text-slate-400 font-normal">Modules to certify</span>
              </div>
            </div>

            {/* Competency Strengths / Focus Highlight Strip */}
            {(strongest || weakest || avgScore > 0) && (
              <div className="flex flex-wrap items-center gap-2 pt-1 text-caption">
                {strongest && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium">
                    <TrendingUp className="h-3 w-3 text-emerald-600" />
                    <span><strong>Strongest:</strong> {strongest}</span>
                  </div>
                )}
                {weakest && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-50 border border-saffron-200 text-saffron-900 font-medium">
                    <AlertCircle className="h-3 w-3 text-saffron-600" />
                    <span><strong>Priority Focus:</strong> {weakest}</span>
                  </div>
                )}
                {avgScore > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                    <span><strong>Avg Score:</strong> {avgScore}%</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

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
