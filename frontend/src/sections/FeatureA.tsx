import React from 'react';
import { Link } from 'react-router-dom';
import { Eyebrow, DisplaySerif, BodyText } from '@/design-system/typography';
import { IllustrationFrame } from '@/components/IllustrationFrame';

export const FeatureA: React.FC = () => {
  return (
    <section id="govassist" className="w-full bg-[#F5EFE0] py-[clamp(80px,12vh,160px)]">
      <div className="max-w-[1440px] mx-auto px-[clamp(20px,5vw,80px)]">
        {/* Asymmetric Split: 7/5 Grid (Left: Framed Illustration, Right: Editorial Content) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Framed Illustration 3 with Gallery Plate */}
          <div className="lg:col-span-7">
            <IllustrationFrame
              src="/illustrations/feature-a-inspection.jpg"
              alt="Editorial still life of an official certificate document with red administrative seal, typewriter-style ruled lines, fountain pen, and magnifying glass"
              aspectRatio="4:3"
              illustrationKey="featureA"
              variant="plate"
              figureNumber="03"
              figureTitle="Statutory Rule Inspection"
            />
          </div>

          {/* Right Column: Heading, Body, CTA, and 40px Terracotta Rule */}
          <div className="lg:col-span-5 space-y-6">
            <Eyebrow>Citizen Pre-Submission Validation</Eyebrow>

            <DisplaySerif
              as="h2"
              size="md"
              text="Verification governed by immutable code."
              italicWord="immutable"
              className="text-[#0A0A0A] leading-[1.12]"
            />

            <BodyText size="base" muted className="text-[#6B6357] leading-relaxed">
              Before traveling to a Taluk office, citizens verify their income certificate.
              Four deterministic rules evaluate issuing authority, temporal validity horizons,
              official seal clarity, and document formatting in under three seconds.
            </BodyText>

            <div className="pt-2">
              <Link
                to="/citizen"
                role="button"
                className="group relative inline-flex items-center text-[15px] font-medium text-[#0A0A0A] py-1 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#0A0A0A] focus-visible:ring-offset-2 outline-none"
              >
                <span className="relative">
                  Launch the Pre-Check Tool
                  <span
                    className="absolute left-0 -bottom-0.5 w-full h-[1px] bg-[#0A0A0A] origin-left scale-x-0 transition-transform duration-250 ease-out group-hover:scale-x-100"
                    aria-hidden="true"
                  />
                </span>
                <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              {/* Thin Horizontal Rule Below CTA: 40px wide, terracotta */}
              <div
                className="w-10 h-[1px] bg-[#C97B5A] mt-4"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureA;
