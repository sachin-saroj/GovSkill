import React from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from '../components/ui';
import { Link000 } from '@/components/ui/skiper-ui/skiper40';
import { ProgressiveBlur } from '@/components/ui/skiper-ui/skiper41';
import { CrowdCanvas } from '@/components/ui/skiper-ui/skiper39';
import { useReveal } from '@/hooks/useReveal';

/**
 * SPREAD 05 — OUTCOME / AMBITIOUS
 * Pure Editorial Finale:
 * - Monumental display typography: 'AMBITIOUS.' + 'Serve better.' in Fraunces serif
 * - Elevated upper-section creed with pure typography (no clutter, no boxes, no fake stamps)
 * - Restrained, elegant Skiper39 Animated Crowd Canvas flowing along the lower horizon
 * - Clean typographic triad: 'Better prepared employees. • Clearer civic workflows. • More confident citizens.'
 * - Primary gateway CTA: 'Get Started →' with Skiper40 integration
 * - Statutory colophon: 'DPDP Act 2023 Compliant • Statutory Data Safeguards'
 * - Preserves all required test assertions: 'Serve', 'better.', 'Get Started', 'DPDP Act 2023 Compliant • Statutory Data Safeguards'
 */
export const SpreadFiveAmbitious: React.FC = () => {
  const { ref, revealed } = useReveal(0.12);

  return (
    <section
      id="spread-05"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative w-full bg-[#FAF8F2] text-[#0A0A0A] min-h-[96vh] flex flex-col justify-between pt-12 sm:pt-16 pb-4 px-6 sm:px-12 lg:px-16 xl:px-20 select-none overflow-hidden"
    >
      {/* ── Top progressive blur transition from Spread 04 ── */}
      <ProgressiveBlur position="top" height="50px" backgroundColor="#FAF8F2" blurAmount="3px" />

      {/* ── Skiper39: Animated Civic Crowd Promenade (Subtle Background Canvas) ── */}
      <div
        className="absolute inset-x-0 bottom-12 sm:bottom-14 h-[220px] sm:h-[260px] pointer-events-none z-0 opacity-30 overflow-hidden select-none"
        style={{
          maskImage: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 65%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 65%, rgba(0,0,0,0) 100%)',
        }}
        aria-hidden="true"
      >
        <CrowdCanvas
          src="/images/peeps/all-peeps.png"
          rows={15}
          cols={7}
          className="absolute bottom-0 h-full w-full pointer-events-none"
        />
      </div>

      <div className="relative h-full w-full max-w-[1280px] mx-auto flex flex-col justify-between flex-1 z-10">

        {/* ── Upper Section: Master Centered Typographic Creed ── */}
        <div className={`text-center max-w-3xl mx-auto flex flex-col items-center justify-center space-y-6 relative z-20 spread-reveal spread-reveal-delay-1 ${revealed ? 'revealed' : ''}`}>

          <div className="space-y-3">
            <h2 className="font-serif text-[clamp(44px,7.5vw,96px)] font-normal text-zinc-950 leading-[0.92] tracking-tight">
              AMBITIOUS.
            </h2>

            <div className="font-serif italic text-3xl sm:text-5xl lg:text-6xl text-[#AF411E] font-light">
              <span>Serve</span> <span className="underline underline-offset-8 decoration-[#0E50B0]/70 font-normal">better.</span>
            </div>
          </div>

          <p className="font-sans text-[14.5px] sm:text-[16px] text-zinc-600 leading-relaxed max-w-lg mx-auto">
            When officers master statutory workflows, public service transforms from bureaucratic delay into citizen trust. Clear procedures, quiet diligence, and dignity restored to the civic counter.
          </p>

          {/* Clean Editorial Outcome Triad (Pure Typography without Box Clutter) */}
          <div className="pt-2 pb-1 font-mono text-[11px] sm:text-[12.5px] uppercase tracking-wider text-zinc-700 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5">
            <span className="font-semibold text-zinc-950">Better prepared employees.</span>
            <span className="text-zinc-300 hidden sm:inline">•</span>
            <span className="font-semibold text-zinc-950">Clearer civic workflows.</span>
            <span className="text-zinc-300 hidden sm:inline">•</span>
            <span className="font-semibold text-zinc-950">More confident citizens.</span>
          </div>

          {/* Gateway CTA Row — Quiet Editorial Hierarchy */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-5 w-full">
            <Link
              to="/login"
              role="button"
              className="inline-flex items-center gap-2 px-5 py-2 bg-zinc-950 hover:bg-zinc-800 text-white font-mono text-[10.5px] uppercase tracking-[0.16em] transition-colors"
            >
              <span>Get Started</span>
              <span className="text-xs leading-none">→</span>
            </Link>
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.16em] text-zinc-500">
              <span>Officer & Supervisor Gateway</span>
              <span className="text-zinc-300">•</span>
              <Link000 href="/citizen" className="skiper40-link font-semibold text-zinc-800 hover:text-black">
                Citizen Pre-Check
              </Link000>
            </div>
          </div>

        </div>

        {/* ── Visual Breathing Room for the Lower Walking Stage ── */}
        <div className="flex-1 min-h-[180px] sm:min-h-[220px]" />

        {/* ── Bottom Row: Minimal, Professional Colophon ── */}
        <div className={`flex flex-wrap items-center justify-between gap-4 shrink-0 relative z-30 pt-4 pb-2 bg-[#FAF8F2] border-t border-zinc-200/80 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.16em] text-zinc-500 spread-reveal spread-reveal-delay-2 ${revealed ? 'revealed' : ''}`}>
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="font-semibold text-zinc-600">GovSkill Administrative Platform</span>
            <span>•</span>
            <span>Ed. 2026</span>
          </div>
          <div className="font-medium text-zinc-500 flex items-center gap-2">
            <Tooltip content="Digital Personal Data Protection Act, 2023: Citizen document data isolation, ephemeral processing, and zero PII leakage safeguards.">
              <span className="cursor-help underline decoration-dotted underline-offset-4 text-zinc-700 hover:text-black">
                DPDP Act 2023 Compliant • Statutory Data Safeguards
              </span>
            </Tooltip>
            <span>•</span>
            <span>Kerala State IT Mission</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SpreadFiveAmbitious;
