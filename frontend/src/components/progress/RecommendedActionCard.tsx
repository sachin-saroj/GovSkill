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
      className={`p-6 border shadow-civic-sm transition-all duration-200 rounded-civic-xl ${
        isAllCertified
          ? 'bg-emerald-50/40 border-emerald-200'
          : isHighPriority
          ? 'bg-gradient-to-r from-amber-50/60 via-orange-50/30 to-white border-amber-200'
          : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-civic-md shrink-0 ${
              isAllCertified
                ? 'bg-emerald-100'
                : isHighPriority
                ? 'bg-amber-100'
                : 'bg-civic-100'
            }`}
          >
            {getActionIcon()}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`text-micro font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  isAllCertified
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : isHighPriority
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                {isAllCertified ? 'Curriculum Complete' : 'Recommended Next Action'}
              </span>
              {isHighPriority && (
                <span className="text-caption font-semibold text-amber-700">• High Priority</span>
              )}
            </div>

            <h3 className="text-section-heading font-semibold text-slate-900 tracking-tight">
              {recommendation.title}
            </h3>

            <p className="text-body text-slate-600 leading-relaxed max-w-2xl font-normal">
              {recommendation.description}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center justify-end">
          <Link
            to={recommendation.link}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-civic-md text-caption font-semibold transition-all shadow-civic-xs active:scale-98 cursor-pointer ${
              isAllCertified
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                : isHighPriority
                ? 'bg-civic-900 hover:bg-civic-800 text-white'
                : 'bg-slate-800 hover:bg-slate-900 text-white'
            }`}
          >
            <span>{getButtonText()}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default RecommendedActionCard;
