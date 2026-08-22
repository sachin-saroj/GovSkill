import React, { useState } from 'react';
import { FileCheck, Bot, Award, LayoutDashboard, CheckCircle2, Cpu, Lock } from 'lucide-react';

interface NodeItem {
  id: string;
  title: string;
  category: 'GovSkill' | 'GovAssist' | 'Core Infrastructure';
  badgeColor: string;
  icon: React.ElementType;
  x: number; // percentage
  y: number; // percentage
  tagline: string;
  details: string[];
  metrics: { label: string; value: string };
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
    tagline: 'Self-Service Pre-Submission Validation',
    details: [
      'Client-side preview + Tesseract OCR extraction',
      'Instant feedback on Income Certificate image readability',
      'Eliminates in-person rejection at government counters',
    ],
    metrics: { label: 'OCR Pipeline', value: '4 Rules Checked' },
  },
  {
    id: 'rule-engine',
    title: 'Deterministic Rule Engine',
    category: 'Core Infrastructure',
    badgeColor: 'bg-civic-100 text-civic-800 border-civic-300',
    icon: Lock,
    x: 50,
    y: 20,
    tagline: '100% Code-Driven Validation',
    details: [
      'Strict Python/FastAPI business logic execution',
      'Zero LLM decision bias on pass/fail outcomes',
      'Checks format, valid issuance period, officer seal & authority',
    ],
    metrics: { label: 'Decision Logic', value: '100% Deterministic' },
  },
  {
    id: 'ai-tutor',
    title: 'Grounded AI Tutor',
    category: 'GovSkill',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    icon: Bot,
    x: 82,
    y: 35,
    tagline: 'Gemini 2.5 Flash with Document Anchoring',
    details: [
      'Strictly grounded in official departmental training modules',
      'Plain-language failure explanations for citizens',
      'Context-isolated prompts preventing speculative hallucinations',
    ],
    metrics: { label: 'AI Scope', value: 'Grounded & Citation-Bound' },
  },
  {
    id: 'quiz-cert',
    title: 'Certification Assessment',
    category: 'GovSkill',
    badgeColor: 'bg-saffron-50 text-saffron-900 border-saffron-300',
    icon: Award,
    x: 32,
    y: 78,
    tagline: 'Server-Evaluated Skill Verification',
    details: [
      'Correct answers evaluated exclusively on backend',
      'Instant skill competency score & certificate generation',
      'Downloadable official administrative proficiency record',
    ],
    metrics: { label: 'Evaluation', value: 'Server Scored' },
  },
  {
    id: 'admin-telemetry',
    title: 'Governance Oversight',
    category: 'GovSkill',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
    icon: LayoutDashboard,
    x: 68,
    y: 78,
    tagline: 'Departmental Readiness Analytics',
    details: [
      'Real-time pass-rate and employee competency telemetry',
      'Department-level skill coverage & verification audit logs',
      'Administrative dashboard for supervisory officers',
    ],
    metrics: { label: 'Telemetry', value: 'Full Audit Trail' },
  },
];

export const EcosystemVisual: React.FC = () => {
  const [activeNodeId, setActiveNodeId] = useState<string>('rule-engine');
  const activeNode = NODES.find((n) => n.id === activeNodeId) || NODES[1];

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-civic-lg overflow-hidden flex flex-col">
      {/* Top Interactive Diagram Canvas */}
      <div className="relative bg-gradient-to-b from-slate-900 via-civic-950 to-civic-900 p-6 sm:p-8 min-h-[360px] flex flex-col justify-between overflow-hidden">
        {/* Background Grid & Civic Glow */}
        <div className="absolute inset-0 bg-civic-pattern opacity-10 pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-civic-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-saffron-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Diagram Header Bar */}
        <div className="relative z-10 flex items-center justify-between pb-4 border-b border-slate-800/80 text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-semibold uppercase tracking-wider">
            <Cpu className="h-4 w-4 text-saffron-400" />
            <span>Interactive GovSkill & GovAssist Ecosystem Architecture</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline-block">
            Click any node to inspect data flow
          </span>
        </div>

        {/* SVG Connecting Paths */}
        <div className="relative z-10 my-auto py-8">
          <svg className="w-full h-44 sm:h-52" viewBox="0 0 1000 360" fill="none">
            {/* SVG Connecting Flow Lines */}
            <path
              d="M 180 130 C 340 130, 340 70, 500 70"
              stroke="#059669"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              className="animate-pulse"
            />
            <path
              d="M 500 70 C 660 70, 660 130, 820 130"
              stroke="#3B82F6"
              strokeWidth="2.5"
              strokeDasharray="6 6"
            />
            <path
              d="M 500 70 C 500 180, 320 200, 320 280"
              stroke="#D97706"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <path
              d="M 500 70 C 500 180, 680 200, 680 280"
              stroke="#9333EA"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Central Engine Anchor */}
            <circle cx="500" cy="70" r="14" fill="#1E4D8C" stroke="#60A5FA" strokeWidth="3" />
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
                    onClick={() => setActiveNodeId(node.id)}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group p-2.5 sm:p-3.5 rounded-xl border transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron-400 ${
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

                    {/* Active Pulsing Indicator */}
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
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

        {/* Category Pills Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> GovAssist (Citizen)
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-blue-500" /> GovSkill (Employee Training)
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-saffron-500" /> Assessment & Governance
          </span>
        </div>
      </div>

      {/* Bottom Detail Showcase Card for Active Node */}
      <div className="p-6 bg-slate-50 border-t border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${activeNode.badgeColor}`}>
                {activeNode.category}
              </span>
              <span className="text-xs text-slate-500 font-medium">Node Showcase</span>
            </div>
            <h4 className="text-base font-bold text-slate-900 tracking-tight">
              {activeNode.title}
            </h4>
            <p className="text-xs text-slate-600 font-medium">{activeNode.tagline}</p>
          </div>

          <div className="bg-white border border-slate-200 px-3.5 py-2 rounded-lg text-right shrink-0">
            <p className="text-[10px] uppercase font-bold text-slate-400">{activeNode.metrics.label}</p>
            <p className="text-xs font-bold text-civic-800">{activeNode.metrics.value}</p>
          </div>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3">
          {activeNode.details.map((detail, index) => (
            <li key={index} className="flex items-start gap-2 text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200/70 shadow-civic-xs">
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
