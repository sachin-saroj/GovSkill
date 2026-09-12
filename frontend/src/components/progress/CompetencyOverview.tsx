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
      {/* 1. Hero Banner with Asymmetric Composition & Animated Civic Geometry */}
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
        <Card className="p-6 bg-[#EDE4D0] border border-[#D9CFBB] shadow-sm rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#6B6357]">
              Overall Competency
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#E4D9C3] text-[#0A0A0A] border border-[#D9CFBB]">
              {learningStatus}
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-bold text-[#0A0A0A] font-mono tracking-tight">
              {overallScore}%
            </span>
            <div className="space-y-0.5">
              <span className="text-caption font-semibold text-[#2A5B4A] block">
                {certifiedCount} of {totalCount} Certified
              </span>
              <span className="text-[12px] text-[#6B6357] font-normal block">
                {modulesRemaining > 0 ? `${modulesRemaining} remaining` : 'All certified'}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#E0D5BE] border border-[#D9CFBB]/60 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={shouldReduceMotion ? { width: `${Math.max(5, overallScore)}%` } : { width: '0%' }}
              animate={{ width: `${Math.max(5, Math.min(100, overallScore))}%` }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="h-2 bg-[#0A0A0A] rounded-full"
            />
          </div>

          <p className="text-[12px] text-[#6B6357] font-medium">
            Benchmark Target: <strong className="text-[#0A0A0A]">75%</strong> on end-of-module assessment
          </p>
        </Card>

        {/* Metric 2: Operational Readiness */}
        <Card className="p-6 bg-[#EDE4D0] border border-[#D9CFBB] shadow-sm rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#6B6357]">
              Operational Readiness
            </span>
            <CheckCircle2 className="h-4 w-4 text-[#2A5B4A]" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-serif font-bold text-[#0A0A0A] tracking-tight">
              {readinessLevel}
            </h3>
            <p className="text-caption text-[#6B6357] line-clamp-2">
              {explanation || 'Evaluated deterministically from recorded assessment evaluation history.'}
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between text-[12px] border-t border-[#D9CFBB] text-[#6B6357] font-medium">
            <span>Staff Evaluation Status</span>
            <span className="font-semibold text-[#0A0A0A] font-mono">{modulesCompleted}/{totalCount} Completed</span>
          </div>
        </Card>

        {/* Metric 3: Focus & Skill Gaps */}
        <Card className="p-6 bg-[#EDE4D0] border border-[#D9CFBB] shadow-sm rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#6B6357]">
              Targeted Remediation
            </span>
            <Target className="h-4 w-4 text-[#C97B5A]" />
          </div>

          <div className="space-y-1.5">
            {weakest ? (
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#C97B5A] bg-[#C97B5A]/10 px-2 py-0.5 rounded-md border border-[#C97B5A]/30 inline-block mb-1">
                  Priority Focus
                </span>
                <p className="text-caption font-serif font-semibold text-[#0A0A0A] truncate" title={weakest}>
                  {weakest}
                </p>
              </div>
            ) : (
              <div className="py-1">
                <p className="text-caption font-serif font-semibold text-[#2A5B4A]">All Competencies Compliant</p>
                <p className="text-[12px] text-[#6B6357]">No active gaps detected</p>
              </div>
            )}

            {strongest && (
              <div className="pt-1 flex items-center gap-1.5 text-[12px] text-[#6B6357]">
                <span className="text-[#6B6357]/80">Top skill:</span>
                <strong className="text-[#0A0A0A] font-medium truncate">{strongest}</strong>
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center justify-between text-[12px] border-t border-[#D9CFBB] text-[#6B6357] font-medium">
            <span>Avg Evaluation Score</span>
            <span className="font-semibold text-[#0A0A0A] font-mono">{avgScore > 0 ? `${avgScore}%` : '—'}</span>
          </div>
        </Card>
      </div>

      {/* Transparent Calculation Explainer Modal */}
      <AnimatePresence>
        {showCalculationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0A]/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#F5EFE0] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#D9CFBB] space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-[#D9CFBB] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#EDE4D0] text-[#0A0A0A] border border-[#D9CFBB]">
                    <Info className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-[#0A0A0A] text-lg">Competency Scoring Standards</h3>
                    <p className="text-caption text-[#6B6357]">How your operational readiness is calculated</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCalculationModal(false)}
                  className="p-1.5 rounded-lg hover:bg-[#EDE4D0] text-[#6B6357] hover:text-[#0A0A0A] transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 text-body text-[#6B6357] leading-relaxed">
                <div className="p-4 bg-[#EDE4D0] rounded-xl border border-[#D9CFBB] space-y-1">
                  <p className="font-serif font-semibold text-[#0A0A0A] flex items-center gap-1.5 text-caption">
                    <Award className="h-4 w-4 text-[#C97B5A]" />
                    Certification Threshold: 75%
                  </p>
                  <p className="text-caption text-[#6B6357]">
                    To earn a verified operational credential for any module, staff must achieve 75% or higher on the server-evaluated end-of-module assessment.
                  </p>
                </div>

                <div>
                  <h4 className="font-serif font-semibold text-[#0A0A0A] mb-2 flex items-center gap-1.5 text-caption">
                    <Target className="h-4 w-4 text-[#C9A24A]" />
                    Readiness Tiers
                  </h4>
                  <ul className="space-y-2">
                    <li className="p-3 rounded-lg bg-[#EDE4D0]/80 border border-[#D9CFBB] text-caption">
                      <strong className="text-[#0A0A0A] block font-semibold">Initial Onboarding (0–24%)</strong>
                      Staff has enrolled and is beginning curriculum reading.
                    </li>
                    <li className="p-3 rounded-lg bg-[#EDE4D0]/80 border border-[#D9CFBB] text-caption">
                      <strong className="text-[#0A0A0A] block font-semibold">Developing Competency (25–49%)</strong>
                      At least one core module certified or multiple curriculum lessons completed.
                    </li>
                    <li className="p-3 rounded-lg bg-[#EDE4D0]/80 border border-[#D9CFBB] text-caption">
                      <strong className="text-[#0A0A0A] block font-semibold">Substantial Readiness (50–74%)</strong>
                      At least 50% of local government administrative skills certified.
                    </li>
                    <li className="p-3 rounded-lg bg-[#2A5B4A]/10 border border-[#2A5B4A]/30 text-caption">
                      <strong className="text-[#2A5B4A] block font-semibold">Full Operational Readiness (75–100%)</strong>
                      All prescribed government skills certified and compliant with administrative standards.
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-[#EDE4D0] rounded-xl border border-[#D9CFBB] flex items-start gap-2 text-caption">
                  <BookOpen className="h-4 w-4 text-[#C9A24A] shrink-0 mt-0.5" />
                  <p className="text-[#0A0A0A]">
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
