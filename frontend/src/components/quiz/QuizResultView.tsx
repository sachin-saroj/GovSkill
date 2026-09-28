import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { QuizSubmitResponse } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  Award,
  RefreshCw,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  TrendingUp,
  History,
} from 'lucide-react';
import { scaleInVariants, fadeUpVariants, staggerContainerVariants } from '@/lib/motion';

interface QuizResultViewProps {
  result: QuizSubmitResponse;
  moduleTitle?: string;
  onRetake: () => void;
  onGoToProgress: () => void;
  onGoToLessons: () => void;
  onViewCertificate?: () => void;
}

export const QuizResultView: React.FC<QuizResultViewProps> = ({
  result,
  moduleTitle = 'Module Assessment',
  onRetake,
  onGoToProgress,
  onGoToLessons,
  onViewCertificate,
}) => {
  const shouldReduceMotion = useReducedMotion();

  const {
    score,
    total,
    percentage,
    passed,
    attempt_number,
    best_score,
    competency_breakdown,
    strengths,
    weak_areas,
    recommended_action,
  } = result;

  const bestPercentage = total > 0 ? Math.round((best_score / total) * 100) : percentage;

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-8"
    >
      {/* Primary Score & Status Seal Card */}
      <Card className="text-center p-8 sm:p-10 space-y-6 border-border-warm bg-surface rounded-2xl shadow-none">
        {/* Outcome Seal */}
        <motion.div
          variants={scaleInVariants}
          className={`inline-flex p-4 sm:p-5 rounded-2xl border ${
            passed
              ? 'bg-sage-500/15 text-sage-900 border-sage-500/30'
              : 'bg-rose-500/15 text-rose-900 border-rose-500/30'
          }`}
        >
          <Award className="h-12 w-12" />
        </motion.div>

        <motion.div variants={fadeUpVariants} className="space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest text-ink-muted font-bold">
            <History className="h-3.5 w-3.5" />
            <span>Attempt #{attempt_number} Evaluation</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            {passed ? 'Assessment Certified!' : 'Assessment Completed — Review Required'}
          </h2>
          <p className="text-sm text-ink-muted max-w-lg mx-auto leading-relaxed font-sans">
            Your competency assessment for <strong className="text-ink font-bold">{moduleTitle}</strong> has been evaluated server-side and recorded in your official employee profile.
          </p>
        </motion.div>

        {/* Score & Certification Card */}
        <motion.div
          variants={fadeUpVariants}
          className="p-6 rounded-2xl bg-surface-light border border-border-warm max-w-md mx-auto space-y-4"
        >
          <div className="flex items-center justify-between text-xs text-ink-muted font-mono border-b border-border-warm pb-2">
            <span>Score: <strong className="font-bold text-ink">{score} of {total}</strong></span>
            <span>Passing Threshold: <strong className="font-bold text-ink">75%</strong></span>
          </div>

          <div className="font-mono text-6xl font-black text-ink tracking-tight py-1">
            {percentage}%
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span
              className={`inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-mono uppercase tracking-wider rounded-full border ${
                passed
                  ? 'bg-sage-500/15 text-sage-900 border-sage-500/30 font-bold'
                  : 'bg-rose-500/15 text-rose-900 border-rose-500/30 font-bold'
              }`}
            >
              {passed ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-sage-700" />
              ) : (
                <AlertTriangle className="h-3.5 w-3.5 text-rose-700" />
              )}
              <span>{passed ? 'Certified Competency' : 'Needs Review (<75%)'}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-3.5 py-1 text-xs font-mono rounded-full bg-surface text-ink border border-border-warm">
              <TrendingUp className="h-3 w-3 text-ink-muted" />
              <span>Best Score: {best_score}/{total} ({bestPercentage}%)</span>
            </span>
          </div>

          {passed && onViewCertificate && (
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.99 }}
              className="pt-2 border-t border-border-warm"
            >
              <button
                type="button"
                onClick={onViewCertificate}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-ink hover:bg-ink/90 text-on-ink text-xs font-mono uppercase tracking-wider font-bold rounded-full shadow-none transition-all cursor-pointer min-h-[44px] focus:outline-none focus:ring-2 focus:ring-ink"
              >
                <Award className="h-4 w-4 text-on-ink" />
                <span>View & Print Official Certificate</span>
              </button>
            </motion.div>
          )}
        </motion.div>
      </Card>

      {/* Competency-Level Breakdown Card */}
      {competency_breakdown && competency_breakdown.length > 0 && (
        <motion.div variants={fadeUpVariants}>
          <Card className="p-6 sm:p-8 space-y-6 border-border-warm bg-surface rounded-2xl shadow-none">
            <div className="flex items-center justify-between border-b border-border-warm pb-4">
              <div className="flex items-center gap-2 text-ink font-sans font-bold text-lg tracking-tight">
                <Layers className="h-4 w-4 text-azure-700" />
                <span>Competency Breakdown</span>
              </div>
              <span className="text-xs font-mono font-bold text-ink-muted uppercase tracking-wider">
                {competency_breakdown.length} Competencies Evaluated
              </span>
            </div>

            <div className="space-y-4">
              {competency_breakdown.map((item, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-surface-light border border-border-warm space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-sans text-sm font-bold text-ink tracking-tight">{item.competency}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-ink">
                        {item.score}/{item.total} ({item.percentage}%)
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          item.mastery_level === 'Mastered' || item.passed
                            ? 'bg-sage-500/15 text-sage-900 border-sage-500/30'
                            : item.mastery_level === 'Operational'
                            ? 'bg-surface text-ink border-border-warm'
                            : 'bg-rose-500/15 text-rose-900 border-rose-500/30'
                        }`}
                      >
                        {item.mastery_level || (item.passed ? 'Mastered' : 'Needs Review')}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-surface rounded-full h-1.5 overflow-hidden border border-border-warm">
                    <div
                      className={`h-full transition-all duration-500 ${
                        item.mastery_level === 'Mastered' || item.passed
                          ? 'bg-sage-600'
                          : item.mastery_level === 'Operational'
                          ? 'bg-ink'
                          : 'bg-rose-600'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>

                  {!item.passed && (
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border-warm text-xs">
                      <span className="text-rose-900 font-sans font-medium">
                        Targeted review recommended before retaking.
                      </span>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/tutor?competency=${encodeURIComponent(item.competency)}&mode=remediation&prompt=${encodeURIComponent(`I need help understanding ${item.competency}. Can you explain the core rules and give me a practice scenario?`)}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface hover:bg-surface-elevated text-ink border border-border-warm font-mono text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                          <Sparkles className="h-3.5 w-3.5 text-azure-700" />
                          <span>Ask AI Tutor</span>
                        </Link>
                        <button
                          type="button"
                          onClick={onGoToLessons}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface hover:bg-surface-elevated text-ink border border-border-warm font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          <BookOpen className="h-3.5 w-3.5 text-azure-700" />
                          <span>Review Lesson</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Strengths & Weak Areas Grid */}
      <motion.div variants={fadeUpVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card className="p-6 border-border-warm bg-surface space-y-4 rounded-2xl shadow-none">
          <div className="flex items-center gap-2 text-sage-900 font-sans font-bold text-base tracking-tight">
            <CheckCircle2 className="h-4 w-4 text-sage-700" />
            <span>Validated Strengths</span>
          </div>
          {strengths && strengths.length > 0 ? (
            <ul className="space-y-2 text-xs font-sans text-ink">
              {strengths.map((st, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-sage-500/10 p-3 rounded-xl border border-sage-500/20 text-sage-950">
                  <span className="text-sage-700 font-mono font-bold">✓</span>
                  <span>{st}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-ink-muted italic">
              No strengths validated above 75% on this attempt.
            </p>
          )}
        </Card>

        {/* Weak Areas */}
        <Card className="p-6 border-border-warm bg-surface space-y-4 rounded-2xl shadow-none">
          <div className="flex items-center gap-2 text-rose-900 font-sans font-bold text-base tracking-tight">
            <AlertTriangle className="h-4 w-4 text-rose-700" />
            <span>Areas for Remediation</span>
          </div>
          {weak_areas && weak_areas.length > 0 ? (
            <ul className="space-y-2 text-xs font-sans text-ink">
              {weak_areas.map((wa, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 text-rose-950">
                  <span className="text-rose-900 font-mono font-bold">!</span>
                  <span>{wa}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-sage-900 font-sans font-semibold">
              No skill gaps detected in this module!
            </p>
          )}
        </Card>
      </motion.div>

      {/* Action Recommendation Banner */}
      <motion.div variants={fadeUpVariants} className="p-6 sm:p-7 rounded-2xl bg-ink text-on-ink border border-ink space-y-2 shadow-none">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-azure-400">
          <Sparkles className="h-4 w-4 text-azure-400" />
          <span>Recommended Next Action:</span>
        </div>
        <p className="text-sm font-sans text-white/80 leading-relaxed font-normal">
          {recommended_action}
        </p>
      </motion.div>

      {/* Footer Navigation Bar */}
      <motion.div variants={fadeUpVariants} className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border-warm">
        <Button variant="outline" size="md" onClick={onRetake} className="min-h-[44px] rounded-full px-5 border-border-warm text-ink hover:bg-surface-elevated font-mono text-xs font-bold uppercase tracking-wider">
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          <span>Retake Assessment</span>
        </Button>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="md" onClick={onGoToProgress} className="min-h-[44px] rounded-full px-5 border-border-warm text-ink hover:bg-surface-elevated font-mono text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 mr-1.5 text-azure-700" />
            <span>View My Skills Dashboard</span>
          </Button>
          <Button size="md" onClick={onGoToLessons} className="min-h-[44px] rounded-full px-5 bg-ink hover:bg-ink/90 text-on-ink font-mono text-xs font-bold uppercase tracking-wider">
            <BookOpen className="h-3.5 w-3.5 mr-1.5" />
            <span>Back to Lessons</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QuizResultView;
