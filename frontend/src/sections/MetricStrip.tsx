import React from 'react';
import { MetricBlock, Eyebrow } from '@/design-system';

export const MetricStrip: React.FC = () => {
  return (
    <section className="w-full bg-white py-[clamp(60px,10vh,120px)] border-t border-[#E4E4E7]">
      <div className="max-w-[1440px] mx-auto px-[clamp(20px,5vw,80px)]">
        {/* Editorial Architectural Metric Card */}
        <div className="relative w-full bg-white text-black border border-[#E4E4E7] p-8 sm:p-14 lg:p-16 space-y-10">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E4E7] pb-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-[#0E50B0] tracking-widest uppercase">
                PART. 08
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#0E50B0]" />
              <Eyebrow>Statutory Rigor</Eyebrow>
            </div>
            <div className="text-[12px] font-mono font-bold uppercase tracking-[0.16em] text-[#71717A]">
              Audit Standard • Section 09
            </div>
          </div>

          {/* TWO Metrics with Oversized Tabular Numbers and Hairline Divider */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="md:col-span-5 space-y-4">
              <MetricBlock
                targetNumber={100}
                suffix="%"
                label="Deterministic Rule Processing"
                context="Validation logic executes exclusively via code-driven Python regex and ISO date calculations, strictly isolated from generative model subjectivity."
                dark={false}
              />
            </div>

            {/* Vertical divider between the two metrics: 1px zinc, 80px tall */}
            <div className="hidden md:flex md:col-span-2 justify-center self-center" aria-hidden="true">
              <div className="w-[1px] h-[80px] bg-[#E4E4E7]" />
            </div>

            <div className="md:col-span-5 space-y-4">
              <MetricBlock
                targetNumber={75}
                suffix="%"
                label="Passing Standard for Certification"
                context="Server-evaluated assessments issue verifiable HMAC-SHA256 credentials with immutable timestamps only upon meeting statutory score thresholds."
                dark={false}
              />
            </div>
          </div>

          {/* Caption at bottom of panel */}
          <div className="relative z-10 pt-4 border-t border-[#E4E4E7] flex justify-between items-center text-[10px] font-mono uppercase tracking-[0.22em] text-[#71717A]">
            <span>AUDIT STANDARD · REVISION 09</span>
            <span>Section 09 Directives</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MetricStrip;
