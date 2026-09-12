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
    <section className="relative w-full bg-[#EDE4D0]/35 py-[clamp(80px,12vh,160px)] border-y border-[#D9CFBB] overflow-hidden">
      {/* Decorative Oversized Asterisk Glyph (✳) at 80px, Muted Terracotta, Rotated -8° */}
      <div
        className="absolute top-8 right-8 sm:top-14 sm:right-16 text-[80px] font-serif text-[#C97B5A]/70 select-none pointer-events-none transform -rotate-8"
        aria-hidden="true"
      >
        ✳
      </div>

      <div className="max-w-[1440px] mx-auto px-[clamp(20px,5vw,80px)] space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <Eyebrow>Competency Domains</Eyebrow>
          <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#6B6357]">
            Core statutory domains · 2026 Revision
          </div>
        </div>

        <DisplaySerif
          as="h2"
          size="md"
          text="A curriculum rooted in administrative reality."
          italicWord="reality"
          className="text-[#0A0A0A] max-w-[840px] leading-[1.12]"
        />

        {/* Asymmetric Poetic Tag Cloud across 4 Visual Weights */}
        <div
          className="flex flex-wrap items-baseline gap-x-6 gap-y-5 max-w-[1180px] pt-4"
          aria-label="Statutory competency domains"
        >
          {CLOUD_ITEMS.map((item, idx) => {
            switch (item.weight) {
              case 1:
                return (
                  <span
                    key={idx}
                    className="inline-block text-[14px] text-[#6B6357] font-sans transition-all duration-200 hover:-translate-y-0.5 hover:text-[#0A0A0A] cursor-default select-none"
                  >
                    {item.text}
                  </span>
                );

              case 2:
                return (
                  <span
                    key={idx}
                    className="inline-block text-[16px] text-[#0A0A0A] font-sans px-4 py-1.5 rounded-full border border-[#D9CFBB] bg-[#F5EFE0]/60 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0A0A0A] hover:bg-[#F5EFE0] cursor-default select-none"
                  >
                    {item.text}
                  </span>
                );

              case 3:
                return (
                  <span
                    key={idx}
                    className="inline-block font-serif italic text-[20px] text-[#0A0A0A] px-5 py-2 rounded-full border border-[#D9CFBB] bg-[#F5EFE0] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0A0A0A] hover:shadow-md cursor-default select-none"
                  >
                    {item.text}
                  </span>
                );

              case 4:
                return (
                  <span
                    key={idx}
                    className="inline-block font-serif italic text-[26px] sm:text-[28px] text-[#0A0A0A] px-2 py-1 leading-none transition-all duration-200 hover:-translate-y-0.5 hover:text-[#C97B5A] cursor-default select-none"
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
