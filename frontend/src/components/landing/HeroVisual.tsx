import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import {
  Shield,
  FileCheck,
  Bot,
  Award,
  Lock,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Database,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const HeroVisual: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 180, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);
  const layer1X = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);
  const layer1Y = useTransform(smoothY, [-0.5, 0.5], [-12, 12]);
  const layer2X = useTransform(smoothX, [-0.5, 0.5], [16, -16]);
  const layer2Y = useTransform(smoothY, [-0.5, 0.5], [16, -16]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
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
      className="relative w-full max-w-5xl mx-auto mt-6"
      style={{ perspective: '1200px' }}
    >
      <motion.div
        style={{
          rotateX: shouldReduceMotion ? 0 : rotateX,
          rotateY: shouldReduceMotion ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-xl overflow-hidden transition-all duration-300"
      >
        {/* Background Ambient Lighting & Grid */}
        <div className="absolute inset-0 bg-civic-pattern opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-civic-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/90 border border-slate-700 text-[11px] font-mono text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>DPI Engine v2.5 Online</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
              <Database className="h-3.5 w-3.5 text-civic-400" />
              <span>PostgreSQL • Tesseract OCR • Gemini 2.5 Flash</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-full border border-slate-700/60">
              National Governance Standards
            </span>
          </div>
        </div>

        {/* 3D Visual Main Grid */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-center">
          {/* Left Column: GovAssist Live Stream (5 Cols) */}
          <motion.div
            style={{
              x: shouldReduceMotion ? 0 : layer1X,
              y: shouldReduceMotion ? 0 : layer1Y,
              transformStyle: 'preserve-3d',
            }}
            className="lg:col-span-6 bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-5 shadow-civic-lg relative overflow-hidden group hover:border-emerald-500/50 transition-colors"
          >
            {/* Top Tag */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <FileCheck className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white tracking-wide">GovAssist Citizen Stream</span>
                  <p className="text-[10px] text-emerald-400 font-mono">Pre-Submission Verification</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                100% Pre-Check Pass
              </span>
            </div>

            {/* Simulated Live OCR & Rule Evaluation */}
            <div className="space-y-3 pt-3">
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/90 space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>Document Type:</span>
                  <span className="text-white font-semibold">Income Certificate (Form No. 12)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Issuing Officer:</span>
                  <span className="text-emerald-300">Tehsildar (Executive Magistrate)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Annual Family Income:</span>
                  <span className="text-white">₹85,000 / annum</span>
                </div>
              </div>

              {/* 4 Deterministic Rules Checklist */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] px-2.5 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-200">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Rule 1: Name & Token Identified</span>
                  </span>
                  <span className="font-mono text-[10px] text-emerald-400">PASS</span>
                </div>
                <div className="flex items-center justify-between text-[11px] px-2.5 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-200">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Rule 2: Valid Certificate Format</span>
                  </span>
                  <span className="font-mono text-[10px] text-emerald-400">PASS</span>
                </div>
                <div className="flex items-center justify-between text-[11px] px-2.5 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-200">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Rule 3: Authority Designation Verified</span>
                  </span>
                  <span className="font-mono text-[10px] text-emerald-400">PASS</span>
                </div>
                <div className="flex items-center justify-between text-[11px] px-2.5 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-200">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Rule 4: Validity & Issue Within Limit</span>
                  </span>
                  <span className="font-mono text-[10px] text-emerald-400">PASS</span>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                <span>Result: Counter rejection risk eliminated</span>
                <Link to="/citizen" className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1">
                  <span>Run Pre-Check</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Right Column: GovSkill AI Officer Training Stream (6 Cols) */}
          <motion.div
            style={{
              x: shouldReduceMotion ? 0 : layer2X,
              y: shouldReduceMotion ? 0 : layer2Y,
              transformStyle: 'preserve-3d',
            }}
            className="lg:col-span-6 bg-slate-950/80 border border-civic-500/30 rounded-2xl p-5 shadow-civic-lg relative overflow-hidden group hover:border-civic-500/50 transition-colors"
          >
            {/* Top Tag */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-civic-500/15 border border-civic-500/30 flex items-center justify-center text-civic-400">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white tracking-wide">GovSkill Grounded AI Tutor</span>
                  <p className="text-[10px] text-civic-400 font-mono">Module Bounded • Zero Speculation</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-civic-500/20 text-civic-300 border border-civic-500/40">
                Grounded 2.5 Flash
              </span>
            </div>

            {/* Simulated Live Officer AI Dialogue */}
            <div className="space-y-3 pt-3">
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] space-y-1">
                <p className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">Officer Prompt:</p>
                <p className="text-slate-200 italic">"What is the required seal authorization for rural income certificates?"</p>
              </div>

              <div className="p-3 rounded-xl bg-civic-950/60 border border-civic-800/60 text-[11px] space-y-1.5 leading-relaxed text-slate-200">
                <div className="flex items-center gap-1.5 text-saffron-400 font-semibold text-[10px]">
                  <Sparkles className="h-3 w-3 text-saffron-400" />
                  <span>Module 1 Grounded Answer:</span>
                </div>
                <p>
                  "Under Revenue Manual §12, rural income certificates require the official seal of the Tehsildar or Naib-Tehsildar with active digital signature registration."
                </p>
                <div className="pt-1 flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Source: Module 1.4</span>
                  <span>Citation Verified</span>
                </div>
              </div>

              {/* Assessment Telemetry Bar */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px]">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-saffron-400" />
                  <span className="text-slate-300 font-medium">Server Assessment:</span>
                </div>
                <span className="font-mono text-saffron-300 font-bold">100% Scored</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating 3D Depth Badge Highlights (Foreground) */}
        <div className="relative z-20 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6">
          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-white shadow-civic-md backdrop-blur-md"
          >
            <Lock className="h-4 w-4 text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">100% Deterministic Engine</p>
              <p className="text-[10px] text-slate-400">Zero AI validation hallucination</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/90 border border-blue-500/30 text-white shadow-civic-md backdrop-blur-md"
          >
            <Bot className="h-4 w-4 text-blue-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Grounded Gemini 2.5</p>
              <p className="text-[10px] text-slate-400">Strictly bounded context prompt</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/90 border border-saffron-500/30 text-white shadow-civic-md backdrop-blur-md"
          >
            <Shield className="h-4 w-4 text-saffron-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Server-Scored Quizzes</p>
              <p className="text-[10px] text-slate-400">Tamper-proof qualification</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroVisual;
