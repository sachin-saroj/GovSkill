import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Award, RefreshCw, Sparkles, BookOpen, CheckCircle2, AlertTriangle } from 'lucide-react';

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

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 animate-fade-in">
      <Card className="text-center p-8 sm:p-10 space-y-6 border-slate-200 shadow-civic-md bg-white">
        {/* Outcome Seal */}
        <div
          className={`inline-flex p-4 sm:p-5 rounded-2xl ${
            passed
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-civic-xs'
              : 'bg-saffron-50 text-saffron-600 border border-saffron-200 shadow-civic-xs'
          }`}
        >
          <Award className="h-12 w-12" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Quiz Submission Complete
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Your quiz score has been evaluated server-side and recorded in your official employee profile.
          </p>
        </div>

        {/* Score Card Frame */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 max-w-sm mx-auto shadow-civic-xs space-y-2">
          <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider block">
            Official Score
          </span>
          <div className="text-4xl font-extrabold text-civic-900 font-mono tracking-tight">
            {score} / {total}
          </div>
          <span
            className={`inline-flex items-center gap-1 px-3.5 py-1 text-xs font-bold rounded-full border shadow-civic-xs ${
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
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={onRetake} className="text-xs shadow-civic-xs">
            <RefreshCw className="h-4 w-4 mr-1.5" />
            <span>Retake Quiz</span>
          </Button>
          <Button variant="outline" onClick={onGoToProgress} className="text-xs shadow-civic-xs">
            <Sparkles className="h-4 w-4 mr-1.5 text-saffron-500" />
            <span>My Skill Progress</span>
          </Button>
          <Button onClick={onGoToLessons} className="text-xs shadow-civic-xs">
            <BookOpen className="h-4 w-4 mr-1.5" />
            <span>Back to Lessons</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default QuizResultView;
