import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { EmployeeSkillStatusResponse, EmployeeSkillItem } from '@/types';
import CertificateModal from '@/components/certificate/CertificateModal';
import CompetencyOverview from '@/components/progress/CompetencyOverview';
import RecommendedActionCard from '@/components/progress/RecommendedActionCard';
import SkillModuleCard from '@/components/progress/SkillModuleCard';
import SkillGapsCard from '@/components/progress/SkillGapsCard';
import AssessmentHistoryTable from '@/components/progress/AssessmentHistoryTable';
import LearningActivityTimeline from '@/components/progress/LearningActivityTimeline';
import { EmptyState, ErrorAlert } from '@/components/ui';
import { Loader2, RefreshCw, BookOpen, Layers } from 'lucide-react';
import { staggerContainerVariants, fadeUpVariants } from '@/lib/motion';

export const ProgressDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<EmployeeSkillStatusResponse | null>(null);
  const [selectedCertSkill, setSelectedCertSkill] = useState<EmployeeSkillItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const fetchSkillProgress = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get<EmployeeSkillStatusResponse>('/progress/my-skills');
      setData(res.data);
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

      {/* 4. Core Skill Modules Breakdown */}
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

      {/* 5. Assessment History & Learning Activity Timeline Grid */}
      <motion.div variants={fadeUpVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        <div className="lg:col-span-2">
          <AssessmentHistoryTable history={data?.assessment_history || []} />
        </div>
        <div className="lg:col-span-1">
          <LearningActivityTimeline activities={data?.recent_activity || []} />
        </div>
      </motion.div>

      {/* Certificate Modal */}
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
        />
      )}
    </motion.div>
  );
};

export default ProgressDashboardPage;
