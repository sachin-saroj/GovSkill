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
    <Card className="bg-white border-slate-200 shadow-civic-md p-6 sm:p-8 space-y-6 rounded-civic-xl" variant="elevated">
      {/* 1. Header Toolbar & Progress Metrics */}
      <div className="space-y-3 pb-5 border-b border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3 text-caption">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-civic-sm bg-civic-100 text-civic-900 font-semibold text-micro uppercase tracking-wider">
              Section {safeIndex + 1} of {totalSections}
            </span>
            <span className="inline-flex items-center gap-1 text-slate-500 font-medium text-caption">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>~{readingTimeMinutes} min read</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isCurrentCompleted ? (
              <span className="inline-flex items-center gap-1 text-micro font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-civic-md border border-emerald-200">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Lessons Completed</span>
              </span>
            ) : (
              <span className="text-caption font-semibold text-slate-500">
                {progressPercent}% curriculum explored
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar Strip */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isCurrentCompleted ? 'bg-emerald-600' : 'bg-civic-700'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Section Jump Tabs */}
        <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1 scrollbar-none">
          {sections.map((sec, idx) => {
            const isCurrent = idx === safeIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSectionChange(idx)}
                className={`px-3 py-1.5 rounded-civic-md text-caption font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-civic-900 text-white shadow-civic-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {idx + 1}. {sec.displayTitle}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Operational Learning Objective Box */}
      <div className="rounded-civic-xl bg-civic-50/80 border border-civic-200/80 p-4 space-y-1.5 shadow-civic-xs">
        <div className="flex items-center gap-2 text-civic-900 font-semibold text-caption">
          <Target className="h-4 w-4 text-civic-700 shrink-0" />
          <span>Operational Learning Objective</span>
        </div>
        <p className="text-caption text-slate-700 font-normal leading-relaxed pl-6">
          {learningObjective}
        </p>
      </div>

      {/* 3. Section Title & Core Procedural Guidance */}
      <div className="space-y-4 pt-1">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-page-title font-semibold text-civic-950 tracking-tight leading-snug">
            {activeSection.rawTitle}
          </h2>

          {/* Contextual Ask Tutor Button */}
          <button
            type="button"
            onClick={handleAskTutor}
            className="shrink-0 hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-civic-md bg-slate-100 hover:bg-blue-50 text-civic-800 hover:text-civic-950 border border-slate-200 hover:border-civic-300 text-caption font-semibold transition-all cursor-pointer shadow-civic-xs"
            title="Ask AI Tutor about this specific section"
          >
            <Bot className="h-3.5 w-3.5 text-civic-700" />
            <span>Ask Tutor About Section</span>
          </button>
        </div>

        {/* Procedural Text Body */}
        <div className="text-body text-slate-700 leading-relaxed whitespace-pre-line space-y-3 font-normal">
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
          className="w-full flex items-center justify-center gap-2 p-2.5 rounded-civic-md bg-blue-50 text-civic-900 border border-civic-200 text-caption font-semibold cursor-pointer"
        >
          <Bot className="h-4 w-4 text-civic-700" />
          <span>Ask AI Tutor About This Section</span>
        </button>
      </div>

      {/* 6. Navigation Controls & Completion Action */}
      <div className="pt-6 border-t border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Previous / Next Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrevSection}
              disabled={safeIndex === 0}
              className="flex-1 sm:flex-initial px-4 py-2 text-caption font-semibold rounded-civic-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-civic-xs"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous Section</span>
            </button>

            {safeIndex < totalSections - 1 && (
              <button
                type="button"
                onClick={handleNextSection}
                className="flex-1 sm:flex-initial px-4 py-2 text-caption font-semibold rounded-civic-md bg-civic-800 hover:bg-civic-900 text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-civic-xs"
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
              className={`w-full sm:w-auto px-5 py-2.5 text-caption font-semibold rounded-civic-md flex items-center justify-center gap-2 transition-all shadow-civic-xs ${
                isCurrentCompleted
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                  : 'bg-civic-800 text-white hover:bg-civic-900 active:scale-95 cursor-pointer'
              }`}
            >
              {isMarkingComplete ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving Completion...</span>
                </>
              ) : isCurrentCompleted ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                  <span>Lessons Completed {completedAt ? `(${new Date(completedAt).toLocaleDateString()})` : ''}</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-saffron-400" />
                  <span>Mark All Lessons Completed</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Recommended Next Action Callout (After completing or on last section) */}
        {isCurrentCompleted && (
          <div className="rounded-civic-xl bg-emerald-50/80 border border-emerald-200 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-emerald-900 font-semibold text-caption">
                <Award className="h-4 w-4 text-emerald-700" />
                <span>Next Step: Validate Your Competency</span>
              </div>
              <p className="text-caption text-emerald-800 font-normal">
                You have completed the official curriculum. Take the scored assessment to earn your verified credential.
              </p>
            </div>

            <Link
              to={`/quiz/${module.id}`}
              className="px-4 py-2 rounded-civic-md bg-emerald-700 hover:bg-emerald-800 text-white text-caption font-semibold flex items-center gap-1.5 shrink-0 shadow-civic-xs"
            >
              <span>Take Scored Quiz</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
};

export default LessonReader;
