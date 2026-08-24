import React from 'react';
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
}

export const QuizResultView: React.FC<QuizResultViewProps> = ({
  result,
  moduleTitle = 'Module Assessment',
  onRetake,
  onGoToProgress,
  onGoToLessons,
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
      className="max-w-3xl mx-auto py-10 px-4 sm:px-6 space-y-6"
    >
      {/* Primary Score & Status Seal Card */}
      <Card className="text-center p-8 sm:p-10 space-y-6 border-slate-200 shadow-civic-md bg-white rounded-3xl" variant="elevated">
        {/* Outcome Seal */}
        <motion.div
          variants={scaleInVariants}
          className={`inline-flex p-4 sm:p-5 rounded-2xl shadow-civic-xs ${
            passed
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
              : 'bg-saffron-50 text-saffron-600 border border-saffron-200'
          }`}
        >
          <Award className="h-14 w-14" />
        </motion.div>

        <motion.div variants={fadeUpVariants} className="space-y-1.5">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <History className="h-3.5 w-3.5" />
            <span>Attempt #{attempt_number} Evaluation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {passed ? 'Assessment Certified!' : 'Assessment Completed — Review Required'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
            Your competency assessment for <strong>{moduleTitle}</strong> has been evaluated server-side and recorded in your official employee profile.
          </p>
        </motion.div>

        {/* Score & Certification Card */}
        <motion.div
          variants={fadeUpVariants}
          className="p-6 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto shadow-civic-xs space-y-3"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-2">
            <span>Score: <strong>{score} of {total}</strong></span>
            <span>Passing Threshold: <strong>75%</strong></span>
          </div>

          <div className="text-4xl sm:text-5xl font-extrabold text-civic-900 font-mono tracking-tight">
            {percentage}%
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span
              className={`inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold rounded-full border shadow-civic-xs ${
                passed
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-saffron-100 text-saffron-900 border-saffron-300'
              }`}
            >
              {passed ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <AlertTriangle className="h-3.5 w-3.5 text-saffron-600" />
              )}
              <span>{passed ? 'Certified Competency' : 'Needs Review (<75%)'}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-slate-200/80 text-slate-800 border border-slate-300">
              <TrendingUp className="h-3 w-3 text-slate-600" />
              <span>Best Score: {best_score}/{total} ({bestPercentage}%)</span>
            </span>
          </div>
        </motion.div>
      </Card>

      {/* Competency-Level Breakdown Card */}
      {competency_breakdown && competency_breakdown.length > 0 && (
        <motion.div variants={fadeUpVariants}>
          <Card className="p-6 sm:p-7 space-y-5 border-slate-200 shadow-civic-sm bg-white rounded-3xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <Layers className="h-5 w-5 text-civic-700" />
                <span>Competency Breakdown</span>
              </div>
              <span className="text-xs font-medium text-slate-500">
                {competency_breakdown.length} Competencies Evaluated
              </span>
            </div>

            <div className="space-y-4">
              {competency_breakdown.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-slate-800">{item.competency}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-600">
                        {item.score}/{item.total} ({item.percentage}%)
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          item.passed
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}
                      >
                        {item.passed ? 'Mastered' : 'Needs Review'}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        item.passed ? 'bg-emerald-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Strengths & Weak Areas Grid */}
      <motion.div variants={fadeUpVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Strengths */}
        <Card className="p-5 border-slate-200 shadow-civic-xs bg-emerald-50/40 space-y-3 rounded-2xl">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Validated Strengths</span>
          </div>
          {strengths && strengths.length > 0 ? (
            <ul className="space-y-1.5 text-xs text-emerald-950">
              {strengths.map((st, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{st}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 italic">
              No strengths validated above 75% on this attempt.
            </p>
          )}
        </Card>

        {/* Weak Areas */}
        <Card className="p-5 border-slate-200 shadow-civic-xs bg-amber-50/40 space-y-3 rounded-2xl">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span>Areas for Remediation</span>
          </div>
          {weak_areas && weak_areas.length > 0 ? (
            <ul className="space-y-1.5 text-xs text-amber-950">
              {weak_areas.map((wa, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold">!</span>
                  <span>{wa}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-emerald-700 font-medium">
              No skill gaps detected in this module!
            </p>
          )}
        </Card>
      </motion.div>

      {/* Action Recommendation Banner */}
      <motion.div variants={fadeUpVariants} className="p-5 rounded-2xl bg-civic-900 text-white shadow-civic-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-saffron-400">
          <Sparkles className="h-4 w-4" />
          <span>Recommended Next Action:</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
          {recommended_action}
        </p>
      </motion.div>

      {/* Footer Navigation Bar */}
      <motion.div variants={fadeUpVariants} className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
        <motion.div whileHover={shouldReduceMotion ? {} : { scale: 1.03 }} whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}>
          <Button variant="outline" onClick={onRetake} className="text-xs shadow-civic-xs cursor-pointer">
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            <span>Retake Assessment</span>
          </Button>
        </motion.div>

        <div className="flex flex-wrap gap-2.5">
          <motion.div whileHover={shouldReduceMotion ? {} : { scale: 1.03 }} whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}>
            <Button variant="outline" onClick={onGoToProgress} className="text-xs shadow-civic-xs cursor-pointer">
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-saffron-500" />
              <span>View My Skills Dashboard</span>
            </Button>
          </motion.div>
          <motion.div whileHover={shouldReduceMotion ? {} : { scale: 1.03 }} whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}>
            <Button onClick={onGoToLessons} className="text-xs shadow-civic-xs cursor-pointer">
              <BookOpen className="h-3.5 w-3.5 mr-1.5" />
              <span>Back to Lessons</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QuizResultView;

