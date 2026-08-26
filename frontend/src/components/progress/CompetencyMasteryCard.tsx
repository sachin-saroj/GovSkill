import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CompetencyMasteryItem } from '@/types';
import {
  Award,
  BookOpen,
  Bot,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Minus,
  Activity,
  AlertCircle,
} from 'lucide-react';
import { fadeUpVariants } from '@/lib/motion';

interface CompetencyMasteryCardProps {
  masteryList: CompetencyMasteryItem[];
}

export const CompetencyMasteryCard: React.FC<CompetencyMasteryCardProps> = ({ masteryList }) => {
  const [filter, setFilter] = useState<'all' | 'unmastered' | 'mastered'>('all');

  if (!masteryList || masteryList.length === 0) {
    return null;
  }

  const filteredList = masteryList.filter((item) => {
    if (filter === 'mastered') return item.mastery_level === 'Mastered';
    if (filter === 'unmastered') return item.mastery_level !== 'Mastered';
    return true;
  });

  const masteredCount = masteryList.filter((item) => item.mastery_level === 'Mastered').length;
  const operationalCount = masteryList.filter((item) => item.mastery_level === 'Operational').length;
  const developingCount = masteryList.filter((item) => item.mastery_level === 'Developing').length;

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'Mastered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-micro font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
            Mastered
          </span>
        );
      case 'Operational':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-micro font-semibold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-300">
            <CheckCircle2 className="h-3.5 w-3.5 text-blue-700" />
            Operational
          </span>
        );
      case 'Developing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-micro font-semibold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
            <AlertCircle className="h-3.5 w-3.5 text-amber-700" />
            Developing
          </span>
        );
      case 'Learning':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-micro font-semibold uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-300">
            <BookOpen className="h-3.5 w-3.5 text-indigo-700" />
            Learning
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-micro font-semibold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
            <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
            Unknown
          </span>
        );
    }
  };

  const getTrendBadge = (trend: string) => {
    switch (trend) {
      case 'Improving':
        return (
          <span className="inline-flex items-center gap-1 text-caption font-semibold text-emerald-700">
            <TrendingUp className="h-3 w-3" />
            Improving
          </span>
        );
      case 'Needs Attention':
        return (
          <span className="inline-flex items-center gap-1 text-caption font-semibold text-rose-600">
            <TrendingDown className="h-3 w-3" />
            Needs Review
          </span>
        );
      case 'Stable':
        return (
          <span className="inline-flex items-center gap-1 text-caption font-semibold text-slate-500">
            <Minus className="h-3 w-3" />
            Stable
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-caption font-medium text-slate-400">
            <Activity className="h-3 w-3" />
            {trend}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-civic-xl border border-slate-200/80 shadow-civic-xs p-6 sm:p-8 space-y-6">
      {/* Header & Metric Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-civic-700" />
            <h2 className="text-section-heading font-semibold text-slate-900 tracking-tight">
              Competency Mastery Breakdown
            </h2>
          </div>
          <p className="text-caption text-slate-500 font-medium">
            Granular competency evidence calculated with 70/30 recency weighting across attempts
          </p>
        </div>

        {/* Quick Filter Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-civic-md gap-1 text-caption font-semibold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-civic-sm transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-civic-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({masteryList.length})
          </button>
          <button
            onClick={() => setFilter('unmastered')}
            className={`px-3 py-1.5 rounded-civic-sm transition-all cursor-pointer ${
              filter === 'unmastered'
                ? 'bg-white text-slate-900 shadow-civic-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Priority ({developingCount + operationalCount})
          </button>
          <button
            onClick={() => setFilter('mastered')}
            className={`px-3 py-1.5 rounded-civic-sm transition-all cursor-pointer ${
              filter === 'mastered'
                ? 'bg-white text-slate-900 shadow-civic-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mastered ({masteredCount})
          </button>
        </div>
      </div>

      {/* Competency Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredList.map((item) => (
          <motion.div
            key={item.competency}
            variants={fadeUpVariants}
            className="rounded-civic-xl border border-slate-200/90 bg-slate-50/50 p-6 space-y-4 hover:border-slate-300 transition-colors"
          >
            {/* Top Row: Competency & Badges */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="text-micro font-semibold uppercase tracking-wider text-civic-700">
                  {item.module_title}
                </div>
                <h3 className="text-section-heading font-semibold text-slate-900 leading-snug">
                  {item.competency}
                </h3>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                {getLevelBadge(item.mastery_level)}
                {getTrendBadge(item.recent_trend)}
              </div>
            </div>

            {/* Score & Progress Bar with 75% Benchmark */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-caption font-medium">
                <span className="text-slate-600">
                  Mastery Evidence:{' '}
                  <strong className="text-slate-900 font-semibold">{item.mastery_score}%</strong>
                </span>
                <span className="text-slate-500 text-caption font-mono">
                  {item.attempts_evaluated > 0
                    ? `${item.attempts_evaluated} attempt${
                        item.attempts_evaluated > 1 ? 's' : ''
                      }`
                    : 'Curriculum phase'}
                </span>
              </div>
              <div className="relative h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.mastery_level === 'Mastered'
                      ? 'bg-emerald-600'
                      : item.mastery_level === 'Operational'
                      ? 'bg-blue-600'
                      : item.mastery_level === 'Developing'
                      ? 'bg-amber-500'
                      : 'bg-indigo-400'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(4, item.mastery_score))}%` }}
                />
                {/* 75% Target Line Indicator */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-slate-700/60 z-10"
                  style={{ left: '75%' }}
                  title="75% Certification Threshold"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <Link
                to={item.deep_link}
                className="inline-flex items-center gap-1.5 text-caption font-semibold text-civic-700 hover:text-civic-800 bg-civic-50 hover:bg-civic-100/80 px-3 py-1.5 rounded-civic-md border border-civic-200/80 transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>{item.target_section_title ? `Review Section ${item.target_section_index + 1}` : 'Review Section'}</span>
              </Link>
              <Link
                to={`/tutor?moduleId=${item.module_id}&competency=${encodeURIComponent(
                  item.competency
                )}&mode=remediation&prompt=${encodeURIComponent(item.tutor_prompt)}`}
                className="inline-flex items-center gap-1.5 text-caption font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 px-3 py-1.5 rounded-civic-md border border-slate-200 shadow-civic-xs transition-colors"
              >
                <Bot className="h-3.5 w-3.5 text-civic-700" />
                <span>Practice in Copilot</span>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CompetencyMasteryCard;
