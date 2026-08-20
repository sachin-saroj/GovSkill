import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '@/lib/api';
import { getApiErrorMessage } from '@/lib/apiError';
import { QuizQuestion, Module } from '@/types';
import QuizCard from '@/components/quiz/QuizCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Award, CheckCircle2, Loader2, RefreshCw, ArrowRight } from 'lucide-react';

export const QuizPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const activeModuleId = moduleId || 'default';

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
        api.get<Module[]>('/modules').catch(() => ({ data: [] as Module[] }))
      ]);
      setQuestions(quizRes.data.questions);
      if (modulesRes.data) {
        const currentMod = modulesRes.data.find(m => m.id === activeModuleId);
        if (currentMod) {
          setModuleTitle(`${currentMod.title} Quiz`);
        } else if (activeModuleId === 'default') {
          setModuleTitle('Digital Document Handling Quiz');
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-2 text-[#5A6472]">
        <Loader2 className="h-5 w-5 animate-spin text-[#1E4D8C]" />
        <span>Loading quiz questions...</span>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="rounded-xl border border-[#C0392B]/30 bg-[#C0392B]/5 p-6 text-sm text-[#C0392B]">
          {error}
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <h2 className="text-xl font-semibold text-[#1A1F2B] mb-2">No quiz questions available</h2>
        <p className="text-[#5A6472]">Please check back after your administrator publishes quiz questions.</p>
      </div>
    );
  }

  if (result) {
    const percentage = Math.round((result.score / result.total) * 100);
    const passed = percentage >= 75;

    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <Card className="text-center p-8 space-y-6">
          <div
            className={`inline-flex p-4 rounded-full ${
              passed ? 'bg-[#2E9E6B]/10 text-[#2E9E6B]' : 'bg-[#D98E04]/10 text-[#D98E04]'
            }`}
          >
            <Award className="h-12 w-12" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#1A1F2B]">Quiz Submission Complete</h2>
            <p className="text-sm text-[#5A6472] mt-1">
              Your quiz score has been evaluated server-side and recorded in your official employee profile.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F7F9FB] border border-[#E2E6EB] max-w-sm mx-auto">
            <span className="text-xs font-semibold uppercase text-[#5A6472] tracking-wider block mb-1">
              Official Score
            </span>
            <div className="text-4xl font-extrabold text-[#1E4D8C] mb-1">
              {result.score} / {result.total}
            </div>
            <span
              className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                passed ? 'bg-[#2E9E6B]/10 text-[#2E9E6B]' : 'bg-[#D98E04]/10 text-[#D98E04]'
              }`}
            >
              {percentage}% — {passed ? 'Passed' : 'Needs Review'}
            </span>
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <Button variant="outline" onClick={handleRetake}>
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Retake Quiz
            </Button>
            <Button onClick={() => navigate('/module')}>
              <span>Back to Lessons</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="border-b border-[#E2E6EB] pb-4">
        <div className="flex items-center gap-2 text-[#2E9E6B] font-semibold text-sm mb-1">
          <Award className="h-4 w-4" />
          <span>Module Quiz Evaluation</span>
        </div>
        <h1 className="text-2xl font-semibold text-[#1A1F2B]">{moduleTitle}</h1>
        <p className="text-sm text-[#5A6472] mt-1">
          Answer all {questions.length} questions below. Scores are submitted securely for server-side evaluation.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-[#C0392B]/10 border border-[#C0392B]/30 text-xs text-[#C0392B]">
          {error}
        </div>
      )}

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

      <div className="flex justify-between items-center pt-4 border-t border-[#E2E6EB]">
        <span className="text-xs text-[#5A6472]">
          Answered {Object.keys(answers).length} of {questions.length} questions
        </span>
        <Button
          onClick={handleSubmitQuiz}
          disabled={isSubmitting || Object.keys(answers).length < questions.length}
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
