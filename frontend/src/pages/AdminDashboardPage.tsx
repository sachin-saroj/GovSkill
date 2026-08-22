import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { QuizAttempt, Module, AdminQuizQuestion, AdminSkillOverviewResponse } from '@/types';
import { Card } from '@/components/ui/Card';
import {
  LayoutDashboard,
  Users,
  Award,
  CheckCircle2,
  Loader2,
  RefreshCw,
  BookOpen,
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Sparkles,
} from 'lucide-react';

type TabType = 'attempts' | 'modules' | 'questions';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('attempts');

  // --- Skills Overview State ---
  const [skillsOverview, setSkillsOverview] = useState<AdminSkillOverviewResponse | null>(null);
  const [isLoadingOverview, setIsLoadingOverview] = useState<boolean>(false);

  // --- Attempt History State & Pagination ---
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [attemptOffset, setAttemptOffset] = useState(0);
  const [isLoadingAttempts, setIsLoadingAttempts] = useState(true);
  const LIMIT = 20;

  // --- Modules CMS State ---
  const [modules, setModules] = useState<Module[]>([]);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);

  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [moduleFormTitle, setModuleFormTitle] = useState('');
  const [moduleFormContent, setModuleFormContent] = useState('');

  // --- Questions CMS State ---
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const [questions, setQuestions] = useState<AdminQuizQuestion[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<AdminQuizQuestion | null>(null);
  const [qText, setQText] = useState('');
  const [qOptions, setQOptions] = useState<string[]>(['', '', '', '']);
  const [qCorrectIdx, setQCorrectIdx] = useState(0);

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // --- Fetch Methods ---
  const fetchSkillsOverview = async () => {
    setIsLoadingOverview(true);
    try {
      const res = await api.get<AdminSkillOverviewResponse>('/progress/admin/skills-overview');
      setSkillsOverview(res.data);
    } catch (err: any) {
      console.warn('Failed to load skills overview', err);
    } finally {
      setIsLoadingOverview(false);
    }
  };

  const fetchAttempts = async () => {
    setIsLoadingAttempts(true);
    setError(null);
    try {
      const res = await api.get<QuizAttempt[]>(`/admin/attempts?limit=${LIMIT}&offset=${attemptOffset}`);
      setAttempts(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail?.error?.message || 'Failed to load attempt logs');
    } finally {
      setIsLoadingAttempts(false);
    }
  };

  const fetchModules = async () => {
    setError(null);
    try {
      const res = await api.get<Module[]>('/modules');
      setModules(res.data);
      if (res.data.length > 0 && !selectedModuleId) {
        setSelectedModuleId(res.data[0].id);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail?.error?.message || 'Failed to load modules');
    }
  };

  const fetchQuestions = async (modId: string) => {
    if (!modId) return;
    setIsLoadingQuestions(true);
    setError(null);
    try {
      const res = await api.get<AdminQuizQuestion[]>(`/admin/modules/${modId}/questions`);
      setQuestions(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail?.error?.message || 'Failed to load quiz questions');
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  useEffect(() => {
    fetchModules();
    fetchSkillsOverview();
  }, []);

  useEffect(() => {
    fetchAttempts();
  }, [attemptOffset]);

  useEffect(() => {
    if (selectedModuleId) {
      fetchQuestions(selectedModuleId);
    }
  }, [selectedModuleId]);

  // --- Module Handlers ---
  const handleOpenModuleModal = (mod?: Module) => {
    if (mod) {
      setEditingModule(mod);
      setModuleFormTitle(mod.title);
      setModuleFormContent(mod.content);
    } else {
      setEditingModule(null);
      setModuleFormTitle('');
      setModuleFormContent('');
    }
    setIsModuleModalOpen(true);
  };

  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingModule) {
        await api.put(`/admin/modules/${editingModule.id}`, {
          title: moduleFormTitle,
          content: moduleFormContent,
        });
        setSuccessMsg('Module updated successfully');
      } else {
        await api.post('/admin/modules', {
          title: moduleFormTitle,
          content: moduleFormContent,
        });
        setSuccessMsg('Module created successfully');
      }
      setIsModuleModalOpen(false);
      fetchModules();
    } catch (err: any) {
      setError(err.response?.data?.detail?.error?.message || 'Failed to save module');
    }
  };

  const handleDeleteModule = async (modId: string) => {
    if (!window.confirm('Are you sure you want to delete this module and its questions?')) return;
    try {
      await api.delete(`/admin/modules/${modId}`);
      setSuccessMsg('Module deleted successfully');
      fetchModules();
    } catch (err: any) {
      setError(err.response?.data?.detail?.error?.message || 'Failed to delete module');
    }
  };

  // --- Question Handlers ---
  const handleOpenQuestionModal = (q?: AdminQuizQuestion) => {
    if (q) {
      setEditingQuestion(q);
      setQText(q.question);
      setQOptions([...q.options]);
      setQCorrectIdx(q.correct_option_index);
    } else {
      setEditingQuestion(null);
      setQText('');
      setQOptions(['', '', '', '']);
      setQCorrectIdx(0);
    }
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const correctOptionText = qOptions[qCorrectIdx]?.trim();
    const cleanOptions = qOptions.map((o) => o.trim()).filter(Boolean);
    if (cleanOptions.length < 2) {
      setError('Please provide at least 2 non-empty options');
      return;
    }
    const finalCorrectIdx = cleanOptions.indexOf(correctOptionText);
    if (finalCorrectIdx === -1) {
      setError('Please select a valid option as the correct answer');
      return;
    }
    try {
      if (editingQuestion) {
        await api.put(`/admin/questions/${editingQuestion.id}`, {
          question: qText,
          options: cleanOptions,
          correct_option_index: finalCorrectIdx,
        });
        setSuccessMsg('Question updated successfully');
      } else {
        await api.post(`/admin/modules/${selectedModuleId}/questions`, {
          question: qText,
          options: cleanOptions,
          correct_option_index: finalCorrectIdx,
        });
        setSuccessMsg('Question created successfully');
      }
      setIsQuestionModalOpen(false);
      fetchQuestions(selectedModuleId);
    } catch (err: any) {
      setError(err.response?.data?.detail?.error?.message || 'Failed to save question');
    }
  };

  const handleDeleteQuestion = async (qId: string) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await api.delete(`/admin/questions/${qId}`);
      setSuccessMsg('Question deleted successfully');
      fetchQuestions(selectedModuleId);
    } catch (err: any) {
      setError(err.response?.data?.detail?.error?.message || 'Failed to delete question');
    }
  };

  const totalAttempts = attempts.length;
  const validAttempts = attempts.filter((a) => a.total > 0);
  const avgScore =
    validAttempts.length > 0
      ? (validAttempts.reduce((acc, curr) => acc + curr.score / curr.total, 0) / validAttempts.length) * 100
      : 0;
  const passCount = attempts.filter((a) => a.total > 0 && a.score / a.total >= 0.75).length;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E2E6EB] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#1E4D8C] font-semibold text-sm mb-1">
            <LayoutDashboard className="h-4 w-4" />
            <span>Supervisor Portal</span>
          </div>
          <h1 className="text-2xl font-semibold text-[#1A1F2B]">Admin Dashboard & CMS</h1>
        </div>

        <button
          onClick={() => {
            fetchAttempts();
            fetchModules();
            fetchSkillsOverview();
            if (selectedModuleId) fetchQuestions(selectedModuleId);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#5A6472] border border-[#E2E6EB] rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-[#C0392B]/10 border border-[#C0392B]/30 text-xs text-[#C0392B] flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)}><X className="h-4 w-4" /></button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-[#2E9E6B]/10 border border-[#2E9E6B]/30 text-xs text-[#2E9E6B] flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg(null)}><X className="h-4 w-4" /></button>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#1E4D8C]/10 text-[#1E4D8C]">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-[#5A6472] font-medium block">Enrolled Employees</span>
            <span className="text-2xl font-bold text-[#1A1F2B]">
              {isLoadingOverview ? '...' : (skillsOverview?.total_employees ?? 0)}
            </span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#2E9E6B]/10 text-[#2E9E6B]">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-[#5A6472] font-medium block">Total Certifications</span>
            <span className="text-2xl font-bold text-[#1A1F2B]">
              {isLoadingOverview ? '...' : (skillsOverview?.total_certifications ?? 0)}
            </span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#D98E04]/10 text-[#D98E04]">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-[#5A6472] font-medium block">Certification Rate</span>
            <span className="text-2xl font-bold text-[#1A1F2B]">
              {isLoadingOverview ? '...' : `${skillsOverview?.overall_certification_rate ?? 0}%`}
            </span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#1E4D8C]/10 text-[#1E4D8C]">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-[#5A6472] font-medium block">Quiz Attempts Logged</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#1A1F2B]">{totalAttempts}</span>
              <span className="text-xs text-[#5A6472]">({passCount} passed, {Math.round(avgScore)}% avg)</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#E2E6EB] gap-8">
        <button
          onClick={() => setActiveTab('attempts')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'attempts'
              ? 'border-[#1E4D8C] text-[#1E4D8C]'
              : 'border-transparent text-[#5A6472] hover:text-[#1A1F2B]'
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Attempt Performance Logs</span>
        </button>

        <button
          onClick={() => setActiveTab('modules')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'modules'
              ? 'border-[#1E4D8C] text-[#1E4D8C]'
              : 'border-transparent text-[#5A6472] hover:text-[#1A1F2B]'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Module CMS ({modules.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'questions'
              ? 'border-[#1E4D8C] text-[#1E4D8C]'
              : 'border-transparent text-[#5A6472] hover:text-[#1A1F2B]'
          }`}
        >
          <HelpCircle className="h-4 w-4" />
          <span>Quiz Management</span>
        </button>
      </div>

      {/* TAB 1: ATTEMPTS LOG */}
      {activeTab === 'attempts' && (
        <Card className="p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E2E6EB] bg-[#F7F9FB] flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#1A1F2B]">Employee Quiz Performance Log</h2>
            <div className="flex items-center gap-2 text-xs text-[#5A6472]">
              <span>Offset: {attemptOffset}</span>
              <button
                disabled={attemptOffset === 0}
                onClick={() => setAttemptOffset(Math.max(0, attemptOffset - LIMIT))}
                className="p-1 border border-[#E2E6EB] rounded hover:bg-gray-100 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                disabled={attempts.length < LIMIT}
                onClick={() => setAttemptOffset(attemptOffset + LIMIT)}
                className="p-1 border border-[#E2E6EB] rounded hover:bg-gray-100 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {isLoadingAttempts ? (
            <div className="p-8 text-center text-sm text-[#5A6472] flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-[#1E4D8C]" />
              <span>Loading attempt logs...</span>
            </div>
          ) : attempts.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#5A6472]">
              No employee quiz attempts recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#1A1F2B]">
                <thead className="bg-[#F7F9FB] border-b border-[#E2E6EB] text-xs font-semibold text-[#5A6472] uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Employee Email</th>
                    <th className="px-6 py-3">Module Title</th>
                    <th className="px-6 py-3">Score</th>
                    <th className="px-6 py-3">Percentage</th>
                    <th className="px-6 py-3">Submitted At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E6EB]">
                  {attempts.map((att, idx) => {
                    const pct = att.total > 0 ? Math.round((att.score / att.total) * 100) : 0;
                    const isPass = pct >= 75;

                    return (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium">{att.user_email}</td>
                        <td className="px-6 py-4 text-[#5A6472]">{att.module_title}</td>
                        <td className="px-6 py-4 font-semibold text-[#1E4D8C]">
                          {att.score} / {att.total}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              isPass ? 'bg-[#2E9E6B]/10 text-[#2E9E6B]' : 'bg-[#D98E04]/10 text-[#D98E04]'
                            }`}
                          >
                            {pct}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-[#5A6472]">
                          {att.submitted_at ? new Date(att.submitted_at).toLocaleString() : 'Recent'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* TAB 2: MODULE CMS */}
      {activeTab === 'modules' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#1A1F2B]">Training Modules Management</h2>
            <button
              onClick={() => handleOpenModuleModal()}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1E4D8C] text-white text-xs font-semibold rounded-lg hover:bg-[#153866] transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Module</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((mod) => (
              <Card key={mod.id} className="p-5 flex flex-col justify-between space-y-4 border border-[#E2E6EB]">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base font-semibold text-[#1A1F2B]">{mod.title}</h3>
                    <span className="text-[10px] font-mono bg-gray-100 px-2 py-0.5 rounded text-[#5A6472]">
                      {mod.id.substring(0, 8)}...
                    </span>
                  </div>
                  <p className="text-xs text-[#5A6472] line-clamp-3 whitespace-pre-line font-mono bg-[#F7F9FB] p-2.5 rounded-lg border border-[#E2E6EB]">
                    {mod.content.substring(0, 150)}...
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E6EB]">
                  <button
                    onClick={() => handleOpenModuleModal(mod)}
                    className="flex items-center gap-1 text-xs text-[#1E4D8C] font-semibold hover:underline"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteModule(mod.id)}
                    className="flex items-center gap-1 text-xs text-[#C0392B] font-semibold hover:underline ml-3"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: QUIZ MANAGEMENT CMS */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F7F9FB] p-4 rounded-xl border border-[#E2E6EB]">
            <div className="flex items-center gap-3">
              <label htmlFor="admin-module-select" className="text-xs font-semibold text-[#5A6472] uppercase">Select Module:</label>
              <select
                id="admin-module-select"
                value={selectedModuleId}
                onChange={(e) => setSelectedModuleId(e.target.value)}
                className="px-3 py-1.5 text-xs font-medium text-[#1A1F2B] border border-[#E2E6EB] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1E4D8C]"
              >
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => handleOpenQuestionModal()}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1E4D8C] text-white text-xs font-semibold rounded-lg hover:bg-[#153866] transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Question</span>
            </button>
          </div>

          {isLoadingQuestions ? (
            <div className="p-8 text-center text-sm text-[#5A6472] flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-[#1E4D8C]" />
              <span>Loading module questions...</span>
            </div>
          ) : questions.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#5A6472] bg-white rounded-xl border border-[#E2E6EB]">
              No questions found for this module. Click "Add Question" above to create one.
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((q, qIdx) => (
                <Card key={q.id} className="p-5 space-y-3 border border-[#E2E6EB]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-[#1E4D8C] text-sm">Q{qIdx + 1}.</span>
                      <h4 className="text-sm font-semibold text-[#1A1F2B]">{q.question}</h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleOpenQuestionModal(q)}
                        className="text-xs text-[#1E4D8C] font-semibold hover:underline flex items-center gap-1"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="text-xs text-[#C0392B] font-semibold hover:underline flex items-center gap-1 ml-2"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#E2E6EB]">
                    {q.options.map((opt, optIdx) => {
                      const isCorrect = optIdx === q.correct_option_index;
                      return (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-lg text-xs flex items-center justify-between border ${
                            isCorrect
                              ? 'bg-[#2E9E6B]/10 border-[#2E9E6B]/40 font-semibold text-[#2E9E6B]'
                              : 'bg-[#F7F9FB] border-[#E2E6EB] text-[#5A6472]'
                          }`}
                        >
                          <span>
                            {String.fromCharCode(65 + optIdx)}. {opt}
                          </span>
                          {isCorrect && (
                            <span className="flex items-center gap-1 text-[10px] bg-[#2E9E6B] text-white px-2 py-0.5 rounded-full font-bold">
                              <Check className="h-3 w-3" /> Answer
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODULE MODAL */}
      {isModuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-semibold text-[#1A1F2B]">
                {editingModule ? 'Edit Training Module' : 'Create Training Module'}
              </h3>
              <button onClick={() => setIsModuleModalOpen(false)} aria-label="Close modal">
                <X className="h-5 w-5 text-[#5A6472]" />
              </button>
            </div>

            <form onSubmit={handleSaveModule} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#5A6472] mb-1">Module Title</label>
                <input
                  type="text"
                  required
                  value={moduleFormTitle}
                  onChange={(e) => setModuleFormTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#1E4D8C]"
                  placeholder="e.g. Cybersecurity Basics"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A6472] mb-1">Markdown Lesson Content</label>
                <textarea
                  required
                  rows={8}
                  value={moduleFormContent}
                  onChange={(e) => setModuleFormContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono border rounded-lg focus:ring-2 focus:ring-[#1E4D8C]"
                  placeholder="# Lesson 1: Overview..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsModuleModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#5A6472] border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#1E4D8C] rounded-lg hover:bg-[#153866]"
                >
                  Save Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUESTION MODAL */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-semibold text-[#1A1F2B]">
                {editingQuestion ? 'Edit Quiz Question' : 'Add Quiz Question'}
              </h3>
              <button onClick={() => setIsQuestionModalOpen(false)} aria-label="Close modal">
                <X className="h-5 w-5 text-[#5A6472]" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#5A6472] mb-1">Question Text</label>
                <input
                  type="text"
                  required
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#1E4D8C]"
                  placeholder="e.g. What is the minimum certificate number length?"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#5A6472]">Options (Select Correct Answer Radio)</label>
                {qOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct_idx"
                      aria-label={`Mark Option ${String.fromCharCode(65 + idx)} as correct`}
                      checked={qCorrectIdx === idx}
                      onChange={() => setQCorrectIdx(idx)}
                      className="h-4 w-4 text-[#1E4D8C]"
                    />
                    <input
                      type="text"
                      required={idx < 2}
                      value={opt}
                      onChange={(e) => {
                        const updated = [...qOptions];
                        updated[idx] = e.target.value;
                        setQOptions(updated);
                      }}
                      className="w-full px-3 py-1.5 text-xs border rounded-lg"
                      placeholder={`Option ${String.fromCharCode(65 + idx)}${idx >= 2 ? ' (Optional)' : ''}`}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsQuestionModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#5A6472] border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#1E4D8C] rounded-lg hover:bg-[#153866]"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;

