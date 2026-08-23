import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  FileCheck,
  Bot,
  Award,
  LayoutDashboard,
  CheckCircle2,
  Cpu,
  Lock,
  Play,
  Pause,
  Sparkles,
  Zap,
  BookOpen,
  FileCode2,
} from 'lucide-react';

interface ArchitectureNode {
  id: string;
  title: string;
  category: 'GovAssist (Citizen)' | 'Deterministic Core' | 'GovSkill (Employee)' | 'Supervisor Oversight' | 'Governance';
  track: 'citizen' | 'core' | 'employee' | 'admin';
  badgeColor: string;
  icon: React.ElementType;
  x: number; // percentage on canvas
  y: number; // percentage on canvas
  tagline: string;
  details: string[];
  metrics: { label: string; value: string };
  connectedPaths: string[];
}

const ARCHITECTURE_NODES: ArchitectureNode[] = [
  {
    id: 'citizen-upload',
    title: 'Citizen Document Pre-Check',
    category: 'GovAssist (Citizen)',
    track: 'citizen',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    icon: FileCheck,
    x: 14,
    y: 28,
    tagline: 'Self-Service Pre-Submission OCR Extraction',
    details: [
      'Accepts Income Certificate scans (PNG, JPG, PDF) with 5MB validation limit',
      'No citizen login required; generates unique UUID Reference ID for tracking',
      'Eliminates physical administrative counter rejection before citizen visits',
    ],
    metrics: { label: 'Ingestion Mode', value: 'Zero-Login Upload' },
    connectedPaths: ['path-upload-ocr'],
  },
  {
    id: 'ocr-extraction',
    title: 'Tesseract OCR Engine',
    category: 'GovAssist (Citizen)',
    track: 'citizen',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    icon: FileCode2,
    x: 38,
    y: 28,
    tagline: 'Optical Character & Field Extraction',
    details: [
      'Image preprocessing with grayscale, contrast enhancement (2.0x), and binarization',
      'Parses Applicant Name, Certificate Number, and Validity Expiry Date',
      'Direct text stream fallback for digitized PDF certificates via PyMuPDF',
    ],
    metrics: { label: 'Extraction Pipeline', value: 'PyTesseract + Pillow' },
    connectedPaths: ['path-upload-ocr', 'path-ocr-rule'],
  },
  {
    id: 'deterministic-rules',
    title: 'Deterministic Rule Engine',
    category: 'Deterministic Core',
    track: 'core',
    badgeColor: 'bg-civic-100 text-civic-900 border-civic-300',
    icon: Lock,
    x: 62,
    y: 28,
    tagline: '100% Code-Driven Validation Protocol',
    details: [
      'Strict Python business logic evaluates Name, Number Format, Expiry Date, and Required Fields',
      'Zero AI hallucination or stochastic decision-making on pass/fail validation',
      'Produces deterministic verification status (PASS vs CORRECTIONS NEEDED)',
    ],
    metrics: { label: 'Decision Engine', value: '100% Deterministic' },
    connectedPaths: ['path-ocr-rule', 'path-rule-ai'],
  },
  {
    id: 'ai-explanation',
    title: 'AI Explanation Layer',
    category: 'GovAssist (Citizen)',
    track: 'citizen',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    icon: Sparkles,
    x: 86,
    y: 28,
    tagline: 'Gemini 2.5 Flash Plain-Language Citizen Guidance',
    details: [
      'Only triggered on validation rules that have ALREADY failed in code',
      'Translates technical validation errors into polite, actionable corrective instructions',
      'Never participates in or influences pass/fail validation decisions',
    ],
    metrics: { label: 'AI Role', value: 'Grounded Guidance Only' },
    connectedPaths: ['path-rule-ai'],
  },
  {
    id: 'employee-curriculum',
    title: 'Training Curriculum',
    category: 'GovSkill (Employee)',
    track: 'employee',
    badgeColor: 'bg-civic-50 text-civic-800 border-civic-200',
    icon: BookOpen,
    x: 18,
    y: 72,
    tagline: 'Official Operational Guidelines & Procedures',
    details: [
      'Structured markdown lessons covering document verification, portal SLAs, and cybersecurity',
      'Interactive module curriculum for local governance officers and desk staff',
      'Real-time lesson reading progress tracking linked to employee skill profiles',
    ],
    metrics: { label: 'Curriculum Scope', value: '4 Core Governance Modules' },
    connectedPaths: ['path-curriculum-tutor'],
  },
  {
    id: 'grounded-tutor',
    title: 'Grounded AI Tutor',
    category: 'GovSkill (Employee)',
    track: 'employee',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    icon: Bot,
    x: 44,
    y: 72,
    tagline: 'Context-Bounded Gemini 2.5 Assistance',
    details: [
      'Code-driven term overlap scoring automatically routes queries to relevant module',
      'Answers are strictly grounded in module content with explicit citation references',
      'Provides instant procedural clarification without policy speculation',
    ],
    metrics: { label: 'Tutor Grounding', value: 'Module Bounded Q&A' },
    connectedPaths: ['path-curriculum-tutor', 'path-tutor-quiz'],
  },
  {
    id: 'server-quiz',
    title: 'Certification Assessment',
    category: 'GovSkill (Employee)',
    track: 'employee',
    badgeColor: 'bg-saffron-50 text-saffron-900 border-saffron-300',
    icon: Award,
    x: 70,
    y: 72,
    tagline: 'Server-Evaluated Competency Scoring',
    details: [
      'Correct answers evaluated exclusively server-side; never exposed to frontend',
      'Automated competency scorecard recording best scores and certification thresholds (75%+)',
      'Digital skill credentials earned and verifiable across municipal administrative units',
    ],
    metrics: { label: 'Scoring Integrity', value: 'Server Evaluated' },
    connectedPaths: ['path-tutor-quiz', 'path-quiz-telemetry'],
  },
  {
    id: 'supervisor-telemetry',
    title: 'Supervisor Telemetry',
    category: 'Governance',
    track: 'admin',
    badgeColor: 'bg-purple-50 text-purple-900 border-purple-200',
    icon: LayoutDashboard,
    x: 92,
    y: 72,
    tagline: 'Workforce Readiness & Assessment Analytics',
    details: [
      'Supervisor dashboard tracking employee certifications, attempts, and competency trends',
      'Full administrative CMS for authoring, updating, and managing training modules & quizzes',
      'Immutable audit logging of employee qualification attempts in PostgreSQL',
    ],
    metrics: { label: 'Audit Trail', value: 'PostgreSQL Telemetry' },
    connectedPaths: ['path-quiz-telemetry'],
  },
];

export const EcosystemVisual: React.FC = () => {
  const [activeNodeId, setActiveNodeId] = useState<string>('deterministic-rules');
  const [isTourPlaying, setIsTourPlaying] = useState<boolean>(false);
  const [tourProgress, setTourProgress] = useState<number>(0);
  const shouldReduceMotion = useReducedMotion();

  const activeNode =
    ARCHITECTURE_NODES.find((n) => n.id === activeNodeId) || ARCHITECTURE_NODES[2];

  // Auto-cycling tour lifecycle
  useEffect(() => {
    if (!isTourPlaying) {
      setTourProgress(0);
      return;
    }

    const intervalDuration = 4500;
    const updateRate = 50;
    const step = (updateRate / intervalDuration) * 100;

    const timer = setInterval(() => {
      setTourProgress((prev) => {
        if (prev >= 100) {
          setActiveNodeId((currentId) => {
            const idx = ARCHITECTURE_NODES.findIndex((n) => n.id === currentId);
            const nextIdx = (idx + 1) % ARCHITECTURE_NODES.length;
            return ARCHITECTURE_NODES[nextIdx].id;
          });
          return 0;
        }
        return prev + step;
      });
    }, updateRate);

    return () => clearInterval(timer);
  }, [isTourPlaying]);

  const handleSelectNode = (id: string) => {
    setActiveNodeId(id);
    if (isTourPlaying) {
      setIsTourPlaying(false);
      setTourProgress(0);
    }
  };

  const isPathActive = (pathId: string) => {
    return activeNode.connectedPaths.includes(pathId);
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-civic-xl overflow-hidden flex flex-col">
      {/* Top Architecture Diagram Canvas */}
      <div className="relative bg-gradient-to-b from-slate-950 via-civic-950 to-slate-900 p-6 sm:p-8 min-h-[460px] flex flex-col justify-between overflow-hidden">
        {/* Background Ambient Glows & Grid */}
        <div className="absolute inset-0 bg-civic-dark-pattern opacity-30 pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-civic-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-saffron-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header Control Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between pb-4 border-b border-slate-800/80 gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-200 font-bold uppercase tracking-wider">
            <Cpu className="h-4 w-4 text-saffron-400" />
            <span>Dual-Track System Architecture & Data Flow</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsTourPlaying(!isTourPlaying)}
              aria-label={isTourPlaying ? 'Pause architecture tour' : 'Play architecture tour'}
              className={`relative overflow-hidden flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border shadow-civic-xs cursor-pointer ${
                isTourPlaying
                  ? 'bg-saffron-500 text-slate-950 border-saffron-400 font-bold shadow-lg shadow-saffron-500/20'
                  : 'bg-slate-800/90 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {isTourPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5" />
                  <span>Pause Architecture Tour</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />
                  <span>Play Interactive Tour</span>
                </>
              )}

              {/* Progress Bar inside tour button */}
              {isTourPlaying && (
                <div
                  className="absolute bottom-0 left-0 h-1 bg-slate-950/40 transition-all duration-75"
                  style={{ width: `${tourProgress}%` }}
                />
              )}
            </button>

            {isTourPlaying && (
              <span className="flex items-center gap-1.5 text-[11px] text-saffron-400 font-medium">
                <Sparkles className="h-3 w-3 animate-spin" />
                <span className="hidden sm:inline">Auto-cycling nodes</span>
              </span>
            )}
          </div>
        </div>

        {/* Dual Track Labels */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 text-[11px] font-bold">
          <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-800/40 w-fit">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Track 1: GovAssist Citizen Pre-Submission Verification</span>
          </div>
          <div className="flex items-center gap-2 text-civic-300 bg-civic-950/40 px-3 py-1.5 rounded-xl border border-civic-800/40 w-fit md:ml-auto">
            <span className="h-2 w-2 rounded-full bg-civic-400 animate-pulse" />
            <span>Track 2: GovSkill Employee Learning & Governance Telemetry</span>
          </div>
        </div>

        {/* SVG Flow Paths Canvas */}
        <div className="relative z-10 my-auto py-6">
          <svg className="w-full h-56 sm:h-64" viewBox="0 0 1000 360" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="emerald-stream" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="blue-stream" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="saffron-stream" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="purple-stream" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9333EA" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#C084FC" stopOpacity="0.9" />
              </linearGradient>
              <filter id="stream-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Track 1 Paths (Citizen) */}
            {/* Path 1: Upload -> OCR */}
            <path
              id="path-upload-ocr"
              d="M 140 100 C 240 100, 280 100, 380 100"
              stroke={isPathActive('path-upload-ocr') ? 'url(#emerald-stream)' : '#065F46'}
              strokeWidth={isPathActive('path-upload-ocr') ? '4' : '2'}
              opacity={isPathActive('path-upload-ocr') ? 1 : 0.35}
              filter={isPathActive('path-upload-ocr') ? 'url(#stream-glow)' : undefined}
              className="svg-flow-path"
            />

            {/* Path 2: OCR -> Deterministic Rules */}
            <path
              id="path-ocr-rule"
              d="M 380 100 C 480 100, 520 100, 620 100"
              stroke={isPathActive('path-ocr-rule') ? 'url(#emerald-stream)' : '#065F46'}
              strokeWidth={isPathActive('path-ocr-rule') ? '4' : '2'}
              opacity={isPathActive('path-ocr-rule') ? 1 : 0.35}
              filter={isPathActive('path-ocr-rule') ? 'url(#stream-glow)' : undefined}
              className="svg-flow-path"
            />

            {/* Path 3: Rules -> AI Explanation (Failed rules only) */}
            <path
              id="path-rule-ai"
              d="M 620 100 C 720 100, 760 100, 860 100"
              stroke={isPathActive('path-rule-ai') ? 'url(#blue-stream)' : '#1E40AF'}
              strokeWidth={isPathActive('path-rule-ai') ? '4' : '2'}
              opacity={isPathActive('path-rule-ai') ? 1 : 0.35}
              filter={isPathActive('path-rule-ai') ? 'url(#stream-glow)' : undefined}
              className="svg-flow-path"
            />

            {/* Track 2 Paths (Employee) */}
            {/* Path 4: Curriculum -> Tutor */}
            <path
              id="path-curriculum-tutor"
              d="M 180 260 C 280 260, 340 260, 440 260"
              stroke={isPathActive('path-curriculum-tutor') ? 'url(#blue-stream)' : '#1E40AF'}
              strokeWidth={isPathActive('path-curriculum-tutor') ? '4' : '2'}
              opacity={isPathActive('path-curriculum-tutor') ? 1 : 0.35}
              filter={isPathActive('path-curriculum-tutor') ? 'url(#stream-glow)' : undefined}
              className="svg-flow-path"
            />

            {/* Path 5: Tutor -> Quiz */}
            <path
              id="path-tutor-quiz"
              d="M 440 260 C 540 260, 600 260, 700 260"
              stroke={isPathActive('path-tutor-quiz') ? 'url(#saffron-stream)' : '#9A3412'}
              strokeWidth={isPathActive('path-tutor-quiz') ? '4' : '2'}
              opacity={isPathActive('path-tutor-quiz') ? 1 : 0.35}
              filter={isPathActive('path-tutor-quiz') ? 'url(#stream-glow)' : undefined}
              className="svg-flow-path"
            />

            {/* Path 6: Quiz -> Supervisor Telemetry */}
            <path
              id="path-quiz-telemetry"
              d="M 700 260 C 780 260, 840 260, 920 260"
              stroke={isPathActive('path-quiz-telemetry') ? 'url(#purple-stream)' : '#581C87'}
              strokeWidth={isPathActive('path-quiz-telemetry') ? '4' : '2'}
              opacity={isPathActive('path-quiz-telemetry') ? 1 : 0.35}
              filter={isPathActive('path-quiz-telemetry') ? 'url(#stream-glow)' : undefined}
              className="svg-flow-path"
            />

            {/* Inter-Track Governance Standard Anchor (Central Core Rule Engine) */}
            <circle
              cx="620"
              cy="100"
              r={activeNodeId === 'deterministic-rules' ? 16 : 10}
              fill="#1E4D8C"
              stroke="#93C5FD"
              strokeWidth="3"
              filter="url(#stream-glow)"
            />
          </svg>

          {/* Interactive HTML Node Markers */}
          <div className="absolute inset-0 p-3">
            <div className="relative w-full h-full">
              {ARCHITECTURE_NODES.map((node) => {
                const isSelected = node.id === activeNodeId;
                const IconComp = node.icon;

                return (
                  <motion.button
                    key={node.id}
                    type="button"
                    onClick={() => handleSelectNode(node.id)}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    aria-label={`Inspect ${node.title} architecture node`}
                    aria-selected={isSelected}
                    whileHover={shouldReduceMotion ? {} : { scale: 1.06 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-2.5 sm:p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron-400 ${
                      isSelected
                        ? 'bg-white text-slate-900 border-saffron-400 ring-4 ring-saffron-400/30 scale-105 z-20 shadow-2xl'
                        : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500 z-10 shadow-civic-md'
                    }`}
                  >
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <div
                        className={`p-1.5 rounded-xl ${
                          isSelected
                            ? 'bg-civic-100 text-civic-800'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <IconComp className="h-4 w-4" />
                      </div>
                      <div className="text-left hidden lg:block">
                        <span className="text-xs font-bold block leading-tight">
                          {node.title}
                        </span>
                        <span
                          className={`text-[9px] block font-mono ${
                            isSelected ? 'text-slate-500 font-medium' : 'text-slate-500'
                          }`}
                        >
                          {node.category}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5" aria-hidden="true">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saffron-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-saffron-500 border-2 border-white" />
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Legend Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-3 text-[11px] text-slate-400 border-t border-slate-800/80">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> Citizen Track (GovAssist)
            </span>
            <span className="text-slate-700">•</span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-civic-400" /> Core Rule Engine
            </span>
            <span className="text-slate-700">•</span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-saffron-400" /> Employee & Assessment
            </span>
          </div>

          <span className="text-slate-400 font-mono text-[10px]">
            Click any node or start the automated tour
          </span>
        </div>
      </div>

      {/* Detail Panel for Active Node with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeNode.id}
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="p-6 bg-slate-50 border-t border-slate-200/80"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${activeNode.badgeColor}`}>
                  {activeNode.category}
                </span>
                <span className="text-xs text-slate-500 font-medium">Architecture Deep-Dive</span>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                {activeNode.title}
                <Zap className="h-4 w-4 text-saffron-500" />
              </h4>
              <p className="text-xs text-slate-600 font-medium">{activeNode.tagline}</p>
            </div>

            <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-2xl text-right shrink-0 shadow-civic-xs">
              <p className="text-[10px] uppercase font-bold text-slate-400">{activeNode.metrics.label}</p>
              <p className="text-sm font-extrabold text-civic-800 font-mono">{activeNode.metrics.value}</p>
            </div>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-4">
            {activeNode.details.map((detail, index) => (
              <li
                key={index}
                className="flex items-start gap-2.5 text-xs text-slate-700 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-civic-xs leading-relaxed"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default EcosystemVisual;
