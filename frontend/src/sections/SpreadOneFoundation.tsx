import React from 'react';
import { Link } from 'react-router-dom';
import { Link000 } from '@/components/ui/skiper-ui/skiper40';
import { ProgressiveBlur } from '@/components/ui/skiper-ui/skiper41';
import { useReveal } from '@/hooks/useReveal';

/**
 * SPREAD 01 — FOUNDATION / HERO
 * Professional Editorial Hero:
 * - Minimal category indicator: 'Civil Competency Platform'
 * - Monumental Fraunces serif display with rock-solid, stable typography
 * - Pure, borderless presentation of civic architecture illustration
 * - High-contrast dual CTAs: 'Explore the Curriculum' & 'Pre-check a citizen document'
 * - Trust colophon: 'Statutory Frameworks & Institutional Standards'
 * - Preserves all required test assertions: 'Civil Competency Platform', 'Public service,', 'mastered', 'Explore the Curriculum', 'Pre-check a citizen document', 'Statutory Frameworks & Institutional Standards', 'Department of Revenue & Land Records', 'Kerala State IT Mission'
 */
export const SpreadOneFoundation: React.FC = () => {
  const { ref, revealed } = useReveal(0.08);

  return (
    <section
      id="spread-01"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative w-full bg-[#FAF8F2] text-[#0A0A0A] border-b border-[#E8E2D5] min-h-[calc(100svh-4rem)] flex flex-col justify-between py-8 sm:py-12 lg:py-14 px-6 sm:px-12 lg:px-16 xl:px-20 select-none overflow-hidden"
    >
      <div className="relative h-full w-full max-w-[1280px] mx-auto flex flex-col justify-between flex-1">

        {/* ── Center Stage: Title + Architectural Centerpiece ── */}
        <div className="flex flex-col items-center justify-center my-auto py-4 sm:py-6 relative z-10 text-center">
          
          {/* Overline Badge */}
          <div className={`space-y-3 max-w-3xl mx-auto spread-reveal spread-reveal-delay-1 ${revealed ? 'revealed' : ''}`}>
            <span className="inline-block text-[11px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#0E50B0] font-semibold">
              Civil Competency Platform
            </span>
            
            <h1 className="font-serif text-[clamp(40px,6.5vw,84px)] font-normal text-zinc-950 leading-[1.02] tracking-tight">
              <span className="inline-block whitespace-nowrap">Public service,</span>{' '}
              <span className="italic font-light text-[#AF411E] inline-block whitespace-nowrap">
                mastered
              </span>
            </h1>

            <p className="font-sans text-[14px] sm:text-[16px] text-zinc-600 max-w-xl mx-auto leading-relaxed pt-1">
              A specialized civil institution designed for local government officers to master statutory procedures and evaluate competencies with quiet rigor.
            </p>
          </div>

          {/* Central Architecture Plate (Clean, Organic, Uncluttered) */}
          <div className={`relative mt-6 sm:mt-8 max-w-[560px] w-full spread-reveal spread-reveal-delay-2 ${revealed ? 'revealed' : ''}`}>
            <div className="flex items-center justify-center overflow-hidden">
              <img
                src="/illustrations/spread1_civic_architecture_v2.png"
                alt="Hand-drawn architectural illustration of a classical municipal secretariat"
                className="max-h-[28vh] sm:max-h-[36vh] w-auto max-w-full object-contain mix-blend-multiply drop-shadow-sm image-stable"
                loading="eager"
              />
            </div>
          </div>

          {/* Dual Action Station — Quiet Editorial Hierarchy */}
          <div className={`flex flex-wrap items-center justify-center gap-5 pt-6 sm:pt-8 pointer-events-auto spread-reveal spread-reveal-delay-3 ${revealed ? 'revealed' : ''}`}>
            <Link
              to="/module"
              role="button"
              className="inline-flex items-center gap-2 px-4.5 py-2 bg-zinc-950 hover:bg-zinc-800 text-white font-mono text-[10.5px] uppercase tracking-[0.16em] transition-colors"
            >
              <span>Explore the Curriculum</span>
              <span className="text-xs leading-none">→</span>
            </Link>
            <Link000
              href="/citizen"
              role="button"
              className="skiper40-link inline-flex items-center gap-1.5 py-2 font-mono text-[11px] sm:text-xs uppercase tracking-[0.14em] text-zinc-700 hover:text-[#AF411E] transition-colors"
            >
              <span>Pre-check a citizen document</span>
              <span className="text-xs leading-none">→</span>
            </Link000>
          </div>

        </div>

        {/* ── Bottom Row: Clean, quiet trust colophon without clutter ── */}
        <div className={`shrink-0 relative z-20 pt-6 border-t border-zinc-200/80 spread-reveal spread-reveal-delay-4 ${revealed ? 'revealed' : ''}`}>
          <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.16em] text-zinc-500">
            <span className="font-semibold text-zinc-700">
              Statutory Frameworks & Institutional Standards
            </span>
            <div className="flex items-center gap-3 text-zinc-400">
              <span>Department of Revenue & Land Records</span>
              <span>•</span>
              <span>Kerala State IT Mission</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Progressive Blur transition to next spread ── */}
      <ProgressiveBlur position="bottom" height="60px" backgroundColor="#FAF8F2" blurAmount="3px" />
    </section>
  );
};

export default SpreadOneFoundation;
