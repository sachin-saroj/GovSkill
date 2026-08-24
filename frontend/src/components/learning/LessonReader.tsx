import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Module } from '@/types';
import Card from '@/components/ui/Card';
import {
  CheckCircle2,
  Sparkles,
  Loader2,
  BookOpen,
} from 'lucide-react';
import { fadeUpVariants, staggerContainerVariants } from '@/lib/motion';

interface LessonReaderProps {
  module: Module;
  isCurrentCompleted: boolean;
  isMarkingComplete: boolean;
  onCompleteLessons: () => void;
}

export const LessonReader: React.FC<LessonReaderProps> = ({
  module,
  isCurrentCompleted,
  isMarkingComplete,
  onCompleteLessons,
}) => {
  const shouldReduceMotion = useReducedMotion();

  const sections = module.content
    .split('# ')
    .filter(Boolean)
    .map((section) => {
      const lines = section.trim().split('\n');
      const title = lines[0];
      const body = lines.slice(1).join('\n');
      return { title, body };
    });

  return (
    <Card className="bg-white border-slate-200 shadow-civic-md p-6 sm:p-8 space-y-8 rounded-3xl" variant="elevated">
      {/* Top Section Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-civic-800">
          <BookOpen className="h-4 w-4 text-civic-700" />
          <span>Curriculum Content</span>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          {sections.length} Official Lessons
        </span>
      </div>

      {/* Lesson Sections Grid / Content */}
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
        key={module.id}
        className="space-y-8 text-slate-900"
      >
        {sections.map((section, idx) => (
          <motion.div
            variants={fadeUpVariants}
            key={idx}
            className="border-b border-slate-200/80 pb-8 last:border-0 last:pb-0 space-y-3"
          >
            <div className="flex items-start gap-3">
              <span className="h-7 w-7 rounded-lg bg-civic-100 text-civic-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-civic-xs">
                {idx + 1}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-civic-900 tracking-tight leading-snug">
                {section.title}
              </h2>
            </div>
            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line pl-10 font-normal">
              {section.body}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom Lesson Completion Control Bar */}
      <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-600">
          {isCurrentCompleted ? (
            <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 px-3.5 py-1 rounded-xl border border-emerald-200 shadow-civic-xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Lessons Completed</span>
            </span>
          ) : (
            <span className="text-slate-500 font-medium">
              Finished reading? Mark lessons completed to update your skill dashboard.
            </span>
          )}
        </div>

        <motion.button
          type="button"
          whileHover={shouldReduceMotion || isCurrentCompleted ? {} : { scale: 1.03 }}
          whileTap={shouldReduceMotion || isCurrentCompleted ? {} : { scale: 0.96 }}
          onClick={onCompleteLessons}
          disabled={isMarkingComplete || isCurrentCompleted}
          className={`px-5 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-civic-xs ${
            isCurrentCompleted
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
              : 'bg-civic-800 text-white hover:bg-civic-900 cursor-pointer'
          }`}
        >
          {isMarkingComplete ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving Progress...</span>
            </>
          ) : isCurrentCompleted ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              <span>Completed</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 text-saffron-400" />
              <span>Mark Lessons as Completed</span>
            </>
          )}
        </motion.button>
      </div>
    </Card>
  );
};

export default LessonReader;
