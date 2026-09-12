import React from 'react';
import { Link } from 'react-router-dom';
import { Eyebrow, BodyText } from '@/design-system/typography';
import { IllustrationFrame } from '@/components/IllustrationFrame';

export const Hero: React.FC = () => {
  return (
    <section className="relative w-full bg-[#F5EFE0] min-h-[calc(100vh-80px)] flex flex-col justify-between pt-8 sm:pt-14 pb-0 overflow-hidden">
      <div className="max-w-[1440px] w-full mx-auto px-[clamp(20px,5vw,80px)] flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left 7 Columns: Editorial Headline and Narrative */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 z-10">
            <Eyebrow>Civil Competency Platform</Eyebrow>

            <div className="space-y-4">
              <h1
                className="font-serif font-normal text-[clamp(56px,7.5vw,108px)] leading-[1.0] tracking-[-0.03em] text-[#0A0A0A]"
                style={{ fontFamily: '"Fraunces", Georgia, serif' }}
              >
                Public service,<br />
                <em className="italic font-normal">mastered</em> with<br />
                quiet rigor.
              </h1>

              {/* 80px wide, 1px, ink at 30% opacity rule */}
              <div className="w-20 h-[1px] bg-[#0A0A0A]/30 pt-0 my-3" aria-hidden="true" />

              <BodyText size="lg" muted className="max-w-[560px] text-[#6B6357] pt-1">
                GovSkill prepares local administrative officers through grounded
                curriculum modules, while GovAssist guides citizens with verified
                pre-submission document checks before they arrive at the counter.
              </BodyText>
            </div>

            {/* CTA Group */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              {/* Primary CTA Pill with 12px Arrow */}
              <Link
                to="/module"
                role="button"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#0A0A0A] text-[#F5EFE0] text-[15px] font-medium tracking-[0.02em] rounded-full transition-all duration-200 ease-out hover:bg-[#1A1A1A] hover:shadow-[0_12px_24px_-8px_rgba(10,10,10,0.25)] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#0A0A0A] focus-visible:ring-offset-2 outline-none"
              >
                <span>Explore the Curriculum</span>
                <span className="text-[12px] transition-transform duration-200 ease-out group-hover:translate-x-1">→</span>
              </Link>

              {/* Secondary Link */}
              <Link
                to="/citizen"
                role="button"
                className="group relative inline-flex items-center text-[15px] font-medium text-[#0A0A0A] py-1 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#0A0A0A] focus-visible:ring-offset-2 outline-none"
              >
                <span className="relative">
                  Pre-check a citizen document
                  <span
                    className="absolute left-0 -bottom-0.5 w-full h-[1px] bg-[#0A0A0A] origin-left scale-x-0 transition-transform duration-250 ease-out group-hover:scale-x-100"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </div>
          </div>

          {/* Right 5 Columns: Editorial Illustration 1 */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="w-full max-w-[450px] transform lg:translate-y-[-6px]">
              <IllustrationFrame
                src="/illustrations/hero-civil-servant.jpg"
                alt="Editorial illustration of a civil servant seated at a wooden desk reviewing an official document with quiet focus under morning window light"
                aspectRatio="3:4"
                illustrationKey="hero"
                variant="plate"
                figureNumber="01"
                figureTitle="Administrative Focus & Duty"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Editorial Scroll Cue: Vertical line 40px with traveling dot */}
      <div className="relative w-full flex flex-col items-center justify-center pt-8 pb-10 sm:pb-14">
        <div className="flex items-center gap-3 text-[#6B6357] text-[11px] font-mono uppercase tracking-[0.2em] select-none">
          <span>SCROLL TO EXAMINE</span>
          <div className="relative w-[1px] h-10 bg-[#0A0A0A]/25 overflow-hidden">
            <div className="absolute top-0 left-[-1.5px] w-1 h-1 rounded-full bg-[#0A0A0A] animate-scroll-dot" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
