import React from 'react';
import { Link } from 'react-router-dom';
import { SkillGapItem } from '@/types';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { AlertCircle, ArrowRight, CheckCircle2, ShieldAlert, Target, Bot, BookOpen } from 'lucide-react';

interface SkillGapsCardProps {
  gaps: SkillGapItem[];
}

export const SkillGapsCard: React.FC<SkillGapsCardProps> = ({ gaps }) => {
  if (!gaps || gaps.length === 0) {
    return (
      <Card className="p-6 sm:p-8 rounded-2xl border border-[#D9CFBB] bg-[#EDE4D0] shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-[#2A5B4A]/10 text-[#2A5B4A] border border-[#2A5B4A]/30 shrink-0">
            <CheckCircle2 className="h-5 w-5 text-[#2A5B4A]" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-[#0A0A0A]">
              No Operational Skill Gaps Detected
            </h3>
            <p className="text-body text-[#6B6357] leading-relaxed font-normal">
              All active training competencies meet or exceed the mandatory 75% certification standard. Maintain regular review to stay operationally ready.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ShieldAlert className="h-4 w-4 text-[#C97B5A]" />
        <h3 className="font-serif font-bold text-xl text-[#0A0A0A] tracking-tight">
          Identified Skill Gaps & Action Items
        </h3>
        <Badge variant="attention">
          {gaps.length} {gaps.length === 1 ? 'Area' : 'Areas'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {gaps.map((gap) => {
          const isNeedsAttention = gap.proficiency === 'Needs Attention' || gap.proficiency === 'Developing';
          const target = gap.target_threshold ?? 75;
          const current = gap.current_score_pct ?? 0;
          const gapPct = gap.gap_percentage ?? Math.max(0, target - current);

          return (
            <Card
              key={gap.module_id}
              className="p-6 rounded-2xl flex flex-col justify-between space-y-4 border border-[#D9CFBB] bg-[#EDE4D0] shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2 pb-2 border-b border-[#D9CFBB]">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#6B6357]">
                      Target Module
                    </span>
                    <h4 className="font-serif font-bold text-base text-[#0A0A0A] leading-snug">
                      {gap.skill}
                    </h4>
                  </div>
                  <Badge variant={isNeedsAttention ? 'attention' : 'civic'} className="shrink-0">
                    <AlertCircle className="h-3 w-3" />
                    <span>{gap.proficiency}</span>
                  </Badge>
                </div>

                {/* Score vs Target Progress Meter */}
                <div className="space-y-1.5 bg-[#F5EFE0] p-3 rounded-xl border border-[#D9CFBB]">
                  <div className="flex items-center justify-between text-caption font-medium text-[#6B6357]">
                    <span className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-[#0A0A0A]">
                      <Target className="h-3.5 w-3.5 text-[#C9A24A]" />
                      Target Standard: {target}%
                    </span>
                    <span className="text-[#C97B5A] font-semibold font-mono">
                      Gap: {gapPct}% ({current}% current)
                    </span>
                  </div>
                  <div className="w-full bg-[#E0D5BE] border border-[#D9CFBB]/60 rounded-full h-2 overflow-hidden relative">
                    <div
                      className="h-2 bg-[#C97B5A] rounded-full"
                      style={{ width: `${Math.min(100, current)}%` }}
                    />
                    {/* Target threshold marker at 75% */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-[#0A0A0A] z-10"
                      style={{ left: `${target}%` }}
                      title={`Certification target: ${target}%`}
                    />
                  </div>
                </div>

                <div className="text-caption space-y-2 bg-[#F5EFE0] p-3.5 rounded-xl border border-[#D9CFBB]">
                  {gap.competency && (
                    <div className="flex items-center gap-1.5 text-caption font-mono text-[11px] text-[#0A0A0A] bg-[#EDE4D0] px-2.5 py-1 rounded-full border border-[#D9CFBB]">
                      <span className="font-semibold text-[#6B6357]">Target Competency:</span>
                      <span>{gap.competency}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-[#0A0A0A]">Observed Evidence: </span>
                    <span className="text-[#6B6357]">{gap.evidence}</span>
                  </div>
                  <div>
                    <span className="font-medium text-[#0A0A0A]">Recommended Action: </span>
                    <span className="text-[#6B6357]">{gap.recommended_action}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#D9CFBB]">
                <Link
                  to={
                    gap.tutor_prompt
                      ? `/tutor?moduleId=${gap.module_id}&competency=${encodeURIComponent(gap.competency || '')}&mode=remediation&prompt=${encodeURIComponent(gap.tutor_prompt)}`
                      : `/tutor?moduleId=${gap.module_id}&mode=remediation`
                  }
                  className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#C97B5A] bg-[#C97B5A]/10 hover:bg-[#C97B5A]/20 border border-[#C97B5A]/30 px-3.5 py-1.5 rounded-full transition-colors cursor-pointer"
                  title="Ask AI Tutor to explain this weak competency and provide a practice check"
                >
                  <Bot className="h-3.5 w-3.5 text-[#C97B5A]" />
                  <span>Ask AI Tutor</span>
                </Link>

                <div className="flex items-center gap-2">
                  <Link
                    to={gap.deep_link || `/module?id=${gap.module_id}`}
                    className="inline-flex items-center gap-1.5 text-caption font-medium text-[#0A0A0A] hover:text-[#C97B5A] px-3.5 py-1.5 rounded-full hover:bg-[#E4D9C3] transition-colors"
                  >
                    <BookOpen className="h-3.5 w-3.5 text-[#C9A24A]" />
                    <span>{gap.target_section_title ? `Review Section` : 'Review Notes'}</span>
                  </Link>
                  <Link
                    to={`/quiz/${gap.module_id}`}
                    className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#F5EFE0] bg-[#0A0A0A] hover:bg-[#262626] px-4 py-1.5 rounded-full shadow-sm transition-all min-h-[36px]"
                  >
                    <span>{current > 0 ? 'Retake Quiz' : 'Take Quiz'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SkillGapsCard;
