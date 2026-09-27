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
        return <BookOpen className="h-5 w-5 text-[#0E50B0]" />;
      case 'take_quiz':
        return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
      case 'retake_quiz':
        return <RefreshCw className="h-5 w-5 text-[#AF411E]" />;
      case 'start_training':
        return <Play className="h-5 w-5 text-[#0E50B0]" />;
      case 'all_certified':
        return <Award className="h-5 w-5 text-emerald-600" />;
      default:
        return <Compass className="h-5 w-5 text-[#0E50B0]" />;
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
      className={`p-6 sm:p-8 border shadow-none transition-all duration-200 rounded-none bg-white ${
        isAllCertified
          ? 'border-[#E4E4E7] border-l-4 border-l-emerald-600'
          : isHighPriority
          ? 'border-[#E4E4E7] border-l-4 border-l-[#AF411E]'
          : 'border-[#E4E4E7]'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div
            className={`p-3 shrink-0 border ${
              isAllCertified
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : isHighPriority
                ? 'bg-orange-50 text-[#AF411E] border-orange-200'
                : 'bg-[#FAFAFA] text-[#09090B] border-[#E4E4E7]'
            }`}
          >
            {getActionIcon()}
          </div>

          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-mono uppercase tracking-[0.2em] font-bold px-2 py-0.5 border ${
                  isAllCertified
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : isHighPriority
                    ? 'bg-orange-50 text-[#AF411E] border-orange-300'
                    : 'bg-[#FAFAFA] text-[#09090B] border-[#E4E4E7]'
                }`}
              >
                {isAllCertified ? 'Curriculum Complete' : 'Recommended Next Action'}
              </span>
              {isHighPriority && (
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#AF411E] font-bold">• Priority Action</span>
              )}
            </div>

            <h3 className="font-sans font-black text-lg uppercase tracking-tight text-[#09090B] leading-snug">
              {recommendation.title}
            </h3>

            <p className="text-body text-[#52525B] leading-relaxed">
              {recommendation.description}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center justify-start md:justify-end">
          <Link
            to={recommendation.link}
            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-none text-xs font-bold uppercase tracking-wider min-h-[42px] transition-all cursor-pointer border ${
              isAllCertified
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-700'
                : 'bg-[#09090B] hover:bg-[#27272A] text-white border-[#09090B]'
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
