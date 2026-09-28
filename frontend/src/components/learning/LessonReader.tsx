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
    <Card className="bg-surface border border-border-warm shadow-none p-6 sm:p-8 space-y-6 rounded-2xl" variant="default">
      {/* 1. Header Toolbar & Progress Metrics */}
      <div className="space-y-4 pb-5 border-b border-border-warm">
        <div className="flex flex-wrap items-center justify-between gap-3 text-caption">
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1 bg-surface-light border border-border-warm text-ink font-mono font-bold text-[11px] uppercase tracking-[0.14em] rounded-full">
              Section {safeIndex + 1} of {totalSections}
            </span>
            <span className="inline-flex items-center gap-1.5 text-ink-muted font-medium text-caption font-mono">
              <Clock className="h-3.5 w-3.5 text-azure-700" />
              <span>~{readingTimeMinutes} min read</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isCurrentCompleted ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-sage-800 bg-sage-500/15 px-3 py-1 border border-sage-500/30 rounded-full">
                <CheckCircle2 className="h-3.5 w-3.5 text-sage-700" />
                <span>Lessons Completed</span>
              </span>
            ) : (
              <span className="text-caption font-mono font-semibold text-ink-muted">
                {progressPercent}% curriculum explored
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar Strip */}
        <div className="w-full bg-surface-strong border border-border-warm h-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isCurrentCompleted ? 'bg-sage-600' : 'bg-azure-600'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Section Jump Tabs */}
        <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1 scrollbar-none">
          {sections.map((sec, idx) => {
            const isCurrent = idx === safeIndex;
            const isPast = isCurrentCompleted || idx < safeIndex;

            let tabStyle = 'bg-surface-light text-ink-muted hover:text-ink border border-border-warm';
            if (isCurrent) {
              tabStyle = 'bg-ink text-on-ink border-ink font-bold shadow-sm';
            } else if (isPast) {
              tabStyle = 'bg-sage-500/15 text-sage-800 border-sage-500/30 hover:bg-sage-500/25 font-medium';
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSectionChange(idx)}
                className={`px-4 py-2 rounded-full text-caption whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider ${tabStyle}`}
              >
                {isPast && !isCurrent && <CheckCircle2 className="h-3.5 w-3.5 text-sage-700 shrink-0" />}
                <span>{idx + 1}. {sec.displayTitle}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Editorial Curriculum Plate */}
      <div className="relative w-full h-44 sm:h-52 overflow-hidden rounded-xl border border-border-warm bg-surface-light">
        <img
          src="/illustrations/curriculum_lesson_folio.jpg"
          alt="Administrative Curriculum Folio"
          className="w-full h-full object-cover object-center grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 bg-ink/90 text-on-ink text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full font-bold">
          Standard Civic Curriculum
        </div>
      </div>

      {/* 2. Operational Learning Objective Box */}
      <div className="bg-surface-light border border-border-warm rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-ink font-mono text-[11px] font-bold uppercase tracking-wider">
          <Target className="h-4 w-4 text-azure-700 shrink-0" />
          <span>Operational Learning Objective</span>
        </div>
        <p className="text-caption text-ink-muted font-normal leading-relaxed pl-6">
          {learningObjective}
        </p>
      </div>

      {/* 3. Section Title & Core Procedural Guidance */}
      <div className="space-y-4 pt-1">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-ink tracking-tight leading-snug">
            {activeSection.rawTitle}
          </h2>

          {/* Contextual Ask Tutor Button */}
          <button
            type="button"
            onClick={handleAskTutor}
            className="shrink-0 hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-light hover:bg-surface-strong text-ink border border-border-warm text-[11px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shadow-none min-h-[40px]"
            title="Ask AI Tutor about this specific section"
          >
            <Bot className="h-4 w-4 text-azure-700" />
            <span>Ask Tutor About Section</span>
          </button>
        </div>

        {/* Procedural Text Body */}
        <div className="text-body text-ink leading-relaxed whitespace-pre-line space-y-4 font-normal max-w-prose">
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
          className="w-full flex items-center justify-center gap-2 p-3 rounded-full bg-surface-light text-ink border border-border-warm text-xs font-mono font-bold uppercase tracking-wider cursor-pointer min-h-[44px]"
        >
          <Bot className="h-4 w-4 text-azure-700" />
          <span>Ask AI Tutor About This Section</span>
        </button>
      </div>

      {/* 6. Navigation Controls & Completion Action */}
      <div className="pt-6 border-t border-border-warm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Previous / Next Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrevSection}
              disabled={safeIndex === 0}
              className="flex-1 sm:flex-initial px-5 py-2.5 text-[12px] font-mono font-bold uppercase tracking-wider rounded-full border border-border-warm bg-surface-light hover:bg-surface-strong text-ink disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px]"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous Section</span>
            </button>

            {safeIndex < totalSections - 1 && (
              <button
                type="button"
                onClick={handleNextSection}
                className="flex-1 sm:flex-initial px-5 py-2.5 text-[12px] font-mono font-bold uppercase tracking-wider rounded-full bg-ink hover:bg-ink-muted text-surface-light flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px]"
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
              className={`w-full sm:w-auto px-6 py-2.5 text-[12px] font-mono font-bold uppercase tracking-wider rounded-full flex items-center justify-center gap-2 transition-all min-h-[44px] ${
                isCurrentCompleted
                  ? 'bg-sage-500/15 text-sage-800 border border-sage-500/30 cursor-default'
                  : 'bg-ink text-surface-light hover:bg-ink-muted cursor-pointer'
              }`}
            >
              {isMarkingComplete ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving Completion...</span>
                </>
              ) : isCurrentCompleted ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-sage-700" />
                  <span>Lessons Completed {completedAt ? `(${new Date(completedAt).toLocaleDateString()})` : ''}</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-azure-400" />
                  <span>Mark All Lessons Completed</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Recommended Next Action Callout (After completing or on last section) */}
        {isCurrentCompleted && (
          <div className="bg-surface-light border border-azure-500/30 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-ink font-mono font-bold text-xs uppercase tracking-wider">
                <Award className="h-4 w-4 text-azure-700" />
                <span>Next Step: Validate Your Competency</span>
              </div>
              <p className="text-body text-ink-muted font-normal">
                You have completed the official curriculum. Take the scored assessment to earn your verified credential.
              </p>
            </div>

            <Link
              to={`/quiz/${module.id}`}
              className="px-6 py-3 rounded-full bg-ink hover:bg-ink-muted text-surface-light text-[12px] font-mono font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 transition-colors"
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
