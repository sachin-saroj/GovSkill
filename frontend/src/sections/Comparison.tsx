import React from 'react';
import { Eyebrow, DisplaySerif, BodyText } from '@/design-system';

export const Comparison: React.FC = () => {
  return (
    <section className="w-full bg-[#F5EFE0] py-[clamp(60px,10vh,140px)] border-t border-[#D9CFBB]/70">
      <div className="max-w-[1440px] mx-auto px-[clamp(20px,5vw,80px)]">
        <div className="mb-12">
          <Eyebrow>Institutional Transformation</Eyebrow>
        </div>

        {/* Asymmetric 5 / 7 Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left 5 Columns: The Old Way */}
          <div className="relative lg:col-span-5 space-y-6 p-6 sm:p-8 rounded-2xl overflow-hidden bg-[#EDE4D0]/20 border border-[#D9CFBB]/60">
            {/* Faint diagonal hatch pattern behind text (2% opacity ink) */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[repeating-linear-gradient(45deg,#0A0A0A,#0A0A0A_1px,transparent_1px,transparent_10px)]"
              aria-hidden="true"
            />

            <div className="relative z-10 space-y-6">
              <div className="text-[12px] font-sans font-medium uppercase tracking-[0.2em] text-[#6B6357]">
                The Traditional Process
              </div>

              <p className="font-serif text-2xl sm:text-3xl text-[#6B6357] font-normal leading-snug">
                Manual inspection, fragmented guidance, and avoidable counter rejection.
              </p>

              <div className="space-y-4 pt-4 border-t border-[#D9CFBB]">
                <div className="py-3 border-b border-[#D9CFBB]/60">
                  <span className="text-[11px] uppercase tracking-wider font-mono text-[#6B6357] block">
                    DEFECT DISCOVERY
                  </span>
                  <p className="text-[14px] font-sans text-[#6B6357] mt-1">
                    Citizens learn of expired seals or missing officer stamps only after enduring physical queues.
                  </p>
                </div>

                <div className="py-3 border-b border-[#D9CFBB]/60">
                  <span className="text-[11px] uppercase tracking-wider font-mono text-[#6B6357] block">
                    TRAINING DELIVERY
                  </span>
                  <p className="text-[14px] font-sans text-[#6B6357] mt-1">
                    Junior staff rely on unwritten institutional memory and contradictory paper circulars.
                  </p>
                </div>

                <div className="py-3 border-b border-[#D9CFBB]/60">
                  <span className="text-[11px] uppercase tracking-wider font-mono text-[#6B6357] block">
                    EVALUATION INTEGRITY
                  </span>
                  <p className="text-[14px] font-sans text-[#6B6357] mt-1">
                    Assessments evaluated without server-scored boundaries or verifiable credentials.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right 7 Columns: The GovSkill Way */}
          <div className="lg:col-span-7 bg-[#EDE4D0]/40 p-8 sm:p-12 lg:p-14 rounded-[32px] border border-[#D9CFBB] space-y-8">
            <div className="text-[12px] font-sans font-medium uppercase tracking-[0.2em] text-[#0A0A0A]">
              The GovSkill Standard
            </div>

            <DisplaySerif
              as="h3"
              size="md"
              text="Deterministic rules eliminate ambiguity before files reach the desk."
              italicWord="eliminate"
            />

            <BodyText size="base" muted>
              By separating deterministic business rules from supportive AI guidance, GovSkill
              guarantees that every evaluation is code-driven, verifiable, and free from algorithmic drift.
            </BodyText>

            {/* Thin 1px Rule Spanning Full Right Column Width */}
            <div className="w-full h-[1px] bg-[#D9CFBB]" aria-hidden="true" />

            {/* Large Serif Metrics Comparison Row: Tabular Lining Figures, -0.04em tracking */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 pb-1">
                  <svg
                    className="w-4 h-4 text-[#C9A24A]"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    aria-hidden="true"
                  >
                    <path d="M8 2.5L14.5 13.5H1.5L8 2.5Z" strokeLinejoin="round" />
                    <line x1="8" y1="6.5" x2="8" y2="9.5" strokeLinecap="round" />
                    <circle cx="8" cy="11.5" r="0.75" fill="currentColor" />
                  </svg>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6357]">
                    A. ZERO ERROR
                  </span>
                </div>
                <div
                  className="font-serif text-[clamp(56px,7vw,100px)] font-normal leading-none text-[#0A0A0A] tabular-nums tracking-[-0.04em]"
                  style={{ fontFamily: '"Fraunces", Georgia, serif' }}
                >
                  0
                </div>
                <div className="text-[11px] uppercase tracking-wider font-sans font-medium text-[#0A0A0A] pt-1">
                  Surprise Rejections
                </div>
                <p className="text-[12px] font-sans text-[#6B6357]">
                  Pre-checked before citizen queue entry
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6357] block pb-1">
                  ENGINE RULES
                </span>
                <div
                  className="font-serif text-[clamp(56px,7vw,100px)] font-normal leading-none text-[#0A0A0A] tabular-nums tracking-[-0.04em]"
                  style={{ fontFamily: '"Fraunces", Georgia, serif' }}
                >
                  4
                </div>
                <div className="text-[11px] uppercase tracking-wider font-sans font-medium text-[#0A0A0A] pt-1">
                  STATUTORY DIRECTIVES
                </div>
                <p className="text-[12px] font-sans text-[#6B6357]">
                  Structure, officer, temporal, and seal
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6357] block pb-1">
                  PASSING FLOOR
                </span>
                <div
                  className="font-serif text-[clamp(56px,7vw,100px)] font-normal leading-none text-[#0A0A0A] tabular-nums tracking-[-0.04em]"
                  style={{ fontFamily: '"Fraunces", Georgia, serif' }}
                >
                  75%
                </div>
                <div className="text-[11px] uppercase tracking-wider font-sans font-medium text-[#0A0A0A] pt-1">
                  PASSING BENCHMARK
                </div>
                <p className="text-[12px] font-sans text-[#6B6357]">
                  Server-scored assessment competency
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Comparison;
