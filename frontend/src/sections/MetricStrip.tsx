import React from 'react';
import { MetricBlock, Eyebrow } from '@/design-system';

export const MetricStrip: React.FC = () => {
  return (
    <section className="w-full bg-[#F5EFE0] py-[clamp(60px,10vh,120px)]">
      <div className="max-w-[1440px] mx-auto px-[clamp(20px,5vw,80px)]">
        {/* Exactly ONE Dark Green Rounded Panel (#2A5B4A) */}
        <div className="relative w-full bg-[#2A5B4A] text-[#F5EFE0] rounded-[32px] sm:rounded-[40px] p-8 sm:p-14 lg:p-16 shadow-[0_25px_60px_-15px_rgba(42,91,74,0.35)] space-y-10 overflow-hidden">
          {/* Subtle diagonal hatch pattern behind panel at 4% cream opacity */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[repeating-linear-gradient(45deg,#F5EFE0,#F5EFE0_1px,transparent_1px,transparent_10px)]"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-6">
            <Eyebrow dark>Statutory Rigor</Eyebrow>
            <div className="text-[12px] font-sans font-medium uppercase tracking-[0.16em] text-[#EDE4D0]/70 font-mono">
              Audit Standard • Section 09
            </div>
          </div>

          {/* TWO Metrics with 96px Tabular Numbers and 60px Vertical Divider */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="md:col-span-5 space-y-3">
              <MetricBlock
                targetNumber={100}
                suffix="%"
                label="Deterministic Rule Processing"
                context="Validation logic executes exclusively via code-driven Python regex and ISO date calculations, strictly isolated from generative model subjectivity."
                dark={true}
              />
            </div>

            {/* Small vertical divider between the two metrics: 1px cream at 30%, 60px tall */}
            <div className="hidden md:flex md:col-span-2 justify-center" aria-hidden="true">
              <div className="w-[1px] h-[60px] bg-[#F5EFE0]/30" />
            </div>

            <div className="md:col-span-5 space-y-3">
              <MetricBlock
                targetNumber={75}
                suffix="%"
                label="Passing Standard for Certification"
                context="Server-evaluated assessments issue verifiable HMAC-SHA256 credentials with immutable timestamps only upon meeting statutory score thresholds."
                dark={true}
              />
            </div>
          </div>

          {/* Caption at bottom-left of panel */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] font-mono uppercase tracking-[0.22em] text-[#EDE4D0]/60">
            <span>AUDIT STANDARD · REVISION 09</span>
            <span>Section 09 Directives</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MetricStrip;
