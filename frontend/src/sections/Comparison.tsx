import React from 'react';
import { Eyebrow, DisplaySerif, BodyText } from '@/design-system';

export const Comparison: React.FC = () => {
  return (
    <section className="w-full bg-white text-black py-[clamp(60px,10vh,140px)] border-b border-[#E4E4E7]">
      <div className="max-w-[1440px] mx-auto px-[clamp(20px,5vw,80px)]">
        {/* Chapter marker header */}
        <div className="flex items-baseline justify-between border-b border-[#E4E4E7] pb-4 mb-10">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-xs uppercase font-bold tracking-[0.25em] text-zinc-400">
              Part.
            </span>
            <span className="font-sans text-3xl font-black tracking-tighter text-black">
              02
            </span>
          </div>
          <Eyebrow>Institutional Transformation</Eyebrow>
        </div>

        {/* Asymmetric 5 / 7 Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left 5 Columns: The Traditional Process */}
          <div className="relative lg:col-span-5 space-y-6 p-6 sm:p-8 bg-zinc-50 border border-[#E4E4E7]">
            <div className="relative z-10 space-y-5">
              <div className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-zinc-400">
                The Traditional Process
              </div>

              <p className="font-sans text-xl sm:text-2xl text-zinc-500 font-bold uppercase leading-snug">
                Manual inspection, fragmented guidance, and avoidable counter rejection.
              </p>

              <div className="space-y-4 pt-4 border-t border-[#E4E4E7]">
                <div className="py-2.5 border-b border-[#E4E4E7]">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-mono font-bold text-zinc-400 block">
                    DEFECT DISCOVERY
                  </span>
                  <p className="text-[13px] font-sans text-zinc-600 mt-1">
                    Citizens learn of expired seals or missing officer stamps only after enduring physical queues.
                  </p>
                </div>

                <div className="py-2.5 border-b border-[#E4E4E7]">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-mono font-bold text-zinc-400 block">
                    TRAINING DELIVERY
                  </span>
                  <p className="text-[13px] font-sans text-zinc-600 mt-1">
                    Junior staff rely on unwritten institutional memory and contradictory paper circulars.
                  </p>
                </div>

                <div className="py-2.5">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-mono font-bold text-zinc-400 block">
                    EVALUATION INTEGRITY
                  </span>
                  <p className="text-[13px] font-sans text-zinc-600 mt-1">
                    Assessments evaluated without server-scored boundaries or verifiable credentials.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right 7 Columns: The GovSkill Standard */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-12 border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,0.08)] space-y-6">
            <div className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-[#0E50B0]">
              The GovSkill Standard
            </div>

            <DisplaySerif
              as="h3"
              size="md"
              text="Deterministic rules eliminate ambiguity before files reach the desk."
              italicWord="eliminate"
            />

            <BodyText size="base" muted className="text-zinc-600">
              By separating deterministic business rules from supportive AI guidance, GovSkill
              guarantees that every evaluation is code-driven, verifiable, and free from algorithmic drift.
            </BodyText>

            {/* Hairline Rule */}
            <div className="w-full h-[1px] bg-[#E4E4E7]" aria-hidden="true" />

            {/* Metric Comparison Row: 50 Ambitious Oversized Numerals */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-zinc-400 block">
                  A. ZERO ERROR
                </span>
                <div className="font-sans text-[clamp(52px,6.5vw,90px)] font-black leading-none text-black tracking-tighter">
                  0
                </div>
                <div className="text-[11px] uppercase tracking-wider font-sans font-bold text-black pt-1">
                  Surprise Rejections
                </div>
                <p className="text-[12px] font-sans text-zinc-500">
                  Pre-checked before citizen queue entry
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-zinc-400 block">
                  ENGINE RULES
                </span>
                <div className="font-sans text-[clamp(52px,6.5vw,90px)] font-black leading-none text-black tracking-tighter">
                  4
                </div>
                <div className="text-[11px] uppercase tracking-wider font-sans font-bold text-black pt-1">
                  STATUTORY DIRECTIVES
                </div>
                <p className="text-[12px] font-sans text-zinc-500">
                  Structure, officer, temporal, and seal
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-zinc-400 block">
                  PASSING FLOOR
                </span>
                <div className="font-sans text-[clamp(52px,6.5vw,90px)] font-black leading-none text-[#0E50B0] tracking-tighter">
                  75%
                </div>
                <div className="text-[11px] uppercase tracking-wider font-sans font-bold text-black pt-1">
                  PASSING BENCHMARK
                </div>
                <p className="text-[12px] font-sans text-zinc-500">
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
