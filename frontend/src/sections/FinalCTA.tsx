import React from 'react';
import { Link } from 'react-router-dom';
import { DisplaySerif } from '@/design-system';

import AnimatedIllustration from '@/components/AnimatedIllustration';

export const FinalCTA: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#2D2218] text-[#F5EFE0] pt-[clamp(90px,14vh,160px)] pb-[clamp(140px,22vh,240px)]">
      {/* Full-Bleed Warm-Toned Cinematic Horizon Artwork */}
      <div className="absolute inset-0 z-0">
        <img
          src="/illustrations/final-cta-horizon.jpg"
          alt="Silhouettes of citizens and civil servants along a warm golden horizon at dusk"
          className="w-full h-full object-cover object-bottom opacity-80 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#2D2218]/30 to-[#2D2218]/90" />
        <AnimatedIllustration illustrationKey="finalCta" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-[clamp(20px,5vw,80px)] text-center space-y-6">
        <div className="text-[12px] font-sans font-medium uppercase tracking-[0.24em] text-[#E8964A]">
          Civil Administration Standard
        </div>

        {/* Huge Italic Serif Overlay */}
        <div className="max-w-[900px] mx-auto">
          <DisplaySerif
            as="h2"
            size="xl"
            dark
            text="Serve better."
            italicWord="better"
            className="text-white"
          />
        </div>

        {/* ONE Primary CTA Below with Breathing Ochre Glow Ring */}
        <div className="pt-2 flex justify-center">
          <div className="relative inline-flex items-center justify-center">
            <div
              className="absolute -inset-1 rounded-full bg-[#E8964A] animate-ochre-ring pointer-events-none"
              aria-hidden="true"
            />
            <Link to="/citizen">
              <button
                type="button"
                className="relative z-10 inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#F5EFE0] hover:bg-white text-[#0A0A0A] text-[15px] font-medium tracking-[0.02em] transition-all shadow-[0_12px_24px_-8px_rgba(0,0,0,0.3)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Begin Document Pre-Check</span>
                <span>→</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Thin Sans Subtext with Ochre Dot Separator */}
        <p className="text-[13px] font-sans font-normal text-[#EDE4D0]/80 max-w-[540px] mx-auto pt-2 flex items-center justify-center gap-2">
          <span>Open to all local administrative departments</span>
          <span className="text-[#E8964A]" aria-hidden="true">•</span>
          <span>Verifiable statewide citizen self-service</span>
        </p>
      </div>
    </section>
  );
};

export default FinalCTA;
