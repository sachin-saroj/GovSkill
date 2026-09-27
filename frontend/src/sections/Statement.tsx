import React from 'react';
import { Eyebrow } from '@/design-system/typography';

export const Statement: React.FC = () => {
  return (
    <section className="w-full bg-white text-black py-[clamp(80px,12vh,180px)] overflow-hidden border-b border-[#E4E4E7]">
      <div className="max-w-[1440px] mx-auto px-[clamp(20px,5vw,80px)] space-y-10 sm:space-y-14">
        {/* Chapter marker header */}
        <div className="flex items-baseline justify-between border-b border-[#E4E4E7] pb-4">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-xs uppercase font-bold tracking-[0.25em] text-zinc-400">
              Part.
            </span>
            <span className="font-sans text-3xl font-black tracking-tighter text-black">
              03
            </span>
          </div>
          <Eyebrow>Institutional Purpose</Eyebrow>
        </div>

        {/* Spread 3 Layout: Mirroring 50 Ambitious Spread 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: 50 Standards lockup + Officer Portrait */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-1">
              <span className="font-sans text-5xl font-black tracking-tight text-black block">50</span>
              <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#0E50B0] block">
                STANDARDS OF CIVIC CRAFT
              </span>
            </div>

            <div className="border border-[#E4E4E7] bg-white p-3 shadow-[4px_4px_0px_rgba(0,0,0,0.06)]">
              <img
                src="/illustrations/spread3_officer_portrait.jpg"
                alt="Editorial illustration of a smiling, capable adult civil service officer"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
              <div className="pt-2 px-1 flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-t border-[#E4E4E7] mt-2">
                <span>PLATE 03 // OFFICER ACADEMY</span>
                <span>VERIFIED</span>
              </div>
            </div>
          </div>

          {/* Right Column: Statement, Editorial Columns, Studio Mark, & 3 Stacked Plates */}
          <div className="lg:col-span-7 space-y-8">
            <div className="max-w-[720px] space-y-4">
              <h2 className="font-sans font-black uppercase text-[clamp(32px,4vw,60px)] leading-[0.96] tracking-[-0.03em] text-black">
                GovSkill is crafted for the dedicated officers who <span className="text-[#0E50B0] inline-block font-black">serve</span> the public.
              </h2>
              <p className="font-sans text-[15px] text-zinc-600 leading-relaxed">
                When front-desk officers have verified curriculum, grounded AI guidance, and tamper-evident evaluation, citizens receive statutory decisions with dignity, precision, and transparency.
              </p>
            </div>

            {/* Studio Mark & 3 Stacked Thumbnail Plates matching Spread 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-2 items-center border-t border-[#E4E4E7]">
              {/* Studio Mark */}
              <div className="sm:col-span-5 space-y-2">
                <div className="font-mono text-xs font-black uppercase tracking-widest text-black">
                  GOVSKILL / ACADEMY
                </div>
                <p className="font-mono text-[11px] text-zinc-500 uppercase tracking-wider leading-relaxed">
                  Institutional syllabus curated alongside senior revenue superintendents.
                </p>
              </div>

              {/* 3 Stacked Thumbnail Cards with Colored Accents */}
              <div className="sm:col-span-7 space-y-2">
                <div className="p-2.5 border border-[#E4E4E7] bg-zinc-50 flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-black uppercase">01. Income Certification</span>
                  <span className="text-[10px] text-[#0E50B0] uppercase font-bold tracking-wider">MODULE A</span>
                </div>
                <div className="p-2.5 border border-[#E4E4E7] bg-zinc-50 flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-black uppercase">02. Land Registry Folios</span>
                  <span className="text-[10px] text-[#AF411E] uppercase font-bold tracking-wider">MODULE B</span>
                </div>
                <div className="p-2.5 border border-[#E4E4E7] bg-zinc-50 flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-black uppercase">03. Commercial Trade Permits</span>
                  <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-wider">MODULE C</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Editorial Section Break */}
        <div className="relative w-full pt-6 pb-2 flex items-center">
          <div className="w-full h-[1px] bg-[#E4E4E7]" />
          <div
            className="absolute left-[28%] -translate-x-1/2 w-2 h-2 bg-black"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
};

export default Statement;
