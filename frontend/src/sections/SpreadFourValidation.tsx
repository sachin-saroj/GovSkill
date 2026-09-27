import React from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from '../components/ui';

/**
 * SPREAD 04 — CITIZEN PRE-CHECK (GOVASSIST)
 * Full-width editorial artboard:
 * - Top-left: vibrant horizontal emerald accent bar + Part. 04 sequential lockup
 * - Uniform 2-column editorial rhythm: Left Text & Action (48%) + Right Visual Stage (52%)
 * - Left side: dominant display typography, concise narrative, interactive process pipeline, CTA, and Field Dispatches
 * - Right side: hand-drawn citizen audit illustration at consistent editorial scale
 * - Bottom-right: emerald green accent square
 * - Symmetrical, balanced editorial rhythm on warm ivory paper
 */
export const SpreadFourValidation: React.FC = () => {
  return (
    <section
      id="spread-04"
      className="relative w-full bg-[#FAF8F2] text-[#0A0A0A] border-b border-[#E8E2D5] min-h-[92vh] flex flex-col justify-between py-8 sm:py-12 lg:py-14 px-6 sm:px-12 lg:px-16 xl:px-20 select-none overflow-hidden"
    >
      <div className="relative h-full w-full max-w-[1440px] mx-auto flex flex-col justify-between flex-1">

        {/* ── Top-Left: Vibrant Horizontal Accent Bar + Part. 04 Sequential Lockup ── */}
        <div className="shrink-0 flex items-center justify-between pt-2">
          <div className="flex items-center gap-4">
            <div
              className="w-20 sm:w-28 h-2.5 sm:h-3 bg-emerald-600 select-none pointer-events-none"
              aria-hidden="true"
            />
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">
                Part.
              </span>
              <span className="font-sans text-2xl sm:text-3xl font-black text-black leading-none">
                04
              </span>
            </div>
          </div>
          <div className="hidden sm:block text-[9px] font-mono uppercase tracking-[0.22em] text-zinc-400">
            Citizen Pre-Submission Gate
          </div>
        </div>

        {/* ── Main Composition: Left Editorial & Action Column + Right Citizen Visual Stage ── */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-14 my-auto py-4">

          {/* ── Left Side: Dominant Display Typography, Action & Field Dispatches ── */}
          <div className="w-full lg:w-[48%] flex flex-col justify-center space-y-4 sm:space-y-5 z-20 lg:pr-2">
            <div className="space-y-1">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#AF411E] block">
                Citizen Pre-Submission Validation
              </span>
              <h2 className="font-sans text-[clamp(28px,3.8vw,52px)] font-black uppercase tracking-tight text-black leading-[1.02]">
                CITIZEN <br />
                <span className="text-emerald-700">PRE-CHECK.</span>
              </h2>
            </div>

            <p className="font-sans text-[13px] sm:text-[14px] text-zinc-600 leading-relaxed max-w-[420px]">
              Self-service document verification before the counter queue. OCR extraction, 4 deterministic rules, AI-powered failure explanations.
            </p>

            {/* Minimal Process Pipeline with Tooltip on OCR */}
            <div className="flex items-center gap-2.5 font-mono text-[9px] uppercase font-bold tracking-wider text-zinc-400 select-none py-1">
              <span className="text-black">Document</span>
              <span>→</span>
              <Tooltip content="Optical Character Recognition: Automated statutory text extraction from citizen documents">
                <span className="text-[#0E50B0] underline decoration-dotted underline-offset-2 cursor-help">OCR</span>
              </Tooltip>
              <span>→</span>
              <span className="text-emerald-700">Rules</span>
              <span>→</span>
              <span className="text-black">Verified</span>
            </div>

            {/* Primary Action Button */}
            <div className="pt-1">
              <Link
                to="/citizen"
                role="button"
                className="inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-zinc-800 text-white font-mono text-[10px] uppercase font-bold tracking-wider cursor-pointer transition-colors shadow-sm w-fit"
              >
                <span>Launch the Pre-Check Tool</span>
                <span>→</span>
              </Link>
            </div>

            {/* Field Dispatches & Rule Standards Annotation */}
            <div className="pt-3 border-t border-zinc-200/80 space-y-3">
              <div className="space-y-1 border-l-2 border-emerald-600/60 pl-3">
                <div className="text-[9px] font-mono uppercase tracking-wider text-zinc-400">
                  <span className="font-extrabold text-[#0E50B0]">Field Dispatches</span>
                  <span> • Voices from the <span className="text-[#AF411E] font-bold">field.</span></span>
                </div>
                <blockquote className="text-[12px] sm:text-[13px] text-zinc-600 italic leading-snug">
                  "Citizens arrive with verified documents. Rejection rates dropped."
                </blockquote>
              </div>

              <div className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-black">
                  Deterministic Rule Processing
                </span>
                <span className="text-[#AF411E] font-bold">
                  Passing Standard for Certification
                </span>
              </div>
            </div>
          </div>

          {/* ── Right Side: Dominant Citizen Artwork at Consistent Scale ── */}
          <div className="w-full lg:w-[52%] flex items-center justify-center lg:justify-end select-none relative">
            <img
              src="/illustrations/spread4_citizen_audit_v2.png"
              alt="Editorial hand-drawn illustration of an Indian citizen carefully examining an official document"
              className="max-h-[38vh] sm:max-h-[55vh] lg:max-h-[72vh] w-auto max-w-full object-contain pointer-events-none mix-blend-multiply drop-shadow-sm"
              loading="eager"
            />
          </div>

        </div>

        {/* ── Bottom-Right: Small Color Accent Square ── */}
        <div className="flex items-center justify-end shrink-0 pt-4">
          <div
            className="w-4 h-4 bg-emerald-600 select-none pointer-events-none"
            aria-hidden="true"
          />
        </div>

      </div>
    </section>
  );
};

export default SpreadFourValidation;
