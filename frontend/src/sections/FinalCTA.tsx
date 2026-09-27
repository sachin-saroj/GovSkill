import React from 'react';
import { Link } from 'react-router-dom';

export const FinalCTA: React.FC = () => {
  return (
    <section className="relative w-full bg-white text-black py-[clamp(90px,14vh,180px)] border-t border-[#E4E4E7] overflow-hidden">
      <div className="relative z-10 max-w-[1440px] mx-auto px-[clamp(20px,5vw,80px)]">
        {/* Spread 5 Layout: Mirroring 50 Ambitious Spread 5 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: AMBITIOUS Headline, Subhead, Paragraphs, Primary CTA */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-[#0E50B0] tracking-widest uppercase">
                  PART. 05
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#0E50B0]" />
                <span className="text-[12px] font-mono font-bold uppercase tracking-[0.24em] text-[#71717A]">
                  AMBITIOUS CIVIC VISION
                </span>
              </div>

              {/* Huge Bold Sans Display Headline matching Spread 5 */}
              <h2 className="font-sans text-[clamp(52px,7vw,100px)] font-black uppercase tracking-tight text-black leading-[0.9]">
                AMBITIOUS
              </h2>

              <div className="pt-2">
                <p className="font-sans text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#0E50B0]">
                  Serve <span className="underline decoration-2 underline-offset-4">better.</span>
                </p>
              </div>
            </div>

            <div className="space-y-4 max-w-[540px]">
              <p className="font-sans text-[15px] sm:text-[16px] text-zinc-600 leading-relaxed font-normal">
                Behind every revenue counter and municipal desk lies a citizen seeking dignity and an officer striving for precision. GovSkill unites both through grounded digital learning, deterministic verification, and sovereign public records.
              </p>
              <p className="font-sans text-[14px] text-zinc-500 leading-relaxed font-normal">
                A modern state cadre is built not by overwhelming complexity, but by mastering foundational civic standards with quiet, daily excellence.
              </p>
            </div>

            {/* ONE Primary CTA Below with Sharp Editorial Button */}
            <div className="pt-2">
              <Link to="/citizen">
                <button
                  type="button"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-none bg-black hover:bg-[#EE8148] text-white text-xs font-bold uppercase tracking-[0.18em] transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-black cursor-pointer shadow-[3px_3px_0px_rgba(0,0,0,0.12)]"
                >
                  <span>Begin Document Pre-Check</span>
                  <span className="text-base leading-none">→</span>
                </button>
              </Link>
            </div>

            {/* Thin Sans Subtext with Accent Dot Separator */}
            <p className="text-[12px] font-mono font-normal text-[#71717A] pt-2 flex flex-wrap items-center gap-2">
              <span>Open to all local administrative departments</span>
              <span className="text-[#EE8148]" aria-hidden="true">•</span>
              <span>Verifiable statewide citizen self-service</span>
            </p>
          </div>

          {/* Right Column: Spread 5 Artwork (Officer with Birds taking flight + SKILL overlay) */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[520px] border border-[#E4E4E7] bg-white p-3 shadow-[6px_6px_0px_rgba(0,0,0,0.06)] overflow-hidden">
              <img
                src="/illustrations/spread5_ambitious_mind.jpg"
                alt="Editorial illustration of an adult civil servant with birds and origami taking flight from their open mind"
                className="w-full h-auto object-cover"
                loading="lazy"
              />

              {/* Bold Rust Orange Typographic Overlay matching CLOUD from Spread 5 */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-sans font-black text-[clamp(44px,6.5vw,90px)] text-[#EE8148]/90 tracking-[0.25em] select-none pointer-events-none"
                aria-hidden="true"
              >
                SKILL
              </div>

              <div className="pt-2 px-1 flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-t border-[#E4E4E7] mt-2">
                <span>PLATE 05 // FLOURISHING CIVIC MIND</span>
                <span>OPEN DIGITAL SOVEREIGNTY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
