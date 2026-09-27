import React, { useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import {
  Award,
  CheckCircle2,
  Target,
  Info,
  X,
  BookOpen,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { CompetencySummary } from '@/types';
import { fadeUpVariants } from '@/lib/motion';
import HeroBanner from './HeroBanner';

interface CompetencyOverviewProps {
  userEmail?: string;
  userRole?: string;
  overallScore: number;
  certifiedCount: number;
  totalCount: number;
  summary?: CompetencySummary;
}

export const CompetencyOverview: React.FC<CompetencyOverviewProps> = ({
  userEmail,
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
      {/* 1. Hero Banner with Asymmetric Composition */}
      <HeroBanner
        userEmail={userEmail}
        userRole={userRole}
        summary={summary}
        certifiedCount={certifiedCount}
        totalCount={totalCount}
        onOpenExplainer={() => setShowCalculationModal(true)}
      />

      {/* 2. Structured Stat Strip: 3 Major Metrics (Competency, Readiness, Gaps) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric 1: Competency Score */}
        <Card className="p-6 bg-white border border-[#E4E4E7] rounded-none shadow-none space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#71717A] font-bold">
              Overall Competency
            </span>
            <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-[#FAFAFA] text-[#09090B] border border-[#E4E4E7] font-bold">
              {learningStatus}
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-black text-[#09090B] font-mono tracking-tight">
              {overallScore}%
            </span>
            <div className="space-y-0.5">
              <span className="text-caption font-bold text-emerald-700 block">
                {certifiedCount} of {totalCount} Certified
              </span>
              <span className="text-[11px] font-mono text-[#71717A] block">
                {modulesRemaining > 0 ? `${modulesRemaining} remaining` : 'All certified'}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#FAFAFA] border border-[#E4E4E7] h-2 overflow-hidden">
            <motion.div
              initial={shouldReduceMotion ? { width: `${Math.max(5, overallScore)}%` } : { width: '0%' }}
              animate={{ width: `${Math.max(5, Math.min(100, overallScore))}%` }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="h-2 bg-[#0E50B0]"
            />
          </div>

          <p className="text-[11px] text-[#71717A] font-medium">
            Benchmark Target: <strong className="text-[#09090B]">75%</strong> on end-of-module assessment
          </p>
        </Card>

        {/* Metric 2: Operational Readiness */}
        <Card className="p-6 bg-white border border-[#E4E4E7] rounded-none shadow-none space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#71717A] font-bold">
              Operational Readiness
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-black uppercase tracking-tight text-[#09090B]">
              {readinessLevel}
            </h3>
            <p className="text-caption text-[#52525B] line-clamp-2">
              {explanation || 'Evaluated deterministically from recorded assessment evaluation history.'}
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] border-t border-[#E4E4E7] text-[#71717A]">
            <span>Staff Evaluation Status</span>
            <span className="font-bold text-[#09090B] font-mono">{modulesCompleted}/{totalCount} Completed</span>
          </div>
        </Card>

        {/* Metric 3: Focus & Skill Gaps */}
        <Card className="p-6 bg-white border border-[#E4E4E7] rounded-none shadow-none space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#71717A] font-bold">
              Targeted Remediation
            </span>
            <Target className="h-4 w-4 text-[#AF411E]" />
          </div>

          <div className="space-y-1.5">
            {weakest ? (
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#AF411E] bg-orange-50 px-2 py-0.5 border border-orange-200 inline-block mb-1 font-bold">
                  Priority Focus
                </span>
                <p className="text-caption font-bold text-[#09090B] truncate" title={weakest}>
                  {weakest}
                </p>
              </div>
            ) : (
              <div className="py-1">
                <p className="text-caption font-bold text-emerald-700">All Competencies Compliant</p>
                <p className="text-[11px] text-[#71717A]">No active gaps detected</p>
              </div>
            )}

            {strongest && (
              <div className="pt-1 flex items-center gap-1.5 text-[11px] text-[#71717A]">
                <span>Top skill:</span>
                <strong className="text-[#09090B] font-bold truncate">{strongest}</strong>
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] border-t border-[#E4E4E7] text-[#71717A]">
            <span>Avg Evaluation Score</span>
            <span className="font-bold text-[#09090B] font-mono">{avgScore > 0 ? `${avgScore}%` : '—'}</span>
          </div>
        </Card>
      </div>

      {/* Transparent Calculation Explainer Modal */}
      <AnimatePresence>
        {showCalculationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="bg-white max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E4E4E7] space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#FAFAFA] text-[#09090B] border border-[#E4E4E7]">
                    <Info className="h-5 w-5 text-[#0E50B0]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#71717A] block">
                      Standards & Formulas
                    </span>
                    <h3 className="font-sans font-black text-lg uppercase tracking-tight text-[#09090B]">
                      Competency Scoring Standards
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCalculationModal(false)}
                  className="p-1.5 hover:bg-[#FAFAFA] text-[#71717A] hover:text-[#09090B] transition-colors cursor-pointer border border-transparent hover:border-[#E4E4E7]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 text-body text-[#52525B] leading-relaxed">
                <div className="p-4 bg-[#FAFAFA] border border-[#E4E4E7] space-y-1">
                  <p className="font-bold text-[#09090B] flex items-center gap-1.5 text-caption uppercase tracking-wider">
                    <Award className="h-4 w-4 text-[#0E50B0]" />
                    Certification Threshold: 75%
                  </p>
                  <p className="text-caption text-[#52525B]">
                    To earn a verified operational credential for any module, staff must achieve 75% or higher on the server-evaluated end-of-module assessment.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-[#09090B] mb-2 flex items-center gap-1.5 text-caption uppercase tracking-wider">
                    <Target className="h-4 w-4 text-[#0E50B0]" />
                    Readiness Tiers
                  </h4>
                  <ul className="space-y-2">
                    <li className="p-3 bg-white border border-[#E4E4E7] text-caption">
                      <strong className="text-[#09090B] block font-bold">Initial Onboarding (0–24%)</strong>
                      Staff has enrolled and is beginning curriculum reading.
                    </li>
                    <li className="p-3 bg-white border border-[#E4E4E7] text-caption">
                      <strong className="text-[#09090B] block font-bold">Developing Competency (25–49%)</strong>
                      At least one core module certified or multiple curriculum lessons completed.
                    </li>
                    <li className="p-3 bg-white border border-[#E4E4E7] text-caption">
                      <strong className="text-[#09090B] block font-bold">Substantial Readiness (50–74%)</strong>
                      At least 50% of local government administrative skills certified.
                    </li>
                    <li className="p-3 bg-emerald-50/50 border border-emerald-300 text-caption">
                      <strong className="text-emerald-800 block font-bold">Full Operational Readiness (75–100%)</strong>
                      All prescribed government skills certified and compliant with administrative standards.
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-[#FAFAFA] border border-[#E4E4E7] flex items-start gap-2 text-caption">
                  <BookOpen className="h-4 w-4 text-[#0E50B0] shrink-0 mt-0.5" />
                  <p className="text-[#09090B] text-xs">
                    <strong className="font-bold">Zero-Guessing Guarantee:</strong> All competency metrics, gap percentages, and score deltas are computed deterministically from stored assessment attempts.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowCalculationModal(false)}
                  size="sm"
                  className="rounded-none uppercase font-bold text-xs tracking-wider"
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
