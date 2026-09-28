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
import { Loader2, RefreshCw, BookOpen, Award, ShieldCheck, ExternalLink, CheckCircle2, ArrowRight } from 'lucide-react';
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
      <div className="flex items-center justify-center min-h-[60vh] gap-3 text-ink-muted">
        <Loader2 className="h-6 w-6 animate-spin text-ink" />
        <span className="font-mono text-xs uppercase tracking-wider text-ink font-bold">
          Loading your digital skill profile...
        </span>
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
          <div className="flex items-center justify-between pb-1 border-b border-border-warm">
            <h2 className="font-serif font-bold text-base tracking-tight text-ink">
              Assigned Modules
            </h2>
            <Link to="/module" className="font-mono text-[10px] uppercase font-bold text-ink-muted hover:text-ink transition-colors">
              All Curriculum ▾
            </Link>
          </div>

          <div className="space-y-2.5">
            {data?.skills && data.skills.length > 0 ? (
              data.skills.map((skill, idx) => {
                const isCert = skill.status === 'certified' || (skill.score_percentage >= 75 && skill.best_score > 0);

                return (
                  <div
                    key={skill.module_id}
                    className="flex items-center justify-between p-3.5 bg-surface border border-border-warm rounded-xl hover:border-ink-muted/30 transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className="w-9 h-9 bg-surface-light border border-border-warm rounded-lg text-ink font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs font-bold text-ink truncate">
                          {skill.module_title}
                        </h3>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-ink-muted">
                          <span>{skill.score_percentage ? `${skill.score_percentage}% Score` : '4 Sections'}</span>
                          <span>•</span>
                          <span className={isCert ? 'text-sage-700 font-bold' : 'text-ink-muted'}>
                            {isCert ? 'Certified' : skill.lessons_completed ? 'Lessons Read' : 'In Progress'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/module?id=${skill.module_id}`}
                      className="shrink-0 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-ink border border-border-warm rounded-full hover:bg-ink hover:text-surface-light hover:border-ink transition-all"
                    >
                      View Module
                    </Link>
                  </div>
                );
              })
            ) : (
              <p className="text-[11px] font-mono text-ink-muted p-4 bg-surface rounded-xl border border-border-warm">
                No modules assigned yet.
              </p>
            )}
          </div>
        </div>

        {/* Column 2: Current Activity & Trajectory (4 cols on lg) */}
        <div className="col-span-12 lg:col-span-4 space-y-3">
          <div className="pb-1 border-b border-border-warm">
            <h2 className="font-serif font-bold text-base tracking-tight text-ink">
              Current Activity & Analytics
            </h2>
          </div>

          {/* Archival Stage Plate Trajectory Chart Card */}
          <div className="bg-surface border border-border-warm rounded-xl p-4 text-ink space-y-2.5">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-sans font-bold text-xs tracking-tight block text-ink">
                  Assessment Trajectory
                </span>
                <span className="font-mono text-[10px] text-ink-muted">75% Target Certification Benchmark</span>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-wider bg-surface-light text-azure-800 border border-border-warm px-2 py-0.5 rounded-full font-bold">
                Telemetry
              </span>
            </div>

            {/* Trajectory Mini Plot */}
            <div className="h-14 w-full pt-1 flex items-end">
              <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                {/* Target benchmark line at 75% (y=10) */}
                <line x1="0" y1="10" x2="100" y2="10" stroke="#BE123C" strokeDasharray="3 3" strokeWidth="1" opacity="0.6" />
                {/* Smooth curve */}
                <path
                  d="M0 35 Q 25 32, 45 22 T 75 16 T 100 8"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="8" r="3" fill="#2563EB" stroke="#FAF4E4" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          {/* Dual Archival Milestone Blocks */}
          <div className="grid grid-cols-2 gap-3">
            {/* 1. Certified Milestone */}
            <div className="bg-surface border border-border-warm rounded-xl p-3.5 text-ink flex flex-col justify-between min-h-[90px]">
              <div>
                <span className="font-mono text-2xl font-black tracking-tight block text-ink">
                  {certifiedCount}/{totalCount}
                </span>
                <span className="font-mono text-[10px] uppercase font-bold text-ink-muted block">
                  Certified Modules
                </span>
              </div>
              <div className="flex justify-end">
                <span className="p-1.5 bg-surface-light border border-border-warm rounded-full">
                  <ArrowRight className="h-3 w-3 text-ink -rotate-45" />
                </span>
              </div>
            </div>

            {/* 2. Priority Gaps */}
            <div className="bg-surface border border-border-warm rounded-xl p-3.5 text-ink flex flex-col justify-between min-h-[90px]">
              <div>
                <span className="font-mono text-2xl font-black tracking-tight block text-rose-700">
                  {data?.skill_gaps?.length ?? 0}
                </span>
                <span className="font-mono text-[10px] uppercase font-bold text-ink-muted block">
                  Priority Action Gaps
                </span>
              </div>
              <div className="flex justify-end">
                <span className="p-1.5 bg-rose-500/15 border border-rose-500/30 rounded-full">
                  <ArrowRight className="h-3 w-3 text-rose-700" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Recent Learning Activity / Signals (3 cols on lg) */}
        <div className="col-span-12 lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-border-warm">
            <h2 className="font-serif font-bold text-base tracking-tight text-ink">
              Recent Signals
            </h2>
            <span className="font-mono text-[10px] text-ink-muted uppercase tracking-wider font-bold">Audit</span>
          </div>

          <div className="space-y-2">
            {data?.recent_activity && data.recent_activity.length > 0 ? (
              data.recent_activity.slice(0, 4).map((act, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-surface border border-border-warm rounded-xl hover:border-ink-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <div className="w-7 h-7 bg-surface-light border border-border-warm rounded-full text-ink flex items-center justify-center shrink-0 font-mono text-[10px]">
                      {act.activity_type === 'certification' ? '🏆' : act.activity_type === 'quiz_attempt' ? '🎯' : '📖'}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-ink block truncate">
                        {act.module_title || act.title}
                      </span>
                      <span className="text-[10px] font-mono text-ink-muted block truncate">
                        {act.detail || new Date(act.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <Link
                    to="/module"
                    className="shrink-0 px-2.5 py-0.5 text-[9px] font-mono uppercase font-bold text-ink border border-border-warm rounded-full hover:bg-ink hover:text-surface-light transition-all"
                  >
                    Review
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-4 bg-surface rounded-xl border border-border-warm text-center text-[11px] font-mono text-ink-muted">
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-warm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 bg-surface-light border border-border-warm rounded-full text-ink-muted">
                § 02
              </span>
              <h2 className="font-serif text-xl font-bold tracking-tight text-ink">
                Full Curriculum Roadmap & Certifications
              </h2>
            </div>
            <p className="text-[13px] text-ink-muted">
              Comprehensive module objectives, lesson reader shortcuts, and assessment status
            </p>
          </div>

          <motion.button
            type="button"
            whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            onClick={fetchSkillProgress}
            className="self-start sm:self-center flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-ink bg-surface border border-border-warm rounded-full hover:bg-surface-strong transition-all cursor-pointer min-h-[38px]"
          >
            <RefreshCw className="h-3.5 w-3.5 text-ink" />
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
          <div className="flex items-center justify-between pb-2 border-b border-border-warm">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-ink text-surface-light rounded-lg">
                <Award className="h-4 w-4 text-azure-400" />
              </div>
              <h2 className="font-serif font-bold text-lg tracking-tight text-ink">
                Official Digital Credentials
              </h2>
            </div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-sage-800 bg-sage-500/15 px-3 py-1 border border-sage-500/30 rounded-full">
              {credentials.length} Cryptographically Signed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {credentials.map((cred) => (
              <div
                key={cred.credential_id}
                className="bg-surface p-6 rounded-2xl border border-border-warm shadow-none flex flex-col justify-between gap-4 relative"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider text-ink bg-surface-light px-2.5 py-0.5 rounded-full border border-border-warm">
                      <ShieldCheck className="h-3 w-3 text-sage-700" />
                      {cred.credential_id}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-sage-800 bg-sage-500/15 px-2.5 py-0.5 border border-sage-500/25 rounded-full">
                      Score: {cred.percentage}%
                    </span>
                  </div>

                  <h3 className="font-sans font-bold text-base tracking-tight text-ink leading-snug">
                    {cred.module_title}
                  </h3>

                  <p className="font-mono text-[11px] text-ink-muted">
                    Issued on {new Date(cred.issued_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between pt-3.5 border-t border-border-warm gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-sage-800">
                    <CheckCircle2 className="h-3.5 w-3.5 text-sage-700" />
                    Signature Verified
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCredentialForModal(cred)}
                      className="inline-flex items-center gap-1.5 text-xs font-mono uppercase font-bold text-ink bg-surface-light hover:bg-surface-strong px-3 py-1.5 rounded-full border border-border-warm transition-colors cursor-pointer min-h-[36px]"
                    >
                      <Award className="h-3.5 w-3.5 text-azure-700" />
                      <span>View Certificate</span>
                    </button>

                    <a
                      href={`/verify/${cred.credential_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono uppercase font-bold text-surface-light bg-ink hover:bg-ink-muted px-3.5 py-1.5 rounded-full border border-ink transition-colors min-h-[36px]"
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
