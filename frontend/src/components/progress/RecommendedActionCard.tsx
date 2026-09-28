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
      className={`p-6 sm:p-8 border shadow-none transition-all duration-200 rounded-2xl bg-surface ${
        isAllCertified
          ? 'border-border-warm border-l-4 border-l-sage-600'
          : isHighPriority
          ? 'border-border-warm border-l-4 border-l-rose-500'
          : 'border-border-warm'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div
            className={`p-3 shrink-0 rounded-xl border ${
              isAllCertified
                ? 'bg-sage-500/15 text-sage-800 border-sage-500/30'
                : isHighPriority
                ? 'bg-rose-500/15 text-rose-800 border-rose-500/30'
                : 'bg-surface-light text-ink border-border-warm'
            }`}
          >
            {getActionIcon()}
          </div>

          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-mono uppercase tracking-[0.16em] font-bold px-2.5 py-0.5 rounded-full border ${
                  isAllCertified
                    ? 'bg-sage-500/15 text-sage-800 border-sage-500/30'
                    : isHighPriority
                    ? 'bg-rose-500/15 text-rose-800 border-rose-500/30'
                    : 'bg-surface-light text-ink-muted border-border-warm'
                }`}
              >
                {isAllCertified ? 'Curriculum Complete' : 'Recommended Next Action'}
              </span>
              {isHighPriority && (
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-700 font-bold">• Priority Action</span>
              )}
            </div>

            <h3 className="font-serif font-bold text-lg tracking-tight text-ink leading-snug">
              {recommendation.title}
            </h3>

            <p className="text-body text-ink-muted leading-relaxed font-normal">
              {recommendation.description}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center justify-start md:justify-end">
          <Link
            to={recommendation.link}
            className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider min-h-[42px] transition-all cursor-pointer ${
              isAllCertified
                ? 'bg-sage-700 hover:bg-sage-800 text-white'
                : 'bg-ink hover:bg-ink-muted text-surface-light hover:text-white'
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
