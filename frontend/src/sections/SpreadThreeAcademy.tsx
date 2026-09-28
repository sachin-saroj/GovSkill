import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HoverExpand_001, Skiper52Image } from '@/components/ui/skiper-ui/skiper52';
import { ProgressiveBlur } from '@/components/ui/skiper-ui/skiper41';
import { useReveal } from '@/hooks/useReveal';

const WORKFLOW_IMAGES: Skiper52Image[] = [
  {
    step: '01',
    title: 'Learn',
    alt: 'Curriculum & Competency Platform',
    category: 'Workforce Readiness',
    code: 'CURRICULUM ENGINE • STATUTORY MODULES',
    description: 'Workforce competency dashboard tracking statutory certifications, procedural compliance, and district readiness.',
    src: '/illustrations/spread3_platform_dashboard.png',
    link: '/module',
    linkText: 'Explore Platform',
  },
  {
    step: '02',
    title: 'Assess',
    alt: 'Cadre Mastery Examination',
    category: 'Statutory Evaluation',
    code: 'SERVER SCORED • 75% MASTERY GATE',
    description: 'Server-scored 4-option statutory quizzes verifying knowledge before counter certification.',
    src: '/illustrations/quiz_assessment_examination.jpg',
    link: '/quiz/1',
    linkText: 'Sample Quiz Engine',
  },
  {
    step: '03',
    title: 'Assist',
    alt: 'GovAssist Pre-Check Gate',
    category: 'Citizen Validation',
    code: 'TESSERACT OCR • 4 DETERMINISTIC RULES',
    description: 'Self-service citizen document upload with 4 deterministic rules, OCR, and AI explanation.',
    src: '/illustrations/govassist_upload_illustration.jpg',
    link: '/citizen',
    linkText: 'Launch GovAssist',
  },
  {
    step: '04',
    title: 'Verify',
    alt: 'Statutory Trust Seal',
    category: 'Public Authentication',
    code: 'SHA-256 SEAL • COUNTER PORTAL',
    description: 'Cryptographic public verification validating issuing officer signature and tamper seals.',
    src: '/illustrations/verification_trust_seal.jpg',
    link: '/verify',
    linkText: 'Certificate Lookup',
  },
  {
    step: '05',
    title: 'Improve',
    alt: 'Statutory Curriculum Reader',
    category: 'Cadre Oversight',
    code: '14 DISTRICTS • REAL-TIME AUDIT',
    description: 'Statutory curriculum reader and administrative intelligence tracking district pass rates.',
    src: '/illustrations/curriculum_lesson_folio.jpg',
    link: '/login',
    linkText: 'Supervisor Portal',
  },
];

/**
 * SPREAD 03 — PLATFORM / CIVIC WORKFLOW ARCHITECTURE
 * Minimalist & Smooth Workflow Showcase (powered by Skiper52 HoverExpand_001):
 * - Smooth horizontal card expand on hover/click with Framer Motion
 * - No bulky browser chrome or artificial card themes
 * - Minimalist, high-end editorial layout with Fraunces serif display
 * - Preserves all required test assertions:
 *   'Institutional Purpose', 'Officer Competency Academy',
 *   'GovSkill is crafted for the dedicated officers who', 'serve', 'the public.',
 *   'View Administrative Curriculum', 'Competency Domains',
 *   'Income Certificate Verification', 'Temporal Validity Horizons', 'Statutory Counter Slips'
 */
export const SpreadThreeAcademy: React.FC = () => {
  const { ref, revealed } = useReveal(0.12);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const activeWorkflow = WORKFLOW_IMAGES[activeIndex];

  return (
    <section
      id="spread-03"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative w-full bg-[#F5F0E6] text-[#0A0A0A] border-b border-[#E8E2D5] min-h-[92vh] flex flex-col justify-between py-10 sm:py-14 px-6 sm:px-12 lg:px-16 xl:px-20 select-none overflow-hidden"
    >
      <div id="curriculum" className="absolute -top-24 left-0 w-0 h-0" aria-hidden="true" />
      <div className="relative h-full w-full max-w-[1320px] mx-auto flex flex-col justify-between flex-1">

        {/* ── Main Composition: Skiper52 Expand Gallery (Left 6.5 cols), Narrative & Domains (Right 5.5 cols) ── */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center my-auto py-6 relative z-10">

          {/* ── Left Side (6.5 cols): Minimalist Smooth Skiper52 Image Gallery ── */}
          <div className={`lg:col-span-7 flex flex-col items-center select-none spread-reveal spread-reveal-delay-1 ${revealed ? 'revealed' : ''}`}>
            <div className="w-full max-w-[620px] space-y-3">
              
              {/* Minimalist Context Kicker Bar */}
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 px-1">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0E50B0]" />
                  <span className="font-bold text-zinc-900">Interactive Workflow Stages</span>
                </div>
                <span className="text-[#AF411E] font-semibold">Stage {activeWorkflow.step} / 05</span>
              </div>

              {/* Skiper52 Minimalist Horizontal Accordion Gallery */}
              <HoverExpand_001
                images={WORKFLOW_IMAGES}
                activeIndex={activeIndex}
                onActiveChange={setActiveIndex}
                className="w-full"
              />

              {/* Minimalist Folio Caption & Quick Route */}
              <div className="pt-1 px-1 flex flex-wrap items-center justify-between gap-3 text-[12px] font-sans text-zinc-600 border-t border-[#E8E2D5]/70">
                <span className="truncate font-mono text-[11px] text-zinc-500">
                  {activeWorkflow.code}
                </span>
                <Link
                  to={activeWorkflow.link || '/module'}
                  className="font-mono text-[10.5px] uppercase font-bold text-[#AF411E] hover:text-black transition-colors shrink-0"
                >
                  {activeWorkflow.linkText || 'Explore'} →
                </Link>
              </div>

            </div>
          </div>

          {/* ── Right Side (5 cols): Clean Card Layout ── */}
          <div className={`lg:col-span-5 flex flex-col justify-center z-20 spread-reveal spread-reveal-delay-2 ${revealed ? 'revealed' : ''}`}>

            {/* Section label — small, quiet */}
            <div className="flex items-center gap-2 text-[10.5px] font-mono uppercase tracking-[0.22em] mb-5">
              <span className="font-bold" style={{ color: '#AF411E' }}>Institutional Purpose</span>
              <span style={{ color: '#D4CCBC' }}>•</span>
              <span className="font-medium" style={{ color: '#8A8279' }}>Officer Competency Academy</span>
            </div>

            {/* Display heading — highlighted box words like the reference */}
            <h2 className="font-serif text-[clamp(30px,3.8vw,48px)] font-normal leading-[1.12] tracking-tight mb-7" style={{ color: '#0A0A0A' }}>
              The{' '}
              <span
                className="relative inline px-1.5 py-0.5"
                style={{ backgroundColor: '#D6E4F0', borderRadius: '3px' }}
              >
                One Platform
              </span>{' '}
              for{' '}
              <span
                className="relative inline px-1.5 py-0.5"
                style={{ backgroundColor: '#D6E4F0', borderRadius: '3px' }}
              >
                Many civic workflows.
              </span>
            </h2>

            {/* ── Clean Card — body + stages + domains ── */}
            <div
              className="rounded-lg p-5 sm:p-6 space-y-5"
              style={{
                backgroundColor: '#EDEBE4',
                border: '1px solid #DDD7CA',
              }}
            >
              {/* Card heading */}
              <h3 className="font-serif text-[20px] sm:text-[22px] font-semibold leading-snug" style={{ color: '#1A1A1A' }}>
                Unified Civic Training, Made Systematic
              </h3>

              {/* Body text */}
              <p className="text-[15px] sm:text-[16px] leading-[1.72]" style={{ color: '#5A5247' }}>
                GovSkill is crafted for the dedicated officers who{' '}
                <span className="font-semibold underline underline-offset-3 decoration-2" style={{ color: '#0E50B0', textDecorationColor: '#0E50B0' }}>serve</span>{' '}
                the public. One platform connects training, competency assessment,
                citizen assistance, and verification across civic workflows.
              </p>

              {/* Workflow Stages — inside the card */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.18em] font-bold" style={{ color: '#0E50B0' }}>
                    Workflow Stages
                  </span>
                  <span className="text-[9.5px] font-mono" style={{ color: '#A09888' }}>
                    Select stage to inspect
                  </span>
                </div>

                <div className="rounded-md overflow-hidden grid grid-cols-5" style={{ backgroundColor: '#FDFCF8', border: '1px solid #D6D0C3' }}>
                  {WORKFLOW_IMAGES.map((wf, idx) => {
                    const isCurrent = idx === activeIndex;
                    return (
                      <button
                        key={wf.step}
                        onClick={() => setActiveIndex(idx)}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className="relative p-2 sm:p-2.5 text-left transition-all duration-200 outline-none focus-visible:ring-1 focus-visible:ring-[#0E50B0] cursor-pointer"
                        style={{
                          backgroundColor: isCurrent ? '#0A0A0A' : 'transparent',
                          borderRight: idx < 4 ? '1px solid #E8E2D5' : 'none',
                        }}
                      >
                        <span className="font-mono text-[8px] uppercase tracking-wider block" style={{ color: isCurrent ? '#737373' : '#A09888' }}>
                          {wf.step}
                        </span>
                        <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-tight truncate block mt-0.5" style={{ color: isCurrent ? '#FFFFFF' : '#1A1A1A' }}>
                          {wf.title}
                        </span>
                        {isCurrent && (
                          <span className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ backgroundColor: '#0E50B0' }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Competency Domains */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] font-semibold block mb-2" style={{ color: '#A09888' }}>
                  Competency Domains
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { label: 'Income Certificate Verification', color: '#059669' },
                    { label: 'Temporal Validity Horizons', color: '#0E50B0' },
                    { label: 'Statutory Counter Slips', color: '#AF411E' },
                  ].map((domain) => (
                    <span
                      key={domain.label}
                      className="inline-flex items-center gap-1.5 font-mono text-[10.5px] font-medium px-2.5 py-1 rounded-md"
                      style={{
                        color: '#3D3428',
                        backgroundColor: '#FDFCF8',
                        border: '1px solid #D6D0C3',
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: domain.color }} />
                      {domain.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA — below the card */}
            <Link
              to="/module"
              role="button"
              className="inline-flex items-center gap-2.5 px-5 py-2.5 text-white font-mono text-[11px] uppercase tracking-[0.15em] font-bold transition-all hover:-translate-y-0.5 w-fit rounded-sm mt-5"
              style={{ backgroundColor: '#0A0A0A', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1A1A1A')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0A0A0A')}
            >
              <span>View Administrative Curriculum</span>
              <span className="text-sm leading-none">→</span>
            </Link>

          </div>

        </div>

        {/* ── Bottom Row ── */}
        <div className="flex items-center justify-between shrink-0 relative z-20 pt-4 border-t border-zinc-200/80 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.16em] text-zinc-400">
          <span>Unified Civil Platform</span>
          <span>Verified Administrative Operations</span>
        </div>

      </div>

      {/* ── Progressive Blur transition to next spread ── */}
      <ProgressiveBlur position="bottom" height="60px" backgroundColor="#F5F0E6" blurAmount="3px" />
    </section>
  );
};

export default SpreadThreeAcademy;
