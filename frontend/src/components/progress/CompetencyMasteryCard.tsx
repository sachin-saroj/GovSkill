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
    <div className="bg-[#EDE4D0] rounded-2xl border border-[#D9CFBB] shadow-sm p-6 sm:p-8 space-y-6">
      {/* Header & Metric Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#D9CFBB] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-[#C9A24A]" />
            <h2 className="font-serif font-bold text-xl text-[#0A0A0A] tracking-tight">
              Competency Mastery Breakdown
            </h2>
          </div>
          <p className="text-caption text-[#6B6357] font-medium">
            Granular competency evidence calculated with 70/30 recency weighting across attempts
          </p>
        </div>

        {/* Quick Filter Tabs */}
        <div className="flex items-center bg-[#E4D9C3] p-1 rounded-full border border-[#D9CFBB] gap-1 text-[12px] font-mono">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-[#0A0A0A] text-[#F5EFE0] shadow-sm'
                : 'text-[#6B6357] hover:text-[#0A0A0A]'
            }`}
          >
            All ({masteryList.length})
          </button>
          <button
            onClick={() => setFilter('unmastered')}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
              filter === 'unmastered'
                ? 'bg-[#0A0A0A] text-[#F5EFE0] shadow-sm'
                : 'text-[#6B6357] hover:text-[#0A0A0A]'
            }`}
          >
            Priority ({developingCount + operationalCount})
          </button>
          <button
            onClick={() => setFilter('mastered')}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
              filter === 'mastered'
                ? 'bg-[#0A0A0A] text-[#F5EFE0] shadow-sm'
                : 'text-[#6B6357] hover:text-[#0A0A0A]'
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
            className="rounded-xl border border-[#D9CFBB] bg-[#F5EFE0] p-6 space-y-4 hover:border-[#0A0A0A]/40 transition-colors shadow-sm"
          >
            {/* Top Row: Competency & Badges */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="text-[10px] font-mono font-semibold uppercase tracking-[0.14em] text-[#C97B5A]">
                  {item.module_title}
                </div>
                <h3 className="font-serif font-bold text-base text-[#0A0A0A] leading-snug">
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
                <span className="text-[#6B6357]">
                  Mastery Evidence:{' '}
                  <strong className="text-[#0A0A0A] font-mono font-semibold">{item.mastery_score}%</strong>
                </span>
                <span className="text-[#6B6357] text-caption font-mono">
                  {item.attempts_evaluated > 0
                    ? `${item.attempts_evaluated} attempt${
                        item.attempts_evaluated > 1 ? 's' : ''
                      }`
                    : 'Curriculum phase'}
                </span>
              </div>
              <div className="relative h-2 w-full bg-[#E0D5BE] border border-[#D9CFBB]/60 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.mastery_level === 'Mastered'
                      ? 'bg-[#2A5B4A]'
                      : item.mastery_level === 'Operational'
                      ? 'bg-[#0A0A0A]'
                      : item.mastery_level === 'Developing'
                      ? 'bg-[#C97B5A]'
                      : 'bg-[#6B6357]'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(4, item.mastery_score))}%` }}
                />
                {/* 75% Target Line Indicator */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-[#0A0A0A] z-10"
                  style={{ left: '75%' }}
                  title="75% Certification Threshold"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <Link
                to={item.deep_link}
                className="inline-flex items-center gap-1.5 text-caption font-medium text-[#0A0A0A] hover:text-[#C97B5A] bg-[#EDE4D0] hover:bg-[#E4D9C3] px-3 py-1.5 rounded-full border border-[#D9CFBB] transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5 text-[#C9A24A]" />
                <span>{item.target_section_title ? `Review Section ${item.target_section_index + 1}` : 'Review Section'}</span>
              </Link>
              <Link
                to={`/tutor?moduleId=${item.module_id}&competency=${encodeURIComponent(
                  item.competency
                )}&mode=remediation&prompt=${encodeURIComponent(item.tutor_prompt)}`}
                className="inline-flex items-center gap-1.5 text-caption font-medium text-[#0A0A0A] hover:text-[#C97B5A] bg-[#EDE4D0] hover:bg-[#E4D9C3] px-3 py-1.5 rounded-full border border-[#D9CFBB] transition-colors"
              >
                <Bot className="h-3.5 w-3.5 text-[#C97B5A]" />
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
