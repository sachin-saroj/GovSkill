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
      <Card className="text-center p-8 sm:p-10 space-y-6 border-[#E4E4E7] bg-white rounded-none shadow-none">
        {/* Outcome Seal */}
        <motion.div
          variants={scaleInVariants}
          className={`inline-flex p-4 sm:p-5 rounded-none border ${
            passed
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
              : 'bg-orange-50 text-[#AF411E] border-[#EE8148]'
          }`}
        >
          <Award className="h-12 w-12" />
        </motion.div>

        <motion.div variants={fadeUpVariants} className="space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest text-[#71717A] font-bold">
            <History className="h-3.5 w-3.5" />
            <span>Attempt #{attempt_number} Evaluation</span>
          </div>
          <h2 className="font-sans text-2xl sm:text-3xl font-black uppercase text-black tracking-tight">
            {passed ? 'Assessment Certified!' : 'Assessment Completed — Review Required'}
          </h2>
          <p className="text-sm text-[#71717A] max-w-lg mx-auto leading-relaxed font-sans">
            Your competency assessment for <strong className="text-black font-bold">{moduleTitle}</strong> has been evaluated server-side and recorded in your official employee profile.
          </p>
        </motion.div>

        {/* Score & Certification Card */}
        <motion.div
          variants={fadeUpVariants}
          className="p-6 rounded-none bg-white border border-[#E4E4E7] max-w-md mx-auto space-y-4"
        >
          <div className="flex items-center justify-between text-xs text-[#71717A] font-mono border-b border-[#E4E4E7] pb-2">
            <span>Score: <strong className="font-bold text-black">{score} of {total}</strong></span>
            <span>Passing Threshold: <strong className="font-bold text-black">75%</strong></span>
          </div>

          <div className="font-mono text-6xl font-black text-black tracking-tight py-1">
            {percentage}%
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span
              className={`inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-mono uppercase tracking-wider rounded-none border ${
                passed
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold'
                  : 'bg-orange-50 text-[#AF411E] border-[#EE8148] font-bold'
              }`}
            >
              {passed ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <AlertTriangle className="h-3.5 w-3.5 text-[#EE8148]" />
              )}
              <span>{passed ? 'Certified Competency' : 'Needs Review (<75%)'}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-3.5 py-1 text-xs font-mono rounded-none bg-zinc-100 text-black border border-[#E4E4E7]">
              <TrendingUp className="h-3 w-3 text-[#71717A]" />
              <span>Best Score: {best_score}/{total} ({bestPercentage}%)</span>
            </span>
          </div>

          {passed && onViewCertificate && (
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.99 }}
              className="pt-2 border-t border-[#E4E4E7]"
            >
              <button
                type="button"
                onClick={onViewCertificate}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-black hover:bg-[#0E50B0] text-white text-xs font-mono uppercase tracking-wider font-bold rounded-none shadow-none transition-all cursor-pointer min-h-[44px]"
              >
                <Award className="h-4 w-4 text-white" />
                <span>View & Print Official Certificate</span>
              </button>
            </motion.div>
          )}
        </motion.div>
      </Card>

      {/* Competency-Level Breakdown Card */}
      {competency_breakdown && competency_breakdown.length > 0 && (
        <motion.div variants={fadeUpVariants}>
          <Card className="p-6 sm:p-8 space-y-6 border-[#E4E4E7] bg-white rounded-none shadow-none">
            <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-4">
              <div className="flex items-center gap-2 text-black font-sans font-bold text-lg uppercase tracking-tight">
                <Layers className="h-4 w-4 text-[#0E50B0]" />
                <span>Competency Breakdown</span>
              </div>
              <span className="text-xs font-mono font-bold text-[#71717A] uppercase tracking-wider">
                {competency_breakdown.length} Competencies Evaluated
              </span>
            </div>

            <div className="space-y-4">
              {competency_breakdown.map((item, idx) => (
                <div key={idx} className="p-5 rounded-none bg-white border border-[#E4E4E7] space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-sans text-sm font-bold text-black uppercase tracking-tight">{item.competency}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-black">
                        {item.score}/{item.total} ({item.percentage}%)
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-none border ${
                          item.mastery_level === 'Mastered' || item.passed
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : item.mastery_level === 'Operational'
                            ? 'bg-zinc-100 text-black border-zinc-300'
                            : 'bg-orange-50 text-[#AF411E] border-[#EE8148]'
                        }`}
                      >
                        {item.mastery_level || (item.passed ? 'Mastered' : 'Needs Review')}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-zinc-100 rounded-none h-1.5 overflow-hidden border border-[#E4E4E7]">
                    <div
                      className={`h-full transition-all duration-500 ${
                        item.mastery_level === 'Mastered' || item.passed
                          ? 'bg-emerald-600'
                          : item.mastery_level === 'Operational'
                          ? 'bg-black'
                          : 'bg-[#EE8148]'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>

                  {!item.passed && (
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E4E4E7] text-xs">
                      <span className="text-[#AF411E] font-sans font-medium">
                        Targeted review recommended before retaking.
                      </span>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/tutor?competency=${encodeURIComponent(item.competency)}&mode=remediation&prompt=${encodeURIComponent(`I need help understanding ${item.competency}. Can you explain the core rules and give me a practice scenario?`)}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-none bg-white hover:bg-zinc-50 text-black border border-[#E4E4E7] font-mono text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                          <Sparkles className="h-3.5 w-3.5 text-[#0E50B0]" />
                          <span>Ask AI Tutor</span>
                        </Link>
                        <button
                          type="button"
                          onClick={onGoToLessons}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-none bg-white hover:bg-zinc-50 text-black border border-[#E4E4E7] font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          <BookOpen className="h-3.5 w-3.5 text-[#0E50B0]" />
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
        <Card className="p-6 border-[#E4E4E7] bg-white space-y-4 rounded-none shadow-none">
          <div className="flex items-center gap-2 text-emerald-700 font-sans font-bold text-base uppercase tracking-tight">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Validated Strengths</span>
          </div>
          {strengths && strengths.length > 0 ? (
            <ul className="space-y-2 text-xs font-sans text-black">
              {strengths.map((st, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-emerald-50/50 p-3 rounded-none border border-emerald-200">
                  <span className="text-emerald-700 font-mono font-bold">✓</span>
                  <span>{st}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[#71717A] italic">
              No strengths validated above 75% on this attempt.
            </p>
          )}
        </Card>

        {/* Weak Areas */}
        <Card className="p-6 border-[#E4E4E7] bg-white space-y-4 rounded-none shadow-none">
          <div className="flex items-center gap-2 text-[#AF411E] font-sans font-bold text-base uppercase tracking-tight">
            <AlertTriangle className="h-4 w-4 text-[#EE8148]" />
            <span>Areas for Remediation</span>
          </div>
          {weak_areas && weak_areas.length > 0 ? (
            <ul className="space-y-2 text-xs font-sans text-black">
              {weak_areas.map((wa, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-orange-50/50 p-3 rounded-none border border-[#EE8148]/30">
                  <span className="text-[#AF411E] font-mono font-bold">!</span>
                  <span>{wa}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-emerald-700 font-sans font-semibold">
              No skill gaps detected in this module!
            </p>
          )}
        </Card>
      </motion.div>

      {/* Action Recommendation Banner */}
      <motion.div variants={fadeUpVariants} className="p-6 sm:p-7 rounded-none bg-black text-white border border-black space-y-2 shadow-none">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#0E50B0]">
          <Sparkles className="h-4 w-4 text-white" />
          <span>Recommended Next Action:</span>
        </div>
        <p className="text-sm font-sans text-[#A1A1AA] leading-relaxed font-normal">
          {recommended_action}
        </p>
      </motion.div>

      {/* Footer Navigation Bar */}
      <motion.div variants={fadeUpVariants} className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#E4E4E7]">
        <Button variant="outline" size="md" onClick={onRetake} className="min-h-[44px] rounded-none px-5 border-[#E4E4E7] text-black hover:bg-zinc-100 font-mono text-xs font-bold uppercase tracking-wider">
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          <span>Retake Assessment</span>
        </Button>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="md" onClick={onGoToProgress} className="min-h-[44px] rounded-none px-5 border-[#E4E4E7] text-black hover:bg-zinc-100 font-mono text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 mr-1.5 text-[#0E50B0]" />
            <span>View My Skills Dashboard</span>
          </Button>
          <Button size="md" onClick={onGoToLessons} className="min-h-[44px] rounded-none px-5 bg-black hover:bg-[#0E50B0] text-white font-mono text-xs font-bold uppercase tracking-wider">
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
