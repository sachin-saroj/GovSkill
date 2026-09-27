import React from 'react';
import { Link } from 'react-router-dom';

/**
 * SPREAD 01 — FOUNDATION / COVER
 * Full-width editorial artboard:
 * - Center-dominant civic architecture illustration with watercolor wash
 * - Large bold display typography directly underneath: 'PUBLIC SERVICE, MASTERED'
 * - Left asymmetric column with category label, paragraph, and dual CTAs
 * - Top-right 'M /' diagonal slash mark
 * - Far-right margin: vertical running display text
 * - Bottom-right: solid cobalt blue accent block
 * - Generous, airy negative space on warm ivory paper
 */
export const SpreadOneFoundation: React.FC = () => {
  return (
    <section
      id="spread-01"
      className="relative w-full bg-[#FAF8F2] text-[#0A0A0A] border-b border-[#E8E2D5] min-h-[calc(100svh-4.5rem)] flex flex-col justify-between py-6 sm:py-8 lg:py-10 px-6 sm:px-12 lg:px-16 xl:px-20 select-none overflow-hidden"
    >
      <div className="relative h-full w-full max-w-[1440px] mx-auto flex flex-col justify-between flex-1">

        {/* ── Top row: left graphic lockup + top-right 'M /' slash mark ── */}
        <div className="flex items-start justify-between shrink-0 relative z-20 pt-2">
          {/* Top-Left: "Part. 01" + Statutory Standards label */}
          <div className="flex items-start gap-4 text-left">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">
                Part.
              </span>
              <span className="font-sans text-3xl sm:text-4xl font-black text-black leading-none">
                01
              </span>
            </div>
            <div className="space-y-0.5 pt-0.5 border-l border-zinc-300 pl-3">
              <span className="block font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                Statutory
              </span>
              <span className="block font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                Standards
              </span>
            </div>
          </div>
        </div>

        {/* ── Center Stage: Centered Architecture + Bold Display Wordmark Underneath ── */}
        <div className="flex flex-col items-center justify-center my-auto py-4 sm:py-6 relative z-10">
          {/* Central Architecture Illustration */}
          <div className="flex items-center justify-center max-w-[580px] w-full">
            <img
              src="/illustrations/spread1_civic_architecture_v2.png"
              alt="Hand-drawn architectural illustration of a classical municipal secretariat"
              className="max-h-[30vh] sm:max-h-[40vh] lg:max-h-[46vh] w-auto max-w-full object-contain mix-blend-multiply drop-shadow-sm"
              loading="eager"
            />
          </div>

          {/* Large Bold Sans Display Wordmark directly underneath */}
          <div className="text-center mt-3 sm:mt-5 select-none">
            <h1 className="font-sans text-[clamp(24px,4.5vw,62px)] font-black uppercase tracking-[0.14em] text-black leading-none">
              Public service, <span className="text-[#AF411E]">mastered</span>
            </h1>
          </div>
        </div>

        {/* ── Left Column: Editorial Paragraph + Brand Signature + CTAs ── */}
        <div className="relative z-20 w-full sm:max-w-[240px] lg:max-w-[300px] mb-4 space-y-3 text-left">
          <span className="font-mono text-[10px] uppercase font-extrabold tracking-[0.24em] text-[#0E50B0] block">
            Civil Competency Platform
          </span>

          <p className="font-sans text-[12px] sm:text-[13px] text-zinc-600 leading-relaxed">
            A specialized civil institution designed for the officers who master statutory workflows with quiet institutional rigor.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-start gap-2 pt-1 pointer-events-auto">
            <Link
              to="/module"
              role="button"
              className="inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-zinc-800 text-white font-mono text-[9px] sm:text-[10px] uppercase font-bold tracking-wider cursor-pointer transition-colors shadow-sm"
            >
              <span>Explore the Curriculum</span>
              <span>→</span>
            </Link>
            <Link
              to="/citizen"
              role="button"
              className="font-mono text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-zinc-500 hover:text-[#AF411E] underline decoration-1 underline-offset-4 cursor-pointer transition-colors"
            >
              <span>Pre-check a citizen document</span>
            </Link>
          </div>
        </div>

        {/* ── Far Right Margin: Vertical Running Display Text ── */}
        <div className="hidden sm:flex absolute top-1/2 -translate-y-1/2 right-0 sm:right-2 lg:right-4 flex-col items-center select-none pointer-events-none z-20">
          <span
            className="font-sans text-[11px] sm:text-xs font-black uppercase tracking-[0.28em] text-black whitespace-nowrap opacity-90"
            style={{ writingMode: 'vertical-rl' }}
          >
            CIVIC RIGOR • SERVE THE PEOPLE
          </span>
        </div>

        {/* ── Bottom Row: Brand lockup on left + Solid blue square on bottom-right ── */}
        <div className="flex items-end justify-between shrink-0 relative z-20 pt-4 border-t border-zinc-200/60">
          {/* Left: Brand signature + statutory partner colophon */}
          <div className="space-y-1">
            <span className="block font-sans text-xs font-black uppercase tracking-wider text-black">
              GOVSKILL
            </span>
            <div className="flex flex-wrap items-center gap-2 text-[9px] font-mono uppercase tracking-[0.16em] text-zinc-500">
              <span>Statutory Frameworks & Institutional Standards</span>
              <span>•</span>
              <span>Department of Revenue & Land Records</span>
              <span>•</span>
              <span>Kerala State IT Mission</span>
            </div>
          </div>

          {/* Bottom-Right: Solid Cobalt Blue Accent Rectangle */}
          <div
            className="w-10 h-6 sm:w-12 sm:h-7 bg-[#0E50B0] select-none pointer-events-none"
            aria-hidden="true"
          />
        </div>

      </div>
    </section>
  );
};

export default SpreadOneFoundation;
