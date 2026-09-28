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
      <Card className="p-6 sm:p-8 rounded-none border border-[#E4E4E7] bg-white shadow-none">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="space-y-1">
            <h3 className="font-sans font-bold text-lg uppercase tracking-tight text-[#09090B]">
              No Operational Skill Gaps Detected
            </h3>
            <p className="text-body text-[#52525B] leading-relaxed">
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
        <ShieldAlert className="h-4 w-4 text-rose-700" />
        <h3 className="font-serif font-bold text-xl tracking-tight text-ink">
          Identified Skill Gaps & Action Items
        </h3>
        <Badge variant="attention" className="rounded-full uppercase font-mono text-[10px]">
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
              className="p-6 rounded-2xl flex flex-col justify-between space-y-4 border border-border-warm border-l-4 border-l-rose-500 bg-surface shadow-none"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2 pb-2 border-b border-border-warm">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-ink-muted font-bold">
                      Target Module
                    </span>
                    <h4 className="font-sans font-bold text-base tracking-tight text-ink leading-snug">
                      {gap.skill}
                    </h4>
                  </div>
                  <Badge variant={isNeedsAttention ? 'attention' : 'civic'} className="shrink-0 rounded-full uppercase font-mono text-[10px]">
                    <AlertCircle className="h-3 w-3" />
                    <span>{gap.proficiency}</span>
                  </Badge>
                </div>

                {/* Score vs Target Progress Meter */}
                <div className="space-y-1.5 bg-surface-light p-3.5 rounded-xl border border-border-warm">
                  <div className="flex items-center justify-between text-caption font-medium text-ink-muted">
                    <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-ink font-bold">
                      <Target className="h-3.5 w-3.5 text-azure-700" />
                      Target Standard: {target}%
                    </span>
                    <span className="text-rose-700 font-bold font-mono text-xs">
                      Gap: {gapPct}% ({current}% current)
                    </span>
                  </div>
                  <div className="w-full bg-surface-strong h-2 rounded-full overflow-hidden relative">
                    <div
                      className="h-2 rounded-full bg-rose-600"
                      style={{ width: `${Math.min(100, current)}%` }}
                    />
                    {/* Target threshold marker at 75% */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-ink z-10"
                      style={{ left: `${target}%` }}
                      title={`Certification target: ${target}%`}
                    />
                  </div>
                </div>

                <div className="text-caption space-y-2 bg-surface-light p-3.5 rounded-xl border border-border-warm">
                  {gap.competency && (
                    <div className="flex items-center gap-1.5 text-caption font-mono text-[10px] text-ink bg-surface px-2.5 py-1 rounded-full border border-border-warm w-fit">
                      <span className="font-bold text-ink-muted uppercase">Target Competency:</span>
                      <span className="font-bold">{gap.competency}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-bold text-ink">Observed Evidence: </span>
                    <span className="text-ink-muted">{gap.evidence}</span>
                  </div>
                  <div>
                    <span className="font-bold text-ink">Recommended Action: </span>
                    <span className="text-ink-muted">{gap.recommended_action}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border-warm">
                <Link
                  to={
                    gap.tutor_prompt
                      ? `/tutor?moduleId=${gap.module_id}&competency=${encodeURIComponent(gap.competency || '')}&mode=remediation&prompt=${encodeURIComponent(gap.tutor_prompt)}`
                      : `/tutor?moduleId=${gap.module_id}&mode=remediation`
                  }
                  className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-rose-800 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 px-3 py-1.5 rounded-full font-bold transition-colors cursor-pointer min-h-[36px]"
                  title="Ask AI Tutor to explain this weak competency and provide a practice check"
                >
                  <Bot className="h-3.5 w-3.5 text-rose-700" />
                  <span>Ask AI Tutor</span>
                </Link>

                <div className="flex items-center gap-2">
                  <Link
                    to={gap.deep_link || `/module?id=${gap.module_id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase font-bold text-ink hover:text-azure-700 px-3 py-1.5 rounded-full border border-border-warm hover:bg-surface-strong transition-colors min-h-[36px]"
                  >
                    <BookOpen className="h-3.5 w-3.5 text-azure-700" />
                    <span>{gap.target_section_title ? `Review Section` : 'Review Notes'}</span>
                  </Link>
                  <Link
                    to={`/quiz/${gap.module_id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase font-bold text-surface-light bg-ink hover:bg-ink-muted px-4 py-1.5 rounded-full shadow-none transition-all min-h-[36px] border border-ink"
                  >
                    <span>Take Assessment</span>
                    <ArrowRight className="h-3.5 w-3.5 text-white" />
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
