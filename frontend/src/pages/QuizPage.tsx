import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { getApiErrorMessage } from '@/lib/apiError';
import { QuizQuestion, Module, QuizSubmitResponse, AdaptiveMeta } from '@/types';
import QuizCard from '@/components/quiz/QuizCard';
import QuizNavigator from '@/components/quiz/QuizNavigator';
import QuizSubmitModal from '@/components/quiz/QuizSubmitModal';
import QuizResultView from '@/components/quiz/QuizResultView';
import CertificateModal from '@/components/certificate/CertificateModal';
import Button from '@/components/ui/Button';
import { EmptyState, ErrorAlert } from '@/components/ui';
import {
  Award,
  CheckCircle2,
  Loader2,
  HelpCircle,
  ShieldCheck,
  Flag,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { staggerContainerVariants, fadeUpVariants } from '@/lib/motion';

export const QuizPage: React.FC = () => {
  const { user } = useAuth();
  const { moduleId } = useParams<{ moduleId: string }>();
  const activeModuleId = moduleId || 'default';
  const shouldReduceMotion = useReducedMotion();

  const [modules, setModules] = useState<Module[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [adaptiveMeta, setAdaptiveMeta] = useState<AdaptiveMeta | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [result, setResult] = useState<QuizSubmitResponse | null>(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [moduleTitle, setModuleTitle] = useState<string>('Digital Document Handling');

  const navigate = useNavigate();

  const fetchQuiz = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [quizRes, modulesRes] = await Promise.all([
        api.get<{ questions: QuizQuestion[]; adaptive_meta?: AdaptiveMeta }>(`/quiz/${activeModuleId}`),
        api.get<Module[]>('/modules').catch(() => ({ data: [] as Module[] })),
      ]);
      setQuestions(quizRes.data.questions);
      setAdaptiveMeta(quizRes.data.adaptive_meta || null);
      if (Array.isArray(modulesRes.data) && modulesRes.data.length > 0) {
        setModules(modulesRes.data);
        const currentMod = modulesRes.data.find((m) => m.id === activeModuleId);
        if (currentMod) {
          setModuleTitle(currentMod.title);
        } else if (activeModuleId === 'default') {
          setModuleTitle(modulesRes.data[0].title);
        } else {
          setModuleTitle('Training Module Assessment');
        }
      }
    } catch (error: unknown) {
      setError(getApiErrorMessage(error, 'Failed to load quiz questions'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [activeModuleId]);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleToggleFlag = (questionId: string) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleJumpToQuestion = (index: number) => {
    const el = document.getElementById(`question-card-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleOpenSubmitModal = () => {
    setIsSubmitModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    const payloadAnswers = Object.entries(answers).map(([qId, idx]) => ({
      question_id: qId,
      selected_option_index: idx,
    }));

    try {
      const res = await api.post<QuizSubmitResponse>(`/quiz/${activeModuleId}/submit`, {
        answers: payloadAnswers,
      });
      setResult(res.data);
      setIsSubmitModalOpen(false);
    } catch (err: any) {
      const msg = err.response?.data?.detail?.error?.message || 'Failed to submit assessment';
      setError(msg);
      setIsSubmitModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setFlaggedQuestions({});
    setResult(null);
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;
  const progressPct = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-3 text-slate-500">
        <Loader2 className="h-6 w-6 animate-spin text-civic-700" />
        <span className="font-medium text-sm">Loading competency assessment...</span>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <ErrorAlert
          title="Assessment Error"
          message={error}
          onRetry={fetchQuiz}
        />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4">
        <EmptyState
          icon={HelpCircle}
          title="No assessment questions available"
          description="Please check back after your administrator publishes assessment questions for this module."
        />
      </div>
    );
  }

  if (result) {
    return (
      <>
        <QuizResultView
          result={result}
          moduleTitle={moduleTitle}
          onRetake={handleRetake}
          onGoToProgress={() => navigate('/progress')}
          onGoToLessons={() => navigate(`/module?id=${activeModuleId}`)}
          onViewCertificate={() => setIsCertificateModalOpen(true)}
        />

        {isCertificateModalOpen && (
          <CertificateModal
            isOpen={isCertificateModalOpen}
            onClose={() => setIsCertificateModalOpen(false)}
            employeeEmail={user?.email || 'employee@office.gov'}
            moduleTitle={moduleTitle}
            moduleId={activeModuleId}
            scorePercentage={result.percentage}
            bestScore={result.best_score}
            totalQuestions={result.total}
            completedDate={result.submitted_at}
            credentialId={result.credential_id || undefined}
          />
        )}
      </>
    );
  }

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8"
    >
      {/* Header Banner & Module Switcher */}
      <motion.div variants={fadeUpVariants} className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-700 font-semibold text-caption">
            <Award className="h-4 w-4 text-emerald-600" />
            <span>Official Competency Assessment</span>
          </div>
          <h1 className="text-page-title font-semibold text-slate-900 tracking-tight">
            {moduleTitle} Assessment
          </h1>
          <p className="text-caption text-slate-500">
            Passing threshold is 75%. Server-side scored with competency-level feedback.
          </p>
        </div>

        {modules.length > 1 && (
          <div className="bg-slate-50 p-3 rounded-civic-xl border border-slate-200 shrink-0 shadow-civic-xs">
            <label htmlFor="quiz-module-select" className="block text-micro font-semibold uppercase text-slate-600 mb-1.5 tracking-wider">
              Switch Assessment:
            </label>
            <select
              id="quiz-module-select"
              value={activeModuleId}
              onChange={(e) => {
                setAnswers({});
                setFlaggedQuestions({});
                setResult(null);
                navigate(`/quiz/${e.target.value}`);
              }}
              className="w-full px-3 py-1.5 text-caption font-semibold text-slate-900 bg-white border border-slate-300 rounded-civic-md focus:outline-none focus:ring-2 focus:ring-civic-700/20 cursor-pointer"
            >
              {modules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </motion.div>

      {/* Adaptive Assessment Focus Banner (Phase 3) */}
      {adaptiveMeta?.is_adaptive && (
        <motion.div
          variants={fadeUpVariants}
          className="p-6 rounded-civic-xl bg-gradient-to-r from-civic-50 via-indigo-50/60 to-white border border-civic-200/90 shadow-civic-xs space-y-2"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-semibold text-civic-900 text-caption">
              <Sparkles className="h-4 w-4 text-civic-700" />
              <span>Adaptive Question Selection Active</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-micro font-semibold uppercase tracking-wider bg-civic-800 text-white">
              Targeted Remediation
            </span>
          </div>
          <p className="text-body text-slate-700 font-normal leading-relaxed">
            {adaptiveMeta.message}
          </p>
          {adaptiveMeta.focus_competencies.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-caption font-semibold text-slate-500">Priority Competencies:</span>
              {adaptiveMeta.focus_competencies.map((comp) => (
                <span
                  key={comp}
                  className="px-2.5 py-0.5 rounded-civic-md text-caption font-semibold bg-white border border-civic-200 text-civic-800 shadow-civic-xs"
                >
                  {comp}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Instructions & Assessment Rules Bar */}
      <div className="p-6 rounded-civic-xl bg-slate-50 border border-slate-200 text-caption text-slate-700 space-y-2">
        <div className="flex items-center gap-2 font-semibold text-slate-900 text-caption">
          <ShieldCheck className="h-4 w-4 text-civic-700" />
          <span>Assessment Guidelines & Instructions:</span>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-caption text-slate-600 pl-6 list-disc">
          <li>Answer all {questions.length} questions to maximize your competency score.</li>
          <li>A score of 75% or higher grants official module certification.</li>
          <li>You can flag questions to review before final submission.</li>
          <li>Retakes are permitted to remediate identified weak areas.</li>
        </ul>
      </div>

      {/* Question Navigator (Jump Palette) */}
      <QuizNavigator
        questions={questions}
        answers={answers}
        flaggedQuestions={flaggedQuestions}
        onJumpToQuestion={handleJumpToQuestion}
        disabled={isSubmitting}
      />

      {/* Answer Progress Meter */}
      <motion.div variants={fadeUpVariants} className="bg-slate-50 p-4 rounded-civic-xl border border-slate-200 shadow-civic-xs space-y-2">
        <div className="flex items-center justify-between text-caption">
          <span className="font-semibold text-slate-800">Completion Progress:</span>
          <span className="font-medium text-slate-600">
            {answeredCount} of {questions.length} answered ({progressPct}%)
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={shouldReduceMotion ? { width: `${progressPct}%` } : { width: '0%' }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="h-2 bg-civic-800 rounded-full"
          />
        </div>
      </motion.div>

      {error && (
        <ErrorAlert
          title="Submission Notice"
          message={error}
          onDismiss={() => setError(null)}
        />
      )}

      {/* Questions Stack */}
      <motion.div variants={fadeUpVariants} className="space-y-6">
        {questions.map((q, idx) => (
          <QuizCard
            key={q.id}
            question={q}
            questionIndex={idx}
            selectedOption={answers[q.id] ?? null}
            onSelectOption={(optIdx) => handleSelectOption(q.id, optIdx)}
            isFlagged={Boolean(flaggedQuestions[q.id])}
            onToggleFlag={() => handleToggleFlag(q.id)}
            disabled={isSubmitting}
          />
        ))}
      </motion.div>

      {/* Bottom Submit Control Bar */}
      <motion.div variants={fadeUpVariants} className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 border-t border-slate-200">
        <div className="flex items-center gap-3 text-caption text-slate-500">
          <span>{answeredCount} of {questions.length} answered</span>
          {flaggedCount > 0 && (
            <span className="text-amber-800 font-semibold flex items-center gap-1">
              <Flag className="h-3 w-3 fill-amber-700 text-amber-700" />
              <span>{flaggedCount} flagged</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate(`/module?id=${activeModuleId}`)}
          >
            <BookOpen className="h-3.5 w-3.5 mr-1.5" />
            <span>Review Lesson</span>
          </Button>

          <Button
            onClick={handleOpenSubmitModal}
            disabled={isSubmitting}
            size="sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                <span>Evaluating...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-1.5" />
                <span>Submit Assessment</span>
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Submit Confirmation Modal */}
      <QuizSubmitModal
        isOpen={isSubmitModalOpen}
        totalQuestions={questions.length}
        answeredCount={answeredCount}
        flaggedCount={flaggedCount}
        isSubmitting={isSubmitting}
        onConfirmSubmit={handleConfirmSubmit}
        onCancel={() => setIsSubmitModalOpen(false)}
      />
    </motion.div>
  );
};

export default QuizPage;
