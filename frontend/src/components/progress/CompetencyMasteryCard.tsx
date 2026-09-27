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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
            Mastered
          </span>
        );
      case 'Operational':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-50 text-[#0E50B0] border border-blue-200">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#0E50B0]" />
            Operational
          </span>
        );
      case 'Developing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none text-[10px] font-mono font-bold uppercase tracking-wider bg-orange-50 text-[#AF411E] border border-orange-200">
            <AlertCircle className="h-3.5 w-3.5 text-[#AF411E]" />
            Developing
          </span>
        );
      case 'Learning':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-50 text-[#09090B] border border-slate-200">
            <BookOpen className="h-3.5 w-3.5 text-[#0E50B0]" />
            Learning
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none text-[10px] font-mono font-bold uppercase tracking-wider bg-[#FAFAFA] text-[#71717A] border border-[#E4E4E7]">
            <HelpCircle className="h-3.5 w-3.5 text-[#71717A]" />
            Unknown
          </span>
        );
    }
  };

  const getTrendBadge = (trend: string) => {
    switch (trend) {
      case 'Improving':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-700">
            <TrendingUp className="h-3 w-3" />
            Improving
          </span>
        );
      case 'Needs Attention':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#AF411E]">
            <TrendingDown className="h-3 w-3" />
            Needs Review
          </span>
        );
      case 'Stable':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-[#71717A]">
            <Minus className="h-3 w-3" />
            Stable
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-[#71717A]">
            <Activity className="h-3 w-3" />
            {trend}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-none border border-[#E4E4E7] shadow-none p-6 sm:p-8 space-y-6">
      {/* Header & Metric Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E4E4E7] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-[#0E50B0]" />
            <h2 className="font-sans font-black text-xl uppercase tracking-tight text-[#09090B]">
              Competency Mastery Breakdown
            </h2>
          </div>
          <p className="text-caption text-[#71717A]">
            Granular competency evidence calculated with 70/30 recency weighting across attempts
          </p>
        </div>

        {/* Quick Filter Tabs */}
        <div className="flex items-center bg-[#FAFAFA] p-1 border border-[#E4E4E7] gap-1 text-[11px] font-mono font-bold uppercase">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-[#09090B] text-white'
                : 'text-[#71717A] hover:text-[#09090B]'
            }`}
          >
            All ({masteryList.length})
          </button>
          <button
            onClick={() => setFilter('unmastered')}
            className={`px-3 py-1 transition-all cursor-pointer ${
              filter === 'unmastered'
                ? 'bg-[#09090B] text-white'
                : 'text-[#71717A] hover:text-[#09090B]'
            }`}
          >
            Priority ({developingCount + operationalCount})
          </button>
          <button
            onClick={() => setFilter('mastered')}
            className={`px-3 py-1 transition-all cursor-pointer ${
              filter === 'mastered'
                ? 'bg-[#09090B] text-white'
                : 'text-[#71717A] hover:text-[#09090B]'
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
            className="border border-[#E4E4E7] bg-white p-6 space-y-4 hover:border-[#A1A1AA] transition-colors shadow-none"
          >
            {/* Top Row: Competency & Badges */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#0E50B0]">
                  {item.module_title}
                </div>
                <h3 className="font-sans font-bold text-base uppercase tracking-tight text-[#09090B] leading-snug">
                  {item.competency}
                </h3>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                {getLevelBadge(item.mastery_level)}
                {getTrendBadge(item.recent_trend)}
              </div>
            </div>

            {/* Score & Progress Bar with 75% Benchmark */}
            <div className="space-y-1.5 bg-[#FAFAFA] p-3 border border-[#E4E4E7]">
              <div className="flex items-center justify-between text-caption font-medium">
                <span className="text-[#71717A]">
                  Mastery Evidence:{' '}
                  <strong className="text-[#09090B] font-mono font-bold">{item.mastery_score}%</strong>
                </span>
                <span className="text-[#71717A] text-[11px] font-mono">
                  {item.attempts_evaluated > 0
                    ? `${item.attempts_evaluated} attempt${
                        item.attempts_evaluated > 1 ? 's' : ''
                      }`
                    : 'Curriculum phase'}
                </span>
              </div>
              <div className="relative h-1.5 w-full bg-[#E4E4E7] overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    item.mastery_level === 'Mastered'
                      ? 'bg-emerald-600'
                      : item.mastery_level === 'Operational'
                      ? 'bg-[#0E50B0]'
                      : item.mastery_level === 'Developing'
                      ? 'bg-[#AF411E]'
                      : 'bg-[#71717A]'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(4, item.mastery_score))}%` }}
                />
                {/* 75% Target Line Indicator */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-[#09090B] z-10"
                  style={{ left: '75%' }}
                  title="75% Certification Threshold"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <Link
                to={item.deep_link}
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase font-bold text-[#09090B] hover:text-[#0E50B0] bg-[#FAFAFA] hover:bg-white px-3 py-1.5 border border-[#E4E4E7] transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5 text-[#0E50B0]" />
                <span>{item.target_section_title ? `Review Section ${item.target_section_index + 1}` : 'Review Section'}</span>
              </Link>
              <Link
                to={`/tutor?moduleId=${item.module_id}&competency=${encodeURIComponent(
                  item.competency
                )}&mode=remediation&prompt=${encodeURIComponent(item.tutor_prompt)}`}
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase font-bold text-[#09090B] hover:text-[#0E50B0] bg-[#FAFAFA] hover:bg-white px-3 py-1.5 border border-[#E4E4E7] transition-colors"
              >
                <Bot className="h-3.5 w-3.5 text-[#0E50B0]" />
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
