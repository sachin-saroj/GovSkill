import React, { useEffect, useState } from 'react';
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
import { EmptyState, ErrorAlert } from '@/components/ui';
import { Loader2, RefreshCw, BookOpen, Layers, Award, ShieldCheck, ExternalLink, CheckCircle2 } from 'lucide-react';
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
      className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8"
    >
      {/* 1. Competency Overview Banner & Metrics */}
      <CompetencyOverview
        userEmail={user?.email}
        userRole={user?.role}
        overallScore={overallScore}
        certifiedCount={certifiedCount}
        totalCount={totalCount}
        summary={data?.summary}
      />

      {/* 2. Recommended Next Action Callout */}
      {data?.recommended_action && (
        <motion.div variants={fadeUpVariants}>
          <RecommendedActionCard recommendation={data.recommended_action} />
        </motion.div>
      )}

      {/* 3. Skill Gaps & Targeted Interventions */}
      {data?.skill_gaps && (
        <motion.div variants={fadeUpVariants}>
          <SkillGapsCard gaps={data.skill_gaps} />
        </motion.div>
      )}

      {/* 4. Competency Mastery Breakdown (Phase 3) */}
      {data?.competency_mastery && data.competency_mastery.length > 0 && (
        <motion.div variants={fadeUpVariants}>
          <CompetencyMasteryCard masteryList={data.competency_mastery} />
        </motion.div>
      )}

      {/* 5. Core Skill Modules Breakdown */}
      <motion.div variants={fadeUpVariants} className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-civic-700" />
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Assigned Competency Curriculum
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Official administrative digital skill curriculum for local government operations
            </p>
          </div>

          <motion.button
            type="button"
            whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
            onClick={fetchSkillProgress}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-civic-xs cursor-pointer"
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

      {/* 5. Official Digital Credentials Section */}
      {credentials.length > 0 && (
        <motion.div variants={fadeUpVariants} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-civic-100 text-civic-800">
                <Award className="h-4 w-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Official Digital Credentials
              </h2>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {credentials.length} Cryptographically Signed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {credentials.map((cred) => (
              <div
                key={cred.credential_id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-civic-xs flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-civic-700 bg-civic-50 px-2.5 py-0.5 rounded-full border border-civic-200 font-mono">
                      <ShieldCheck className="h-3 w-3 text-emerald-600" />
                      {cred.credential_id}
                    </span>
                    <span className="text-xs font-bold text-emerald-700">
                      Score: {cred.percentage}%
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {cred.module_title}
                  </h3>

                  <p className="text-[11px] text-slate-500">
                    Issued on {new Date(cred.issued_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Signature Verified
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCredentialForModal(cred)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                    >
                      <Award className="h-3 w-3 text-civic-700" />
                      <span>View Certificate</span>
                    </button>

                    <a
                      href={`/verify/${cred.credential_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-civic-700 hover:text-civic-900 bg-civic-50 hover:bg-civic-100 px-3 py-1.5 rounded-xl border border-civic-200 transition-colors"
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

      {/* 6. Assessment History & Learning Activity Timeline Grid */}
      <motion.div variants={fadeUpVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        <div className="lg:col-span-2">
          <AssessmentHistoryTable history={data?.assessment_history || []} />
        </div>
        <div className="lg:col-span-1">
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
