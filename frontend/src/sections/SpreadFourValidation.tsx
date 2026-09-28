import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tooltip } from '../components/ui';
import { ProgressiveBlur } from '@/components/ui/skiper-ui/skiper41';
import { useReveal } from '@/hooks/useReveal';

/**
 * SPREAD 04 — CITIZEN PRE-CHECK (GOVASSIST)
 * Realistic government dossier aesthetic — clean heading + body + realistic folder
 *
 * Test assertions:
 *   'Citizen Pre-Submission Validation', 'Launch the Pre-Check Tool', 'Field Dispatches',
 *   'Voices from the', 'field.', 'Deterministic Rule Processing', 'Passing Standard for Certification'
 */

interface Step {
  id: string;
  number: string;
  label: string;
  sub: string;
}

const STEPS: Step[] = [
  { id: 'doc', number: '01', label: 'Document Upload', sub: 'PDF, JPEG, or PNG scan via browser' },
  { id: 'ocr', number: '02', label: 'OCR Extraction', sub: 'Dates, name, income fields parsed' },
  { id: 'rules', number: '03', label: 'Rule Validation', sub: '4 deterministic code-driven checks' },
  { id: 'verified', number: '04', label: 'Counter Certified', sub: 'Tamper-evident validation slip' },
];

/* Realistic scattered positions — each item positioned like papers on a desk */
const CARD_LAYOUT: { top: string; left: string; rotate: number; w: string }[] = [
  { top: '6%', left: '4%', rotate: -2.5, w: '48%' },
  { top: '5%', left: '50%', rotate: 1.8, w: '46%' },
  { top: '50%', left: '2%', rotate: 1.2, w: '47%' },
  { top: '48%', left: '48%', rotate: -1.5, w: '48%' },
];

/* Clean minimal card accent colors */
const CARD_STYLES = [
  { accent: '#D97706', activeBg: '#FFFBEB', border: '#FDE68A', numColor: '#92400E' },
  { accent: '#2563EB', activeBg: '#EFF6FF', border: '#BFDBFE', numColor: '#1E40AF' },
  { accent: '#059669', activeBg: '#ECFDF5', border: '#A7F3D0', numColor: '#065F46' },
  { accent: '#DB2777', activeBg: '#FDF2F8', border: '#FBCFE8', numColor: '#9D174D' },
];

export const SpreadFourValidation: React.FC = () => {
  const { ref, revealed } = useReveal(0.12);
  const [active, setActive] = useState('rules');

  return (
    <section
      id="spread-04"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative w-full min-h-[92vh] flex flex-col select-none overflow-hidden"
      style={{ backgroundColor: '#F5F0E6' }}
    >
      <div id="precheck" className="absolute -top-24 left-0 w-0 h-0" aria-hidden="true" />

      <div className="relative flex-1 w-full max-w-[1320px] mx-auto flex flex-col justify-between py-12 sm:py-16 px-6 sm:px-12 lg:px-16 xl:px-20">

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center my-auto relative z-10">

          {/* ── LEFT: Heading + Body + CTA + Dispatches ── */}
          <div className={`lg:col-span-5 flex flex-col justify-center z-20 spread-reveal spread-reveal-delay-1 ${revealed ? 'revealed' : ''}`}>

            {/* Section label */}
            <span
              className="text-[11px] font-mono uppercase tracking-[0.22em] font-bold mb-4 block"
              style={{ color: '#AF411E' }}
            >
              Citizen Pre-Submission Validation
            </span>

            {/* Display heading */}
            <h2
              className="font-serif text-[clamp(32px,4.2vw,54px)] font-normal leading-[1.06] tracking-tight mb-5"
              style={{ color: '#1A1A1A' }}
            >
              Citizen{' '}
              <br className="hidden sm:block" />
              <span className="italic font-light" style={{ color: '#AF411E' }}>pre-check.</span>
            </h2>

            {/* Body text — normal size, readable */}
            <p className="text-[16px] sm:text-[17px] leading-[1.75] mb-3" style={{ color: '#5A5247' }}>
              Self-service document verification before the counter queue.
              Citizens upload an Income Certificate and the system runs{' '}
              <Tooltip content="4 code-driven rules evaluate statutory validity without LLM hallucination">
                <span className="underline decoration-dotted underline-offset-3 cursor-help font-medium" style={{ color: '#1A1A1A' }}>
                  Deterministic Rule Processing
                </span>
              </Tooltip>
              {' '}— four code-driven checks — to deliver a counter-ready result.
            </p>

            <p className="text-[16px] sm:text-[17px] leading-[1.75] mb-7" style={{ color: '#5A5247' }}>
              Every rule is auditable, every outcome reproducible. The{' '}
              <span className="font-medium" style={{ color: '#1A1A1A' }}>Passing Standard for Certification</span>{' '}
              is 100% deterministic — no AI hallucination.
            </p>

            {/* CTA */}
            <Link
              to="/citizen"
              role="button"
              className="inline-flex items-center gap-2.5 px-5 py-2.5 text-white font-mono text-[11px] uppercase tracking-[0.15em] font-bold transition-all hover:-translate-y-0.5 w-fit mb-8 rounded-sm"
              style={{ backgroundColor: '#1A1A1A', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#333')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1A1A1A')}
            >
              <span>Launch the Pre-Check Tool</span>
              <span className="text-sm leading-none">→</span>
            </Link>

            {/* Field Dispatches */}
            <div className="pt-5 space-y-2.5" style={{ borderTop: '1px solid #DDD5C6' }}>
              <div className="text-[11px] font-mono uppercase tracking-wider flex items-center gap-1.5" style={{ color: '#A09888' }}>
                <span className="font-bold" style={{ color: '#1A1A1A' }}>Field Dispatches</span>
                <span>•</span>
                <span>Voices from the <span className="font-bold" style={{ color: '#AF411E' }}>field.</span></span>
              </div>
              <blockquote
                className="font-serif italic text-[16px] leading-relaxed pl-4"
                style={{ color: '#6B6359', borderLeft: '2.5px solid rgba(175, 65, 30, 0.35)' }}
              >
                "Citizens arrive with verified documents. Rejection rates dropped."
              </blockquote>
            </div>
          </div>

          {/* ── RIGHT: Realistic Government Dossier ── */}
          <div className={`lg:col-span-7 flex items-center justify-center spread-reveal spread-reveal-delay-2 ${revealed ? 'revealed' : ''}`}>
            <div className="relative w-full max-w-[580px] aspect-[4/3.4]">

              {/* Outer folder — kraft paper with realistic depth */}
              <div className="absolute inset-0 rounded-[3px]" style={{
                background: 'linear-gradient(155deg, #C9AB82 0%, #BDA07A 25%, #A8906A 60%, #9D8560 100%)',
                boxShadow: `
                  0 25px 50px rgba(0,0,0,0.15),
                  0 8px 20px rgba(0,0,0,0.08),
                  inset 0 1px 0 rgba(255,255,255,0.15),
                  inset 0 -1px 0 rgba(0,0,0,0.05)
                `,
              }}>
                {/* Folder tab — slightly 3D */}
                <div className="absolute -top-4 right-[52px] w-[88px] h-[22px] rounded-t-[4px]" style={{
                  background: 'linear-gradient(180deg, #C4A87E 0%, #B99C75 100%)',
                  boxShadow: '0 -2px 6px rgba(0,0,0,0.06)',
                }} />
                {/* Tab label */}
                <div className="absolute -top-3 right-[56px] w-[80px] flex items-center justify-center">
                  <span className="font-mono text-[7px] uppercase tracking-[0.15em] font-bold" style={{ color: '#7A6B55' }}>
                    GovAssist
                  </span>
                </div>

                {/* Paper fiber texture */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-[3px]" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />

                {/* Folder crease line */}
                <div className="absolute top-[38%] left-0 right-0 h-px opacity-[0.08]" style={{ backgroundColor: '#000' }} />
              </div>

              {/* Inner document sheet — white paper with subtle aging */}
              <div className="absolute top-6 left-5 right-5 bottom-5 rounded-[2px]" style={{
                backgroundColor: '#FDFAF4',
                border: '1px solid #E6DCCB',
                boxShadow: `
                  0 1px 3px rgba(0,0,0,0.04),
                  inset 0 0 20px rgba(0,0,0,0.01)
                `,
              }}>
                {/* Ruled lines like actual paper */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.06]" style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 31px, #8B7355 31px, #8B7355 32px)',
                  backgroundPosition: '0 20px',
                }} />

                {/* Red margin line */}
                <div className="absolute top-0 bottom-0 left-[48px] w-px opacity-[0.08]" style={{ backgroundColor: '#DC2626' }} />

                {/* Header area on the paper */}
                <div className="relative z-10 px-5 pt-4 pb-2 flex items-center justify-between" style={{ borderBottom: '1px solid #EDE6D8' }}>
                  <div>
                    <span className="font-mono text-[8px] uppercase tracking-[0.2em] block" style={{ color: '#A09888' }}>
                      Government of Kerala • Revenue Department
                    </span>
                    <span className="font-serif text-[13px] sm:text-[14px] font-bold block mt-0.5" style={{ color: '#3D3428' }}>
                      Income Certificate — Verification Report
                    </span>
                  </div>
                  <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-sm" style={{
                    color: '#065F46',
                    backgroundColor: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                  }}>
                    4/4 PASS
                  </span>
                </div>

                {/* The 4 verification items — scattered like papers pinned on a board */}
                <div className="relative z-10 w-full" style={{ height: 'calc(100% - 56px)' }}>
                  {STEPS.map((step, i) => {
                    const pos = CARD_LAYOUT[i];
                    const style = CARD_STYLES[i];
                    const isActive = step.id === active;
                    return (
                      <motion.button
                        key={step.id}
                        onClick={() => setActive(step.id)}
                        className="absolute cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#AF411E]"
                        style={{ top: pos.top, left: pos.left, width: pos.w }}
                        whileHover={{ scale: 1.04, y: -3 }}
                        whileTap={{ scale: 0.97 }}
                        animate={{
                          rotate: isActive ? 0 : pos.rotate,
                          zIndex: isActive ? 10 : 1,
                        }}
                        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                      >
                        <div
                          className="rounded-md p-3 sm:p-3.5 transition-all duration-200 relative overflow-hidden"
                          style={{
                            backgroundColor: isActive ? style.activeBg : '#FFFEFB',
                            border: `1px solid ${isActive ? style.border : '#E8E0D0'}`,
                            boxShadow: isActive
                              ? '0 6px 20px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)'
                              : '0 2px 6px rgba(0,0,0,0.04)',
                          }}
                        >
                          {/* Left accent stripe */}
                          <div
                            className="absolute top-0 left-0 bottom-0 w-[3px] rounded-l-md transition-opacity duration-200"
                            style={{ backgroundColor: style.accent, opacity: isActive ? 1 : 0.3 }}
                          />

                          <div className="flex items-start justify-between gap-2 pl-1.5">
                            <div className="min-w-0">
                              <span className="font-mono text-[22px] sm:text-[26px] font-black leading-none block" style={{ color: isActive ? style.numColor : '#C4BAA8' }}>
                                {step.number}
                              </span>
                              <span className="font-sans text-[11px] sm:text-[12px] font-semibold block mt-1 truncate" style={{ color: isActive ? style.numColor : '#7A7062' }}>
                                {step.label}
                              </span>
                              <span className="text-[10px] block mt-0.5" style={{ color: isActive ? style.numColor : '#A09888', opacity: 0.7 }}>
                                {step.sub}
                              </span>
                            </div>
                            {/* Active indicator */}
                            {isActive && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-1"
                                style={{ backgroundColor: style.accent }}
                              >
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </motion.span>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Corner crease / dog ear on folder */}
              <div className="absolute bottom-5 right-5 w-8 h-8 z-30 pointer-events-none" style={{
                background: 'linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.03) 50%)',
              }} />

              {/* Stamp */}
              <motion.div
                className="absolute bottom-4 left-4 z-20"
                initial={{ opacity: 0, scale: 0.7, rotate: -12 }}
                animate={revealed ? { opacity: 0.75, scale: 1, rotate: -6 } : {}}
                transition={{ delay: 0.65, type: 'spring', stiffness: 160, damping: 16 }}
              >
                <div className="px-2 py-1 rounded-[2px] text-center" style={{
                  border: '2px solid #AF411E',
                  backgroundColor: 'rgba(175,65,30,0.03)',
                }}>
                  <span className="block font-mono text-[6.5px] tracking-[0.15em] font-bold uppercase" style={{ color: '#AF411E' }}>
                    ★ Pre-Check ★
                  </span>
                  <span className="block font-mono text-[9px] font-black uppercase" style={{ color: '#AF411E' }}>
                    Counter-Ready
                  </span>
                </div>
              </motion.div>

              {/* Bottom-right label */}
              <div className="absolute bottom-2 right-4 z-20 text-right font-mono text-[8px] uppercase tracking-[0.1em]" style={{ color: '#A08E72' }}>
                Case File: KL-REV/2026
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between shrink-0 relative z-20 pt-4 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.16em]" style={{ borderTop: '1px solid #DDD5C6', color: '#A09888' }}>
          <span>Citizen Pre-Flight Verification</span>
          <span>Pre-Check Assured at First Submission</span>
        </div>
      </div>

      <ProgressiveBlur position="bottom" height="60px" backgroundColor="#F5F0E6" blurAmount="3px" />
    </section>
  );
};

export default SpreadFourValidation;
