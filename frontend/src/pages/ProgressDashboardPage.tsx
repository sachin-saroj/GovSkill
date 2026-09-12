import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { EmployeeSkillStatusResponse, EmployeeSkillItem, EmployeeCredentialItem, EmployeeCredentialsResponse } from '@/types';
import CertificateModal from '@/components/certificate/CertificateModal';
import CompetencyOverview from '@/components/progress/CompetencyOverview';
import RecommendedActionCard from '@/components/progress/RecommendedActionCard';
import SkillModuleCard from '@/components/progress/SkillModuleCard';
import SkillGapsCard from '@/components/progress/SkillGapsCard';
import CompetencyMasteryCard from '@/components/progress/CompetencyMasteryCard';
import AssessmentHistoryTable from '@/components/progress/AssessmentHistoryTable';
import LearningActivityTimeline from '@/components/progress/LearningActivityTimeline';
import ProgressChart from '@/components/progress/ProgressChart';
import { EmptyState, ErrorAlert } from '@/components/ui';
import { Loader2, RefreshCw, BookOpen, Layers, Award, ShieldCheck, ExternalLink, CheckCircle2, ArrowRight } from 'lucide-react';
import { staggerContainerVariants, fadeUpVariants } from '@/lib/motion';

export const ProgressDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<EmployeeSkillStatusResponse | null>(null);
  const [credentials, setCredentials] = useState<EmployeeCredentialItem[]>([]);
  const [selectedCertSkill, setSelectedCertSkill] = useState<EmployeeSkillItem | null>(null);
  const [selectedCredentialForModal, setSelectedCredentialForModal] = useState<EmployeeCredentialItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const fetchSkillProgress = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [skillRes, credRes] = await Promise.all([
        api.get<EmployeeSkillStatusResponse>('/progress/my-skills'),
        api.get<EmployeeCredentialsResponse>('/credentials/my-credentials').catch(() => ({ data: { credentials: [], total_count: 0 } })),
      ]);
      setData(skillRes.data);
      setCredentials(credRes.data.credentials || []);
    } catch (err: any) {
      setError(err.response?.data?.detail?.error?.message || 'Failed to load skill progress');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleLessons = async (module_id: string) => {
    try {
      await api.post(`/progress/modules/${module_id}/complete-lessons`);
      fetchSkillProgress();
    } catch (err: any) {
      alert(err.response?.data?.detail?.error?.message || 'Failed to update lesson status');
    }
  };

  useEffect(() => {
    fetchSkillProgress();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-3 text-slate-500">
        <Loader2 className="h-6 w-6 animate-spin text-civic-700" />
        <span className="font-medium text-sm">Loading your digital skill profile...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4">
        <ErrorAlert
          title="Competency Data Error"
          message={error}
          onRetry={fetchSkillProgress}
        />
      </div>
    );
  }

  const certifiedCount = data?.certified_modules || 0;
  const totalCount = data?.total_modules || 0;
  const overallScore = data?.overall_skill_score || 0;

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-10"
    >
      {/* 1. Page Header & Competency Hero */}
      <CompetencyOverview
        userEmail={user?.email}
        userRole={user?.role}
        overallScore={overallScore}
        certifiedCount={certifiedCount}
        totalCount={totalCount}
        summary={data?.summary}
      />

      {/* 2. Reference-Aligned Asymmetric 3-Column Section */}
      <motion.div variants={fadeUpVariants} className="grid grid-cols-12 gap-6">
        {/* Column 1: Assigned Learning / Recommended Modules (5 cols on lg) */}
        <div className="col-span-12 lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-[15px] text-[#0A0A0A] font-normal">
              Assigned Modules
            </h2>
            <Link to="/module" className="font-mono text-[11px] text-[#6B6357] hover:text-[#0A0A0A] transition-colors">
              All Curriculum ▾
            </Link>
          </div>

          <div className="space-y-2.5">
            {data?.skills && data.skills.length > 0 ? (
              data.skills.map((skill, idx) => {
                const badgeStyles = [
                  { bg: 'bg-[#C9A24A]/15', text: 'text-[#8F6A1A]' },
                  { bg: 'bg-[#C97B5A]/15', text: 'text-[#8F3E22]' },
                  { bg: 'bg-[#2A5B4A]/15', text: 'text-[#1E4537]' },
                  { bg: 'bg-[#6B8299]/15', text: 'text-[#3E5266]' },
                ];
                const b = badgeStyles[idx % badgeStyles.length];
                const isCert = skill.status === 'certified' || (skill.score_percentage >= 75 && skill.best_score > 0);

                return (
                  <div
                    key={skill.module_id}
                    className="flex items-center justify-between p-3 bg-[#EDE4D0]/70 rounded-xl border border-[#D9CFBB] shadow-xs hover:bg-[#EDE4D0] transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className={`w-9 h-9 rounded-lg ${b.bg} ${b.text} font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-[#D9CFBB]/60`}>
                        {skill.module_title.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-[13px] font-medium text-[#0A0A0A] truncate">
                          {skill.module_title}
                        </h3>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-[#6B6357]">
                          <span>{skill.score_percentage ? `${skill.score_percentage}% Score` : '4 Sections'}</span>
                          <span>•</span>
                          <span className={isCert ? 'text-[#2A5B4A] font-semibold' : 'text-[#6B6357]'}>
                            {isCert ? 'Certified' : skill.lessons_completed ? 'Lessons Read' : 'In Progress'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/module?id=${skill.module_id}`}
                      className="shrink-0 px-3 py-1 text-[11px] font-sans font-medium text-[#0A0A0A] border border-[#D9CFBB] rounded-full hover:bg-[#0A0A0A] hover:text-[#F5EFE0] hover:border-[#0A0A0A] transition-all shadow-xs"
                    >
                      View Module
                    </Link>
                  </div>
                );
              })
            ) : (
              <p className="text-[12px] text-[#6B6357] p-4 bg-[#EDE4D0]/60 rounded-xl border border-[#D9CFBB]">No modules assigned yet.</p>
            )}
          </div>
        </div>

        {/* Column 2: Current Activity & Trajectory (4 cols on lg) */}
        <div className="col-span-12 lg:col-span-4 space-y-3">
          <h2 className="font-serif text-[15px] text-[#0A0A0A] font-normal">
            Current Activity & Analytics
          </h2>

          {/* Archival Stage Plate Trajectory Chart Card */}
          <div className="bg-[#0A0A0A] border border-[#222222] rounded-2xl p-5 text-[#F5EFE0] shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-serif text-[13px] font-normal block text-[#F5EFE0]">Assessment Trajectory</span>
                <span className="font-mono text-[10px] text-[#D9CFBB]/70">75% Target Certification Benchmark</span>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-wider bg-white/10 text-[#C9A24A] border border-white/15 px-2 py-0.5 rounded-full">
                Telemetry
              </span>
            </div>

            {/* Trajectory Mini Plot */}
            <div className="h-16 w-full pt-1 flex items-end">
              <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                {/* Target benchmark line at 75% (y=10) */}
                <line x1="0" y1="10" x2="100" y2="10" stroke="rgba(217,207,187,0.25)" strokeDasharray="3 3" strokeWidth="1" />
                {/* Smooth curve */}
                <path
                  d="M0 35 Q 25 32, 45 22 T 75 16 T 100 8"
                  fill="none"
                  stroke="#C9A24A"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="8" r="3" fill="#C9A24A" stroke="#F5EFE0" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          {/* Dual Archival Milestone Blocks */}
          <div className="grid grid-cols-2 gap-3">
            {/* 1. Certified Milestone */}
            <div className="bg-[#EDE4D0]/80 border border-[#D9CFBB] rounded-xl p-3.5 text-[#0A0A0A] shadow-xs flex flex-col justify-between min-h-[90px]">
              <div>
                <span className="font-mono text-2xl font-bold tracking-tight block text-[#0A0A0A]">
                  {certifiedCount}/{totalCount}
                </span>
                <span className="font-sans text-[11px] text-[#6B6357] block">
                  Certified Modules
                </span>
              </div>
              <div className="flex justify-end">
                <span className="p-1 rounded-full bg-[#F5EFE0] border border-[#D9CFBB]">
                  <ArrowRight className="h-3 w-3 text-[#0A0A0A] -rotate-45" />
                </span>
              </div>
            </div>

            {/* 2. Priority Gaps */}
            <div className="bg-[#EDE4D0]/80 border border-[#D9CFBB] rounded-xl p-3.5 text-[#0A0A0A] shadow-xs flex flex-col justify-between min-h-[90px]">
              <div>
                <span className="font-mono text-2xl font-bold tracking-tight block text-[#C97B5A]">
                  {data?.skill_gaps?.length ?? 0}
                </span>
                <span className="font-sans text-[11px] text-[#6B6357] block">
                  Priority Action Gaps
                </span>
              </div>
              <div className="flex justify-end">
                <span className="p-1 rounded-full bg-[#F5EFE0] border border-[#D9CFBB]">
                  <ArrowRight className="h-3 w-3 text-[#C97B5A]" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Recent Learning Activity / Signals (3 cols on lg) */}
        <div className="col-span-12 lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-[15px] text-[#0A0A0A] font-normal">
              Recent Signals
            </h2>
            <span className="font-mono text-[10px] text-[#6B6357] uppercase tracking-wider">Audit</span>
          </div>

          <div className="space-y-2">
            {data?.recent_activity && data.recent_activity.length > 0 ? (
              data.recent_activity.slice(0, 4).map((act, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-[#EDE4D0]/70 rounded-xl border border-[#D9CFBB] hover:bg-[#EDE4D0] transition-colors shadow-xs"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <div className="w-7 h-7 rounded-full bg-[#F5EFE0] border border-[#D9CFBB] text-[#0A0A0A] flex items-center justify-center shrink-0 font-mono text-[10px]">
                      {act.activity_type === 'certification' ? '🏆' : act.activity_type === 'quiz_attempt' ? '🎯' : '📖'}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[12px] font-medium text-[#0A0A0A] block truncate">
                        {act.module_title || act.title}
                      </span>
                      <span className="text-[10px] font-mono text-[#6B6357] block truncate">
                        {act.detail || new Date(act.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <Link
                    to="/module"
                    className="shrink-0 px-2.5 py-0.5 text-[10px] font-mono text-[#0A0A0A] border border-[#D9CFBB] rounded-full hover:bg-[#0A0A0A] hover:text-[#F5EFE0] transition-all"
                  >
                    Review
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-4 bg-[#EDE4D0]/60 rounded-xl border border-[#D9CFBB] text-center text-[12px] text-[#6B6357]">
                <span>No recent activity signals.</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* 3. Next Best Action Callout */}
      {data?.recommended_action && (
        <motion.div variants={fadeUpVariants}>
          <RecommendedActionCard recommendation={data.recommended_action} />
        </motion.div>
      )}

      {/* 4. Full Detailed Curriculum Roadmap Grid */}
      <motion.div variants={fadeUpVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-civic-700" />
              <h2 className="text-section-heading font-semibold text-slate-900 tracking-tight">
                Full Curriculum Roadmap & Certifications
              </h2>
            </div>
            <p className="text-caption text-slate-500 font-medium">
              Comprehensive module objectives, lesson reader shortcuts, and assessment status
            </p>
          </div>

          <motion.button
            type="button"
            whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            onClick={fetchSkillProgress}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-caption font-semibold text-slate-700 bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all shadow-civic-xs cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 text-civic-700" />
            <span>Refresh</span>
          </motion.button>
        </div>

        {data?.skills && data.skills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.skills.map((skill) => (
              <SkillModuleCard
                key={skill.module_id}
                skill={skill}
                onToggleLessons={handleToggleLessons}
                onViewCertificate={setSelectedCertSkill}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title="No Skill Modules Assigned"
            description="There are currently no training modules assigned to your account. Please check back later."
          />
        )}
      </motion.div>

      {/* 4. Skill Gaps & Targeted Interventions */}
      {data?.skill_gaps && (
        <motion.div variants={fadeUpVariants}>
          <SkillGapsCard gaps={data.skill_gaps} />
        </motion.div>
      )}

      {/* 5. Competency Mastery Breakdown */}
      {data?.competency_mastery && data.competency_mastery.length > 0 && (
        <motion.div variants={fadeUpVariants}>
          <CompetencyMasteryCard masteryList={data.competency_mastery} />
        </motion.div>
      )}

      {/* 6. Official Digital Credentials Section */}
      {credentials.length > 0 && (
        <motion.div variants={fadeUpVariants} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-full bg-[#0A0A0A] text-[#F5EFE0]">
                <Award className="h-4 w-4 text-[#C9A24A]" />
              </div>
              <h2 className="font-serif text-[18px] sm:text-[20px] font-normal text-[#0A0A0A]">
                Official Digital Credentials
              </h2>
            </div>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#1E4537] bg-[#2A5B4A]/12 px-2.5 py-1 rounded-full border border-[#2A5B4A]/30">
              {credentials.length} Cryptographically Signed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {credentials.map((cred) => (
              <div
                key={cred.credential_id}
                className="bg-[#EDE4D0]/80 p-6 rounded-2xl border border-[#D9CFBB] shadow-xs flex flex-col justify-between gap-4 relative"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#0A0A0A] bg-[#F5EFE0] px-2.5 py-0.5 rounded-full border border-[#D9CFBB]">
                      <ShieldCheck className="h-3 w-3 text-[#2A5B4A]" />
                      {cred.credential_id}
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-[#1E4537] bg-[#2A5B4A]/12 px-2 py-0.5 rounded-full">
                      Score: {cred.percentage}%
                    </span>
                  </div>

                  <h3 className="font-serif text-[17px] font-normal text-[#0A0A0A] leading-snug">
                    {cred.module_title}
                  </h3>

                  <p className="font-sans text-[12px] text-[#6B6357]">
                    Issued on {new Date(cred.issued_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between pt-3.5 border-t border-[#D9CFBB]/70 gap-2">
                  <span className="inline-flex items-center gap-1 font-sans text-[12px] text-[#1E4537] font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#2A5B4A]" />
                    Signature Verified
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCredentialForModal(cred)}
                      className="inline-flex items-center gap-1.5 text-[11px] font-sans font-medium text-[#0A0A0A] bg-[#F5EFE0] hover:bg-[#EDE4D0] px-3 py-1.5 rounded-full border border-[#D9CFBB] transition-colors cursor-pointer shadow-xs"
                    >
                      <Award className="h-3.5 w-3.5 text-[#C9A24A]" />
                      <span>View Certificate</span>
                    </button>

                    <a
                      href={`/verify/${cred.credential_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] font-sans font-medium text-[#F5EFE0] bg-[#0A0A0A] hover:bg-[#222222] px-3 py-1.5 rounded-full border border-[#0A0A0A] transition-colors shadow-xs"
                    >
                      <span>Verify Online</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 7. Lower Page: Assessment History, Growth Trajectory Chart & Activity Timeline */}
      <motion.div variants={fadeUpVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        <div className="lg:col-span-2 space-y-6">
          <AssessmentHistoryTable history={data?.assessment_history || []} />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <ProgressChart history={data?.assessment_history || []} />
          <LearningActivityTimeline activities={data?.recent_activity || []} />
        </div>
      </motion.div>

      {/* Certificate Modal for Skill Module Card */}
      {selectedCertSkill && (
        <CertificateModal
          isOpen={!!selectedCertSkill}
          onClose={() => setSelectedCertSkill(null)}
          employeeEmail={user?.email || 'employee@office.gov'}
          moduleTitle={selectedCertSkill.module_title}
          moduleId={selectedCertSkill.module_id}
          scorePercentage={selectedCertSkill.score_percentage}
          bestScore={selectedCertSkill.best_score}
          totalQuestions={selectedCertSkill.total_questions}
          completedDate={selectedCertSkill.updated_at}
          credentialId={
            credentials.find((c) => c.module_id === selectedCertSkill.module_id)?.credential_id
          }
        />
      )}

      {/* Certificate Modal for Digital Credentials Section */}
      {selectedCredentialForModal && (
        <CertificateModal
          isOpen={!!selectedCredentialForModal}
          onClose={() => setSelectedCredentialForModal(null)}
          employeeEmail={user?.email || 'employee@office.gov'}
          moduleTitle={selectedCredentialForModal.module_title}
          moduleId={selectedCredentialForModal.module_id}
          scorePercentage={selectedCredentialForModal.percentage}
          bestScore={selectedCredentialForModal.score_achieved}
          totalQuestions={selectedCredentialForModal.total_score}
          completedDate={selectedCredentialForModal.issued_at}
          credentialId={selectedCredentialForModal.credential_id}
        />
      )}
    </motion.div>
  );
};

export default ProgressDashboardPage;
