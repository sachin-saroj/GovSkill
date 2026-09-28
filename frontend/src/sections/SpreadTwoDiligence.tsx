import React from 'react';
import { ProgressiveBlur } from '@/components/ui/skiper-ui/skiper41';
import { useReveal } from '@/hooks/useReveal';

/**
 * SPREAD 02 — OFFICER / DILIGENCE
 * Professional Comparison Artboard:
 * - Clear editorial typography: 'BE DILIGENT. Know what comes next.'
 * - Modern, clean comparative card: 'The Traditional Process' vs 'The GovSkill Standard'
 * - Naturally integrated Officer Ananya illustration
 * - Preserves all required test assertions: 'Institutional Command', 'unwavering', 'The Traditional Process', 'The GovSkill Standard', 'Surprise Rejections', 'Officer Training View'
 */
export const SpreadTwoDiligence: React.FC = () => {
  const { ref, revealed } = useReveal(0.08);

  return (
    <section
      id="spread-02"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative w-full bg-[#F5F0E6] text-[#0A0A0A] border-b border-[#E8E2D5] min-h-[92vh] flex flex-col justify-between py-10 sm:py-14 px-6 sm:px-12 lg:px-16 xl:px-20 select-none overflow-hidden"
    >
      <div className="relative h-full w-full max-w-[1280px] mx-auto flex flex-col justify-between flex-1">

        {/* ── Main Composition: Narrative + Editorial Annotation + Prominent Artwork ── */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center my-auto py-6 relative z-10">

          {/* ── Left Side (6.5 cols): Editorial Headline & Quiet Comparative Annotation ── */}
          <div
            className={`lg:col-span-7 flex flex-col justify-center space-y-6 spread-reveal spread-reveal-delay-1 ${revealed ? 'revealed' : ''}`}
          >
            <div className="space-y-3">
              <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#0E50B0] font-semibold">
                Institutional Command
              </span>
              
              <h2 className="font-serif text-[clamp(34px,4.5vw,58px)] font-normal text-zinc-950 leading-[1.04] tracking-tight">
                BE DILIGENT. <br />
                <span className="italic font-light text-[#AF411E]">Know what comes next.</span>
              </h2>
            </div>

            <p className="font-sans text-[14px] sm:text-[15.5px] text-zinc-600 leading-relaxed max-w-lg">
              An administrative interface shaped for <span className="text-zinc-950 font-semibold underline underline-offset-4 decoration-[#0E50B0]">unwavering</span> clarity.
              Officers navigate statutory procedures with precision, not guesswork.
            </p>

            {/* Quiet Hairline Comparison Annotation (Unboxed, Pure Editorial) */}
            <div className="pt-2 border-t border-zinc-200/80 space-y-4 max-w-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
                {/* Traditional Process */}
                <div className="space-y-1 sm:border-r border-zinc-200/70 sm:pr-5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.16em] text-rose-900 block">
                    The Traditional Process
                  </span>
                  <p className="font-sans text-[13px] text-zinc-600 leading-relaxed">
                    Paper oversights and counter bottlenecks leading to frequent <strong className="text-zinc-900 font-semibold">Surprise Rejections</strong>.
                  </p>
                </div>

                {/* GovSkill Standard */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.16em] text-[#0E50B0] block">
                    The GovSkill Standard
                  </span>
                  <p className="font-sans text-[13px] text-zinc-600 leading-relaxed">
                    Deterministic pre-checks and lesson modules ensuring every submitted certificate passes procedural review.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-1 flex items-center gap-2.5 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#AF411E]" />
              <span className="font-semibold text-zinc-600">Officer Training View</span>
              <span>•</span>
              <span>Procedural Standard</span>
            </div>
          </div>

          {/* ── Right Side (5.5 cols): Officer Ananya Artwork with Generous Scale ── */}
          <div
            className={`lg:col-span-5 flex items-center justify-center select-none spread-reveal spread-reveal-delay-2 ${revealed ? 'revealed' : ''}`}
          >
            <img
              src="/illustrations/spread2_ananya_diligence.png"
              alt="Illustration of Officer Ananya studying statutory revenue records at her municipal desk"
              className="max-h-[44vh] sm:max-h-[54vh] w-auto max-w-full object-contain pointer-events-none mix-blend-multiply drop-shadow-xs image-stable"
              loading="eager"
            />
          </div>

        </div>

        {/* ── Bottom Row ── */}
        <div className="flex items-center justify-between shrink-0 relative z-20 pt-4 border-t border-zinc-200/80 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.16em] text-zinc-400">
          <span>Officer Cadre Diligence</span>
          <span>Statutory Revenue Record Verification</span>
        </div>

      </div>

      {/* ── Progressive Blur transition to next spread ── */}
      <ProgressiveBlur position="bottom" height="60px" backgroundColor="#FAF8F2" blurAmount="3px" />
    </section>
  );
};

export default SpreadTwoDiligence;
