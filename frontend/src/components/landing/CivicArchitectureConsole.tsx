import React, { useState, useEffect, useCallback } from 'react';
import {
  FileCheck,
  Bot,
  Award,
  LayoutDashboard,
  Shield,
  FileCode2,
  Play,
  Pause,
  CheckCircle2,
  Lock,
  Sparkles,
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

interface ArchitectureNode {
  id: string;
  title: string;
  category: string;
  track: 'citizen' | 'core' | 'employee' | 'admin';
  icon: React.ElementType;
  tagline: string;
  details: string[];
  metrics: { label: string; value: string };
}

const NODES: ArchitectureNode[] = [
  {
    id: 'rule-engine',
    title: '100% Code-Driven Validation Protocol',
    category: 'Deterministic Core',
    track: 'core',
    icon: Lock,
    tagline: 'Zero-AI Deterministic Rule Processing Engine',
    details: [
      'Authored in pure Python regex and ISO date comparison algorithms (rule_engine.py)',
      '100% deterministic decision boundary: AI is strictly prohibited from making pass/fail decisions',
      'Evaluates certificate format, issuing authority, expiry dates, and official stamp clarity',
    ],
    metrics: { label: 'Decision Logic', value: '100% Code Driven' },
  },
  {
    id: 'citizen-upload',
    title: 'Citizen Document Pre-Check',
    category: 'GovAssist (Citizen)',
    track: 'citizen',
    icon: FileCheck,
    tagline: 'Self-Service Pre-Submission OCR Extraction',
    details: [
      'Accepts Income Certificate scans (PNG, JPG, PDF) with 5MB validation limits',
      'No citizen login required; generates unique UUID Reference ID for status lookups',
      'Provides instant actionable pre-submission counter slip before visiting the office',
    ],
    metrics: { label: 'Ingestion Mode', value: 'Zero-Login Self-Service' },
  },
  {
    id: 'ocr-extraction',
    title: 'Tesseract OCR Engine',
    category: 'GovAssist (Citizen)',
    track: 'citizen',
    icon: FileCode2,
    tagline: 'Multi-Stage Image Preprocessing & Text Extraction',
    details: [
      'Pillow image enhancement with grayscale conversion, 2.0x contrast boosting, and binarization',
      'Regex parsing of applicant names, official certificate numbers, and valid date spans',
      'Direct text extraction and PyMuPDF rendering pipeline for multi-page documents',
    ],
    metrics: { label: 'Extraction Pipeline', value: 'Binarized OCR' },
  },
  {
    id: 'ai-explanation',
    title: 'Plain-Language AI Rule Explanations',
    category: 'GovAssist (Citizen)',
    track: 'citizen',
    icon: Bot,
    tagline: 'Isolated Google Gemini Explanation Layer',
    details: [
      'Invoked strictly for failed rules to explain rejections in empathetic, plain language',
      'Privacy-preserving: only rule rejection reason is passed, zero citizen PII leaked to LLM',
      'Hardcoded fallback responses guaranteed if external AI API times out or key is missing',
    ],
    metrics: { label: 'AI Guardrail', value: 'Strictly Grounded' },
  },
  {
    id: 'employee-academy',
    title: 'Employee Competency Academy',
    category: 'GovSkill (Employee)',
    track: 'employee',
    icon: Shield,
    tagline: 'Curriculum-Driven Local Government Training',
    details: [
      'Comprehensive administrative lessons with reading estimates, scenarios, and red flags',
      'Interactive formative knowledge self-checks for practical skill verification',
      'Contextual AI Tutor assistance bound strictly to approved local office SOP guidelines',
    ],
    metrics: { label: 'Curriculum Coverage', value: '4 Active Modules' },
  },
  {
    id: 'quiz-evaluation',
    title: 'Server-Scored Certified Assessment',
    category: 'GovSkill (Employee)',
    track: 'employee',
    icon: Award,
    tagline: 'Tamper-Evident HMAC Cryptographic Certification',
    details: [
      'Answer key strictly withheld from client; evaluated server-side in secure API routes',
      'Issues tamper-evident HMAC-SHA256 signed digital certificates for scores >= 75%',
      '70/30 recency-weighted competency mastery tracking across repeated attempts',
    ],
    metrics: { label: 'Passing Standard', value: '>= 75% Score' },
  },
  {
    id: 'supervisor-dashboard',
    title: 'Department Supervisor Dashboard',
    category: 'Supervisor Telemetry',
    track: 'admin',
    icon: LayoutDashboard,
    tagline: 'Workforce Competency Telemetry & Statutory Audit Export',
    details: [
      'Aggregated workforce pass rates, assessment histories, and competency gap identification',
      'Full administrative module & question CMS with role-based access control',
      'Statutory CSV & JSON compliance exports with citizen pre-check defect telemetry',
    ],
    metrics: { label: 'Auditing Format', value: 'CSV & JSON Export' },
  },
];

export const CivicArchitectureConsole: React.FC = () => {
  const [activeNodeId, setActiveNodeId] = useState<string>('rule-engine');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const activeNode = NODES.find((n) => n.id === activeNodeId) || NODES[0];

  const handleNext = useCallback(() => {
    setActiveNodeId((prevId) => {
      const idx = NODES.findIndex((n) => n.id === prevId);
      const nextIdx = (idx + 1) % NODES.length;
      return NODES[nextIdx].id;
    });
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(handleNext, 4500);
    return () => clearInterval(interval);
  }, [isPlaying, handleNext]);

  return (
    <div className="w-full space-y-6">
      {/* Top Console Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-civic-xl bg-slate-900 border border-slate-800 shadow-civic-sm">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-caption font-semibold text-slate-200">
            Interactive Architecture Inspector
          </span>
          <span className="text-micro px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
            {NODES.findIndex((n) => n.id === activeNode.id) + 1} of {NODES.length} Modules
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={isPlaying ? 'Pause architecture tour' : 'Play architecture tour'}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-caption font-semibold bg-civic-800 hover:bg-civic-700 text-white transition-colors cursor-pointer border border-civic-600 shadow-civic-xs"
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5 text-saffron-400" />
                <span>Pause architecture tour</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 text-saffron-400 fill-saffron-400" />
                <span>Play architecture tour</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Node Selector Pills Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {NODES.map((node) => {
          const isSelected = node.id === activeNode.id;
          const NodeIcon = node.icon;
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => {
                setActiveNodeId(node.id);
                setIsPlaying(false);
              }}
              aria-label={`Inspect ${node.title} architecture node`}
              className={`flex items-start gap-3 p-3.5 rounded-civic-xl text-left transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-civic-900 border-civic-500 shadow-civic-md ring-1 ring-civic-500'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div
                className={`p-2 rounded-civic-md shrink-0 ${
                  isSelected ? 'bg-civic-700 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                <NodeIcon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-caption font-semibold truncate ${
                    isSelected ? 'text-white' : 'text-slate-300'
                  }`}
                >
                  {node.title}
                </p>
                <p className="text-micro text-slate-400 truncate">{node.category}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Node Deep-Dive Inspection Card */}
      <Card className="bg-slate-900 border border-slate-800 rounded-civic-2xl p-6 sm:p-8 text-white shadow-civic-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="info" size="sm">
                {activeNode.category}
              </Badge>
              <span className="text-micro font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Deterministic Verification
              </span>
            </div>
            <h3 className="text-section-heading sm:text-page-title font-semibold text-white tracking-tight">
              {activeNode.title}
            </h3>
            <p className="text-body text-slate-300 font-medium">
              {activeNode.tagline}
            </p>
          </div>

          <div className="p-4 rounded-civic-xl bg-slate-950/80 border border-slate-800 text-center sm:text-right shrink-0">
            <p className="text-micro uppercase tracking-wider text-slate-400 font-semibold">
              {activeNode.metrics.label}
            </p>
            <p className="text-section-heading font-bold text-saffron-400 font-mono">
              {activeNode.metrics.value}
            </p>
          </div>
        </div>

        {/* Architectural Verification Assertions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeNode.details.map((detail, idx) => (
            <div
              key={idx}
              className="p-4 rounded-civic-xl bg-slate-950/50 border border-slate-800/80 space-y-2 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2 text-micro font-semibold text-civic-400">
                <Sparkles className="h-3.5 w-3.5 text-saffron-400" />
                <span>Verification Pillar #{idx + 1}</span>
              </div>
              <p className="text-caption text-slate-300 leading-relaxed">
                {detail}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default CivicArchitectureConsole;
