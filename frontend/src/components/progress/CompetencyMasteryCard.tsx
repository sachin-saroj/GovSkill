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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-sage-500/15 text-sage-800 border border-sage-500/30">
            <ShieldCheck className="h-3.5 w-3.5 text-sage-700" />
            Mastered
          </span>
        );
      case 'Operational':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-azure-500/15 text-azure-800 border border-azure-500/30">
            <CheckCircle2 className="h-3.5 w-3.5 text-azure-700" />
            Operational
          </span>
        );
      case 'Developing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-500/15 text-rose-800 border border-rose-500/30">
            <AlertCircle className="h-3.5 w-3.5 text-rose-700" />
            Developing
          </span>
        );
      case 'Learning':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-surface text-ink border border-border-warm">
            <BookOpen className="h-3.5 w-3.5 text-azure-700" />
            Learning
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-surface-light text-ink-muted border border-border-warm">
            <HelpCircle className="h-3.5 w-3.5 text-ink-muted" />
            Unknown
          </span>
        );
    }
  };

  const getTrendBadge = (trend: string) => {
    switch (trend) {
      case 'Improving':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-sage-700">
            <TrendingUp className="h-3 w-3" />
            Improving
          </span>
        );
      case 'Needs Attention':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-rose-700">
            <TrendingDown className="h-3 w-3" />
            Needs Review
          </span>
        );
      case 'Stable':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-ink-muted">
            <Minus className="h-3 w-3" />
            Stable
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-ink-muted">
            <Activity className="h-3 w-3" />
            {trend}
          </span>
        );
    }
  };

  return (
    <div className="bg-surface rounded-2xl border border-border-warm shadow-none p-6 sm:p-8 space-y-6">
      {/* Header & Metric Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border-warm pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-azure-700" />
            <h2 className="font-serif font-bold text-xl tracking-tight text-ink">
              Competency Mastery Breakdown
            </h2>
          </div>
          <p className="text-caption text-ink-muted">
            Granular competency evidence calculated with 70/30 recency weighting across attempts
          </p>
        </div>

        {/* Quick Filter Tabs */}
        <div className="flex items-center bg-surface-light p-1 border border-border-warm rounded-full gap-1 text-[11px] font-mono font-bold uppercase">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1 rounded-full transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-ink text-surface-light'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            All ({masteryList.length})
          </button>
          <button
            onClick={() => setFilter('unmastered')}
            className={`px-3.5 py-1 rounded-full transition-all cursor-pointer ${
              filter === 'unmastered'
                ? 'bg-ink text-surface-light'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            Priority ({developingCount + operationalCount})
          </button>
          <button
            onClick={() => setFilter('mastered')}
            className={`px-3.5 py-1 rounded-full transition-all cursor-pointer ${
              filter === 'mastered'
                ? 'bg-ink text-surface-light'
                : 'text-ink-muted hover:text-ink'
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
            className="border border-border-warm bg-surface-light rounded-xl p-5 space-y-4 hover:border-ink-muted/30 transition-all shadow-none"
          >
            {/* Top Row: Competency & Badges */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="text-[10px] font-mono font-bold uppercase tracking-[0.16em] text-azure-700">
                  {item.module_title}
                </div>
                <h3 className="font-sans font-bold text-base text-ink tracking-tight leading-snug">
                  {item.competency}
                </h3>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                {getLevelBadge(item.mastery_level)}
                {getTrendBadge(item.recent_trend)}
              </div>
            </div>

            {/* Score & Progress Bar with 75% Benchmark */}
            <div className="space-y-1.5 bg-surface p-3.5 rounded-xl border border-border-warm">
              <div className="flex items-center justify-between text-caption font-medium">
                <span className="text-ink-muted">
                  Mastery Evidence:{' '}
                  <strong className="text-ink font-mono font-bold">{item.mastery_score}%</strong>
                </span>
                <span className="text-ink-muted text-[11px] font-mono">
                  {item.attempts_evaluated > 0
                    ? `${item.attempts_evaluated} attempt${
                        item.attempts_evaluated > 1 ? 's' : ''
                      }`
                    : 'Curriculum phase'}
                </span>
              </div>
              <div className="relative h-2 w-full bg-surface-strong rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.mastery_level === 'Mastered'
                      ? 'bg-sage-600'
                      : item.mastery_level === 'Operational'
                      ? 'bg-azure-600'
                      : item.mastery_level === 'Developing'
                      ? 'bg-rose-600'
                      : 'bg-ink-muted/50'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(4, item.mastery_score))}%` }}
                />
                {/* 75% Target Line Indicator */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-ink z-10"
                  style={{ left: '75%' }}
                  title="75% Certification Threshold"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <Link
                to={item.deep_link}
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase font-bold text-ink hover:text-azure-700 bg-surface hover:bg-surface-strong px-3 py-1.5 rounded-full border border-border-warm transition-colors min-h-[36px]"
              >
                <BookOpen className="h-3.5 w-3.5 text-azure-700" />
                <span>{item.target_section_title ? `Review Section ${item.target_section_index + 1}` : 'Review Section'}</span>
              </Link>
              <Link
                to={`/tutor?moduleId=${item.module_id}&competency=${encodeURIComponent(
                  item.competency
                )}&mode=remediation&prompt=${encodeURIComponent(item.tutor_prompt)}`}
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase font-bold text-ink hover:text-azure-700 bg-surface hover:bg-surface-strong px-3 py-1.5 rounded-full border border-border-warm transition-colors min-h-[36px]"
              >
                <Bot className="h-3.5 w-3.5 text-azure-700" />
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
