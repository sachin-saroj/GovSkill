import React from 'react';
import { Eyebrow, DisplaySerif, BodyText } from '@/design-system/typography';

export const ImmersiveStage: React.FC = () => {
  return (
    <section className="w-full bg-white py-[clamp(80px,12vh,180px)] border-b border-[#E4E4E7]">
      <div className="max-w-[1440px] mx-auto px-[clamp(20px,5vw,80px)]">
        {/* The 50 Ambitious dark contrast presentation block */}
        <div className="relative w-full bg-black text-white rounded-none sm:rounded-md p-8 sm:p-14 lg:p-20 border border-black space-y-12 overflow-hidden shadow-2xl">
          {/* Subtle Radial Vignette Behind UI Mock */}
          <div
            className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_70%,rgba(14,80,176,0.12)_0%,rgba(0,0,0,0.85)_65%,transparent_100%)]"
            aria-hidden="true"
          />

          {/* Stage Header: Mirroring Spread 2 from 50 Ambitious */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center border-b border-zinc-800 pb-12">
            {/* Left 6 cols: Two-tier headline & editorial body */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-1">
                <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-zinc-400 font-bold block">
                  YOU SHOULD ALWAYS
                </span>
                <h2 className="font-sans text-[clamp(40px,5vw,72px)] font-black uppercase tracking-tight text-white leading-[0.92]">
                  BE DILIGENT
                </h2>
              </div>

              <div className="w-12 h-[2px] bg-[#0E50B0]" aria-hidden="true" />

              <div className="space-y-3">
                <Eyebrow dark>Institutional Command</Eyebrow>

                <DisplaySerif
                  as="h3"
                  size="md"
                  dark
                  text="An administrative interface shaped for unwavering clarity."
                  italicWord="unwavering"
                  className="text-white tracking-[-0.03em] leading-[1.05]"
                />

                <BodyText size="base" dark muted className="text-zinc-400 leading-relaxed">
                  Built purposefully for daily collectorate operations. GovSkill removes
                  ambiguity from officer curriculum study, structured assessments, and citizen
                  document validation through an unhurried, focused digital workspace.
                </BodyText>
              </div>

              {/* Insignia & 50 Standards lockup matching Spread 2 */}
              <div className="pt-4 flex items-center gap-6 border-t border-zinc-800">
                <div className="p-3 border border-zinc-800 bg-zinc-900 flex items-center justify-center">
                  <span className="font-mono text-xs font-black tracking-widest text-[#0E50B0]">GOVSKILL</span>
                </div>
                <div>
                  <div className="font-sans text-3xl font-black text-white leading-none tracking-tight">50</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">STANDARDS</div>
                </div>
              </div>
            </div>

            {/* Right 6 cols: Spread 2 Artwork (Revenue Officer in Cobalt Blue) */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="w-full max-w-[400px] border border-zinc-800 bg-zinc-950 p-2 shadow-2xl">
                <img
                  src="/illustrations/spread2_officer_diligence.jpg"
                  alt="Editorial illustration of an adult revenue officer in cobalt blue tunic seated with official dossier"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
                <div className="pt-2 px-1 flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-t border-zinc-900 mt-2">
                  <span>PLATE 02 // DILIGENCE</span>
                  <span>EST. 2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* Elevate: UI Product Mock */}
          <div className="relative z-10 w-full pt-4">
            <div className="w-full rounded-sm bg-zinc-950 border border-zinc-800 p-5 sm:p-8 shadow-2xl overflow-hidden">
              {/* Application Window Chrome */}
              <div className="flex items-center justify-between pb-5 border-b border-zinc-800 text-xs text-zinc-400 font-sans">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  </div>
                  <span className="ml-3 font-mono text-[11px] text-zinc-500 tracking-wider">
                    govskill.internal/workspace/revenue-module-01
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-[11px] uppercase tracking-wider font-mono text-zinc-400 font-bold">
                    Officer Training View
                  </span>
                  {/* Module Pill with 6px dot pulsing once every 4s */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] font-mono text-[#F5EFE0]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24A] animate-dot-pulse-4s" />
                    <span>Module 2 of 4</span>
                  </div>
                </div>
              </div>

              {/* Product UI View: Staggered Staged Workspace */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-start">
                {/* Curriculum Index Column */}
                <div className="lg:col-span-4 space-y-4 bg-[#111111] p-6 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-[#EDE4D0]/60 font-mono">
                      Module 01 • Revenue
                    </div>
                    {/* Sidebar Icon with 60ms Staggered Fade-Up */}
                    <svg
                      className="w-4 h-4 text-[#EDE4D0]/40 transition-opacity duration-300"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      aria-hidden="true"
                    >
                      <path d="M2 4h12M2 8h12M2 12h8" />
                    </svg>
                  </div>

                  <h3 className="font-serif text-xl text-[#F5EFE0] font-normal leading-snug">
                    Statutory Income Certificate Verification
                  </h3>

                  {/* Module Rows with 60ms Staggered Reveal */}
                  <div className="space-y-2.5 pt-2 text-[13px] font-sans text-[#EDE4D0]/75">
                    <div className="p-3 rounded-xl bg-white/5 flex items-center justify-between border border-transparent hover:border-white/10 transition-colors">
                      <span className="font-medium">01. Jurisdiction & Authority</span>
                      <span className="text-[#EDE4D0]/40 text-xs font-mono">Completed</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/10 border border-[#C9A24A]/40 flex items-center justify-between text-[#F5EFE0] shadow-sm">
                      <span className="font-medium">02. Temporal Validity Horizons</span>
                      <span className="text-[#C9A24A] text-xs font-mono font-medium tracking-wide">
                        In Progress
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 flex items-center justify-between border border-transparent hover:border-white/10 transition-colors">
                      <span className="font-medium">03. Seal & Signature Legibility</span>
                      <span className="text-[#EDE4D0]/40 text-xs font-mono">Queued</span>
                    </div>
                  </div>
                </div>

                {/* Main Content Workspace Column */}
                <div className="lg:col-span-8 bg-[#111111] p-6 sm:p-10 rounded-2xl border border-white/5 space-y-6">
                  <div className="flex items-center justify-between text-xs text-[#EDE4D0]/60 pb-3 border-b border-white/5">
                    <span className="font-sans font-medium">Lesson 2: Administrative Horizons</span>
                    <span className="font-mono tabular-nums">Estimated: 08 mins</span>
                  </div>

                  <h4 className="font-serif text-2xl sm:text-3xl text-[#F5EFE0] font-normal leading-tight">
                    Temporal Validity Standards for Welfare Ingestion
                  </h4>

                  <p className="text-[15px] font-sans text-[#EDE4D0]/80 leading-relaxed max-w-[700px]">
                    Under standard revenue procedure, income certificates issued for statutory scholarship
                    and welfare disbursement maintain binding validity for twelve calendar months from
                    the date of signature. Certificates bearing an elapsed period require immediate renewal
                    prior to clerical endorsement.
                  </p>

                  <div className="p-5 rounded-xl bg-white/5 border-l-2 border-[#C9A24A] text-[13px] text-[#EDE4D0]/90 space-y-1">
                    <span className="font-mono uppercase tracking-wider text-[11px] text-[#C9A24A] block">
                      Statutory Directive 04-B
                    </span>
                    <p className="font-sans leading-relaxed">
                      Cross-examine both Gregorian and regional Saka calendar stamps prior to logging
                      the digital dispatch timestamp into the district repository.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImmersiveStage;
