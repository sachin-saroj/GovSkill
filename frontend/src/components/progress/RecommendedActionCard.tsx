import React from 'react';
import { Link } from 'react-router-dom';
import { NextActionRecommendation } from '@/types';
import Card from '@/components/ui/Card';
import { ArrowRight, BookOpen, CheckCircle2, RefreshCw, Award, Compass, Play } from 'lucide-react';

interface RecommendedActionCardProps {
  recommendation: NextActionRecommendation;
}

export const RecommendedActionCard: React.FC<RecommendedActionCardProps> = ({ recommendation }) => {
  const getActionIcon = () => {
    switch (recommendation.action_type) {
      case 'read_lesson':
        return <BookOpen className="h-5 w-5 text-civic-700" />;
      case 'take_quiz':
        return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
      case 'retake_quiz':
        return <RefreshCw className="h-5 w-5 text-amber-600" />;
      case 'start_training':
        return <Play className="h-5 w-5 text-civic-700" />;
      case 'all_certified':
        return <Award className="h-5 w-5 text-emerald-600" />;
      default:
        return <Compass className="h-5 w-5 text-civic-700" />;
    }
  };

  const getButtonText = () => {
    switch (recommendation.action_type) {
      case 'read_lesson':
        return 'Read Official Lessons';
      case 'take_quiz':
        return 'Take Assessment';
      case 'retake_quiz':
        return 'Retake Assessment';
      case 'start_training':
        return 'Start Module Curriculum';
      case 'all_certified':
        return 'Review Verified Skills';
      default:
        return 'Continue Learning';
    }
  };

  const isHighPriority = recommendation.priority === 'high';
  const isAllCertified = recommendation.action_type === 'all_certified';

  return (
    <Card
      className={`p-6 sm:p-8 border shadow-sm transition-all duration-200 rounded-2xl ${
        isAllCertified
          ? 'bg-[#EDE4D0] border-[#2A5B4A]/30'
          : isHighPriority
          ? 'bg-[#EDE4D0] border-[#C97B5A]/40'
          : 'bg-[#EDE4D0] border-[#D9CFBB]'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-full shrink-0 ${
              isAllCertified
                ? 'bg-[#2A5B4A]/10 text-[#2A5B4A] border border-[#2A5B4A]/30'
                : isHighPriority
                ? 'bg-[#C97B5A]/10 text-[#C97B5A] border border-[#C97B5A]/30'
                : 'bg-[#E4D9C3] text-[#0A0A0A] border border-[#D9CFBB]'
            }`}
          >
            {getActionIcon()}
          </div>

          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-mono uppercase tracking-[0.14em] px-2.5 py-0.5 rounded-full border ${
                  isAllCertified
                    ? 'bg-[#2A5B4A]/10 text-[#2A5B4A] border-[#2A5B4A]/30'
                    : isHighPriority
                    ? 'bg-[#C97B5A]/10 text-[#C97B5A] border-[#C97B5A]/30'
                    : 'bg-[#E4D9C3] text-[#0A0A0A] border-[#D9CFBB]'
                }`}
              >
                {isAllCertified ? 'Curriculum Complete' : 'Recommended Next Action'}
              </span>
              {isHighPriority && (
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#C97B5A]">• Priority Action</span>
              )}
            </div>

            <h3 className="font-serif font-bold text-xl text-[#0A0A0A] tracking-tight leading-snug">
              {recommendation.title}
            </h3>

            <p className="text-body text-[#6B6357] leading-relaxed font-normal">
              {recommendation.description}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center justify-start md:justify-end">
          <Link
            to={recommendation.link}
            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-medium min-h-[44px] transition-all shadow-sm cursor-pointer ${
              isAllCertified
                ? 'bg-[#2A5B4A] hover:bg-[#1f4336] text-[#F5EFE0]'
                : 'bg-[#0A0A0A] hover:bg-[#262626] text-[#F5EFE0]'
            }`}
          >
            <span>{getButtonText()}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default RecommendedActionCard;
