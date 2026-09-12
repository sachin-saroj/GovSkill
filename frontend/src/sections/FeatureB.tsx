import React from 'react';
import { Link } from 'react-router-dom';
import { Eyebrow, DisplaySerif, BodyText } from '@/design-system/typography';
import { IllustrationFrame } from '@/components/IllustrationFrame';

export const FeatureB: React.FC = () => {
  return (
    <section id="curriculum" className="w-full bg-[#F5EFE0] py-[clamp(80px,12vh,160px)] border-t border-[#D9CFBB]/70">
      <div className="max-w-[1440px] mx-auto px-[clamp(20px,5vw,80px)]">
        {/* Mirrored Asymmetric Split: 5 Cols Left (Content), 7 Cols Right (Dominant UI Frame) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading, Body, CTA Link, and Terracotta Pull-Quote (Max 32ch) */}
          <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
            <Eyebrow>Officer Competency Academy</Eyebrow>

            <DisplaySerif
              as="h2"
              size="md"
              text="Certifying public officers through rigorous evaluation."
              italicWord="rigorous"
              className="text-[#0A0A0A] leading-[1.12]"
            />

            <BodyText size="base" muted className="text-[#6B6357] leading-relaxed">
              Evaluation criteria remain strictly server-side. Question scoring is executed
              in isolated API routes, and passing scores generate tamper-evident HMAC-SHA256
              signed digital credentials verifiable across district collectorates.
            </BodyText>

            <div className="pt-2 space-y-5">
              <Link
                to="/module"
                role="button"
                className="group relative inline-flex items-center text-[15px] font-medium text-[#0A0A0A] py-1 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#0A0A0A] focus-visible:ring-offset-2 outline-none"
              >
                <span className="relative">
                  View Administrative Curriculum
                  <span
                    className="absolute left-0 -bottom-0.5 w-full h-[1px] bg-[#0A0A0A] origin-left scale-x-0 transition-transform duration-250 ease-out group-hover:scale-x-100"
                    aria-hidden="true"
                  />
                </span>
                <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              {/* Small Italic Serif Pull-Quote Below CTA: Max 32ch, Muted Terracotta */}
              <p className="font-serif italic text-[14px] sm:text-[15px] text-[#C97B5A] leading-relaxed max-w-[32ch] pt-2">
                “Competency authenticated at the server cannot be diluted or rescinded.”
              </p>
            </div>
          </div>

          {/* Right Column: Framed Illustration 4 with Gallery Plate */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <IllustrationFrame
              src="/illustrations/feature-b-seal.jpg"
              alt="Editorial illustration of a sovereign credential seal with concentric guilloche line work, cryptographic ribbon, and geometric center"
              aspectRatio="4:3"
              illustrationKey="featureB"
              variant="plate"
              figureNumber="04"
              figureTitle="Sovereign Credential Seal"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureB;
