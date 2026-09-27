import React from 'react';
import { Link } from 'react-router-dom';
import { Eyebrow, DisplaySerif, BodyText } from '@/design-system/typography';
import { IllustrationFrame } from '@/components/IllustrationFrame';

export const FeatureB: React.FC = () => {
  return (
    <section id="curriculum" className="w-full bg-white py-[clamp(80px,12vh,160px)] border-t border-[#E4E4E7]">
      <div className="max-w-[1440px] mx-auto px-[clamp(20px,5vw,80px)]">
        {/* Mirrored Asymmetric Split: 5 Cols Left (Content), 7 Cols Right (Dominant UI Frame) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading, Body, CTA Link, and Cobalt Pull-Quote (Max 32ch) */}
          <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-[#0E50B0] tracking-widest uppercase">
                PART. 06
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#0E50B0]" />
              <Eyebrow>Officer Competency Academy</Eyebrow>
            </div>

            <DisplaySerif
              as="h2"
              size="md"
              text="Certifying public officers through rigorous evaluation."
              italicWord="rigorous"
              className="text-black leading-[1.12] tracking-tight font-black uppercase"
            />

            <BodyText size="base" muted className="text-[#71717A] leading-relaxed">
              Evaluation criteria remain strictly server-side. Question scoring is executed
              in isolated API routes, and passing scores generate tamper-evident HMAC-SHA256
              signed digital credentials verifiable across district collectorates.
            </BodyText>

            <div className="pt-2 space-y-5">
              <Link
                to="/module"
                role="button"
                className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-none bg-black text-white text-xs font-bold uppercase tracking-[0.16em] hover:bg-[#0E50B0] transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-black"
              >
                <span>View Administrative Curriculum</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              {/* 50 Ambitious Cobalt Accent Bar & Pull-Quote */}
              <div className="pt-2">
                <div className="w-12 h-[3px] bg-[#0E50B0] mb-4" aria-hidden="true" />
                <p className="font-sans font-semibold text-[13px] sm:text-[14px] text-[#0E50B0] tracking-wide uppercase leading-relaxed max-w-[32ch]">
                  “Competency authenticated at the server cannot be diluted or rescinded.”
                </p>
              </div>
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
