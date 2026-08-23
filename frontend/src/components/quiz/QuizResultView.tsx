import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Award, RefreshCw, Sparkles, BookOpen, CheckCircle2, AlertTriangle } from 'lucide-react';
import { scaleInVariants, fadeUpVariants, staggerContainerVariants } from '@/lib/motion';

interface QuizResultViewProps {
  score: number;
  total: number;
  onRetake: () => void;
  onGoToProgress: () => void;
  onGoToLessons: () => void;
}

export const QuizResultView: React.FC<QuizResultViewProps> = ({
  score,
  total,
  onRetake,
  onGoToProgress,
  onGoToLessons,
}) => {
  const percentage = Math.round((score / total) * 100);
  const passed = percentage >= 75;
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto py-12 px-4"
    >
      <Card className="text-center p-8 sm:p-10 space-y-6 border-slate-200 shadow-civic-lg bg-white rounded-3xl" variant="elevated">
        {/* Outcome Seal */}
        <motion.div
          variants={scaleInVariants}
          className={`inline-flex p-5 rounded-3xl ${
            passed
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-civic-xs'
              : 'bg-saffron-50 text-saffron-600 border border-saffron-200 shadow-civic-xs'
          }`}
        >
          <Award className="h-14 w-14" />
        </motion.div>

        <motion.div variants={fadeUpVariants} className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Quiz Submission Complete
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Your quiz score has been evaluated server-side and recorded in your official employee profile.
          </p>
        </motion.div>

        {/* Score Card Frame */}
        <motion.div
          variants={fadeUpVariants}
          className="p-6 rounded-3xl bg-slate-50 border border-slate-200/90 max-w-sm mx-auto shadow-civic-xs space-y-2.5"
        >
          <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider block">
            Official Score
          </span>
          <div className="text-4xl font-extrabold text-civic-900 font-mono tracking-tight">
            {score} / {total}
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-4 py-1 text-xs font-bold rounded-full border shadow-civic-xs ${
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
            <span>
              {percentage}% — {passed ? 'Passed & Certified' : 'Needs Review'}
            </span>
          </span>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={fadeUpVariants}
          className="flex flex-wrap justify-center gap-3 pt-4 border-t border-slate-100"
        >
          <motion.div whileHover={shouldReduceMotion ? {} : { scale: 1.03 }} whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}>
            <Button variant="outline" onClick={onRetake} className="text-xs shadow-civic-xs cursor-pointer">
              <RefreshCw className="h-4 w-4 mr-1.5" />
              <span>Retake Quiz</span>
            </Button>
          </motion.div>

          <motion.div whileHover={shouldReduceMotion ? {} : { scale: 1.03 }} whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}>
            <Button variant="outline" onClick={onGoToProgress} className="text-xs shadow-civic-xs cursor-pointer">
              <Sparkles className="h-4 w-4 mr-1.5 text-saffron-500" />
              <span>My Skill Progress</span>
            </Button>
          </motion.div>

          <motion.div whileHover={shouldReduceMotion ? {} : { scale: 1.03 }} whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}>
            <Button onClick={onGoToLessons} className="text-xs shadow-civic-xs cursor-pointer">
              <BookOpen className="h-4 w-4 mr-1.5" />
              <span>Back to Lessons</span>
            </Button>
          </motion.div>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default QuizResultView;
