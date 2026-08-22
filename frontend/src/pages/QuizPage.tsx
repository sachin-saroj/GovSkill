import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '@/lib/api';
import { getApiErrorMessage } from '@/lib/apiError';
import { QuizQuestion, Module } from '@/types';
import QuizCard from '@/components/quiz/QuizCard';
import QuizResultView from '@/components/quiz/QuizResultView';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  Award,
  CheckCircle2,
  Loader2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const QuizPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const activeModuleId = moduleId || 'default';

  const [modules, setModules] = useState<Module[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [moduleTitle, setModuleTitle] = useState<string>('Digital Document Handling Quiz');

  const navigate = useNavigate();

  const fetchQuiz = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [quizRes, modulesRes] = await Promise.all([
        api.get<{ questions: QuizQuestion[] }>(`/quiz/${activeModuleId}`),
        api.get<Module[]>('/modules').catch(() => ({ data: [] as Module[] })),
      ]);
      setQuestions(quizRes.data.questions);
      if (Array.isArray(modulesRes.data) && modulesRes.data.length > 0) {
        setModules(modulesRes.data);
        const currentMod = modulesRes.data.find((m) => m.id === activeModuleId);
        if (currentMod) {
          setModuleTitle(`${currentMod.title} Quiz`);
        } else if (activeModuleId === 'default') {
          setModuleTitle(`${modulesRes.data[0].title} Quiz`);
        } else {
          setModuleTitle('Training Module Quiz');
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

  const handleSubmitQuiz = async () => {
    if (Object.keys(answers).length < questions.length) {
      setError(`Please answer all ${questions.length} questions before submitting.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payloadAnswers = Object.entries(answers).map(([qId, idx]) => ({
      question_id: qId,
      selected_option_index: idx,
    }));

    try {
      const res = await api.post<{ score: number; total: number }>(`/quiz/${activeModuleId}/submit`, {
        answers: payloadAnswers,
      });
      setResult(res.data);
    } catch (err: any) {
      const msg = err.response?.data?.detail?.error?.message || 'Failed to submit quiz';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setResult(null);
  };

  const answeredCount = Object.keys(answers).length;
  const progressPct = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-3 text-slate-500">
        <Loader2 className="h-6 w-6 animate-spin text-civic-700" />
        <span className="font-medium text-sm">Loading quiz questions...</span>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <Card className="border-red-200 bg-red-50/60 p-6 text-sm text-red-700 flex items-start gap-3 shadow-civic-xs">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-red-900 mb-1">Assessment Error</h4>
            <p>{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <Card className="p-8 max-w-md mx-auto bg-white border-slate-200 shadow-civic-sm space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <HelpCircle className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">No quiz questions available</h2>
          <p className="text-xs text-slate-500">
            Please check back after your administrator publishes quiz questions.
          </p>
        </Card>
      </div>
    );
  }

  if (result) {
    return (
      <QuizResultView
        score={result.score}
        total={result.total}
        onRetake={handleRetake}
        onGoToProgress={() => navigate('/progress')}
        onGoToLessons={() => navigate('/module')}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
      {/* Header Banner & Module Switcher */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
            <Award className="h-4 w-4 text-emerald-600" />
            <span>Module Quiz Evaluation</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{moduleTitle}</h1>
          <p className="text-xs text-slate-500">
            Answer all {questions.length} questions below. Scores are submitted securely for server-side evaluation.
          </p>
        </div>

        {modules.length > 1 && (
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 shrink-0 shadow-civic-xs">
            <label htmlFor="quiz-module-select" className="block text-[10px] uppercase font-bold text-slate-600 mb-1.5 tracking-wider">
              Switch Quiz Module:
            </label>
            <select
              id="quiz-module-select"
              value={activeModuleId}
              onChange={(e) => {
                setAnswers({});
                setResult(null);
                navigate(`/quiz/${e.target.value}`);
              }}
              className="w-full px-3 py-1.5 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-civic-700/20 cursor-pointer"
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

      {/* Answer Progress Meter */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-civic-xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800">Progress:</span>
          <span className="font-medium text-slate-600">
            {answeredCount} of {questions.length} answered ({progressPct}%)
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className="h-2 bg-civic-800 rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-300 text-xs text-red-700 flex items-center gap-2 shadow-civic-xs animate-fade-in">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Questions Stack */}
      <div className="space-y-4">
        {questions.map((q, idx) => (
          <QuizCard
            key={q.id}
            question={q}
            questionIndex={idx}
            selectedOption={answers[q.id] ?? null}
            onSelectOption={(optIdx) => handleSelectOption(q.id, optIdx)}
            disabled={isSubmitting}
          />
        ))}
      </div>

      {/* Bottom Submit Control Bar */}
      <div className="flex justify-between items-center pt-5 border-t border-slate-200">
        <span className="text-xs font-medium text-slate-500">
          Answered {answeredCount} of {questions.length} questions
        </span>
        <Button
          onClick={handleSubmitQuiz}
          disabled={isSubmitting || answeredCount < questions.length}
          className="px-6 py-2.5 shadow-civic-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
              <span>Evaluating Score...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4 mr-1.5" />
              <span>Submit Quiz</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default QuizPage;
