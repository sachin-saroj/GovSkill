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
      className={`p-6 sm:p-8 border shadow-civic-xs transition-all duration-200 rounded-civic-xl ${
        isAllCertified
          ? 'bg-emerald-50/50 border-emerald-200'
          : isHighPriority
          ? 'bg-amber-50/40 border-amber-200'
          : 'bg-civic-50/50 border-civic-200'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-full shrink-0 ${
              isAllCertified
                ? 'bg-emerald-100 text-emerald-800'
                : isHighPriority
                ? 'bg-amber-100 text-amber-900'
                : 'bg-civic-100 text-civic-800'
            }`}
          >
            {getActionIcon()}
          </div>

          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span
                className={`text-micro font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  isAllCertified
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : isHighPriority
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-civic-100 text-civic-800 border-civic-200'
                }`}
              >
                {isAllCertified ? 'Curriculum Complete' : 'Recommended Next Action'}
              </span>
              {isHighPriority && (
                <span className="text-caption font-semibold text-amber-700">• High Priority</span>
              )}
            </div>

            <h3 className="text-section-heading font-semibold text-slate-900 tracking-tight leading-snug">
              {recommendation.title}
            </h3>

            <p className="text-body text-slate-600 leading-relaxed font-normal">
              {recommendation.description}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center justify-start md:justify-end">
          <Link
            to={recommendation.link}
            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-btn font-semibold min-h-[44px] transition-all shadow-civic-xs cursor-pointer ${
              isAllCertified
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-civic-900 hover:bg-civic-800 text-white'
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
