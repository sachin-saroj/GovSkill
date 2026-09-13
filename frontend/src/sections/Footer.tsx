import React from 'react';
import { Link } from 'react-router-dom';
import { GovSkillLogo } from '@/components/GovSkillLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#F5EFE0] text-[#0A0A0A] border-t border-[#D9CFBB] pt-[clamp(60px,10vh,120px)] pb-10">
      <div className="max-w-[1440px] mx-auto px-[clamp(20px,5vw,80px)] space-y-16 sm:space-y-24">
        {/* 3 Minimal Columns (Product, Platform, Contact) with Generous Spacing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16 pt-2">
          {/* Column 1: Product */}
          <div className="space-y-4">
            <div>
              <div className="text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-[#6B6357]">
                Product
              </div>
              <div className="w-3 h-[1px] bg-[#C97B5A]/60 mt-1.5" aria-hidden="true" />
            </div>
            <ul className="space-y-1 text-[14px] font-sans leading-[2.0] text-[#0A0A0A]">
              <li>
                <Link to="/module" className="group relative inline-block text-[#0A0A0A] hover:text-[#6B6357] transition-colors">
                  <span>Officer Training Curriculum</span>
                  <span className="absolute left-0 bottom-0.5 w-full h-[1px] bg-[#0A0A0A] origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
                </Link>
              </li>
              <li>
                <Link to="/citizen" className="group relative inline-block text-[#0A0A0A] hover:text-[#6B6357] transition-colors">
                  <span>GovAssist Pre-Check Tool</span>
                  <span className="absolute left-0 bottom-0.5 w-full h-[1px] bg-[#0A0A0A] origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
                </Link>
              </li>
              <li>
                <Link to="/verify" className="group relative inline-block text-[#0A0A0A] hover:text-[#6B6357] transition-colors">
                  <span>Public Certificate Verification</span>
                  <span className="absolute left-0 bottom-0.5 w-full h-[1px] bg-[#0A0A0A] origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
                </Link>
              </li>
              <li>
                <Link to="/login" className="group relative inline-block text-[#0A0A0A] hover:text-[#6B6357] transition-colors">
                  <span>Officer Examination Portal</span>
                  <span className="absolute left-0 bottom-0.5 w-full h-[1px] bg-[#0A0A0A] origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Directives */}
          <div className="space-y-4">
            <div>
              <div className="text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-[#6B6357]">
                Directives
              </div>
              <div className="w-3 h-[1px] bg-[#C97B5A]/60 mt-1.5" aria-hidden="true" />
            </div>
            <ul className="space-y-1 text-[14px] font-sans leading-[2.0] text-[#0A0A0A]">
              <li>
                <span className="group relative inline-block hover:text-[#6B6357] transition-colors cursor-default">
                  <span>Kerala Land Revenue Manual</span>
                  <span className="absolute left-0 bottom-0.5 w-full h-[1px] bg-[#0A0A0A] origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
                </span>
              </li>
              <li>
                <span className="group relative inline-block hover:text-[#6B6357] transition-colors cursor-default">
                  <span>Income Certificate Verification Rules</span>
                  <span className="absolute left-0 bottom-0.5 w-full h-[1px] bg-[#0A0A0A] origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
                </span>
              </li>
              <li>
                <span className="group relative inline-block hover:text-[#6B6357] transition-colors cursor-default">
                  <span>District Collectorate Directory</span>
                  <span className="absolute left-0 bottom-0.5 w-full h-[1px] bg-[#0A0A0A] origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
                </span>
              </li>
              <li>
                <span className="group relative inline-block hover:text-[#6B6357] transition-colors cursor-default">
                  <span>Administrative Circular Archive</span>
                  <span className="absolute left-0 bottom-0.5 w-full h-[1px] bg-[#0A0A0A] origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: Governance & Contact */}
          <div className="space-y-4">
            <div>
              <div className="text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-[#6B6357]">
                Authority & Contact
              </div>
              <div className="w-3 h-[1px] bg-[#C97B5A]/60 mt-1.5" aria-hidden="true" />
            </div>
            <div className="space-y-2 text-[14px] font-sans text-[#6B6357] leading-relaxed">
              <p className="text-[#0A0A0A]">
                Local Self Government & Revenue Department
              </p>
              <p>Government Secretariat, Thiruvananthapuram</p>
              <p className="font-mono text-xs pt-1 text-[#0A0A0A]">
                registrar@govskill.gov.in
              </p>
            </div>
          </div>
        </div>

        {/* Huge Wordmark with Pulsing Ochre Dot and Sovereign Emblem */}
        <div className="w-full pt-8 sm:pt-14 border-t border-[#D9CFBB]/60 select-none overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-6">
            <div
              className="font-serif text-[clamp(60px,14vw,190px)] font-normal text-[#0A0A0A] tracking-[-0.04em] leading-[0.88]"
              style={{ fontFamily: '"Fraunces", Georgia, serif' }}
            >
              GovSkill
              <span className="inline-block w-[clamp(10px,2vw,24px)] h-[clamp(10px,2vw,24px)] rounded-full bg-[#E8964A] ml-2 sm:ml-4 animate-dot-pulse-6s" />
            </div>
            <div className="hidden sm:block pb-2">
              <GovSkillLogo size={52} variant="icon" />
            </div>
          </div>
        </div>

        {/* Single Thin Row: Copyright + Rotating Compliance Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-[#D9CFBB]/80 text-[12px] font-sans text-[#6B6357]">
          <div>
            © 2026 GovSkill Initiative. Government of Kerala. All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2A5B4A]" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#0A0A0A]">
              DPDP Act 2023 Compliant • Statutory Data Safeguards
            </span>
            {/* Rotating circular compliance emblem */}
            <svg
              className="w-8 h-8 text-[#2A5B4A] animate-badge-rotate"
              viewBox="0 0 32 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              aria-hidden="true"
            >
              <circle cx="16" cy="16" r="14" strokeDasharray="3 3" />
              <circle cx="16" cy="16" r="10" />
              <path d="M16 8L16 24M8 16L24 16" strokeWidth="0.8" />
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
