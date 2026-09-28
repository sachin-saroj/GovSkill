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
        {/* Metric 1: Competency Score (Azure Tint) */}
        <Card variant="kpi-azure" className="p-6 rounded-2xl border border-azure-500/25 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-ink-muted font-bold">
              Overall Competency
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-azure-500/15 text-ink border border-azure-500/30 rounded-full font-bold">
              {learningStatus}
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-black text-ink font-mono tracking-tight">
              {overallScore}%
            </span>
            <div className="space-y-0.5">
              <span className="text-caption font-bold text-sage-700 block">
                {certifiedCount} of {totalCount} Certified
              </span>
              <span className="text-[11px] font-mono text-ink-muted block">
                {modulesRemaining > 0 ? `${modulesRemaining} remaining` : 'All certified'}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-azure-500/15 border border-azure-500/20 h-2 rounded-full overflow-hidden">
            <motion.div
              initial={shouldReduceMotion ? { width: `${Math.max(5, overallScore)}%` } : { width: '0%' }}
              animate={{ width: `${Math.max(5, Math.min(100, overallScore))}%` }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="h-2 rounded-full bg-azure-600"
            />
          </div>

          <p className="text-[11px] text-ink-muted font-medium">
            Benchmark Target: <strong className="text-ink">75%</strong> on end-of-module assessment
          </p>
        </Card>

        {/* Metric 2: Operational Readiness (Sage Tint) */}
        <Card variant="kpi-sage" className="p-6 rounded-2xl border border-sage-500/25 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-ink-muted font-bold">
              Operational Readiness
            </span>
            <CheckCircle2 className="h-4 w-4 text-sage-700" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold font-serif tracking-tight text-ink">
              {readinessLevel}
            </h3>
            <p className="text-caption text-ink-muted line-clamp-2">
              {explanation || 'Evaluated deterministically from recorded assessment evaluation history.'}
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] border-t border-sage-500/20 text-ink-muted">
            <span>Staff Evaluation Status</span>
            <span className="font-bold text-ink font-mono">{modulesCompleted}/{totalCount} Completed</span>
          </div>
        </Card>

        {/* Metric 3: Focus & Skill Gaps (Gold Tint) */}
        <Card variant="kpi-gold" className="p-6 rounded-2xl border border-gold-500/25 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-ink-muted font-bold">
              Targeted Remediation
            </span>
            <Target className="h-4 w-4 text-gold-700" />
          </div>

          <div className="space-y-1.5">
            {weakest ? (
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-800 bg-rose-500/15 px-2.5 py-0.5 border border-rose-500/25 rounded-full inline-block mb-1 font-bold">
                  Priority Focus
                </span>
                <p className="text-caption font-bold text-ink truncate" title={weakest}>
                  {weakest}
                </p>
              </div>
            ) : (
              <div className="py-1">
                <p className="text-caption font-bold text-sage-800">All Competencies Compliant</p>
                <p className="text-[11px] text-ink-muted">No active gaps detected</p>
              </div>
            )}

            {strongest && (
              <div className="pt-1 flex items-center gap-1.5 text-[11px] text-ink-muted">
                <span>Top skill:</span>
                <strong className="text-ink font-bold truncate">{strongest}</strong>
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] border-t border-gold-500/20 text-ink-muted">
            <span>Avg Evaluation Score</span>
            <span className="font-bold text-ink font-mono">{avgScore > 0 ? `${avgScore}%` : '—'}</span>
          </div>
        </Card>
      </div>

      {/* Transparent Calculation Explainer Modal */}
      <AnimatePresence>
        {showCalculationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="bg-surface max-w-lg w-full p-6 sm:p-8 rounded-3xl shadow-xl border border-border-warm space-y-5 max-h-[90vh] overflow-y-auto text-ink"
            >
              <div className="flex items-center justify-between border-b border-border-warm pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-surface-light text-ink border border-border-warm rounded-xl">
                    <Info className="h-5 w-5 text-azure-700" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink-muted block font-bold">
                      Standards & Formulas
                    </span>
                    <h3 className="font-serif font-bold text-lg text-ink">
                      Competency Scoring Standards
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCalculationModal(false)}
                  className="p-1.5 hover:bg-surface-light text-ink-muted hover:text-ink rounded-full transition-colors cursor-pointer border border-transparent hover:border-border-warm"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 text-body text-ink-muted leading-relaxed">
                <div className="p-4 bg-surface-light border border-border-warm rounded-2xl space-y-1">
                  <p className="font-bold text-ink flex items-center gap-1.5 text-caption uppercase tracking-wider">
                    <Award className="h-4 w-4 text-azure-700" />
                    Certification Threshold: 75%
                  </p>
                  <p className="text-caption text-ink-muted">
                    To earn a verified operational credential for any module, staff must achieve 75% or higher on the server-evaluated end-of-module assessment.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-ink mb-2 flex items-center gap-1.5 text-caption uppercase tracking-wider">
                    <Target className="h-4 w-4 text-azure-700" />
                    Readiness Tiers
                  </h4>
                  <ul className="space-y-2">
                    <li className="p-3 bg-surface-light border border-border-warm rounded-xl text-caption">
                      <strong className="text-ink block font-bold">Initial Onboarding (0–24%)</strong>
                      Staff has enrolled and is beginning curriculum reading.
                    </li>
                    <li className="p-3 bg-surface-light border border-border-warm rounded-xl text-caption">
                      <strong className="text-ink block font-bold">Developing Competency (25–49%)</strong>
                      At least one core module certified or multiple curriculum lessons completed.
                    </li>
                    <li className="p-3 bg-surface-light border border-border-warm rounded-xl text-caption">
                      <strong className="text-ink block font-bold">Substantial Readiness (50–74%)</strong>
                      At least 50% of local government administrative skills certified.
                    </li>
                    <li className="p-3 bg-sage-500/15 border border-sage-500/30 rounded-xl text-caption">
                      <strong className="text-sage-800 block font-bold">Full Operational Readiness (75–100%)</strong>
                      All prescribed government skills certified and compliant with administrative standards.
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-surface-light border border-border-warm rounded-2xl flex items-start gap-2 text-caption">
                  <BookOpen className="h-4 w-4 text-azure-700 shrink-0 mt-0.5" />
                  <p className="text-ink text-xs">
                    <strong className="font-bold">Zero-Guessing Guarantee:</strong> All competency metrics, gap percentages, and score deltas are computed deterministically from stored assessment attempts.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowCalculationModal(false)}
                  size="sm"
                  className="rounded-full uppercase font-bold text-xs tracking-wider"
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
