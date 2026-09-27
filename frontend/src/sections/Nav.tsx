import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const Nav: React.FC = () => {
  const { user } = useAuth();

  return (
    <nav
      aria-label="Presentation Navigation"
      className="inline-flex items-center gap-3 sm:gap-5 px-3 py-1.5 rounded-full bg-[#18181B] border border-white/10 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.35)] text-white select-none transition-all"
    >
      {/* ── Left Editorial Identity ── */}
      <a
        href="#spread-01"
        className="flex items-center gap-2 px-1 group outline-none focus-visible:ring-1 focus-visible:ring-white"
        aria-label="GovSkill Presentation Home"
      >
        <span className="w-2 h-2 rounded-full bg-[#AF411E] group-hover:scale-125 transition-transform shrink-0" />
        <span className="font-sans font-black text-xs sm:text-sm tracking-tight text-white">GovSkill.</span>
      </a>

      {/* ── Editorial Section Navigation Links ── */}
      <div className="flex items-center gap-4 sm:gap-6 px-1">
        <a
          href="#spread-01"
          className="text-xs sm:text-[13px] font-sans font-medium text-zinc-300 hover:text-white transition-colors outline-none focus-visible:ring-1 focus-visible:ring-white"
        >
          Project
        </a>
        <a
          href="#spread-03"
          className="text-xs sm:text-[13px] font-sans font-medium text-zinc-300 hover:text-white transition-colors outline-none focus-visible:ring-1 focus-visible:ring-white"
        >
          Platform
        </a>
        <a
          href="#spread-04"
          className="text-xs sm:text-[13px] font-sans font-medium text-zinc-300 hover:text-white transition-colors outline-none focus-visible:ring-1 focus-visible:ring-white"
        >
          GovAssist
        </a>
        <a
          href="#spread-05"
          className="text-xs sm:text-[13px] font-sans font-medium text-zinc-300 hover:text-white transition-colors outline-none focus-visible:ring-1 focus-visible:ring-white"
        >
          Outcome
        </a>
      </div>

      {/* ── Right Action CTA: Gateway to application ── */}
      <Link
        to={user ? (user.role === 'admin' ? '/admin' : '/progress') : '/login'}
        className="px-3.5 sm:px-4 py-1.5 rounded-full bg-white hover:bg-zinc-100 text-black text-xs font-semibold tracking-tight transition-all shadow-sm flex items-center gap-1.5 shrink-0 hover:scale-[1.03] outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <span>{user ? user.email.split('@')[0] : 'Get Started'}</span>
        <span aria-hidden="true" className="text-black font-bold">→</span>
      </Link>
    </nav>
  );
};

export default Nav;
