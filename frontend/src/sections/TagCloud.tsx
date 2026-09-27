import React from 'react';
import { Eyebrow, DisplaySerif } from '@/design-system/typography';

interface CloudItem {
  text: string;
  weight: 1 | 2 | 3 | 4;
}

// Deterministically distributed tags arranged like a rhythmic editorial poem
const CLOUD_ITEMS: CloudItem[] = [
  { text: 'Income Certificate Verification', weight: 4 },
  { text: 'Temporal Validity Horizons', weight: 3 },
  { text: 'Issuing Authority Verification', weight: 2 },
  { text: 'Official Seal Legibility', weight: 3 },
  { text: 'welfare scheme eligibility criteria', weight: 1 },
  { text: 'Non-Discretionary Compliance', weight: 3 },
  { text: 'Administrative Red Flags', weight: 2 },
  { text: 'Statutory Counter Slips', weight: 3 },
  { text: 'HMAC-SHA256 Token Boundaries', weight: 2 },
  { text: 'collectorate counter protocol', weight: 1 },
  { text: 'Zero-PII Evaluation Isolation', weight: 3 },
  { text: 'Revenue Office Directives', weight: 4 },
  { text: 'Grounded Curriculum Q&A', weight: 2 },
  { text: 'statutory gazette precedent', weight: 1 },
  { text: 'Server-Scored Knowledge Benchmarks', weight: 2 },
  { text: 'Citizen Pre-Submission Audit', weight: 2 },
  { text: 'Decisive Administrative Craft', weight: 4 },
];

export const TagCloud: React.FC = () => {
  return (
    <section className="relative w-full bg-white text-black py-[clamp(80px,12vh,160px)] border-b border-[#E4E4E7] overflow-hidden">
      {/* Decorative typographic accent mark */}
      <div
        className="absolute top-8 right-8 sm:top-14 sm:right-16 text-[90px] font-sans font-black text-black/5 select-none pointer-events-none"
        aria-hidden="true"
      >
        50
      </div>

      <div className="max-w-[1440px] mx-auto px-[clamp(20px,5vw,80px)] space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-[#E4E4E7] pb-4">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-xs uppercase font-bold tracking-[0.25em] text-zinc-400">
              Part.
            </span>
            <span className="font-sans text-3xl font-black tracking-tighter text-black">
              04
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Eyebrow>Competency Domains</Eyebrow>
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 hidden sm:inline">
              Core statutory domains · 2026 Revision
            </span>
          </div>
        </div>

        <DisplaySerif
          as="h2"
          size="md"
          text="A curriculum rooted in administrative reality."
          italicWord="reality"
          className="text-black max-w-[840px] leading-[1.05]"
        />

        {/* Asymmetric Poetic Tag Cloud across 4 Visual Weights */}
        <div
          className="flex flex-wrap items-baseline gap-x-5 gap-y-4 max-w-[1180px] pt-4"
          aria-label="Statutory competency domains"
        >
          {CLOUD_ITEMS.map((item, idx) => {
            switch (item.weight) {
              case 1:
                return (
                  <span
                    key={idx}
                    className="inline-block text-[13px] text-zinc-500 font-sans font-medium uppercase tracking-wider transition-colors hover:text-black cursor-default select-none"
                  >
                    {item.text}
                  </span>
                );

              case 2:
                return (
                  <span
                    key={idx}
                    className="inline-block text-[14px] text-black font-sans font-bold uppercase tracking-wider px-3.5 py-1.5 border border-[#E4E4E7] bg-zinc-50 transition-all hover:border-black cursor-default select-none"
                  >
                    {item.text}
                  </span>
                );

              case 3:
                return (
                  <span
                    key={idx}
                    className="inline-block font-sans font-black text-[18px] sm:text-[20px] text-black uppercase tracking-tight px-4 py-2 border-2 border-black bg-white shadow-[3px_3px_0px_rgba(0,0,0,0.1)] transition-transform hover:-translate-y-0.5 cursor-default select-none"
                  >
                    {item.text}
                  </span>
                );

              case 4:
                return (
                  <span
                    key={idx}
                    className="inline-block font-sans font-black uppercase text-[24px] sm:text-[28px] text-[#0E50B0] tracking-tighter px-2 py-1 leading-none transition-colors hover:text-black cursor-default select-none"
                  >
                    {item.text}
                  </span>
                );

              default:
                return null;
            }
          })}
        </div>
      </div>
    </section>
  );
};

export default TagCloud;
