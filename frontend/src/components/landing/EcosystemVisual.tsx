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
} from 'lucide-react';

interface NodeItem {
  id: string;
  title: string;
  category: 'GovAssist' | 'Core Architecture' | 'GovSkill' | 'Governance';
  badgeColor: string;
  icon: React.ElementType;
  x: number; // percentage
  y: number; // percentage
  tagline: string;
  details: string[];
  metrics: { label: string; value: string };
  connectedPathIds: string[];
}

const NODES: NodeItem[] = [
  {
    id: 'citizen-ocr',
    title: 'Citizen Document Pre-Check',
    category: 'GovAssist',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    icon: FileCheck,
    x: 18,
    y: 35,
    tagline: 'Self-Service Pre-Submission OCR Extraction',
    details: [
      'Client preview + server-side Tesseract OCR extraction',
      'Parses applicant name, certificate number, and expiry date',
      'Runs before physical submission to eliminate administrative counter rejection',
    ],
    metrics: { label: 'Citizen Pipeline', value: 'Instant Pre-Check' },
    connectedPathIds: ['path-citizen-rule'],
  },
  {
    id: 'rule-engine',
    title: 'Deterministic Rule Engine',
    category: 'Core Architecture',
    badgeColor: 'bg-civic-100 text-civic-800 border-civic-300',
    icon: Lock,
    x: 50,
    y: 20,
    tagline: '100% Code-Driven Validation Protocol',
    details: [
      'Strict Python/FastAPI business rules evaluate document compliance',
      'Zero AI decision bias on pass/fail validation decisions',
      'Enforces name presence, number format, validity period, and officer authority',
    ],
    metrics: { label: 'Validation Logic', value: '100% Deterministic' },
    connectedPathIds: ['path-citizen-rule', 'path-rule-ai', 'path-rule-quiz'],
  },
  {
    id: 'ai-grounding',
    title: 'Grounded AI Explanations & Tutor',
    category: 'GovSkill',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    icon: Bot,
    x: 82,
    y: 35,
    tagline: 'Gemini 2.5 Flash Anchored to Official Guidelines',
    details: [
      'Translates failed deterministic rules into clear citizen action steps',
      'Answers employee queries strictly bounded to training module texts',
      'Context-isolated prompts preventing speculative hallucinations',
    ],
    metrics: { label: 'AI Scope', value: 'Grounded & Citation-Bound' },
    connectedPathIds: ['path-rule-ai'],
  },
  {
    id: 'quiz-cert',
    title: 'Certification Assessment',
    category: 'GovSkill',
    badgeColor: 'bg-saffron-50 text-saffron-900 border-saffron-300',
    icon: Award,
    x: 32,
    y: 78,
    tagline: 'Server-Evaluated Competency Scoring',
    details: [
      'Answers scored exclusively on the backend server for integrity',
      'Instant digital competency certificates generated upon 75%+ score',
      'Reinforces document verification protocols learned in module lessons',
    ],
    metrics: { label: 'Scoring Mode', value: 'Server Evaluated' },
    connectedPathIds: ['path-rule-quiz', 'path-quiz-admin'],
  },
  {
    id: 'admin-telemetry',
    title: 'Governance & Audit Oversight',
    category: 'Governance',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
    icon: LayoutDashboard,
    x: 68,
    y: 78,
    tagline: 'Departmental Readiness Analytics & Telemetry',
    details: [
      'Supervisor portal tracking workforce certification completion rates',
      'Comprehensive audit log of quiz attempts, timestamps, and scores',
      'Authoring CMS for official training modules and assessment questions',
    ],
    metrics: { label: 'Audit Trail', value: 'PostgreSQL Telemetry' },
    connectedPathIds: ['path-quiz-admin'],
  },
];

export const EcosystemVisual: React.FC = () => {
  const [activeNodeId, setActiveNodeId] = useState<string>('rule-engine');
  const [isTourPlaying, setIsTourPlaying] = useState<boolean>(false);
  const [tourProgress, setTourProgress] = useState<number>(0);
  const shouldReduceMotion = useReducedMotion();

  const activeNode = NODES.find((n) => n.id === activeNodeId) || NODES[1];

  // Auto-tour lifecycle player with smooth progress timer
  useEffect(() => {
    if (!isTourPlaying) {
      setTourProgress(0);
      return;
    }

    const intervalDuration = 4000;
    const updateRate = 50;
    const step = (updateRate / intervalDuration) * 100;

    const progressTimer = setInterval(() => {
      setTourProgress((prev) => {
        if (prev >= 100) {
          setActiveNodeId((currentId) => {
            const currentIndex = NODES.findIndex((n) => n.id === currentId);
            const nextIndex = (currentIndex + 1) % NODES.length;
            return NODES[nextIndex].id;
          });
          return 0;
        }
        return prev + step;
      });
    }, updateRate);

    return () => clearInterval(progressTimer);
  }, [isTourPlaying]);

  const handleSelectNode = (id: string) => {
    setActiveNodeId(id);
    if (isTourPlaying) {
      setIsTourPlaying(false);
      setTourProgress(0);
    }
  };

  const isPathActive = (pathId: string) => {
    return activeNode.connectedPathIds.includes(pathId);
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-civic-xl overflow-hidden flex flex-col transition-all duration-300">
      {/* Top Interactive Diagram Canvas */}
      <div className="relative bg-gradient-to-b from-slate-900 via-civic-950 to-civic-900 p-6 sm:p-8 min-h-[420px] flex flex-col justify-between overflow-hidden">
        {/* Background Grid & Ambient Glows */}
        <div className="absolute inset-0 bg-civic-pattern opacity-10 pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-civic-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-saffron-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Diagram Controls Header Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between pb-4 border-b border-slate-800/80 gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-200 font-bold uppercase tracking-wider">
            <Cpu className="h-4 w-4 text-saffron-400" />
            <span>GovSkill & GovAssist Dynamic Architecture Flow</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Tour Button */}
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

              {/* Animated Progress Fill Bar */}
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

        {/* SVG Connecting Paths & Moving Packets */}
        <div className="relative z-10 my-auto py-8">
          <svg className="w-full h-52 sm:h-60" viewBox="0 0 1000 360" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="emerald-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="blue-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="saffron-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="purple-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9333EA" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#C084FC" stopOpacity="0.9" />
              </linearGradient>
              <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Path 1: Citizen Pre-Check -> Deterministic Rule Engine */}
            <path
              id="path-citizen-rule"
              d="M 180 126 C 320 126, 340 72, 500 72"
              stroke={isPathActive('path-citizen-rule') ? 'url(#emerald-glow)' : '#047857'}
              strokeWidth={isPathActive('path-citizen-rule') ? '4' : '2'}
              opacity={isPathActive('path-citizen-rule') ? 1 : 0.3}
              filter={isPathActive('path-citizen-rule') ? 'url(#glow-filter)' : undefined}
              className="svg-flow-path transition-all duration-300"
            />

            {/* Path 2: Rule Engine -> AI Explanations & Tutor */}
            <path
              id="path-rule-ai"
              d="M 500 72 C 660 72, 680 126, 820 126"
              stroke={isPathActive('path-rule-ai') ? 'url(#blue-glow)' : '#1D4ED8'}
              strokeWidth={isPathActive('path-rule-ai') ? '4' : '2'}
              opacity={isPathActive('path-rule-ai') ? 1 : 0.3}
              filter={isPathActive('path-rule-ai') ? 'url(#glow-filter)' : undefined}
              className="svg-flow-path transition-all duration-300"
            />

            {/* Path 3: Training Standards Core -> Certification Assessment */}
            <path
              id="path-rule-quiz"
              d="M 500 72 C 500 180, 320 190, 320 280"
              stroke={isPathActive('path-rule-quiz') ? 'url(#saffron-glow)' : '#B45309'}
              strokeWidth={isPathActive('path-rule-quiz') ? '4' : '2'}
              opacity={isPathActive('path-rule-quiz') ? 1 : 0.3}
              filter={isPathActive('path-rule-quiz') ? 'url(#glow-filter)' : undefined}
              className="svg-flow-path transition-all duration-300"
            />

            {/* Path 4: Quiz Assessment Evaluation -> Supervisor Oversight Telemetry */}
            <path
              id="path-quiz-admin"
              d="M 320 280 C 450 310, 550 310, 680 280"
              stroke={isPathActive('path-quiz-admin') ? 'url(#purple-glow)' : '#7E22CE'}
              strokeWidth={isPathActive('path-quiz-admin') ? '4' : '2'}
              opacity={isPathActive('path-quiz-admin') ? 1 : 0.3}
              filter={isPathActive('path-quiz-admin') ? 'url(#glow-filter)' : undefined}
              className="svg-flow-path transition-all duration-300"
            />

            {/* Central Deterministic Engine Hub Node */}
            <circle
              cx="500"
              cy="72"
              r={activeNodeId === 'rule-engine' ? 18 : 12}
              fill="#1E4D8C"
              stroke="#93C5FD"
              strokeWidth="3.5"
              filter="url(#glow-filter)"
              className="transition-all duration-300"
            />
          </svg>

          {/* Interactive HTML Node Markers with Framer Motion */}
          <div className="absolute inset-0 p-4">
            <div className="relative w-full h-full">
              {NODES.map((node) => {
                const isSelected = node.id === activeNodeId;
                const IconComponent = node.icon;

                return (
                  <motion.button
                    key={node.id}
                    type="button"
                    onClick={() => handleSelectNode(node.id)}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    aria-label={`Inspect ${node.title} architecture node`}
                    aria-selected={isSelected}
                    whileHover={shouldReduceMotion ? {} : { scale: 1.08 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group p-3 sm:p-4 rounded-2xl border transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron-400 ${
                      isSelected
                        ? 'bg-white text-civic-950 border-saffron-400 ring-4 ring-saffron-400/30 scale-110 z-20 shadow-2xl'
                        : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500 z-10 shadow-civic-md'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 whitespace-nowrap">
                      <div
                        className={`p-1.5 rounded-lg ${
                          isSelected
                            ? 'bg-civic-100 text-civic-800'
                            : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                        }`}
                      >
                        <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div className="text-left hidden md:block">
                        <span className="text-xs sm:text-sm font-bold block leading-tight">
                          {node.title}
                        </span>
                        <span
                          className={`text-[10px] block font-mono ${
                            isSelected ? 'text-slate-500 font-medium' : 'text-slate-500'
                          }`}
                        >
                          {node.category}
                        </span>
                      </div>
                    </div>

                    {/* Active Pulsing Marker */}
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

        {/* Category Legend Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-2 text-[11px] text-slate-400 border-t border-slate-800/80">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" /> GovAssist (Citizen Pre-Check)
            </span>
            <span className="text-slate-700">•</span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" /> GovSkill (Tutor & Modules)
            </span>
            <span className="text-slate-700">•</span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-saffron-500 shadow-sm shadow-saffron-500/50" /> Assessment & Oversight
            </span>
          </div>

          <span className="text-slate-400 font-mono text-[10px]">
            Click any node or start the automated tour
          </span>
        </div>
      </div>

      {/* Bottom Detail Showcase Card for Active Node with AnimatePresence */}
      <AnimatePresence initial={false}>
        <motion.div
          key={activeNode.id}
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
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
              <motion.li
                key={index}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="flex items-start gap-2.5 text-xs text-slate-700 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-civic-xs leading-relaxed hover:border-slate-300 transition-colors"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{detail}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default EcosystemVisual;
