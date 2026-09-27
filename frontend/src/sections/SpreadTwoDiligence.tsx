import React from 'react';

/**
 * SPREAD 02 — OFFICER / DILIGENCE
 * Full-width editorial artboard:
 * - Illustration anchored on the LEFT edge and bottom, seamlessly blended with paper
 * - Right side dominated by oversized "Part. 02" numeral lockup
 * - Dominant display statement: "BE DILIGENT. KNOW WHAT COMES NEXT."
 * - Institutional Command label + concise explanatory paragraph
 * - Traditional vs GovSkill procedural integrity annotations
 * - Bottom-right 'M /' diagonal slash mark
 * - Confident asymmetry on warm ivory paper
 */
export const SpreadTwoDiligence: React.FC = () => {
  return (
    <section
      id="spread-02"
      className="relative w-full bg-[#FAF8F2] text-[#0A0A0A] border-b border-[#E8E2D5] min-h-[92vh] flex flex-col justify-between py-8 sm:py-12 lg:py-14 px-6 sm:px-12 lg:px-16 xl:px-20 select-none overflow-hidden"
    >
      <div className="relative h-full w-full max-w-[1440px] mx-auto flex flex-col justify-between flex-1">

        {/* ── Main Composition: Left Editorial Column + Right Visual Stage ── */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-14 my-auto py-4">

          {/* ── Left Side: "Part. 02" Lockup + Editorial Statement ── */}
          <div className="w-full lg:w-[48%] flex flex-col justify-center space-y-4 lg:space-y-6 z-20">

            {/* "Part. 02" Header Lockup */}
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-zinc-400">
                Part.
              </span>
              <span className="font-sans text-[clamp(72px,10vw,128px)] font-black text-black leading-none tracking-tighter -mt-3">
                02
              </span>
            </div>

            {/* Dominant Display Headline */}
            <div className="space-y-1.5">
              <span className="font-mono text-[10px] sm:text-[11px] uppercase font-extrabold tracking-[0.28em] text-[#0E50B0] block">
                STATUTORY DILIGENCE
              </span>
              <h2 className="font-sans text-[clamp(28px,3.8vw,54px)] font-black uppercase tracking-tight text-black leading-[1.04]">
                BE DILIGENT. <span className="text-[#AF411E]">KNOW WHAT COMES NEXT.</span>
              </h2>
            </div>

            {/* Label */}
            <div>
              <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#AF411E]">
                Institutional Command
              </span>
            </div>

            {/* Editorial Paragraph */}
            <p className="font-sans text-[13px] sm:text-sm text-zinc-600 leading-relaxed max-w-[440px]">
              An administrative interface shaped for <span className="text-black font-bold underline underline-offset-4 decoration-[#0E50B0]">unwavering</span> clarity.
              Officers navigate statutory procedures with precision, not guesswork.
            </p>

            {/* Clear, Complete Comparative Sentence (Replaces badge clutter) */}
            <div className="pt-2 border-t border-zinc-200/80">
              <p className="font-sans text-[12px] sm:text-[13px] text-zinc-600 leading-relaxed max-w-[440px]">
                Unlike <span className="font-semibold text-zinc-800">The Traditional Process</span> burdened by counter delays and surprise rejections, <span className="font-semibold text-[#0E50B0]">The GovSkill Standard</span> enforces statutory pre-checks so every submitted certificate passes procedural review.
              </p>
            </div>

            {/* Secondary footer marker */}
            <div className="pt-1 text-[9px] font-mono uppercase tracking-[0.22em] text-zinc-400">
              <span>Officer Training View</span>
            </div>
          </div>

          {/* ── Right Side: Anchored Officer Illustration (Officer Ananya at desk) ── */}
          <div className="w-full lg:w-[52%] flex flex-col justify-end items-center lg:items-end select-none relative">
            <img
              src="/illustrations/spread2_ananya_diligence.png"
              alt="Editorial hand-drawn watercolor illustration of Officer Ananya studying statutory revenue records at her municipal desk"
              className="max-h-[38vh] sm:max-h-[55vh] lg:max-h-[72vh] w-auto max-w-full object-contain object-bottom pointer-events-none mix-blend-multiply drop-shadow-sm"
              loading="eager"
            />
          </div>

        </div>

      </div>
    </section>
  );
};

export default SpreadTwoDiligence;
