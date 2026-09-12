import React from 'react';
import { useReducedMotion } from 'framer-motion';

interface Agency {
  name: string;
  code: string;
}

const CIVIL_ADMIN_AGENCIES: Agency[] = [
  { name: 'Department of Revenue & Land Records', code: 'REV-01' },
  { name: 'District Collectorate Governance Network', code: 'DCO-02' },
  { name: 'Directorate of Municipal Administration', code: 'DMA-03' },
  { name: 'Civil Registration & Vital Statistics Bureau', code: 'CRB-04' },
  { name: 'Department of Public Grievance Redressal', code: 'PGR-05' },
  { name: 'Social Welfare & Direct Benefit Directorate', code: 'SWD-06' },
  { name: 'Statutory Compliance & Land Registry', code: 'SCR-07' },
];

const TECHNICAL_DIVISIONS: Agency[] = [
  { name: 'Kerala State IT Mission', code: 'KSITM-SYS' },
  { name: 'National e-Governance Division', code: 'NeGD-IND' },
  { name: 'Public Service Training Academy', code: 'PSTA-ACAD' },
  { name: 'Civil Supplies & Public Distribution', code: 'CSPD-OPS' },
  { name: 'Panchayati Raj Administration', code: 'PRLG-LOC' },
  { name: 'State Archival & Gazette Repository', code: 'SDR-GOV' },
  { name: 'Digital Public Infrastructure Verification Bureau', code: 'DPI-VER' },
];

export const TrustMarquee: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-label="Statutory Frameworks & Institutional Standards Registry"
      className="group relative w-full bg-[#EDE4D0]/60 border-y border-[#D9CFBB] py-4 sm:py-5 overflow-hidden select-none transition-colors duration-300 hover:bg-[#EDE4D0]/80"
    >
      {/* Edge Gradient Vignette Masks: Left & Right Seamless Fade */}
      <div
        className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 sm:w-44 bg-gradient-to-r from-[#F5EFE0] via-[#F5EFE0]/85 to-transparent z-20"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 sm:w-44 bg-gradient-to-l from-[#F5EFE0] via-[#F5EFE0]/85 to-transparent z-20"
        aria-hidden="true"
      />

      {/* Institutional Metadata Header Bar */}
      <div className="max-w-[1440px] mx-auto px-[clamp(20px,5vw,80px)] mb-3">
        <div className="flex items-center justify-between border-b border-[#D9CFBB]/70 pb-2.5">
          <div className="flex items-center gap-2.5 text-[10.5px] font-mono tracking-[0.22em] uppercase text-[#6B6357]">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C97B5A] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C97B5A]" />
            </span>
            <span className="font-semibold text-[#0A0A0A]">
              Statutory Frameworks & Institutional Standards
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[10px] font-mono tracking-[0.2em] uppercase text-[#8C8273]">
            <span className="flex items-center gap-1.5">
              <span className="text-[#C9A24A]">◆</span>
              <span>INTER-DEPARTMENTAL ACCREDITATION</span>
            </span>
            <span className="text-[#D9CFBB]">•</span>
            <span>GAZETTE COMPLIANT [REV. 2026]</span>
          </div>
        </div>
      </div>

      {/* Track 1: Civil Administration & Collectorates (Drifting Left) */}
      <div
        className="relative overflow-hidden py-1.5"
        tabIndex={0}
        aria-label="Civil Administration Departments"
      >
        <div
          className={`flex items-center gap-10 sm:gap-14 whitespace-nowrap w-max ${
            shouldReduceMotion
              ? ''
              : 'animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]'
          }`}
          style={{ animationDuration: '44s' }}
        >
          {CIVIL_ADMIN_AGENCIES.concat(CIVIL_ADMIN_AGENCIES).map((agency, idx) => (
            <div
              key={`admin-${idx}`}
              className="flex items-center gap-3 text-[12px] sm:text-[12.5px] font-sans font-medium uppercase tracking-[0.16em] text-[#2D2821] transition-colors"
            >
              <span className="text-[#C97B5A] text-[9px]" aria-hidden="true">
                ◆
              </span>
              <span className="hover:text-[#0A0A0A]">{agency.name}</span>
              <span className="text-[9.5px] font-mono tracking-widest text-[#8C8273] bg-[#E2D8C0]/70 px-1.5 py-0.5 rounded border border-[#D9CFBB]/90">
                {agency.code}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Subtle Dividing Hairline */}
      <div className="max-w-[1440px] mx-auto px-[clamp(20px,5vw,80px)] my-1.5">
        <div className="w-full h-[1px] bg-[#D9CFBB]/40" aria-hidden="true" />
      </div>

      {/* Track 2: Digital Public Infrastructure & Technical Academies (Drifting Right) */}
      <div
        className="relative overflow-hidden py-1.5"
        tabIndex={0}
        aria-label="Technical and Infrastructure Divisions"
      >
        <div
          className={`flex items-center gap-10 sm:gap-14 whitespace-nowrap w-max ${
            shouldReduceMotion
              ? ''
              : 'animate-marquee-reverse group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]'
          }`}
          style={{ animationDuration: '48s' }}
        >
          {TECHNICAL_DIVISIONS.concat(TECHNICAL_DIVISIONS).map((division, idx) => (
            <div
              key={`tech-${idx}`}
              className="flex items-center gap-3 text-[12px] sm:text-[12.5px] font-sans font-medium uppercase tracking-[0.16em] text-[#3D352B] transition-colors"
            >
              <span className="text-[#C9A24A] text-[9px]" aria-hidden="true">
                ◆
              </span>
              <span className="hover:text-[#0A0A0A]">{division.name}</span>
              <span className="text-[9.5px] font-mono tracking-widest text-[#8C8273] bg-[#E2D8C0]/70 px-1.5 py-0.5 rounded border border-[#D9CFBB]/90">
                {division.code}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustMarquee;
