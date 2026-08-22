import React, { useEffect, useState } from 'react';
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

  const activeNode = NODES.find((n) => n.id === activeNodeId) || NODES[1];

  // Auto-tour lifecycle player
  useEffect(() => {
    if (!isTourPlaying) return;

    const interval = setInterval(() => {
      setActiveNodeId((currentId) => {
        const currentIndex = NODES.findIndex((n) => n.id === currentId);
        const nextIndex = (currentIndex + 1) % NODES.length;
        return NODES[nextIndex].id;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [isTourPlaying]);

  const handleSelectNode = (id: string) => {
    setActiveNodeId(id);
    if (isTourPlaying) {
      setIsTourPlaying(false);
    }
  };

  const isPathActive = (pathId: string) => {
    return activeNode.connectedPathIds.includes(pathId);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-civic-lg overflow-hidden flex flex-col transition-all duration-300">
      {/* Top Interactive Diagram Canvas */}
      <div className="relative bg-gradient-to-b from-slate-900 via-civic-950 to-civic-900 p-6 sm:p-8 min-h-[380px] flex flex-col justify-between overflow-hidden">
        {/* Background Grid & Ambient Glows */}
        <div className="absolute inset-0 bg-civic-pattern opacity-10 pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-civic-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-saffron-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Diagram Controls Header Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between pb-4 border-b border-slate-800/80 gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-200 font-bold uppercase tracking-wider">
            <Cpu className="h-4 w-4 text-saffron-400" />
            <span>GovSkill & GovAssist Architecture Flow</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsTourPlaying(!isTourPlaying)}
              aria-label={isTourPlaying ? 'Pause architecture tour' : 'Play architecture tour'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border shadow-civic-xs cursor-pointer ${
                isTourPlaying
                  ? 'bg-saffron-500 text-slate-950 border-saffron-400 font-bold'
                  : 'bg-slate-800/90 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {isTourPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5" />
                  <span>Pause Tour</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />
                  <span>Play Architecture Tour</span>
                </>
              )}
            </button>

            {isTourPlaying && (
              <span className="flex items-center gap-1.5 text-[11px] text-saffron-400 font-medium animate-pulse">
                <Sparkles className="h-3 w-3" />
                <span>Auto-cycling nodes</span>
              </span>
            )}
          </div>
        </div>

        {/* SVG Connecting Paths & Moving Packets */}
        <div className="relative z-10 my-auto py-8">
          <svg className="w-full h-48 sm:h-56" viewBox="0 0 1000 360" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="emerald-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#107C41" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="blue-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1E4D8C" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
              <linearGradient id="saffron-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
              <linearGradient id="purple-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9333EA" />
                <stop offset="100%" stopColor="#C084FC" />
              </linearGradient>
            </defs>

            {/* Path 1: Citizen Pre-Check -> Deterministic Rule Engine */}
            <path
              id="path-citizen-rule"
              d="M 180 126 C 320 126, 340 72, 500 72"
              stroke={isPathActive('path-citizen-rule') ? '#10B981' : '#047857'}
              strokeWidth={isPathActive('path-citizen-rule') ? '3.5' : '2'}
              opacity={isPathActive('path-citizen-rule') ? 1 : 0.4}
              className="svg-flow-path transition-all duration-300"
            />

            {/* Path 2: Rule Engine -> AI Explanations & Tutor */}
            <path
              id="path-rule-ai"
              d="M 500 72 C 660 72, 680 126, 820 126"
              stroke={isPathActive('path-rule-ai') ? '#60A5FA' : '#1D4ED8'}
              strokeWidth={isPathActive('path-rule-ai') ? '3.5' : '2'}
              opacity={isPathActive('path-rule-ai') ? 1 : 0.4}
              className="svg-flow-path transition-all duration-300"
            />

            {/* Path 3: Training Standards Core -> Certification Assessment */}
            <path
              id="path-rule-quiz"
              d="M 500 72 C 500 180, 320 190, 320 280"
              stroke={isPathActive('path-rule-quiz') ? '#FBBF24' : '#B45309'}
              strokeWidth={isPathActive('path-rule-quiz') ? '3.5' : '2'}
              opacity={isPathActive('path-rule-quiz') ? 1 : 0.4}
              className="svg-flow-path transition-all duration-300"
            />

            {/* Path 4: Quiz Assessment Evaluation -> Supervisor Oversight Telemetry */}
            <path
              id="path-quiz-admin"
              d="M 320 280 C 450 310, 550 310, 680 280"
              stroke={isPathActive('path-quiz-admin') ? '#C084FC' : '#7E22CE'}
              strokeWidth={isPathActive('path-quiz-admin') ? '3.5' : '2'}
              opacity={isPathActive('path-quiz-admin') ? 1 : 0.4}
              className="svg-flow-path transition-all duration-300"
            />

            {/* Central Deterministic Engine Hub Node */}
            <circle
              cx="500"
              cy="72"
              r={activeNodeId === 'rule-engine' ? 16 : 12}
              fill="#1E4D8C"
              stroke="#93C5FD"
              strokeWidth="3"
              className="transition-all duration-300"
            />
          </svg>

          {/* Interactive HTML Node Markers */}
          <div className="absolute inset-0 p-4">
            <div className="relative w-full h-full">
              {NODES.map((node) => {
                const isSelected = node.id === activeNodeId;
                const IconComponent = node.icon;

                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => handleSelectNode(node.id)}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    aria-label={`Inspect ${node.title} architecture node`}
                    aria-selected={isSelected}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group p-2.5 sm:p-3.5 rounded-xl border transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron-400 ${
                      isSelected
                        ? 'bg-white text-civic-950 border-saffron-400 ring-4 ring-saffron-400/30 scale-110 z-20 shadow-civic-xl'
                        : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500 hover:scale-105 z-10 shadow-civic-md'
                    }`}
                  >
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <IconComponent
                        className={`h-4 w-4 sm:h-5 sm:w-5 ${
                          isSelected ? 'text-civic-700' : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      />
                      <span className="text-xs sm:text-sm font-semibold hidden md:inline-block">
                        {node.title}
                      </span>
                    </div>

                    {/* Active Pulsing Marker */}
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3" aria-hidden="true">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saffron-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-saffron-500" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Category Legend Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-2 text-[11px] text-slate-400 border-t border-slate-800/80">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> GovAssist (Citizen)
            </span>
            <span className="text-slate-700">•</span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500" /> GovSkill (Tutor & Modules)
            </span>
            <span className="text-slate-700">•</span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-saffron-500" /> Assessment & Oversight
            </span>
          </div>

          <span className="text-slate-400 font-mono text-[10px]">
            Click any node or start the automated tour
          </span>
        </div>
      </div>

      {/* Bottom Detail Showcase Card for Active Node */}
      <div className="p-6 bg-slate-50 border-t border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${activeNode.badgeColor}`}>
                {activeNode.category}
              </span>
              <span className="text-xs text-slate-500 font-medium">Architecture Breakdown</span>
            </div>
            <h4 className="text-base font-bold text-slate-900 tracking-tight">
              {activeNode.title}
            </h4>
            <p className="text-xs text-slate-600 font-medium">{activeNode.tagline}</p>
          </div>

          <div className="bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-right shrink-0 shadow-civic-xs">
            <p className="text-[10px] uppercase font-bold text-slate-400">{activeNode.metrics.label}</p>
            <p className="text-xs font-extrabold text-civic-800">{activeNode.metrics.value}</p>
          </div>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3">
          {activeNode.details.map((detail, index) => (
            <li key={index} className="flex items-start gap-2 text-xs text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200/70 shadow-civic-xs leading-relaxed">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EcosystemVisual;
