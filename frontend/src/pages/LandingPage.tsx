import React from 'react';
import Nav from '@/sections/Nav';
import SpreadOneFoundation from '@/sections/SpreadOneFoundation';
import SpreadTwoDiligence from '@/sections/SpreadTwoDiligence';
import SpreadThreeAcademy from '@/sections/SpreadThreeAcademy';
import SpreadFourValidation from '@/sections/SpreadFourValidation';
import SpreadFiveAmbitious from '@/sections/SpreadFiveAmbitious';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#FAF8F2] text-[#0A0A0A] selection:bg-[#0E50B0]/20 selection:text-black flex flex-col font-sans overflow-x-hidden">
      {/* ── Top Navigation: in normal flow so it gracefully scrolls away with Spread 01 ── */}
      <div className="w-full pt-4 sm:pt-6 flex justify-center z-30 px-4">
        <Nav />
      </div>

      {/* ── The Five Full-Width Editorial Artboards (no beige gutter, no card margins) ── */}
      <main className="w-full flex flex-col">
        <SpreadOneFoundation />
        <SpreadTwoDiligence />
        <SpreadThreeAcademy />
        <SpreadFourValidation />
        <SpreadFiveAmbitious />
      </main>
    </div>
  );
};

export default LandingPage;
