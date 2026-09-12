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
      <Card className="text-center p-8 sm:p-10 space-y-6 border-[#D9CFBB] bg-[#EDE4D0] rounded-2xl shadow-xs">
        {/* Outcome Seal */}
        <motion.div
          variants={scaleInVariants}
          className={`inline-flex p-4 sm:p-5 rounded-2xl shadow-xs border ${
            passed
              ? 'bg-[#F5EFE0] text-[#2A5B4A] border-[#2A5B4A]/30'
              : 'bg-[#F5EFE0] text-[#C97B5A] border-[#C97B5A]/30'
          }`}
        >
          <Award className="h-12 w-12" />
        </motion.div>

        <motion.div variants={fadeUpVariants} className="space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest text-[#6B6357]">
            <History className="h-3.5 w-3.5" />
            <span>Attempt #{attempt_number} Evaluation</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#0A0A0A] tracking-tight">
            {passed ? 'Assessment Certified!' : 'Assessment Completed — Review Required'}
          </h2>
          <p className="text-sm text-[#6B6357] max-w-lg mx-auto leading-relaxed font-sans">
            Your competency assessment for <strong className="text-[#0A0A0A]">{moduleTitle}</strong> has been evaluated server-side and recorded in your official employee profile.
          </p>
        </motion.div>

        {/* Score & Certification Card */}
        <motion.div
          variants={fadeUpVariants}
          className="p-6 rounded-xl bg-[#F5EFE0] border border-[#D9CFBB] max-w-md mx-auto shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between text-xs text-[#6B6357] font-mono border-b border-[#D9CFBB] pb-2">
            <span>Score: <strong className="font-bold text-[#0A0A0A]">{score} of {total}</strong></span>
            <span>Passing Threshold: <strong className="font-bold text-[#0A0A0A]">75%</strong></span>
          </div>

          <div className="font-serif text-5xl font-normal text-[#0A0A0A] tracking-tight py-1">
            {percentage}%
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span
              className={`inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-mono uppercase tracking-wider rounded-full border ${
                passed
                  ? 'bg-[#EDE4D0] text-[#2A5B4A] border-[#2A5B4A]/40 font-semibold'
                  : 'bg-[#EDE4D0] text-[#C97B5A] border-[#C97B5A]/40 font-semibold'
              }`}
            >
              {passed ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-[#2A5B4A]" />
              ) : (
                <AlertTriangle className="h-3.5 w-3.5 text-[#C97B5A]" />
              )}
              <span>{passed ? 'Certified Competency' : 'Needs Review (<75%)'}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-3.5 py-1 text-xs font-mono rounded-full bg-[#EDE4D0] text-[#0A0A0A] border border-[#D9CFBB]">
              <TrendingUp className="h-3 w-3 text-[#6B6357]" />
              <span>Best Score: {best_score}/{total} ({bestPercentage}%)</span>
            </span>
          </div>

          {passed && onViewCertificate && (
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.99 }}
              className="pt-2 border-t border-[#D9CFBB]"
            >
              <button
                type="button"
                onClick={onViewCertificate}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#2A5B4A] hover:bg-[#2A5B4A]/90 text-[#F5EFE0] text-xs font-mono uppercase tracking-wider font-semibold rounded-full shadow-xs transition-all cursor-pointer min-h-[44px]"
              >
                <Award className="h-4 w-4 text-[#F5EFE0]" />
                <span>View & Print Official Certificate</span>
              </button>
            </motion.div>
          )}
        </motion.div>
      </Card>

      {/* Competency-Level Breakdown Card */}
      {competency_breakdown && competency_breakdown.length > 0 && (
        <motion.div variants={fadeUpVariants}>
          <Card className="p-6 sm:p-8 space-y-5 border-[#D9CFBB] bg-[#EDE4D0] rounded-2xl shadow-xs">
            <div className="flex items-center justify-between border-b border-[#D9CFBB] pb-3">
              <div className="flex items-center gap-2 text-[#0A0A0A] font-serif text-lg tracking-tight">
                <Layers className="h-4 w-4 text-[#2A5B4A]" />
                <span>Competency Breakdown</span>
              </div>
              <span className="text-xs font-mono text-[#6B6357]">
                {competency_breakdown.length} Competencies Evaluated
              </span>
            </div>

            <div className="space-y-3.5">
              {competency_breakdown.map((item, idx) => (
                <div key={idx} className="p-4 sm:p-5 rounded-xl bg-[#F5EFE0] border border-[#D9CFBB] space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-serif text-sm font-medium text-[#0A0A0A]">{item.competency}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-[#6B6357]">
                        {item.score}/{item.total} ({item.percentage}%)
                      </span>
                      <span
                        className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          item.mastery_level === 'Mastered' || item.passed
                            ? 'bg-[#EDE4D0] text-[#2A5B4A] border-[#2A5B4A]/40'
                            : item.mastery_level === 'Operational'
                            ? 'bg-[#EDE4D0] text-[#0A0A0A] border-[#D9CFBB]'
                            : 'bg-[#EDE4D0] text-[#C97B5A] border-[#C97B5A]/40'
                        }`}
                      >
                        {item.mastery_level || (item.passed ? 'Mastered' : 'Needs Review')}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-[#EDE4D0] rounded-full h-2 overflow-hidden border border-[#D9CFBB]/60">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        item.mastery_level === 'Mastered' || item.passed
                          ? 'bg-[#2A5B4A]'
                          : item.mastery_level === 'Operational'
                          ? 'bg-[#0A0A0A]'
                          : 'bg-[#C97B5A]'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>

                  {!item.passed && (
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#D9CFBB] text-xs">
                      <span className="text-[#C97B5A] font-sans">
                        Targeted review recommended before retaking.
                      </span>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/tutor?competency=${encodeURIComponent(item.competency)}&mode=remediation&prompt=${encodeURIComponent(`I need help understanding ${item.competency}. Can you explain the core rules and give me a practice scenario?`)}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EDE4D0] hover:bg-[#EDE4D0]/80 text-[#0A0A0A] border border-[#D9CFBB] font-mono text-xs transition-colors shadow-xs"
                        >
                          <Sparkles className="h-3.5 w-3.5 text-[#C9A24A]" />
                          <span>Ask AI Tutor</span>
                        </Link>
                        <button
                          type="button"
                          onClick={onGoToLessons}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EDE4D0] hover:bg-[#EDE4D0]/80 text-[#0A0A0A] border border-[#D9CFBB] font-mono text-xs transition-colors cursor-pointer shadow-xs"
                        >
                          <BookOpen className="h-3.5 w-3.5 text-[#2A5B4A]" />
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
        <Card className="p-6 border-[#D9CFBB] bg-[#EDE4D0] space-y-3.5 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2 text-[#2A5B4A] font-serif text-base tracking-tight">
            <CheckCircle2 className="h-4 w-4 text-[#2A5B4A]" />
            <span>Validated Strengths</span>
          </div>
          {strengths && strengths.length > 0 ? (
            <ul className="space-y-2 text-xs font-sans text-[#0A0A0A]">
              {strengths.map((st, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-[#F5EFE0] p-2.5 rounded-lg border border-[#D9CFBB]">
                  <span className="text-[#2A5B4A] font-mono font-bold">✓</span>
                  <span>{st}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[#6B6357] italic">
              No strengths validated above 75% on this attempt.
            </p>
          )}
        </Card>

        {/* Weak Areas */}
        <Card className="p-6 border-[#D9CFBB] bg-[#EDE4D0] space-y-3.5 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2 text-[#C97B5A] font-serif text-base tracking-tight">
            <AlertTriangle className="h-4 w-4 text-[#C97B5A]" />
            <span>Areas for Remediation</span>
          </div>
          {weak_areas && weak_areas.length > 0 ? (
            <ul className="space-y-2 text-xs font-sans text-[#0A0A0A]">
              {weak_areas.map((wa, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-[#F5EFE0] p-2.5 rounded-lg border border-[#D9CFBB]">
                  <span className="text-[#C97B5A] font-mono font-bold">!</span>
                  <span>{wa}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[#2A5B4A] font-sans font-medium">
              No skill gaps detected in this module!
            </p>
          )}
        </Card>
      </motion.div>

      {/* Action Recommendation Banner */}
      <motion.div variants={fadeUpVariants} className="p-6 sm:p-7 rounded-2xl bg-[#0A0A0A] text-[#F5EFE0] border border-[#0A0A0A] space-y-2 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C9A24A]">
          <Sparkles className="h-4 w-4" />
          <span>Recommended Next Action:</span>
        </div>
        <p className="text-sm font-sans text-[#EDE4D0] leading-relaxed font-normal">
          {recommended_action}
        </p>
      </motion.div>

      {/* Footer Navigation Bar */}
      <motion.div variants={fadeUpVariants} className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-[#D9CFBB]">
        <Button variant="outline" size="md" onClick={onRetake} className="min-h-[44px] rounded-full px-5">
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          <span>Retake Assessment</span>
        </Button>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="md" onClick={onGoToProgress} className="min-h-[44px] rounded-full px-5">
            <Sparkles className="h-3.5 w-3.5 mr-1.5 text-[#C9A24A]" />
            <span>View My Skills Dashboard</span>
          </Button>
          <Button size="md" onClick={onGoToLessons} className="min-h-[44px] rounded-full px-5">
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
