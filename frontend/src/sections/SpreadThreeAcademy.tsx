import React from 'react';
import { Link } from 'react-router-dom';

/**
 * SPREAD 03 — PLATFORM / COMPETENCY
 * Full-width editorial artboard:
 * - Far left: vertical rotated tag ("COMPETENCY")
 * - Center-left: typography column with Part. 03 lockup, headline, paragraph, and CTA
 * - Editorial system labels: Training • GovAssist • Competency • Verification
 * - Competency Domains typographic tags
 * - Right side: female officer portrait facing inward with generous whitespace
 * - Clean, measured whitespace on warm ivory paper
 */
export const SpreadThreeAcademy: React.FC = () => {
  return (
    <section
      id="spread-03"
      className="relative w-full bg-[#FAF8F2] text-[#0A0A0A] border-b border-[#E8E2D5] min-h-[92vh] flex flex-col justify-between py-8 sm:py-12 lg:py-14 px-6 sm:px-12 lg:px-16 xl:px-20 select-none overflow-hidden"
    >
      <div id="curriculum" className="absolute -top-24 left-0 w-0 h-0" aria-hidden="true" />
      <div className="relative h-full w-full max-w-[1440px] mx-auto flex flex-col justify-between flex-1">

        {/* ── Top Row: Part. 03 Sequential Lockup & Platform Rail ── */}
        <div className="flex items-start justify-between shrink-0 relative z-20 pt-2 border-b border-zinc-200/80 pb-3">
          <div className="flex items-center gap-4 text-left">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">
                Part.
              </span>
              <span className="font-sans text-3xl sm:text-4xl font-black text-black leading-none">
                03
              </span>
            </div>
            <div className="space-y-0.5 border-l border-zinc-300 pl-3">
              <span className="block font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#0E50B0]">
                Platform Infrastructure
              </span>
              <span className="block font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                Civic Workflow Architecture
              </span>
            </div>
          </div>
        </div>

        {/* ── Main Composition: Left Editorial Column + Right Real Platform Showcase ── */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-14 my-auto py-4">

          {/* ── Left Side: Editorial Text & Typography Column ── */}
          <div className="w-full lg:w-[48%] flex flex-col justify-center space-y-4 sm:space-y-5 z-20">

            {/* Dominant Display Typography */}
            <div className="space-y-1.5">
              <h2 className="font-sans text-[clamp(26px,3.4vw,46px)] font-black uppercase tracking-tight text-black leading-[1.06]">
                ONE PLATFORM. <br />
                <span className="text-[#0E50B0]">MANY CIVIC WORKFLOWS.</span>
              </h2>
              <div className="w-14 h-0.5 bg-[#0E50B0] mt-1" />
            </div>

            {/* Label */}
            <div className="space-y-0.5">
              <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#AF411E]">
                Institutional Purpose
              </span>
              <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                Officer Competency Academy
              </span>
            </div>

            {/* Editorial Body Text */}
            <p className="font-sans text-[13px] sm:text-[14px] text-zinc-600 leading-relaxed max-w-[420px]">
              GovSkill is crafted for the dedicated officers who <span className="text-[#0E50B0] font-bold underline underline-offset-4 decoration-[#0E50B0]">serve</span> the public.
              One platform connects training, competency assessment, citizen assistance, and verification across civic workflows.
            </p>

            {/* Primary Action Button */}
            <div className="pt-1">
              <Link
                to="/module"
                role="button"
                className="inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-zinc-800 text-white font-mono text-[10px] uppercase font-bold tracking-wider cursor-pointer transition-colors shadow-sm w-fit"
              >
                <span>View Administrative Curriculum</span>
                <span>→</span>
              </Link>
            </div>

            {/* Editorial System Flow + Competency Domains */}
            <div className="space-y-3 pt-2 select-none">
              <div className="flex items-center gap-2 text-[9px] font-mono uppercase font-bold tracking-[0.22em] text-zinc-500">
                <span className="text-black">Training</span>
                <span className="text-zinc-300">→</span>
                <span className="text-[#0E50B0]">GovAssist</span>
                <span className="text-zinc-300">→</span>
                <span className="text-black">Competency</span>
                <span className="text-zinc-300">→</span>
                <span className="text-[#AF411E]">Verification</span>
              </div>

              <div>
                <span className="font-mono text-[9px] uppercase font-bold tracking-[0.2em] text-zinc-400 block mb-1.5">
                  Competency Domains
                </span>
                <div className="flex flex-wrap gap-2">
                  <span className="font-mono text-[9px] px-2.5 py-1 border border-black text-black font-semibold bg-white shadow-xs">
                    Income Certificate Verification
                  </span>
                  <span className="font-mono text-[9px] px-2.5 py-1 border border-zinc-300 text-zinc-600 bg-white/60">
                    Temporal Validity Horizons
                  </span>
                  <span className="font-mono text-[9px] px-2.5 py-1 border border-zinc-300 text-zinc-600 bg-white/60">
                    Statutory Counter Slips
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Side: Real Platform Dashboard Showcase (Browser Framed) ── */}
          <div className="w-full lg:w-[52%] flex items-center justify-center lg:justify-end select-none relative">
            <div className="w-full max-w-[580px] rounded-2xl shadow-xl border border-zinc-300/80 bg-white overflow-hidden transition-transform duration-300 hover:scale-[1.01]">
              <img
                src="/illustrations/spread3_platform_dashboard.png"
                alt="Real GovSkill platform interface showcase displaying the employee digital competency ledger, operational readiness, and curriculum modules"
                className="max-h-[38vh] sm:max-h-[55vh] lg:max-h-[70vh] w-auto max-w-full object-contain pointer-events-none drop-shadow-sm"
                loading="eager"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default SpreadThreeAcademy;
