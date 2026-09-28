import React, { useEffect } from 'react';
import Lenis from 'lenis';
import Nav from '@/sections/Nav';
import EditorialProgress from '@/components/ui/skiper-ui/EditorialProgress';
import SpreadOneFoundation from '@/sections/SpreadOneFoundation';
import SpreadTwoDiligence from '@/sections/SpreadTwoDiligence';
import SpreadThreeAcademy from '@/sections/SpreadThreeAcademy';
import SpreadFourValidation from '@/sections/SpreadFourValidation';
import SpreadFiveAmbitious from '@/sections/SpreadFiveAmbitious';

export const LandingPage: React.FC = () => {
  useEffect(() => {
    // Avoid non-browser or test environments (e.g. jsdom without matchMedia)
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function' ||
      typeof requestAnimationFrame === 'undefined'
    ) {
      return;
    }

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });

    (window as any).__govskill_lenis = lenis;

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as any).__govskill_lenis;
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#FAF8F2] text-[#0A0A0A] selection:bg-[#0E50B0]/20 selection:text-black flex flex-col font-sans overflow-x-hidden">
      {/* ── Sticky Editorial Navigation Bar ── */}
      <Nav />

      {/* ── Quiet Archival Scroll Index (Skiper89 adaptation) ── */}
      <EditorialProgress />

      {/* ── The Five Full-Width Editorial Artboards (no beige gutters, distinct compositions) ── */}
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

