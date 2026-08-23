import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import api from '@/lib/api';
import { QuizAttempt, Module, AdminQuizQuestion, AdminSkillOverviewResponse } from '@/types';
import Card from '@/components/ui/Card';
import GovernanceOverview from '@/components/admin/GovernanceOverview';
import ReadinessMetricCard from '@/components/admin/ReadinessMetricCard';
import CompetencyInsights from '@/components/admin/CompetencyInsights';
import EmployeeReadinessTable from '@/components/admin/EmployeeReadinessTable';
import {
  LayoutDashboard,
  Users,
  Award,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { staggerContainerVariants, fadeUpVariants, scaleInVariants } from '@/lib/motion';

type TabType = 'attempts' | 'modules' | 'questions';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('attempts');
  const shouldReduceMotion = useReducedMotion();

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
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchAttempts(),
        fetchModules(),
        fetchSkillsOverview(),
        selectedModuleId ? fetchQuestions(selectedModuleId) : Promise.resolve(),
      ]);
    } finally {
      setIsRefreshing(false);
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
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8"
    >
      {/* Governance Hero Header */}
      <GovernanceOverview
        onRefresh={handleRefreshAll}
        isRefreshing={isRefreshing}
      />

      {/* Global Error Banner with AnimatePresence */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? {} : { opacity: 0, y: -6 }}
            className="p-4 rounded-2xl bg-red-50 border border-red-300 text-xs text-red-700 flex items-center justify-between shadow-civic-xs"
          >
            <span>{error}</span>
            <button type="button" onClick={() => setError(null)} className="p-1 hover:bg-red-100 rounded-lg cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Success Banner with AnimatePresence */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? {} : { opacity: 0, y: -6 }}
            className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 flex items-center justify-between shadow-civic-xs"
          >
            <span>{successMsg}</span>
            <button type="button" onClick={() => setSuccessMsg(null)} className="p-1 hover:bg-emerald-100 rounded-lg cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Metric Cards */}
      <motion.div variants={fadeUpVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <ReadinessMetricCard
          icon={Users}
          iconBgClass="bg-civic-100"
          iconColorClass="text-civic-800"
          label="Enrolled Employees"
          value={isLoadingOverview ? '...' : (skillsOverview?.total_employees ?? 0)}
          subtext="Municipal office staff"
          badgeText="Workforce"
          badgeVariant="civic"
        />

        <ReadinessMetricCard
          icon={Award}
          iconBgClass="bg-emerald-100"
          iconColorClass="text-emerald-700"
          label="Total Certifications"
          value={isLoadingOverview ? '...' : (skillsOverview?.total_certifications ?? 0)}
          subtext="Verified credentials earned"
          badgeText="Certified"
          badgeVariant="emerald"
        />

        <ReadinessMetricCard
          icon={Sparkles}
          iconBgClass="bg-saffron-100"
          iconColorClass="text-saffron-700"
          label="Certification Rate"
          value={isLoadingOverview ? '...' : `${skillsOverview?.overall_certification_rate ?? 0}%`}
          subtext="Workforce completion progress"
          badgeText="Rate"
          badgeVariant="saffron"
        />

        <ReadinessMetricCard
          icon={CheckCircle2}
          iconBgClass="bg-civic-100"
          iconColorClass="text-civic-800"
          label="Quiz Attempts Logged"
          value={totalAttempts}
          subtext={`(${passCount} passed, ${Math.round(avgScore)}% avg)`}
          badgeText="Telemetry"
          badgeVariant="civic"
        />
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div variants={fadeUpVariants} className="flex border-b border-slate-200 gap-8">
        <button
          type="button"
          onClick={() => setActiveTab('attempts')}
          className={`pb-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'attempts'
              ? 'border-civic-800 text-civic-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Attempt Performance Logs</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('modules')}
          className={`pb-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'modules'
              ? 'border-civic-800 text-civic-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Module CMS ({modules.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('questions')}
          className={`pb-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'questions'
              ? 'border-civic-800 text-civic-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="h-4 w-4" />
          <span>Quiz Management</span>
        </button>
      </motion.div>

      {/* TAB 1: ATTEMPTS LOG & COMPETENCY SIGNALS */}
      {activeTab === 'attempts' && (
        <motion.div variants={fadeUpVariants} className="space-y-6">
          <CompetencyInsights
            totalEmployees={skillsOverview?.total_employees ?? 0}
            totalCertifications={skillsOverview?.total_certifications ?? 0}
            certificationRate={skillsOverview?.overall_certification_rate ?? 0}
            totalAttempts={totalAttempts}
            passCount={passCount}
            avgScore={avgScore}
          />

          <EmployeeReadinessTable
            attempts={attempts}
            isLoading={isLoadingAttempts}
            offset={attemptOffset}
            limit={LIMIT}
            onPrevPage={() => setAttemptOffset(Math.max(0, attemptOffset - LIMIT))}
            onNextPage={() => setAttemptOffset(attemptOffset + LIMIT)}
          />
        </motion.div>
      )}

      {/* TAB 2: MODULE CMS */}
      {activeTab === 'modules' && (
        <motion.div variants={fadeUpVariants} className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Training Modules Management
              </h2>
              <p className="text-xs text-slate-500">
                Create, update, and manage official training curriculum modules
              </p>
            </div>

            <motion.button
              type="button"
              whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
              onClick={() => handleOpenModuleModal()}
              className="flex items-center gap-1.5 px-4 py-2 bg-civic-800 text-white text-xs font-bold rounded-xl hover:bg-civic-900 transition-all shadow-civic-xs cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Module</span>
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((mod) => (
              <motion.div
                key={mod.id}
                whileHover={shouldReduceMotion ? {} : { y: -2 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              >
                <Card
                  className="p-6 flex flex-col justify-between space-y-4 border-slate-200 shadow-civic-sm bg-white hover:shadow-civic-md transition-all rounded-3xl"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                        {mod.title}
                      </h3>
                      <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded-lg text-slate-600 border border-slate-200 shrink-0">
                        {mod.id.substring(0, 8)}...
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-3 whitespace-pre-line font-mono bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      {mod.content.substring(0, 150)}...
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 text-xs">
                    <button
                      type="button"
                      onClick={() => handleOpenModuleModal(mod)}
                      className="flex items-center gap-1 text-civic-800 font-bold hover:underline cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteModule(mod.id)}
                      className="flex items-center gap-1 text-red-600 font-bold hover:underline cursor-pointer ml-2"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* TAB 3: QUIZ MANAGEMENT CMS */}
      {activeTab === 'questions' && (
        <motion.div variants={fadeUpVariants} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-civic-xs">
            <div className="flex items-center gap-3">
              <label htmlFor="admin-module-select" className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Select Module:
              </label>
              <select
                id="admin-module-select"
                value={selectedModuleId}
                onChange={(e) => setSelectedModuleId(e.target.value)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-civic-700/20 cursor-pointer"
              >
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>

            <motion.button
              type="button"
              whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
              onClick={() => handleOpenQuestionModal()}
              className="flex items-center gap-1.5 px-4 py-2 bg-civic-800 text-white text-xs font-bold rounded-xl hover:bg-civic-900 transition-all shadow-civic-xs cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Question</span>
            </motion.button>
          </div>

          {isLoadingQuestions ? (
            <div className="p-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-civic-700" />
              <span className="font-medium">Loading module questions...</span>
            </div>
          ) : questions.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-civic-xs">
              No questions found for this module. Click "Add Question" above to create one.
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((q, qIdx) => (
                <Card key={q.id} className="p-6 space-y-3.5 border-slate-200 shadow-civic-sm bg-white rounded-3xl">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-2.5">
                      <span className="font-extrabold text-civic-800 text-xs mt-0.5">Q{qIdx + 1}.</span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{q.question}</h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenQuestionModal(q)}
                        className="text-xs text-civic-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="text-xs text-red-600 font-bold hover:underline flex items-center gap-1 ml-2 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
                    {q.options.map((opt, optIdx) => {
                      const isCorrect = optIdx === q.correct_option_index;
                      return (
                        <div
                          key={optIdx}
                          className={`p-3 rounded-xl text-xs flex items-center justify-between border transition-colors ${
                            isCorrect
                              ? 'bg-emerald-50/70 border-emerald-300 font-bold text-emerald-900 shadow-civic-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span className="leading-snug">
                            <strong className="mr-1">{String.fromCharCode(65 + optIdx)}.</strong> {opt}
                          </span>
                          {isCorrect && (
                            <span className="flex items-center gap-1 text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold shadow-civic-xs shrink-0 ml-2">
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
        </motion.div>
      )}

      {/* MODULE MODAL with AnimatePresence */}
      <AnimatePresence>
        {isModuleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              variants={scaleInVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-civic-xl border border-slate-200"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  {editingModule ? 'Edit Training Module' : 'Create Training Module'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModuleModalOpen(false)}
                  aria-label="Close modal"
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveModule} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Module Title</label>
                  <input
                    type="text"
                    required
                    value={moduleFormTitle}
                    onChange={(e) => setModuleFormTitle(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-civic-700/20 focus:border-civic-700 focus:outline-none"
                    placeholder="e.g. Cybersecurity Basics"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Markdown Lesson Content</label>
                  <textarea
                    required
                    rows={8}
                    value={moduleFormContent}
                    onChange={(e) => setModuleFormContent(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-civic-700/20 focus:border-civic-700 focus:outline-none"
                    placeholder="# Lesson 1: Overview..."
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModuleModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 border border-slate-300 rounded-xl hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-civic-800 rounded-xl hover:bg-civic-900 shadow-civic-xs cursor-pointer"
                  >
                    Save Module
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QUESTION MODAL with AnimatePresence */}
      <AnimatePresence>
        {isQuestionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              variants={scaleInVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-civic-xl border border-slate-200"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  {editingQuestion ? 'Edit Quiz Question' : 'Add Quiz Question'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsQuestionModalOpen(false)}
                  aria-label="Close modal"
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveQuestion} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Question Text</label>
                  <input
                    type="text"
                    required
                    value={qText}
                    onChange={(e) => setQText(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-civic-700/20 focus:border-civic-700 focus:outline-none"
                    placeholder="e.g. What is the minimum certificate number length?"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600">Options (Select Correct Answer Radio)</label>
                  {qOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correct_idx"
                        aria-label={`Mark Option ${String.fromCharCode(65 + idx)} as correct`}
                        checked={qCorrectIdx === idx}
                        onChange={() => setQCorrectIdx(idx)}
                        className="h-4 w-4 text-civic-700 cursor-pointer"
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
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-civic-700/20"
                        placeholder={`Option ${String.fromCharCode(65 + idx)}${idx >= 2 ? ' (Optional)' : ''}`}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsQuestionModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 border border-slate-300 rounded-xl hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-civic-800 rounded-xl hover:bg-civic-900 shadow-civic-xs cursor-pointer"
                  >
                    Save Question
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminDashboardPage;
