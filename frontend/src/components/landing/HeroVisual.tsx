import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import {
  Shield,
  FileCheck,
  Bot,
  Award,
  Lock,
  Sparkles,
  ArrowRight,
  Database,
  Check,
  Stamp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFinePointer, springDepth } from '@/lib/motion';

/**
 * HeroVisual — Layered 3D "Office Desk" Composition.
 * Designed to evoke authentic civic digital public infrastructure:
 * Stacked registry ledger cards, official verification stamps, and real translateZ depth.
 * Cursor parallax is strictly gated behind useFinePointer().
 */
export const HeroVisual: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isFinePointer = useFinePointer();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth, high-damping spring for multi-plane parallax
  const smoothX = useSpring(mouseX, springDepth);
  const smoothY = useSpring(mouseY, springDepth);

  // Controlled, subtle 3D rotation angles
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [3.5, -3.5]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-4.5, 4.5]);

  // Differential plane parallax offsets
  const basePlaneX = useTransform(smoothX, [-0.5, 0.5], [-4, 4]);
  const basePlaneY = useTransform(smoothY, [-0.5, 0.5], [-4, 4]);
  const cardLeftX = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);
  const cardLeftY = useTransform(smoothY, [-0.5, 0.5], [-8, 8]);
  const cardRightX = useTransform(smoothX, [-0.5, 0.5], [10, -10]);
  const cardRightY = useTransform(smoothY, [-0.5, 0.5], [8, -8]);
  const floatingBadgeX = useTransform(smoothX, [-0.5, 0.5], [-14, 14]);
  const floatingBadgeY = useTransform(smoothY, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !isFinePointer || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(relX);
    mouseY.set(relY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const isMotionActive = !shouldReduceMotion && isFinePointer;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-5xl mx-auto mt-8 select-none"
      style={{ perspective: '1200px' }}
    >
      {/* Outer 3D Canvas Shell — Styled as an Official Executive Desk Mat */}
      <motion.div
        style={{
          rotateX: isMotionActive ? rotateX : 0,
          rotateY: isMotionActive ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        className="relative bg-gradient-to-b from-ink via-slate-900 to-[#0F172A] border border-slate-700/80 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-2xl overflow-hidden"
      >
        {/* Ambient Desk Lighting & Official Watermark */}
        <div className="absolute inset-0 bg-civic-dark-pattern opacity-25 pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-marigold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Base Layer: Infrastructure Header Bar (Z: 0) */}
        <motion.div
          style={{
            x: isMotionActive ? basePlaneX : 0,
            y: isMotionActive ? basePlaneY : 0,
            transformStyle: 'preserve-3d',
          }}
          className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900/90 border border-slate-700 text-[11px] font-mono text-slate-200 shadow-civic-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>DPI Platform Engine • Live</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
              <Database className="h-3.5 w-3.5 text-blue-400" />
              <span>PostgreSQL • Tesseract OCR • Gemini 2.5 Flash</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-200 bg-slate-900/80 px-3 py-1 rounded-xl border border-slate-700 shadow-civic-xs">
              <Stamp className="h-3 w-3 text-seal" />
              <span>National Governance Standards</span>
            </span>
          </div>
        </motion.div>

        {/* Mid-Plane 3D Grid: Dual Layered Official Documents (Z: 24px - 32px) */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-stretch">
          {/* Left Desk Layer: GovAssist Citizen Income Certificate Registry Card (6 Cols) */}
          <motion.div
            style={{
              x: isMotionActive ? cardLeftX : 0,
              y: isMotionActive ? cardLeftY : 0,
              transform: isMotionActive ? 'translateZ(24px)' : 'none',
              transformStyle: 'preserve-3d',
            }}
            className="lg:col-span-6 bg-paper text-slate-900 border border-amber-200/80 rounded-3xl p-5 sm:p-6 shadow-2xl relative flex flex-col justify-between"
          >
            {/* Top Official Registry Stamp Header */}
            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-stone-200">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shadow-civic-xs">
                    <FileCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-ink tracking-wide block font-body">
                      GovAssist Citizen Stream
                    </span>
                    <p className="text-[10px] text-emerald-800 font-mono font-medium">
                      Income Certificate Pre-Check
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-civic-xs text-[10px] font-bold">
                  <Check className="h-3 w-3 text-emerald-700" />
                  <span>4/4 Rules Passed</span>
                </div>
              </div>

              {/* Stamped Document Body */}
              <div className="space-y-3 pt-4">
                <div className="p-3.5 rounded-2xl bg-white border border-stone-200/90 space-y-2 font-mono text-[11px] shadow-civic-xs">
                  <div className="flex justify-between items-center text-slate-500 pb-1 border-b border-stone-100">
                    <span className="text-[10px] uppercase font-semibold text-slate-400">OCR Extracted Field</span>
                    <span className="text-[10px] uppercase font-semibold text-emerald-700 font-bold">Verified Value</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Applicant Name:</span>
                    <span className="text-ink font-bold">Prakash R. Sharma</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Certificate No:</span>
                    <span className="text-emerald-800 font-extrabold bg-emerald-50 px-1.5 rounded border border-emerald-200">
                      INC-2025-88492
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Annual Income:</span>
                    <span className="text-ink font-semibold">₹85,000 / annum</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Validity Period:</span>
                    <span className="text-slate-700 font-medium">Valid through 31-03-2026</span>
                  </div>
                </div>

                {/* 4 Deterministic Rule Validation Badges */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-[11px] font-medium">
                    <Check className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                    <span className="truncate">Name Present</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-[11px] font-medium">
                    <Check className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                    <span className="truncate">Number Format</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-[11px] font-medium">
                    <Check className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                    <span className="truncate">Date Validity</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-[11px] font-medium">
                    <Check className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                    <span className="truncate">Required Fields</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Card Action Strip */}
            <div className="pt-4 mt-4 border-t border-stone-200 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Rejection risk eliminated</span>
              <Link
                to="/citizen"
                className="text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1 transition-colors"
              >
                <span>Run Pre-Check</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* Right Desk Layer: GovSkill Grounded AI & Certification Ledger (6 Cols) */}
          <motion.div
            style={{
              x: isMotionActive ? cardRightX : 0,
              y: isMotionActive ? cardRightY : 0,
              transform: isMotionActive ? 'translateZ(32px)' : 'none',
              transformStyle: 'preserve-3d',
            }}
            className="lg:col-span-6 bg-slate-900/95 border border-slate-700 text-white rounded-3xl p-5 sm:p-6 shadow-2xl relative flex flex-col justify-between"
          >
            <div>
              {/* Stream Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300 shadow-civic-xs">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white tracking-wide block">
                      GovSkill Grounded AI Tutor
                    </span>
                    <p className="text-[10px] text-blue-300 font-mono">
                      Module Bounded • Zero Hallucination
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-500/40 shadow-civic-xs">
                  Grounded AI 2.5 Flash
                </span>
              </div>

              {/* Simulated Live Procedural Dialogue */}
              <div className="space-y-3 pt-4">
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11px] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Officer Query:
                  </span>
                  <p className="text-slate-200 italic font-medium">
                    "What is the required seal authorization for rural income certificates?"
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-blue-900/50 text-[11px] space-y-1.5 text-slate-200">
                  <div className="flex items-center gap-1.5 text-marigold font-bold text-[10px]">
                    <Sparkles className="h-3.5 w-3.5 text-marigold" />
                    <span>Module 1 Grounded Answer:</span>
                  </div>
                  <p className="leading-relaxed">
                    "Under Revenue Manual §12, rural income certificates require the official seal of the Tehsildar with active digital signature registration."
                  </p>
                  <div className="pt-1 flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                      Source: Module 1.4
                    </span>
                    <span className="text-emerald-400 font-semibold">Citation Verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Card Action Strip */}
            <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-marigold font-bold">
                <Award className="h-4 w-4" />
                <span>Server-Scored Quiz: 100%</span>
              </div>
              <Link
                to="/module"
                className="text-blue-300 hover:text-white font-bold flex items-center gap-1 transition-colors"
              >
                <span>Curriculum</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Foreground Floating 3D Trust Capsules (Z: 48px) */}
        <motion.div
          style={{
            x: isMotionActive ? floatingBadgeX : 0,
            y: isMotionActive ? floatingBadgeY : 0,
            transform: isMotionActive ? 'translateZ(48px)' : 'none',
            transformStyle: 'preserve-3d',
          }}
          className="relative z-20 grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-6"
        >
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/95 border border-emerald-500/40 text-white shadow-civic-lg backdrop-blur-md">
            <div className="h-8 w-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">100% Deterministic</p>
              <p className="text-[11px] text-slate-400">Zero AI validation hallucination</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/95 border border-blue-500/40 text-white shadow-civic-lg backdrop-blur-md">
            <div className="h-8 w-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Grounded Gemini 2.5</p>
              <p className="text-[11px] text-slate-400">Strictly bounded module context</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/95 border border-amber-500/40 text-white shadow-civic-lg backdrop-blur-md">
            <div className="h-8 w-8 rounded-xl bg-amber-500/20 text-marigold flex items-center justify-center shrink-0">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Server-Scored Quiz</p>
              <p className="text-[11px] text-slate-400">Tamper-proof qualifications</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroVisual;
