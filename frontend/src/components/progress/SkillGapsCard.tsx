import React from 'react';
import { Link } from 'react-router-dom';
import { SkillGapItem } from '@/types';
import Card from '@/components/ui/Card';
import { AlertCircle, ArrowRight, CheckCircle2, ShieldAlert, Target } from 'lucide-react';

interface SkillGapsCardProps {
  gaps: SkillGapItem[];
}

export const SkillGapsCard: React.FC<SkillGapsCardProps> = ({ gaps }) => {
  if (!gaps || gaps.length === 0) {
    return (
      <Card className="p-6 rounded-civic-xl border border-emerald-200 bg-emerald-50/40 shadow-civic-xs">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-civic-md bg-emerald-100 text-emerald-800 shrink-0">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="space-y-1">
            <h3 className="text-section-heading font-semibold text-emerald-950">
              No Operational Skill Gaps Detected
            </h3>
            <p className="text-caption text-emerald-800 leading-relaxed font-normal">
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
        <ShieldAlert className="h-4 w-4 text-amber-600" />
        <h3 className="text-section-heading font-semibold text-slate-900 tracking-tight">
          Identified Skill Gaps & Action Items
        </h3>
        <span className="text-micro font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
          {gaps.length} {gaps.length === 1 ? 'Area' : 'Areas'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {gaps.map((gap) => {
          const isNeedsAttention = gap.proficiency === 'Needs Attention';
          const target = gap.target_threshold ?? 75;
          const current = gap.current_score_pct ?? 0;
          const gapPct = gap.gap_percentage ?? Math.max(0, target - current);

          return (
            <Card
              key={gap.module_id}
              className={`p-6 rounded-civic-xl flex flex-col justify-between space-y-4 border shadow-civic-xs ${
                isNeedsAttention
                  ? 'border-amber-200 bg-amber-50/30'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-section-heading font-semibold text-slate-900 leading-snug">
                    {gap.skill}
                  </h4>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-micro font-semibold uppercase tracking-wider shrink-0 border ${
                      isNeedsAttention
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-civic-50 text-civic-800 border-civic-200'
                    }`}
                  >
                    <AlertCircle className="h-3 w-3" />
                    <span>{gap.proficiency}</span>
                  </span>
                </div>

                {/* Score vs Target Progress Meter */}
                <div className="space-y-1.5 bg-white p-3 rounded-civic-md border border-slate-200/80">
                  <div className="flex items-center justify-between text-caption font-medium text-slate-600">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Target className="h-3.5 w-3.5 text-civic-600" />
                      Target Standard: {target}%
                    </span>
                    <span className="text-amber-900 font-semibold">
                      Gap: {gapPct}% ({current}% current)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden relative">
                    <div
                      className="h-2 bg-amber-500 rounded-full"
                      style={{ width: `${Math.min(100, current)}%` }}
                    />
                    {/* Target threshold marker at 75% */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10"
                      style={{ left: `${target}%` }}
                      title={`Certification target: ${target}%`}
                    />
                  </div>
                </div>

                <div className="text-caption space-y-2 bg-white/80 p-3.5 rounded-civic-md border border-slate-200/70">
                  {gap.competency && (
                    <div className="flex items-center gap-1.5 text-caption font-semibold text-civic-900 bg-civic-50 px-2.5 py-1 rounded-civic-sm border border-civic-200/80">
                      <span className="font-semibold text-civic-700">Target Competency:</span>
                      <span>{gap.competency}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-semibold text-slate-700">Observed Evidence: </span>
                    <span className="text-slate-600">{gap.evidence}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-civic-900">Recommended Action: </span>
                    <span className="text-slate-700">{gap.recommended_action}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <Link
                  to={
                    gap.tutor_prompt
                      ? `/tutor?moduleId=${gap.module_id}&competency=${encodeURIComponent(gap.competency || '')}&mode=remediation&prompt=${encodeURIComponent(gap.tutor_prompt)}`
                      : `/tutor?moduleId=${gap.module_id}&mode=remediation`
                  }
                  className="inline-flex items-center gap-1 text-caption font-semibold text-saffron-800 bg-saffron-50 hover:bg-saffron-100 border border-saffron-200 px-3 py-1.5 rounded-civic-md transition-colors"
                  title="Ask AI Tutor to explain this weak competency and provide a practice check"
                >
                  <span>Ask AI Tutor</span>
                </Link>

                <div className="flex items-center gap-2">
                  <Link
                    to={gap.deep_link || `/module?id=${gap.module_id}`}
                    className="inline-flex items-center gap-1 text-caption font-semibold text-civic-800 hover:text-civic-900 px-3 py-1.5 rounded-civic-md hover:bg-civic-50 transition-colors"
                  >
                    <span>{gap.target_section_title ? `Review Section` : 'Review Notes'}</span>
                  </Link>
                  <Link
                    to={`/quiz/${gap.module_id}`}
                    className="inline-flex items-center gap-1.5 text-caption font-semibold text-white bg-civic-900 hover:bg-civic-800 px-3.5 py-1.5 rounded-civic-md shadow-civic-xs active:scale-98 transition-all"
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
