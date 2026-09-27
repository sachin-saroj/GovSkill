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
      className="group relative w-full bg-white border-y border-[#E4E4E7] py-4 sm:py-5 overflow-hidden select-none"
    >
      {/* Edge Gradient Vignette Masks: Left & Right Seamless Fade */}
      <div
        className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 sm:w-44 bg-gradient-to-r from-white via-white/85 to-transparent z-20"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 sm:w-44 bg-gradient-to-l from-white via-white/85 to-transparent z-20"
        aria-hidden="true"
      />

      {/* Institutional Metadata Header Bar */}
      <div className="max-w-[1440px] mx-auto px-[clamp(20px,5vw,80px)] mb-3">
        <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-2.5">
          <div className="flex items-center gap-2.5 text-[10.5px] font-mono tracking-[0.22em] uppercase text-zinc-500">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0E50B0] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0E50B0]" />
            </span>
            <span className="font-bold text-black">
              Statutory Frameworks & Institutional Standards
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[10px] font-mono tracking-[0.2em] uppercase text-zinc-400 font-bold">
            <span className="flex items-center gap-1.5">
              <span className="text-[#0E50B0]">◆</span>
              <span>INTER-DEPARTMENTAL ACCREDITATION</span>
            </span>
            <span className="text-zinc-300">•</span>
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
              className="flex items-center gap-3 text-[12px] sm:text-[12.5px] font-sans font-bold uppercase tracking-[0.16em] text-zinc-700 transition-colors"
            >
              <span className="text-[#0E50B0] text-[9px]" aria-hidden="true">
                ◆
              </span>
              <span className="hover:text-black">{agency.name}</span>
              <span className="text-[9.5px] font-mono tracking-widest text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded-sm border border-zinc-200">
                {agency.code}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Subtle Dividing Hairline */}
      <div className="max-w-[1440px] mx-auto px-[clamp(20px,5vw,80px)] my-1.5">
        <div className="w-full h-[1px] bg-[#E4E4E7]" aria-hidden="true" />
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
              className="flex items-center gap-3 text-[12px] sm:text-[12.5px] font-sans font-bold uppercase tracking-[0.16em] text-zinc-700 transition-colors"
            >
              <span className="text-[#AF411E] text-[9px]" aria-hidden="true">
                ◆
              </span>
              <span className="hover:text-black">{division.name}</span>
              <span className="text-[9.5px] font-mono tracking-widest text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded-sm border border-zinc-200">
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
