import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/design-system';
import { GovSkillLogo } from '@/components/GovSkillLogo';

export const Nav: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F5EFE0]/90 backdrop-blur-md border-b border-[#D9CFBB]/70 transition-all">
      <div className="max-w-[1440px] mx-auto px-[clamp(20px,5vw,80px)] h-20 flex items-center justify-between">
        {/* Element 1: Logo Wordmark with Official Sovereign Emblem */}
        <Link
          to="/"
          className="group inline-flex items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A] focus-visible:ring-offset-2 rounded-sm"
          aria-label="GovSkill Home"
        >
          <GovSkillLogo size={30} variant="icon" />
          <span
            className="font-serif text-[24px] font-normal tracking-[-0.03em] text-[#0A0A0A] transition-colors group-hover:text-[#6B6357]"
            style={{ fontFamily: '"Fraunces", Georgia, serif' }}
          >
            GovSkill
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#E8964A]" aria-hidden="true" />
        </Link>

        {/* Element 2: Primary Nav (Strict Max 3 Links) */}
        <nav
          className="hidden md:flex items-center gap-9"
          aria-label="Primary Navigation"
        >
          <a
            href="#curriculum"
            className="text-[14px] font-sans font-normal text-[#6B6357] hover:text-[#0A0A0A] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A] focus-visible:ring-offset-2 rounded-sm"
          >
            Curriculum
          </a>
          <Link
            to="/citizen"
            className="text-[14px] font-sans font-normal text-[#6B6357] hover:text-[#0A0A0A] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A] focus-visible:ring-offset-2 rounded-sm"
          >
            GovAssist
          </Link>
          <Link
            to="/verify"
            className="text-[14px] font-sans font-normal text-[#6B6357] hover:text-[#0A0A0A] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A] focus-visible:ring-offset-2 rounded-sm"
          >
            Verification
          </Link>
        </nav>

        {/* Elements 3 & 4: Secondary Auth Link + Primary Action Pill */}
        <div className="flex items-center gap-6">
          <Link
            to={user ? (user.role === 'admin' ? '/admin' : '/progress') : '/login'}
            className="text-[14px] font-sans font-normal text-[#6B6357] hover:text-[#0A0A0A] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A] focus-visible:ring-offset-2 rounded-sm"
          >
            Workspace →
          </Link>

          <Link to="/citizen" tabIndex={-1}>
            <Button variant="primary" size="sm" arrow={false}>
              Pre-Check Slip
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Nav;
