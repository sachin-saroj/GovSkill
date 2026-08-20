import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import { getApiErrorMessage } from '@/lib/apiError';
import { EmployeeSkillStatusResponse } from '@/types';
import { Card } from '@/components/ui/Card';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Circle,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Loader2
} from 'lucide-react';

export const ProgressDashboardPage: React.FC = () => {
  const [data, setData] = useState<EmployeeSkillStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSkillProgress = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get<EmployeeSkillStatusResponse>('/progress/my-skills');
      setData(res.data);
    } catch (error: unknown) {
      setError(getApiErrorMessage(error, 'Failed to load skill progress'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleLessons = async (module_id: string) => {
    try {
      await api.post(`/progress/modules/${module_id}/complete-lessons`);
      fetchSkillProgress();
    } catch (error: unknown) {
      alert(getApiErrorMessage(error, 'Failed to update lesson status'));
    }
  };

  useEffect(() => {
    fetchSkillProgress();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[60vh] gap-2 text-[#5A6472]"><Loader2 className="h-5 w-5 animate-spin text-[#1E4D8C]" /><span>Loading your digital skill profile...</span></div>;
  }

  if (error) {
    return <div className="max-w-4xl mx-auto py-12 px-4"><div className="rounded-xl border border-[#C0392B]/30 bg-[#C0392B]/5 p-6 text-sm text-[#C0392B]">{error}</div></div>;
  }

  const certifiedCount = data?.certified_modules || 0;
  const totalCount = data?.total_modules || 0;
  const overallScore = data?.overall_skill_score || 0;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1E4D8C] via-[#163A6B] to-[#0D2447] p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-white/80 text-sm font-semibold mb-2">
            <Sparkles className="h-4 w-4 text-[#D98E04]" />
            <span>Digital Skill Competency Dashboard</span>
          </div>
          <h1 className="text-3xl font-semibold leading-tight mb-2">My Skill Progress</h1>
          <p className="text-white/90 text-sm max-w-xl leading-relaxed">
            Track your completed lessons, quiz scores, and verified digital skill certifications for local government operations.
          </p>
        </div>

        <div className="bg-white/10 p-5 rounded-2xl backdrop-blur border border-white/20 text-center shrink-0 min-w-[200px]">
          <span className="text-xs font-semibold text-white/80 uppercase block mb-1">Skill Competency</span>
          <div className="text-3xl font-bold text-white mb-1">{overallScore}%</div>
          <span className="text-xs text-white/70 block">
            {certifiedCount} of {totalCount} Modules Certified
          </span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#1A1F2B]">Assigned Skill Modules</h2>
        <button
          onClick={fetchSkillProgress}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#5A6472] border border-[#E2E6EB] rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Module Skill Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data?.skills.map((skill) => {
          const isCertified = skill.status === 'certified';
          const isCompleted = skill.status === 'completed';
          const isInProgress = skill.status === 'in_progress';

          return (
            <Card key={skill.module_id} className="p-6 flex flex-col justify-between space-y-6 border border-[#E2E6EB]">
              <div className="space-y-4">
                {/* Status Badge & Header */}
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-[#1A1F2B]">{skill.module_title}</h3>

                  {isCertified && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#2E9E6B]/15 text-[#2E9E6B] border border-[#2E9E6B]/30 shrink-0">
                      <Award className="h-3.5 w-3.5" />
                      <span>Certified</span>
                    </span>
                  )}

                  {isCompleted && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#1E4D8C]/15 text-[#1E4D8C] border border-[#1E4D8C]/30 shrink-0">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Lessons Done</span>
                    </span>
                  )}

                  {isInProgress && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#D98E04]/15 text-[#D98E04] border border-[#D98E04]/30 shrink-0">
                      <Clock className="h-3.5 w-3.5" />
                      <span>In Progress</span>
                    </span>
                  )}

                  {skill.status === 'not_started' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-[#5A6472] border border-gray-200 shrink-0">
                      <Circle className="h-3.5 w-3.5" />
                      <span>Not Started</span>
                    </span>
                  )}
                </div>

                {/* Progress Indicators */}
                <div className="space-y-3 bg-[#F7F9FB] p-4 rounded-xl border border-[#E2E6EB]">
                  <div className="flex items-center justify-between text-xs text-[#5A6472]">
                    <span className="font-semibold text-[#1A1F2B]">Lessons Read:</span>
                    <button
                      onClick={() => handleToggleLessons(skill.module_id)}
                      className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border transition-colors ${
                        skill.lessons_completed
                          ? 'bg-[#2E9E6B]/10 text-[#2E9E6B] border-[#2E9E6B]/40'
                          : 'bg-white text-[#5A6472] border-[#E2E6EB] hover:border-[#1E4D8C]'
                      }`}
                    >
                      {skill.lessons_completed ? 'Completed ✓' : 'Mark as Read'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#5A6472]">
                    <span className="font-semibold text-[#1A1F2B]">Best Quiz Score:</span>
                    <span className="font-bold text-[#1E4D8C]">
                      {skill.total_questions > 0
                        ? `${skill.best_score} / ${skill.total_questions} (${skill.score_percentage}%)`
                        : 'No quiz taken'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 transition-all duration-500 ${
                        isCertified ? 'bg-[#2E9E6B]' : isInProgress || isCompleted ? 'bg-[#1E4D8C]' : 'bg-gray-300'
                      }`}
                      style={{ width: `${Math.max(5, skill.score_percentage)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-[#E2E6EB] text-xs">
                <Link
                  to="/module"
                  className="flex items-center gap-1 font-semibold text-[#1E4D8C] hover:underline"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Read Lessons</span>
                </Link>

                <Link
                  to={`/quiz/${skill.module_id}`}
                  className="flex items-center gap-1 font-semibold text-[#2E9E6B] hover:underline"
                >
                  <Award className="h-3.5 w-3.5" />
                  <span>Take Quiz</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressDashboardPage;
