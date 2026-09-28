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
  const [answers, setAnswers] = useState<Record<string, number>>(() => {
    try {
      const saved = sessionStorage.getItem(`govskill_quiz_draft_${activeModuleId}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
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
    try {
      const saved = sessionStorage.getItem(`govskill_quiz_draft_${activeModuleId}`);
      if (saved) {
        setAnswers(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, [activeModuleId]);

  useEffect(() => {
    if (Object.keys(answers).length > 0 && !result) {
      try {
        sessionStorage.setItem(`govskill_quiz_draft_${activeModuleId}`, JSON.stringify(answers));
      } catch {
        // ignore
      }
    }
  }, [answers, activeModuleId, result]);

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
      try {
        sessionStorage.removeItem(`govskill_quiz_draft_${activeModuleId}`);
      } catch {
        // ignore
      }
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
    try {
      sessionStorage.removeItem(`govskill_quiz_draft_${activeModuleId}`);
    } catch {
      // ignore
    }
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;
  const progressPct = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-3 text-ink-muted">
        <Loader2 className="h-6 w-6 animate-spin text-ink" />
        <span className="font-mono text-xs">Loading competency assessment...</span>
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
      className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-8"
    >
      {/* 1. Header Banner & Assessment Progress */}
      <motion.div variants={fadeUpVariants} className="bg-surface rounded-2xl border border-border-warm p-6 sm:p-8 space-y-6 shadow-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-border-warm gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-azure-900 bg-azure-500/10 px-3 py-1 border border-azure-500/25 rounded-full">
              <Award className="h-3.5 w-3.5 text-azure-700" />
              <span>Competency Assessment</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              {moduleTitle} Assessment
            </h1>
            <p className="text-sm text-ink-muted font-sans font-normal">
              Passing threshold is 75%. Server-side scored with competency-level breakdown and official certification.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="hidden md:block w-32 h-20 rounded-xl overflow-hidden border border-border-warm bg-surface-light">
              <img
                src="/illustrations/quiz_assessment_examination.jpg"
                alt="Official Civil Service Examination Desk"
                className="w-full h-full object-cover object-center grayscale contrast-125"
                loading="lazy"
              />
            </div>

            {modules.length > 1 && (
            <div className="bg-surface-light p-3 border border-border-warm rounded-xl shrink-0">
              <label htmlFor="quiz-module-select" className="block text-[10px] font-mono font-bold uppercase text-ink-muted mb-1 tracking-wider">
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
                className="w-full px-3 py-1.5 text-xs font-mono text-ink bg-surface border border-border-warm rounded-lg focus:outline-none focus:ring-1 focus:ring-ink cursor-pointer min-h-[38px]"
              >
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

        {/* Answer Progress Meter */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-ink uppercase tracking-wider">
              Assessment Progress:
            </span>
            <span className="text-ink-muted font-semibold">
              {answeredCount} of {questions.length} answered ({progressPct}%)
            </span>
          </div>
          <div className="w-full bg-surface-light rounded-full h-2 overflow-hidden border border-border-warm">
            <motion.div
              initial={shouldReduceMotion ? { width: `${progressPct}%` } : { width: '0%' }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="h-full bg-ink rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* 2. Adaptive Assessment Focus Banner */}
      {adaptiveMeta?.is_adaptive && (
        <motion.div
          variants={fadeUpVariants}
          className="p-6 rounded-2xl bg-surface border border-azure-500/40 space-y-3"
        >
          <div className="flex items-center justify-between gap-2 border-b border-azure-500/20 pb-3">
            <div className="flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-wider text-ink">
              <Sparkles className="h-4 w-4 text-azure-700" />
              <span>Adaptive Question Selection Active</span>
            </div>
            <span className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest bg-azure-500/15 text-azure-900 border border-azure-500/30 rounded-full">
              Targeted Remediation
            </span>
          </div>
          <p className="text-xs text-ink-muted font-sans leading-relaxed">
            {adaptiveMeta.message}
          </p>
          {adaptiveMeta.focus_competencies.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-mono font-bold text-ink">Priority Competencies:</span>
              {adaptiveMeta.focus_competencies.map((comp) => (
                <span
                  key={comp}
                  className="px-3 py-1 text-xs font-mono bg-surface-light border border-border-warm text-ink rounded-full"
                >
                  {comp}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* 3. Instructions & Assessment Rules Bar */}
      <div className="p-6 rounded-2xl bg-surface border border-border-warm text-xs space-y-3">
        <div className="flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-wider text-ink">
          <ShieldCheck className="h-4 w-4 text-sage-700" />
          <span>Assessment Guidelines & Instructions:</span>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-ink-muted pl-5 list-disc">
          <li>Answer all {questions.length} questions to maximize your competency score.</li>
          <li>A score of 75% or higher grants official module certification.</li>
          <li>You can flag questions to review before final submission.</li>
          <li>Retakes are permitted to remediate identified weak areas.</li>
        </ul>
      </div>

      {/* 4. Question Navigator (Jump Palette) */}
      <QuizNavigator
        questions={questions}
        answers={answers}
        flaggedQuestions={flaggedQuestions}
        onJumpToQuestion={handleJumpToQuestion}
        disabled={isSubmitting}
      />

      {error && (
        <ErrorAlert
          title="Submission Notice"
          message={error}
          onDismiss={() => setError(null)}
        />
      )}

      {/* 5. Questions Stack */}
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

      {/* 6. Bottom Submit Control Bar */}
      <motion.div variants={fadeUpVariants} className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-border-warm bg-surface p-6 border rounded-2xl shadow-none">
        <div className="flex items-center gap-3 text-xs font-mono text-ink-muted">
          <span>{answeredCount} of {questions.length} answered</span>
          {flaggedCount > 0 && (
            <span className="text-rose-900 font-bold flex items-center gap-1.5 bg-rose-500/15 px-3 py-1 rounded-full border border-rose-500/30">
              <Flag className="h-3 w-3 fill-rose-600 text-rose-600" />
              <span>{flaggedCount} flagged</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => navigate(`/module?id=${activeModuleId}`)}
            className="min-h-[44px] rounded-full px-5 border-border-warm text-ink hover:bg-surface-elevated font-mono text-xs font-bold uppercase tracking-wider"
          >
            <BookOpen className="h-3.5 w-3.5 mr-1.5" />
            <span>Review Lesson</span>
          </Button>

          <Button
            onClick={handleOpenSubmitModal}
            disabled={isSubmitting}
            size="md"
            className="min-h-[44px] rounded-full px-6 bg-ink hover:bg-ink/90 text-on-ink font-mono text-xs font-bold uppercase tracking-wider"
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
