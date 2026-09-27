import React from 'react';
import { Link } from 'react-router-dom';

/**
 * SPREAD 05 — OUTCOME / AMBITIOUS
 * Full-width editorial artboard:
 * - Completely unified with Spreads 01-04 on warm ivory paper
 * - Large, confident typography: 'AMBITIOUS.' + 'Serve better.' in editorial serif italic
 * - Hand-drawn ink & watercolor outcome illustration: two proud officers with verified dossiers
 * - Gateway CTA: 'Get Started →' linking to /login for officers and supervisors
 * - Statutory colophon: DPDP Act 2023 Compliant • Statutory Data Safeguards
 * - Confident asymmetry, generous negative space, no card frames
 */
export const SpreadFiveAmbitious: React.FC = () => {
  return (
    <section
      id="spread-05"
      className="relative w-full bg-[#FAF8F2] text-[#0A0A0A] min-h-[92vh] flex flex-col justify-between py-8 sm:py-12 lg:py-14 px-6 sm:px-12 lg:px-16 xl:px-20 select-none overflow-hidden"
    >
      <div className="relative h-full w-full max-w-[1440px] mx-auto flex flex-col justify-between flex-1">

        {/* ── Top Row: Part. 05 Sequential Lockup ── */}
        <div className="flex items-start justify-between shrink-0 relative z-20 pt-2 border-b border-zinc-200/80 pb-3">
          <div className="flex items-center gap-4 text-left">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">
                Part.
              </span>
              <span className="font-sans text-3xl sm:text-4xl font-black text-black leading-none">
                05
              </span>
            </div>
            <div className="space-y-0.5 border-l border-zinc-300 pl-3">
              <span className="block font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#AF411E]">
                Civic Mastery
              </span>
              <span className="block font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                Public Outcome
              </span>
            </div>
          </div>
        </div>

        {/* ── Main Composition: Left Statement & CTA + Right Hand-Drawn Outcome Illustration ── */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-14 my-auto py-6">

          {/* ── Left Side: Dominant Statement + Narrative + Gateway Action ── */}
          <div className="w-full lg:w-[48%] flex flex-col justify-center space-y-5 lg:pr-4 z-20">

            {/* Dominant Headline Lockup: 'AMBITIOUS.' + 'Serve better.' */}
            <div className="space-y-1">
              <span className="font-mono text-[10px] sm:text-[11px] uppercase font-extrabold tracking-[0.28em] text-[#0E50B0] block">
                THE INSTITUTIONAL GOAL
              </span>
              <h2 className="font-sans text-[clamp(44px,6.8vw,88px)] font-black uppercase tracking-tight text-black leading-[0.96]">
                AMBITIOUS.
              </h2>
              <div className="font-serif italic text-3xl sm:text-4xl text-[#AF411E] pt-1">
                <span>Serve</span> <span className="underline underline-offset-4 decoration-[#0E50B0]">better.</span>
              </div>
            </div>

            {/* Narrative Body Copy */}
            <p className="font-sans text-[13px] sm:text-sm text-zinc-600 leading-relaxed max-w-[440px]">
              When officers master statutory workflows, public service transforms from bureaucratic delay into citizen trust. Clear procedures. Uncompromising diligence. Dignity restored to the civic counter.
            </p>

            {/* Primary Gateway Pill Button linking to /login */}
            <div className="pt-2 space-y-2.5">
              <Link
                to="/login"
                role="button"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-black hover:bg-zinc-800 text-white font-mono text-[11px] sm:text-xs uppercase font-bold tracking-wider transition-all shadow-md hover:shadow-lg hover:scale-[1.01] w-fit"
              >
                <span>Get Started</span>
                <span className="text-sm leading-none">→</span>
              </Link>
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-400">
                <span>Officer & Supervisor Gateway</span>
                <span>•</span>
                <Link to="/citizen" className="hover:text-black underline underline-offset-2 transition-colors">
                  Citizen Pre-Check
                </Link>
              </div>
            </div>

          </div>

          {/* ── Right Side: Commissioned Ink & Watercolor Outcome Artwork (Officer Ananya) ── */}
          <div className="w-full lg:w-[52%] flex items-center justify-center select-none relative">
            <img
              src="/illustrations/spread5_ananya_ambitious.png"
              alt="Editorial hand-drawn watercolor illustration of Officer Ananya holding certified statutory dossiers outside the municipal secretariat portico"
              className="max-h-[38vh] sm:max-h-[55vh] lg:max-h-[76vh] w-auto max-w-full object-contain pointer-events-none drop-shadow-sm"
              loading="eager"
            />
          </div>

        </div>

        {/* ── Bottom Row: Downward anchor + Statutory Compliance Colophon ── */}
        <div className="flex items-center justify-between shrink-0 relative z-20 pt-4 border-t border-zinc-200/80 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.16em] text-zinc-500">
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="text-base leading-none">↓</span>
            <span className="hidden sm:inline text-[9px]">GovSkill Administrative Platform</span>
          </div>
          <span className="font-medium text-zinc-600">
            DPDP Act 2023 Compliant • Statutory Data Safeguards • Kerala State IT Mission
          </span>
        </div>

      </div>
    </section>
  );
};

export default SpreadFiveAmbitious;
