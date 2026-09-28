import React from 'react';
import { Link000 } from '@/components/ui/skiper-ui/skiper40';

export const Nav: React.FC = () => {
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (targetId.startsWith('#')) {
      const el = document.getElementById(targetId.slice(1));
      if (el) {
        e.preventDefault();
        if ((window as any).__govskill_lenis) {
          (window as any).__govskill_lenis.scrollTo(el, { offset: -60, duration: 1.0 });
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAF8F2]/90 backdrop-blur-md border-b border-[#E8E2D5] select-none transition-colors">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 xl:px-20 h-14 sm:h-16 flex items-center justify-between">
        {/* ── Left Editorial Identity ── */}
        <a
          href="#spread-01"
          onClick={(e) => handleAnchorClick(e, '#spread-01')}
          className="flex items-center gap-3 group outline-none focus-visible:ring-1 focus-visible:ring-zinc-900 py-1"
          aria-label="GovSkill Presentation Home"
        >
          <img
            src="/govskill-horizontal.png"
            alt="GovSkill."
            className="h-11 sm:h-13 w-auto object-contain transition-transform group-hover:scale-[1.02] shrink-0 drop-shadow-xs"
            loading="eager"
          />
        </a>

        {/* ── Editorial Section Navigation Links with Skiper40 ── */}
        <nav
          aria-label="Presentation Navigation"
          className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-mono uppercase tracking-[0.2em] text-zinc-600"
        >
          <a
            href="#spread-03"
            onClick={(e) => handleAnchorClick(e, '#spread-03')}
            className="skiper40-link hover:text-zinc-950 transition-colors"
          >
            Platform
          </a>
          <a
            href="#spread-04"
            onClick={(e) => handleAnchorClick(e, '#spread-04')}
            className="skiper40-link hover:text-zinc-950 transition-colors"
          >
            GovAssist
          </a>
          <Link000 href="/verify" className="hover:text-zinc-950 transition-colors">
            Verification
          </Link000>
        </nav>

        {/* ── Right Actions: Login & Get Started with Skiper40 ── */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link000
            href="/login"
            className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-600 hover:text-zinc-950 transition-colors"
          >
            Login
          </Link000>
          <a
            href="/login"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-zinc-900 text-zinc-950 hover:bg-zinc-950 hover:text-white font-mono text-[10px] sm:text-[11px] uppercase tracking-wider transition-colors"
          >
            <span>Get started</span>
            <span aria-hidden="true" className="text-xs leading-none">→</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Nav;

