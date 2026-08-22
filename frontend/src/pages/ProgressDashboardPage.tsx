import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { EmployeeSkillStatusResponse, EmployeeSkillItem } from '@/types';
import CertificateModal from '@/components/certificate/CertificateModal';
import CompetencyOverview from '@/components/progress/CompetencyOverview';
import SkillModuleCard from '@/components/progress/SkillModuleCard';
import { EmptyState, ErrorAlert } from '@/components/ui';
import { Loader2, RefreshCw, BookOpen } from 'lucide-react';

export const ProgressDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<EmployeeSkillStatusResponse | null>(null);
  const [selectedCertSkill, setSelectedCertSkill] = useState<EmployeeSkillItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      {/* Competency Overview Banner & Metrics */}
      <CompetencyOverview
        userEmail={user?.email}
        userRole={user?.role}
        overallScore={overallScore}
        certifiedCount={certifiedCount}
        totalCount={totalCount}
      />

      {/* Module List Header & Action Bar */}
      <div className="flex items-center justify-between pt-2">
        <div className="space-y-0.5">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Assigned Skill Modules
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Core administrative training curriculum for local governance officers
          </p>
        </div>

        <button
          type="button"
          onClick={fetchSkillProgress}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-civic-xs cursor-pointer active:scale-95"
        >
          <RefreshCw className="h-3.5 w-3.5 text-civic-700" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Module Skill Cards Grid */}
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
    </div>
  );
};

export default ProgressDashboardPage;
