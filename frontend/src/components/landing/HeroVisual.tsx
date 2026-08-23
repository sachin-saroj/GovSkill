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
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const HeroVisual: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth, high-damping spring for silky multi-plane parallax
  const springConfig = { damping: 28, stiffness: 160, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Controlled, subtle 3D rotation angles
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [4.5, -4.5]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-5.5, 5.5]);

  // Differential plane parallax offsets
  const basePlaneX = useTransform(smoothX, [-0.5, 0.5], [-6, 6]);
  const basePlaneY = useTransform(smoothY, [-0.5, 0.5], [-6, 6]);
  const cardLeftX = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);
  const cardLeftY = useTransform(smoothY, [-0.5, 0.5], [-10, 10]);
  const cardRightX = useTransform(smoothX, [-0.5, 0.5], [14, -14]);
  const cardRightY = useTransform(smoothY, [-0.5, 0.5], [12, -12]);
  const floatingBadgeX = useTransform(smoothX, [-0.5, 0.5], [-18, 18]);
  const floatingBadgeY = useTransform(smoothY, [-0.5, 0.5], [-14, 14]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !containerRef.current) return;
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

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-5xl mx-auto mt-6 select-none"
      style={{ perspective: '1200px' }}
    >
      {/* Outer 3D Canvas Shell */}
      <motion.div
        style={{
          rotateX: shouldReduceMotion ? 0 : rotateX,
          rotateY: shouldReduceMotion ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative bg-slate-950/95 border border-slate-800/90 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-2xl overflow-hidden"
      >
        {/* Ambient Depth Glows */}
        <div className="absolute inset-0 bg-civic-dark-pattern opacity-30 pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-[420px] h-[420px] bg-civic-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[380px] h-[380px] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-saffron-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Base Layer: Infrastructure Header Bar (Z: 0) */}
        <motion.div
          style={{
            x: shouldReduceMotion ? 0 : basePlaneX,
            y: shouldReduceMotion ? 0 : basePlaneY,
            transformStyle: 'preserve-3d',
          }}
          className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/80"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900/90 border border-slate-700/80 text-[11px] font-mono text-slate-200 shadow-civic-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>DPI Platform Engine • Live</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
              <Database className="h-3.5 w-3.5 text-civic-400" />
              <span>PostgreSQL • Tesseract OCR • Gemini 2.5 Flash</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-300 bg-slate-900/80 px-3 py-1 rounded-xl border border-slate-700/70 shadow-civic-xs">
              National Governance Standards
            </span>
          </div>
        </motion.div>

        {/* Mid-Plane 3D Grid: Dual Live Streams (Z: 24px - 32px) */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-stretch">
          {/* Left Stream: GovAssist Citizen Pre-check (6 Cols) */}
          <motion.div
            style={{
              x: shouldReduceMotion ? 0 : cardLeftX,
              y: shouldReduceMotion ? 0 : cardLeftY,
              transform: shouldReduceMotion ? 'none' : 'translateZ(24px)',
              transformStyle: 'preserve-3d',
            }}
            className="lg:col-span-6 bg-slate-900/90 border border-emerald-500/40 rounded-3xl p-5 sm:p-6 shadow-civic-xl relative flex flex-col justify-between"
          >
            <div>
              {/* Stream Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-civic-xs">
                    <FileCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white tracking-wide block">
                      GovAssist Citizen Stream
                    </span>
                    <p className="text-[10px] text-emerald-400 font-mono">
                      Income Certificate Pre-Check
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-civic-xs">
                  4/4 Rules Passed
                </span>
              </div>

              {/* Simulated OCR Extraction Summary */}
              <div className="space-y-3 pt-4">
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Applicant Name:</span>
                    <span className="text-white font-semibold">Prakash R. Sharma</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Certificate No:</span>
                    <span className="text-emerald-300 font-bold">INC-2025-88492</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Annual Income:</span>
                    <span className="text-white">₹85,000 / annum</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Validity Period:</span>
                    <span className="text-slate-300">Valid through 31-03-2026</span>
                  </div>
                </div>

                {/* 4 Deterministic Rule Indicators */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-200 text-[11px]">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">Name Present</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-200 text-[11px]">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">Number Format</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-200 text-[11px]">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">Date Validity</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-200 text-[11px]">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">Required Fields</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Rejection risk eliminated</span>
              <Link
                to="/citizen"
                className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 transition-colors"
              >
                <span>Run Pre-Check</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* Right Stream: GovSkill Grounded AI & Certification (6 Cols) */}
          <motion.div
            style={{
              x: shouldReduceMotion ? 0 : cardRightX,
              y: shouldReduceMotion ? 0 : cardRightY,
              transform: shouldReduceMotion ? 'none' : 'translateZ(32px)',
              transformStyle: 'preserve-3d',
            }}
            className="lg:col-span-6 bg-slate-900/90 border border-civic-500/40 rounded-3xl p-5 sm:p-6 shadow-civic-xl relative flex flex-col justify-between"
          >
            <div>
              {/* Stream Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-civic-500/20 border border-civic-500/40 flex items-center justify-center text-civic-300 shadow-civic-xs">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white tracking-wide block">
                      GovSkill Grounded AI Tutor
                    </span>
                    <p className="text-[10px] text-civic-400 font-mono">
                      Module Bounded • Zero Hallucination
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-civic-500/20 text-civic-200 border border-civic-500/40 shadow-civic-xs">
                  Grounded AI 2.5 Flash
                </span>
              </div>

              {/* Simulated Live Dialogue */}
              <div className="space-y-3 pt-4">
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11px] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Officer Query:
                  </span>
                  <p className="text-slate-200 italic font-medium">
                    "What is the required seal authorization for rural income certificates?"
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-civic-950/70 border border-civic-800/70 text-[11px] space-y-1.5 text-slate-200">
                  <div className="flex items-center gap-1.5 text-saffron-400 font-bold text-[10px]">
                    <Sparkles className="h-3.5 w-3.5 text-saffron-400" />
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

            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-saffron-400 font-bold">
                <Award className="h-4 w-4" />
                <span>Server-Scored Quiz: 100%</span>
              </div>
              <Link
                to="/module"
                className="text-civic-300 hover:text-white font-bold flex items-center gap-1 transition-colors"
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
            x: shouldReduceMotion ? 0 : floatingBadgeX,
            y: shouldReduceMotion ? 0 : floatingBadgeY,
            transform: shouldReduceMotion ? 'none' : 'translateZ(48px)',
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

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/95 border border-saffron-500/40 text-white shadow-civic-lg backdrop-blur-md">
            <div className="h-8 w-8 rounded-xl bg-saffron-500/20 text-saffron-400 flex items-center justify-center shrink-0">
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
