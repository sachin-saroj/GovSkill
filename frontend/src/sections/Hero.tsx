import React from 'react';
import { Link } from 'react-router-dom';
import { Eyebrow, BodyText } from '@/design-system/typography';
import { IllustrationFrame } from '@/components/IllustrationFrame';

export const Hero: React.FC = () => {
  return (
    <section className="relative w-full bg-white text-black min-h-[calc(100vh-80px)] flex flex-col justify-between pt-8 sm:pt-14 pb-0 overflow-hidden border-b border-[#E4E4E7]">
      <div className="max-w-[1440px] w-full mx-auto px-[clamp(20px,5vw,80px)] flex-1 flex flex-col justify-center">
        {/* Editorial Top Chapter Lockup: "Part. 01" convention */}
        <div className="flex items-baseline justify-between border-b border-[#E4E4E7] pb-4 mb-8 sm:mb-12">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-xs uppercase font-bold tracking-[0.25em] text-zinc-400">
              Part.
            </span>
            <span className="font-sans text-3xl sm:text-4xl font-black tracking-tighter text-black">
              01
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase font-bold tracking-[0.25em] text-zinc-400 hidden sm:inline-block">
            ARCHIVE VOL. 50 // AMBITIOUS GOVERNANCE
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Two-Tier Headline Convention (35%) */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 z-10">
            <Eyebrow>Civil Competency Platform</Eyebrow>

            <div className="space-y-4">
              <h1 className="font-sans font-black uppercase text-[clamp(44px,6.2vw,86px)] leading-[0.92] tracking-[-0.035em] text-black">
                Public service,<br />
                <span className="text-[#0E50B0] inline-block font-black">mastered</span> with<br />
                quiet rigor.
              </h1>

              {/* Razor-thin 1px black ink line */}
              <div className="w-16 h-[2px] bg-black pt-0 my-3" aria-hidden="true" />

              <BodyText size="lg" muted className="max-w-[540px] text-zinc-600 pt-1">
                GovSkill prepares local administrative officers through grounded
                curriculum modules, while GovAssist guides citizens with verified
                pre-submission document checks before they arrive at the counter.
              </BodyText>
            </div>

            {/* CTA Group: Flat, sharp editorial buttons */}
            <div className="flex flex-wrap items-center gap-5 pt-2">
              <Link
                to="/module"
                role="button"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-black text-white text-[14px] font-bold tracking-wide rounded-none transition-all duration-150 ease-out hover:bg-zinc-800 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-black outline-none border border-black shadow-[2px_2px_0px_rgba(0,0,0,0.15)]"
              >
                <span>Explore the Curriculum</span>
                <span className="text-[13px] transition-transform duration-150 ease-out group-hover:translate-x-1">→</span>
              </Link>

              <Link
                to="/citizen"
                role="button"
                className="group relative inline-flex items-center text-[14px] font-bold text-black py-1.5 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-black outline-none"
              >
                <span className="relative">
                  Pre-check a citizen document
                  <span
                    className="absolute left-0 -bottom-0.5 w-full h-[1.5px] bg-black origin-left scale-x-0 transition-transform duration-200 ease-out group-hover:scale-x-100"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </div>
          </div>

          {/* Right Column: Full-Bleed Illustration Field (65%) */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            <div className="w-full max-w-[560px] border border-[#E4E4E7] bg-white p-3 shadow-[4px_4px_0px_rgba(0,0,0,0.06)]">
              <IllustrationFrame
                src="/illustrations/spread1_civic_architecture.jpg"
                alt="Editorial architectural illustration of a classical municipal government secretariat with terracotta botanical watercolor wash"
                aspectRatio="16:9"
                illustrationKey="hero"
                variant="plate"
                figureNumber="01"
                figureTitle="Civic Architecture & Public Trust"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Editorial Scroll Cue */}
      <div className="relative w-full flex flex-col items-center justify-center pt-8 pb-8">
        <div className="flex items-center gap-3 text-zinc-400 text-[10px] font-mono uppercase tracking-[0.25em] select-none">
          <span>SCROLL TO EXAMINE</span>
          <div className="relative w-[1px] h-8 bg-zinc-300 overflow-hidden">
            <div className="absolute top-0 left-[-1.5px] w-1 h-1 rounded-full bg-black animate-scroll-dot" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
