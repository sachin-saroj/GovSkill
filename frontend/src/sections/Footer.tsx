import React from 'react';
import { Link } from 'react-router-dom';
import { GovSkillLogo } from '@/components/GovSkillLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white text-black border-t border-[#E4E4E7] pt-[clamp(60px,10vh,120px)] pb-10">
      <div className="max-w-[1440px] mx-auto px-[clamp(20px,5vw,80px)] space-y-16 sm:space-y-24">
        {/* 3 Minimal Columns (Product, Platform, Contact) with Generous Spacing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16 pt-2">
          {/* Column 1: Product */}
          <div className="space-y-4">
            <div>
              <div className="text-[11px] font-sans font-bold uppercase tracking-[0.25em] text-zinc-500">
                Product
              </div>
              <div className="w-3 h-[1.5px] bg-black mt-1.5" aria-hidden="true" />
            </div>
            <ul className="space-y-1 text-[13px] font-sans font-medium leading-[2.0] text-black">
              <li>
                <Link to="/module" className="hover:text-[#0E50B0] transition-colors">
                  Officer Training Curriculum
                </Link>
              </li>
              <li>
                <Link to="/citizen" className="hover:text-[#0E50B0] transition-colors">
                  GovAssist Pre-Check Tool
                </Link>
              </li>
              <li>
                <Link to="/verify" className="hover:text-[#0E50B0] transition-colors">
                  Public Certificate Verification
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#0E50B0] transition-colors">
                  Officer Examination Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Directives */}
          <div className="space-y-4">
            <div>
              <div className="text-[11px] font-sans font-bold uppercase tracking-[0.25em] text-zinc-500">
                Directives
              </div>
              <div className="w-3 h-[1.5px] bg-black mt-1.5" aria-hidden="true" />
            </div>
            <ul className="space-y-1 text-[13px] font-sans font-medium leading-[2.0] text-zinc-600">
              <li>
                <span>Kerala Land Revenue Manual</span>
              </li>
              <li>
                <span>Income Certificate Verification Rules</span>
              </li>
              <li>
                <span>District Collectorate Directory</span>
              </li>
              <li>
                <span>Administrative Circular Archive</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Governance & Contact */}
          <div className="space-y-4">
            <div>
              <div className="text-[11px] font-sans font-bold uppercase tracking-[0.25em] text-zinc-500">
                Authority & Contact
              </div>
              <div className="w-3 h-[1.5px] bg-black mt-1.5" aria-hidden="true" />
            </div>
            <div className="space-y-2 text-[13px] font-sans text-zinc-600 leading-relaxed">
              <p className="text-black font-semibold">
                Local Self Government & Revenue Department
              </p>
              <p>Government Secretariat, Thiruvananthapuram</p>
              <p className="font-mono text-xs pt-1 text-black">
                registrar@govskill.gov.in
              </p>
            </div>
          </div>
        </div>

        {/* Huge Wordmark with 50 Ambitious Display Typography and Emblem */}
        <div className="w-full pt-8 sm:pt-14 border-t border-[#E4E4E7] select-none overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-6">
            <div className="font-sans text-[clamp(60px,14vw,190px)] font-black text-black tracking-tighter leading-[0.85]">
              GovSkill
              <span className="inline-block w-[clamp(10px,2vw,24px)] h-[clamp(10px,2vw,24px)] rounded-full bg-[#0E50B0] ml-2 sm:ml-4" />
            </div>
            <div className="hidden sm:block pb-2">
              <GovSkillLogo size={52} variant="icon" />
            </div>
          </div>
        </div>

        {/* Single Thin Row: Copyright + Rotating Compliance Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-[#E4E4E7] text-[12px] font-sans text-zinc-500">
          <div>
            © 2026 GovSkill Initiative. Government of Kerala. All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0E50B0]" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-black">
              DPDP Act 2023 Compliant • Statutory Data Safeguards
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
