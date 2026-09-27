import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Module } from '@/types';
import Card from '@/components/ui/Card';
import ScenarioCallout from './ScenarioCallout';
import SectionSelfCheck from './SectionSelfCheck';
import {
  CheckCircle2,
  Sparkles,
  Loader2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Bot,
  Award,
  Target,
  ArrowRight,
} from 'lucide-react';

interface LessonReaderProps {
  module: Module;
  isCurrentCompleted: boolean;
  isMarkingComplete: boolean;
  onCompleteLessons: () => void;
  currentSectionIndex: number;
  onSectionChange: (index: number) => void;
  completedAt?: string;
  startedAt?: string;
}

export const LessonReader: React.FC<LessonReaderProps> = ({
  module,
  isCurrentCompleted,
  isMarkingComplete,
  onCompleteLessons,
  currentSectionIndex,
  onSectionChange,
  completedAt,
}) => {

  const navigate = useNavigate();

  const sections = useMemo(() => {
    return module.content
      .split('# ')
      .filter(Boolean)
      .map((section) => {
        const lines = section.trim().split('\n');
        const rawTitle = lines[0].trim();
        const body = lines.slice(1).join('\n').trim();
        const displayTitle = rawTitle.replace(/^Lesson\s+\d+:\s*/i, '');
        return { rawTitle, displayTitle, body };
      });
  }, [module.content]);

  const totalSections = Math.max(sections.length, 1);
  const safeIndex = Math.min(Math.max(currentSectionIndex, 0), totalSections - 1);
  const activeSection = sections[safeIndex] || {
    rawTitle: 'General Overview',
    displayTitle: 'General Overview',
    body: module.content,
  };

  // Calculate estimated reading time for current section (~180 wpm)
  const readingTimeMinutes = useMemo(() => {
    const words = (activeSection.body + ' ' + activeSection.displayTitle).split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 150));
  }, [activeSection]);

  // Section completion progress
  const progressPercent = Math.round(((safeIndex + 1) / totalSections) * 100);

  // Derive learning objective
  const learningObjective = useMemo(() => {
    const titleLower = activeSection.displayTitle.toLowerCase();
    if (titleLower.includes('checklist') || titleLower.includes('verification')) {
      return 'Master statutory verification criteria and standard document validation standards.';
    }
    if (titleLower.includes('error') || titleLower.includes('prevention')) {
      return 'Identify common data discrepancies and apply procedural controls to avoid audit errors.';
    }
    if (titleLower.includes('security') || titleLower.includes('privacy') || titleLower.includes('network')) {
      return 'Uphold citizen PII confidentiality, workstation security, and statutory compliance.';
    }
    if (titleLower.includes('sla') || titleLower.includes('escalation')) {
      return 'Track citizen service turnaround times and execute timely supervisor escalation workflows.';
    }
    if (titleLower.includes('archival') || titleLower.includes('retention')) {
      return 'Apply standardized archival metadata tags and statutory document retention schedules.';
    }
    return `Understand standard operational protocols and official workflows for ${activeSection.displayTitle}.`;
  }, [activeSection.displayTitle]);

  const handleAskTutor = () => {
    const promptText = `Regarding ${module.title} (${activeSection.rawTitle}): Can you explain the practical steps and verification rules for this section?`;
    navigate(`/tutor?module=${module.id}&prompt=${encodeURIComponent(promptText)}`);
  };

  const handleNextSection = () => {
    if (safeIndex < totalSections - 1) {
      onSectionChange(safeIndex + 1);
    }
  };

  const handlePrevSection = () => {
    if (safeIndex > 0) {
      onSectionChange(safeIndex - 1);
    }
  };

  return (
    <Card className="bg-white border border-[#E4E4E7] shadow-none p-6 sm:p-8 space-y-6 rounded-none" variant="default">
      {/* 1. Header Toolbar & Progress Metrics */}
      <div className="space-y-4 pb-5 border-b border-[#E4E4E7]">
        <div className="flex flex-wrap items-center justify-between gap-3 text-caption">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-black text-white font-mono font-bold text-[11px] uppercase tracking-[0.14em]">
              Section {safeIndex + 1} of {totalSections}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[#71717A] font-medium text-caption font-mono">
              <Clock className="h-3.5 w-3.5 text-[#0E50B0]" />
              <span>~{readingTimeMinutes} min read</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isCurrentCompleted ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 border border-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Lessons Completed</span>
              </span>
            ) : (
              <span className="text-caption font-mono font-semibold text-[#71717A]">
                {progressPercent}% curriculum explored
              </span>
            )}
          </div>
        </div>

        {/* Hairline Progress Bar Strip */}
        <div className="w-full bg-zinc-100 border border-[#E4E4E7] h-1.5 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isCurrentCompleted ? 'bg-emerald-600' : 'bg-[#0E50B0]'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Section Jump Tabs */}
        <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1 scrollbar-none">
          {sections.map((sec, idx) => {
            const isCurrent = idx === safeIndex;
            const isPast = isCurrentCompleted || idx < safeIndex;

            let tabStyle = 'bg-white text-[#71717A] hover:text-black border border-[#E4E4E7]';
            if (isCurrent) {
              tabStyle = 'bg-black text-white border-black font-bold';
            } else if (isPast) {
              tabStyle = 'bg-zinc-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 font-medium';
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSectionChange(idx)}
                className={`px-4 py-2 rounded-none text-caption whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider ${tabStyle}`}
              >
                {isPast && !isCurrent && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />}
                <span>{idx + 1}. {sec.displayTitle}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Editorial Curriculum Plate */}
      <div className="relative w-full h-44 sm:h-52 overflow-hidden border border-[#E4E4E7] bg-zinc-100">
        <img
          src="/illustrations/curriculum_lesson_folio.jpg"
          alt="Administrative Curriculum Folio"
          className="w-full h-full object-cover object-center grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 bg-black text-white text-[10px] font-mono uppercase tracking-widest px-3 py-1 font-bold">
          Standard Civic Curriculum
        </div>
      </div>

      {/* 2. Operational Learning Objective Box */}
      <div className="bg-white border border-[#E4E4E7] p-4 space-y-2">
        <div className="flex items-center gap-2 text-black font-mono text-[11px] font-bold uppercase tracking-wider">
          <Target className="h-4 w-4 text-[#0E50B0] shrink-0" />
          <span>Operational Learning Objective</span>
        </div>
        <p className="text-caption text-[#71717A] font-normal leading-relaxed pl-6">
          {learningObjective}
        </p>
      </div>

      {/* 3. Section Title & Core Procedural Guidance */}
      <div className="space-y-4 pt-1">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-sans font-black text-2xl sm:text-3xl text-black tracking-tight uppercase leading-snug">
            {activeSection.rawTitle}
          </h2>

          {/* Contextual Ask Tutor Button */}
          <button
            type="button"
            onClick={handleAskTutor}
            className="shrink-0 hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-none bg-white hover:bg-zinc-100 text-black border border-[#E4E4E7] text-[11px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shadow-none min-h-[40px]"
            title="Ask AI Tutor about this specific section"
          >
            <Bot className="h-4 w-4 text-[#0E50B0]" />
            <span>Ask Tutor About Section</span>
          </button>
        </div>

        {/* Procedural Text Body */}
        <div className="text-body text-[#18181B] leading-relaxed whitespace-pre-line space-y-4 font-normal">
          {activeSection.body}
        </div>
      </div>

      {/* 4. Practical Scenario & Common Mistakes Callout */}
      <ScenarioCallout
        moduleTitle={module.title}
        sectionIndex={safeIndex}
        sectionTitle={activeSection.rawTitle}
      />

      {/* 5. Interactive Section Understanding Check */}
      <SectionSelfCheck
        moduleTitle={module.title}
        sectionIndex={safeIndex}
        sectionTitle={activeSection.rawTitle}
      />

      {/* Mobile Ask Tutor CTA */}
      <div className="block sm:hidden">
        <button
          type="button"
          onClick={handleAskTutor}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-none bg-white text-black border border-[#E4E4E7] text-xs font-mono font-bold uppercase tracking-wider cursor-pointer min-h-[44px]"
        >
          <Bot className="h-4 w-4 text-[#0E50B0]" />
          <span>Ask AI Tutor About This Section</span>
        </button>
      </div>

      {/* 6. Navigation Controls & Completion Action */}
      <div className="pt-6 border-t border-[#E4E4E7] space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Previous / Next Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrevSection}
              disabled={safeIndex === 0}
              className="flex-1 sm:flex-initial px-5 py-2.5 text-[12px] font-mono font-bold uppercase tracking-wider rounded-none border border-[#E4E4E7] bg-white hover:bg-zinc-100 text-black disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px]"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous Section</span>
            </button>

            {safeIndex < totalSections - 1 && (
              <button
                type="button"
                onClick={handleNextSection}
                className="flex-1 sm:flex-initial px-5 py-2.5 text-[12px] font-mono font-bold uppercase tracking-wider rounded-none bg-black hover:bg-[#0E50B0] text-white flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px]"
              >
                <span>Next Section</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Mark Complete / Completed State */}
          <div className="w-full sm:w-auto flex items-center justify-end">
            <button
              type="button"
              onClick={onCompleteLessons}
              disabled={isMarkingComplete || isCurrentCompleted}
              className={`w-full sm:w-auto px-6 py-2.5 text-[12px] font-mono font-bold uppercase tracking-wider rounded-none flex items-center justify-center gap-2 transition-all min-h-[44px] ${
                isCurrentCompleted
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 cursor-default'
                  : 'bg-black text-white hover:bg-[#0E50B0] cursor-pointer'
              }`}
            >
              {isMarkingComplete ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving Completion...</span>
                </>
              ) : isCurrentCompleted ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Lessons Completed {completedAt ? `(${new Date(completedAt).toLocaleDateString()})` : ''}</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-[#0E50B0]" />
                  <span>Mark All Lessons Completed</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Recommended Next Action Callout (After completing or on last section) */}
        {isCurrentCompleted && (
          <div className="bg-white border border-[#0E50B0] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-black font-mono font-bold text-xs uppercase tracking-wider">
                <Award className="h-4 w-4 text-[#0E50B0]" />
                <span>Next Step: Validate Your Competency</span>
              </div>
              <p className="text-body text-[#71717A] font-normal">
                You have completed the official curriculum. Take the scored assessment to earn your verified credential.
              </p>
            </div>

            <Link
              to={`/quiz/${module.id}`}
              className="px-6 py-3 rounded-none bg-black hover:bg-[#0E50B0] text-white text-[12px] font-mono font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 transition-colors"
            >
              <span>Take Scored Quiz</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
};

export default LessonReader;
