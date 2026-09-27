import React from 'react';
import { Link } from 'react-router-dom';
import { Eyebrow, DisplaySerif, BodyText } from '@/design-system/typography';

export const FeatureA: React.FC = () => {
  return (
    <section id="govassist" className="w-full bg-white py-[clamp(80px,12vh,160px)] border-t border-[#E4E4E7]">
      <div className="max-w-[1440px] mx-auto px-[clamp(20px,5vw,80px)]">
        {/* Spread 4 Layout: Mirroring 50 Ambitious Spread 4 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Close-up Portrait with Graphic Orange Letter Overlay */}
          <div className="lg:col-span-6 relative">
            <div className="relative border border-[#E4E4E7] bg-white p-3 shadow-[6px_6px_0px_rgba(0,0,0,0.06)] overflow-hidden">
              <img
                src="/illustrations/spread4_citizen_audit.jpg"
                alt="Editorial close-up portrait of an adult citizen carefully auditing official statutory documents"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
              {/* Graphic Orange Typographic Overlay matching Spread 4 'M' overlay */}
              <div
                className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 font-sans font-black text-[clamp(70px,10vw,140px)] text-[#EE8148]/85 leading-none select-none pointer-events-none tracking-tighter"
                aria-hidden="true"
              >
                RULE
              </div>
              <div className="pt-2 px-1 flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-t border-[#E4E4E7] mt-2">
                <span>PLATE 04 // DETERMINISTIC AUDIT</span>
                <span>4 STATUTORY DIRECTIVES</span>
              </div>
            </div>
          </div>

          {/* Right Column: Heading, Body, CTA, Studio Credit */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-[#EE8148] tracking-widest uppercase">
                PART. 04
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#EE8148]" />
              <Eyebrow>Citizen Pre-Submission Validation</Eyebrow>
            </div>

            <DisplaySerif
              as="h2"
              size="md"
              text="Verification governed by immutable code."
              italicWord="immutable"
              className="text-black leading-[1.08] tracking-tight font-black uppercase"
            />

            <BodyText size="base" muted className="text-[#71717A] leading-relaxed">
              Before traveling to a Taluk office, citizens verify their income certificate.
              Four deterministic rules evaluate issuing authority, temporal validity horizons,
              official seal clarity, and document formatting in under three seconds.
            </BodyText>

            <div className="pt-2">
              <Link
                to="/citizen"
                role="button"
                className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-none bg-black text-white text-xs font-bold uppercase tracking-[0.16em] hover:bg-[#EE8148] transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-black"
              >
                <span>Launch the Pre-Check Tool</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

            {/* Studio credit & hairline divider matching Spread 4 */}
            <div className="pt-6 border-t border-[#E4E4E7] flex items-center justify-between font-mono text-[10.5px] uppercase tracking-wider text-zinc-400">
              <span>GOVSKILL / DETERMINISTIC ENGINE</span>
              <span>EST. 2026</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureA;
