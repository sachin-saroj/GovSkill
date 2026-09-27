import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import api from '@/lib/api';
import {
  QuizAttempt,
  Module,
  AdminQuizQuestion,
  AdminSkillOverviewResponse,
  CitizenTelemetryResponse,
  ComplianceReportResponse,
} from '@/types';
import Card from '@/components/ui/Card';
import GovernanceOverview from '@/components/admin/GovernanceOverview';
import ReadinessMetricCard from '@/components/admin/ReadinessMetricCard';
import CompetencyInsights from '@/components/admin/CompetencyInsights';
import EmployeeReadinessTable from '@/components/admin/EmployeeReadinessTable';
import GovernanceDashboard from '@/components/admin/GovernanceDashboard';
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
  ShieldCheck,
} from 'lucide-react';
import { staggerContainerVariants, fadeUpVariants, scaleInVariants } from '@/lib/motion';

type TabType = 'attempts' | 'modules' | 'questions' | 'governance';

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

  // --- Governance, Compliance & Citizen Telemetry State ---
  const [complianceReport, setComplianceReport] = useState<ComplianceReportResponse | null>(null);
  const [isLoadingCompliance, setIsLoadingCompliance] = useState(false);
  const [complianceError, setComplianceError] = useState<string | null>(null);
  const [citizenTelemetry, setCitizenTelemetry] = useState<CitizenTelemetryResponse | null>(null);
  const [isLoadingTelemetry, setIsLoadingTelemetry] = useState(false);
  const [telemetryError, setTelemetryError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<'csv' | 'json' | null>(null);

  // --- Fetch Methods ---
  const fetchComplianceReport = async () => {
    setIsLoadingCompliance(true);
    setComplianceError(null);
    try {
      const res = await api.get<ComplianceReportResponse>('/admin/reports/export?format=json');
      setComplianceReport(res.data);
    } catch (err: any) {
      setComplianceError(err.response?.data?.detail?.error?.message || 'Failed to load workforce compliance ledger');
    } finally {
      setIsLoadingCompliance(false);
    }
  };

  const fetchCitizenTelemetry = async () => {
    setIsLoadingTelemetry(true);
    setTelemetryError(null);
    try {
      const res = await api.get<CitizenTelemetryResponse>('/admin/governance/citizen-telemetry');
      setCitizenTelemetry(res.data);
    } catch (err: any) {
      setTelemetryError(err.response?.data?.detail?.error?.message || 'Failed to load citizen defect telemetry');
    } finally {
      setIsLoadingTelemetry(false);
    }
  };

  const handleExportReport = async (format: 'csv' | 'json') => {
    setIsExporting(format);
    try {
      if (format === 'csv') {
        const res = await api.get('/admin/reports/export?format=csv', { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'govskill_workforce_compliance_report.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
        setSuccessMsg('Compliance CSV report downloaded successfully');
      } else {
        const res = await api.get('/admin/reports/export?format=json');
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(res.data, null, 2));
        const link = document.createElement('a');
        link.href = dataStr;
        link.setAttribute('download', 'govskill_workforce_compliance_report.json');
        document.body.appendChild(link);
        link.click();
        link.remove();
        setSuccessMsg('Compliance JSON audit downloaded successfully');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail?.error?.message || 'Failed to export compliance report');
    } finally {
      setIsExporting(null);
    }
  };

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
    try {
      const res = await api.get<Module[]>('/modules');
      setModules(res.data);
      if (res.data.length > 0 && !selectedModuleId) {
        setSelectedModuleId(res.data[0].id);
      }
    } catch (err: any) {
      console.warn('Failed to load admin modules', err);
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
        fetchComplianceReport(),
        fetchCitizenTelemetry(),
        selectedModuleId ? fetchQuestions(selectedModuleId) : Promise.resolve(),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchModules();
    fetchSkillsOverview();
    fetchComplianceReport();
    fetchCitizenTelemetry();
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
            className="p-4 bg-white border-l-4 border-l-[#AF411E] border-[#E4E4E7] text-caption text-[#AF411E] flex items-center justify-between"
          >
            <span className="font-bold">{error}</span>
            <button type="button" onClick={() => setError(null)} className="p-1 hover:bg-[#FAFAFA] cursor-pointer">
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
            className="p-4 bg-white border-l-4 border-l-emerald-600 border-[#E4E4E7] text-caption text-emerald-800 flex items-center justify-between"
          >
            <span className="font-bold">{successMsg}</span>
            <button type="button" onClick={() => setSuccessMsg(null)} className="p-1 hover:bg-[#FAFAFA] cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Metric Cards */}
      <motion.div variants={fadeUpVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <ReadinessMetricCard
          icon={Users}
          iconBgClass="bg-[#FAFAFA]"
          iconColorClass="text-[#09090B]"
          label="Enrolled Employees"
          value={isLoadingOverview ? '...' : (skillsOverview?.total_employees ?? 0)}
          subtext="Municipal office workforce"
          badgeText="Workforce"
          badgeVariant="civic"
        />

        <ReadinessMetricCard
          icon={BookOpen}
          iconBgClass="bg-[#FAFAFA]"
          iconColorClass="text-[#0E50B0]"
          label="Training Modules"
          value={isLoadingOverview ? '...' : (skillsOverview?.total_modules ?? 0)}
          subtext="Standardized curriculum courses"
          badgeText="Curriculum"
          badgeVariant="civic"
        />

        <ReadinessMetricCard
          icon={CheckCircle2}
          iconBgClass="bg-[#FAFAFA]"
          iconColorClass="text-emerald-700"
          label="Quiz Attempts Logged"
          value={isLoadingOverview ? '...' : (skillsOverview?.total_quiz_attempts ?? 0)}
          subtext="Server-scored evaluations"
          badgeText="Telemetry"
          badgeVariant="civic"
        />

        <ReadinessMetricCard
          icon={Sparkles}
          iconBgClass="bg-[#FAFAFA]"
          iconColorClass="text-[#0E50B0]"
          label="Avg Assessment Score"
          value={isLoadingOverview ? '...' : `${skillsOverview?.average_quiz_score_pct ?? 0}%`}
          subtext="System-wide quiz average"
          badgeText="Proficiency"
          badgeVariant="saffron"
        />

        <ReadinessMetricCard
          icon={Award}
          iconBgClass="bg-[#FAFAFA]"
          iconColorClass="text-emerald-700"
          label="Total Certifications"
          value={isLoadingOverview ? '...' : (skillsOverview?.total_certifications ?? 0)}
          subtext="Verified credentials earned"
          badgeText="Certified"
          badgeVariant="emerald"
        />

        <ReadinessMetricCard
          icon={Sparkles}
          iconBgClass="bg-[#FAFAFA]"
          iconColorClass="text-[#0E50B0]"
          label="Certification Rate"
          value={isLoadingOverview ? '...' : `${skillsOverview?.overall_certification_rate ?? 0}%`}
          subtext="Workforce completion progress"
          badgeText="Rate"
          badgeVariant="saffron"
        />
      </motion.div>

      {/* Workforce Competency Health & Intervention Priority */}
      {skillsOverview?.competency_health && skillsOverview.competency_health.length > 0 && (
        <motion.div variants={fadeUpVariants} className="bg-white rounded-none border border-[#E4E4E7] shadow-none p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E4E4E7] pb-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#0E50B0]" />
                <h2 className="font-sans font-black text-lg uppercase tracking-tight text-[#09090B]">
                  Workforce Competency Health & Intervention Priority
                </h2>
              </div>
              <p className="text-xs text-[#71717A] font-sans">
                Aggregated mastery telemetry across all local government employee assessment attempts
              </p>
            </div>
            {skillsOverview.lowest_performing_competency && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 border border-orange-200 text-xs font-mono font-bold text-[#AF411E] shrink-0 uppercase">
                <Sparkles className="h-3.5 w-3.5 text-[#AF411E]" />
                <span>Priority Focus: {skillsOverview.lowest_performing_competency}</span>
              </div>
            )}
          </div>

          <div className="overflow-x-auto border border-[#E4E4E7]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E4E4E7] text-[10px] font-mono font-bold text-[#71717A] uppercase tracking-[0.15em] bg-[#FAFAFA]">
                  <th className="py-3 px-3 border-r border-[#E4E4E7]">Competency</th>
                  <th className="py-3 px-3 border-r border-[#E4E4E7]">Module</th>
                  <th className="py-3 px-3 border-r border-[#E4E4E7]">Avg Mastery</th>
                  <th className="py-3 px-3 text-center border-r border-[#E4E4E7]">Mastered (≥75%)</th>
                  <th className="py-3 px-3 text-center border-r border-[#E4E4E7]">Developing (&lt;75%)</th>
                  <th className="py-3 px-3 text-right">Health Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4E7] font-normal text-[#09090B]">
                {skillsOverview.competency_health.map((item) => (
                  <tr key={item.competency} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="py-3 px-3 font-bold text-[#09090B] border-r border-[#E4E4E7]">{item.competency}</td>
                    <td className="py-3 px-3 text-[#52525B] border-r border-[#E4E4E7]">{item.module_title}</td>
                    <td className="py-3 px-3 font-mono font-bold text-[#09090B] border-r border-[#E4E4E7]">{item.average_mastery_pct}%</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-emerald-700 border-r border-[#E4E4E7]">{item.employees_mastered}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-[#AF411E] border-r border-[#E4E4E7]">{item.employees_developing}</td>
                    <td className="py-3 px-3 text-right">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold border ${
                          item.status === 'Healthy'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : item.status === 'Needs Attention'
                            ? 'bg-orange-50 text-[#AF411E] border-orange-200'
                            : item.status === 'Unassessed'
                            ? 'bg-[#FAFAFA] text-[#71717A] border-[#E4E4E7]'
                            : 'bg-orange-50 text-[#AF411E] border-orange-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Navigation Tabs (Sharp Monospace Segmented Controls) */}
      <motion.div variants={fadeUpVariants} className="flex flex-wrap gap-1 p-1 bg-[#FAFAFA] border border-[#E4E4E7] w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('attempts')}
          className={`px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer min-h-[38px] ${
            activeTab === 'attempts'
              ? 'bg-[#09090B] text-white'
              : 'text-[#71717A] hover:text-[#09090B] hover:bg-white'
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Attempt Performance Logs</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('modules')}
          className={`px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer min-h-[38px] ${
            activeTab === 'modules'
              ? 'bg-[#09090B] text-white'
              : 'text-[#71717A] hover:text-[#09090B] hover:bg-white'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Module CMS ({modules.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('questions')}
          className={`px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer min-h-[38px] ${
            activeTab === 'questions'
              ? 'bg-[#09090B] text-white'
              : 'text-[#71717A] hover:text-[#09090B] hover:bg-white'
          }`}
        >
          <HelpCircle className="h-4 w-4" />
          <span>Quiz Management</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('governance')}
          className={`px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer min-h-[38px] ${
            activeTab === 'governance'
              ? 'bg-[#09090B] text-white'
              : 'text-[#71717A] hover:text-[#09090B] hover:bg-white'
          }`}
        >
          <ShieldCheck className="h-4 w-4 text-[#0E50B0]" />
          <span>Workforce Governance & Telemetry</span>
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
          <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7]">
            <div>
              <h2 className="font-sans font-black text-xl uppercase tracking-tight text-[#09090B]">
                Training Modules Management
              </h2>
              <p className="text-xs text-[#71717A]">
                Create, update, and manage official training curriculum modules
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleOpenModuleModal()}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-[#09090B] text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#27272A] transition-all cursor-pointer min-h-[40px] border border-[#09090B]"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Module</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((mod) => (
              <div key={mod.id}>
                <Card
                  className="p-6 flex flex-col justify-between space-y-4 border border-[#E4E4E7] shadow-none bg-white hover:border-[#A1A1AA] transition-all rounded-none"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-sans font-bold text-base uppercase tracking-tight text-[#09090B]">
                        {mod.title}
                      </h3>
                      <span className="text-[10px] font-mono bg-[#FAFAFA] px-2 py-0.5 text-[#71717A] border border-[#E4E4E7] shrink-0 font-bold">
                        {mod.id.substring(0, 8)}...
                      </span>
                    </div>
                    <p className="text-xs text-[#3F3F46] line-clamp-3 whitespace-pre-line font-mono bg-[#FAFAFA] p-3 border border-[#E4E4E7]">
                      {mod.content.substring(0, 150)}...
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E4E4E7] text-xs font-mono font-bold uppercase">
                    <button
                      type="button"
                      onClick={() => handleOpenModuleModal(mod)}
                      className="flex items-center gap-1 text-[#09090B] hover:underline cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5 text-[#0E50B0]" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteModule(mod.id)}
                      className="flex items-center gap-1 text-[#AF411E] hover:underline cursor-pointer ml-2"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* TAB 3: QUIZ MANAGEMENT CMS */}
      {activeTab === 'questions' && (
        <motion.div variants={fadeUpVariants} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 border border-[#E4E4E7] shadow-none">
            <div className="flex items-center gap-3">
              <label htmlFor="admin-module-select" className="text-[10px] font-mono font-bold text-[#71717A] uppercase tracking-wider">
                Select Module:
              </label>
              <select
                id="admin-module-select"
                value={selectedModuleId}
                onChange={(e) => setSelectedModuleId(e.target.value)}
                className="px-3.5 py-2 text-xs font-mono font-bold text-[#09090B] border border-[#E4E4E7] bg-[#FAFAFA] focus:outline-none focus:ring-1 focus:ring-[#09090B] cursor-pointer min-h-[40px]"
              >
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => handleOpenQuestionModal()}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-[#09090B] text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#27272A] transition-all shadow-none cursor-pointer min-h-[40px] border border-[#09090B]"
            >
              <Plus className="h-4 w-4" />
              <span>Add Question</span>
            </button>
          </div>

          {isLoadingQuestions ? (
            <div className="p-12 text-center text-xs font-mono text-[#71717A] flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-[#09090B]" />
              <span>Loading module questions...</span>
            </div>
          ) : questions.length === 0 ? (
            <div className="p-12 text-center text-xs font-sans text-[#71717A] bg-white border border-[#E4E4E7]">
              No questions found for this module. Click "Add Question" above to create one.
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((q, qIdx) => (
                <Card key={q.id} className="p-6 space-y-3.5 border border-[#E4E4E7] shadow-none bg-white rounded-none">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-2.5">
                      <span className="font-mono font-bold text-[#09090B] text-xs mt-0.5">Q{qIdx + 1}.</span>
                      <h4 className="font-sans font-bold text-base uppercase tracking-tight text-[#09090B]">{q.question}</h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenQuestionModal(q)}
                        className="text-xs font-mono text-[#09090B] font-bold uppercase hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="h-3.5 w-3.5 text-[#0E50B0]" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="text-xs font-mono text-[#AF411E] font-bold uppercase hover:underline flex items-center gap-1 ml-2 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-[#E4E4E7]">
                    {q.options.map((opt, optIdx) => {
                      const isCorrect = optIdx === q.correct_option_index;
                      return (
                        <div
                          key={optIdx}
                          className={`p-3 text-xs flex items-center justify-between border transition-colors ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-300 font-bold text-[#09090B]'
                              : 'bg-[#FAFAFA] border-[#E4E4E7] text-[#09090B]'
                          }`}
                        >
                          <span className="leading-snug">
                            <strong className="mr-1 font-mono">{String.fromCharCode(65 + optIdx)}.</strong> {opt}
                          </span>
                          {isCorrect && (
                            <span className="flex items-center gap-1 text-[10px] font-mono bg-emerald-700 text-white px-2 py-0.5 font-bold uppercase tracking-wider shrink-0 ml-2">
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

      {/* TAB 4: WORKFORCE GOVERNANCE & TELEMETRY */}
      {activeTab === 'governance' && (
        <GovernanceDashboard
          skillsOverview={skillsOverview}
          complianceReport={complianceReport}
          citizenTelemetry={citizenTelemetry}
          isLoadingCompliance={isLoadingCompliance}
          isLoadingTelemetry={isLoadingTelemetry}
          complianceError={complianceError}
          telemetryError={telemetryError}
          isExporting={isExporting}
          onExport={handleExportReport}
        />
      )}

      {/* MODULE MODAL with AnimatePresence */}
      <AnimatePresence>
        {isModuleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
            <motion.div
              variants={scaleInVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-[#E4E4E7]"
            >
              <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-3">
                <h3 className="font-sans font-black text-lg uppercase tracking-tight text-[#09090B]">
                  {editingModule ? 'Edit Training Module' : 'Create Training Module'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModuleModalOpen(false)}
                  aria-label="Close modal"
                  className="p-1 hover:bg-[#FAFAFA] text-[#71717A] hover:text-[#09090B] cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveModule} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#09090B] mb-1">
                    Module Title
                  </label>
                  <input
                    type="text"
                    required
                    value={moduleFormTitle}
                    onChange={(e) => setModuleFormTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-sans text-[#09090B] bg-[#FAFAFA] border border-[#E4E4E7] focus:ring-1 focus:ring-[#09090B] focus:border-[#09090B] focus:outline-none"
                    placeholder="e.g. Cybersecurity Basics"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#09090B] mb-1">
                    Markdown Lesson Content
                  </label>
                  <textarea
                    required
                    rows={8}
                    value={moduleFormContent}
                    onChange={(e) => setModuleFormContent(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono text-[#09090B] bg-[#FAFAFA] border border-[#E4E4E7] focus:ring-1 focus:ring-[#09090B] focus:border-[#09090B] focus:outline-none"
                    placeholder="# Lesson 1: Overview..."
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E4E4E7]">
                  <button
                    type="button"
                    onClick={() => setIsModuleModalOpen(false)}
                    className="px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider text-[#09090B] border border-[#E4E4E7] hover:bg-[#FAFAFA] cursor-pointer min-h-[40px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider text-white bg-[#09090B] hover:bg-[#27272A] shadow-none cursor-pointer min-h-[40px] border border-[#09090B]"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
            <motion.div
              variants={scaleInVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-[#E4E4E7]"
            >
              <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-3">
                <h3 className="font-sans font-black text-lg uppercase tracking-tight text-[#09090B]">
                  {editingQuestion ? 'Edit Quiz Question' : 'Add Quiz Question'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsQuestionModalOpen(false)}
                  aria-label="Close modal"
                  className="p-1 hover:bg-[#FAFAFA] text-[#71717A] hover:text-[#09090B] cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveQuestion} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#09090B] mb-1">
                    Question Text
                  </label>
                  <input
                    type="text"
                    required
                    value={qText}
                    onChange={(e) => setQText(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-sans text-[#09090B] bg-[#FAFAFA] border border-[#E4E4E7] focus:ring-1 focus:ring-[#09090B] focus:border-[#09090B] focus:outline-none"
                    placeholder="e.g. What is the minimum certificate number length?"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#09090B]">
                    Options (Select Correct Answer Radio)
                  </label>
                  {qOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correct_idx"
                        aria-label={`Mark Option ${String.fromCharCode(65 + idx)} as correct`}
                        checked={qCorrectIdx === idx}
                        onChange={() => setQCorrectIdx(idx)}
                        className="h-4 w-4 text-[#09090B] accent-[#09090B] cursor-pointer"
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
                        className="w-full px-3.5 py-2 text-xs font-sans text-[#09090B] bg-[#FAFAFA] border border-[#E4E4E7] focus:outline-none focus:ring-1 focus:ring-[#09090B]"
                        placeholder={`Option ${String.fromCharCode(65 + idx)}${idx >= 2 ? ' (Optional)' : ''}`}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E4E4E7]">
                  <button
                    type="button"
                    onClick={() => setIsQuestionModalOpen(false)}
                    className="px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider text-[#09090B] border border-[#E4E4E7] hover:bg-[#FAFAFA] cursor-pointer min-h-[40px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider text-white bg-[#09090B] hover:bg-[#27272A] shadow-none cursor-pointer min-h-[40px] border border-[#09090B]"
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
