import React from 'react';
import { Eyebrow, FigureCaption } from '@/design-system/typography';
import { IllustrationFrame } from '@/components/IllustrationFrame';

export const Statement: React.FC = () => {
  return (
    <section className="w-full bg-[#F5EFE0] py-[clamp(80px,12vh,180px)] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-[clamp(20px,5vw,80px)] space-y-12 sm:space-y-16">
        <div className="text-left">
          <Eyebrow>Institutional Purpose</Eyebrow>
        </div>

        {/* Headline */}
        <div className="max-w-[980px]">
          <h2
            className="font-serif font-normal text-[clamp(44px,6vw,84px)] leading-[1.06] tracking-[-0.03em] text-[#0A0A0A]"
            style={{ fontFamily: '"Fraunces", Georgia, serif' }}
          >
            GovSkill is crafted for the dedicated officers who <em className="italic font-normal">serve</em> the public.
          </h2>
          {/* Mobile-only view for closing paragraph */}
          <p className="sm:hidden font-serif text-[15px] text-[#6B6357] leading-relaxed pt-4">
            When front-desk officers have verified curriculum, grounded AI guidance, and tamper-evident evaluation, citizens receive statutory decisions with dignity, precision, and transparency.
          </p>
        </div>

        {/* Illustration 2 Container with Editorial Inset Overlays */}
        <div className="relative w-full">
          <IllustrationFrame
            src="/illustrations/statement-assembly.jpg"
            alt="Editorial illustration of a loose crowd of citizens and civil servants walking together across a wide public plaza under a cream sky"
            aspectRatio="16:9"
            illustrationKey="statement"
            variant="clean"
            caption={
              <FigureCaption
                figureNumber="02"
                title="Collective stewardship and civic responsibility across public plazas"
              />
            }
          />

          {/* Overlay: Upper Negative Space Right-Aligned Closing Paragraph (Max 40ch, Ink at 80%) */}
          <div className="absolute top-6 sm:top-10 right-6 sm:right-10 z-20 max-w-[40ch] text-right pointer-events-none hidden sm:block">
            <p className="font-serif text-[15px] sm:text-[17px] text-[#0A0A0A]/80 leading-relaxed bg-[#F5EFE0]/85 p-4 rounded-xl backdrop-blur-[2px] border border-[#D9CFBB]/50 shadow-sm">
              When front-desk officers have verified curriculum, grounded AI guidance, and tamper-evident evaluation, citizens receive statutory decisions with dignity, precision, and transparency.
            </p>
          </div>

          {/* Overlay: Bottom-Left Italic Serif Pull-Quote in Terracotta */}
          <div className="absolute bottom-14 sm:bottom-16 left-6 sm:left-10 z-20 max-w-[36ch] pointer-events-none hidden sm:block">
            <p className="font-serif italic text-[15px] sm:text-[17px] text-[#C97B5A] leading-snug bg-[#F5EFE0]/90 p-3 rounded-lg backdrop-blur-[2px] border border-[#D9CFBB]/40 shadow-sm">
              “A republic’s enduring trust begins quietly at the front desk.”
            </p>
          </div>
        </div>

        {/* Editorial Section Break: Horizontal 1px rule with small circular dot at its center-left */}
        <div className="relative w-full pt-8 pb-2 flex items-center">
          <div className="w-full h-[1px] bg-[#D9CFBB]" />
          <div
            className="absolute left-[28%] -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#0A0A0A]"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
};

export default Statement;
