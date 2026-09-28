import React, { useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ShieldCheck,
  AlertTriangle,
  Printer,
  X,
  FileCheck2,
  Calendar,
  User,
  Hash,
  Clock,
  FileText,
  Copy,
  Check,
  CheckCircle2,
} from 'lucide-react';
import { ValidationRuleResult } from '@/types';
import Button from '@/components/ui/Button';
import { scaleInVariants } from '@/lib/motion';
import { GovSkillLogo } from '@/components/GovSkillLogo';

export interface CounterSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  overallStatus?: string;
  extractedData?: Record<string, any> | null;
  validationResults: ValidationRuleResult[];
  passedCount?: number;
  totalCount?: number;
  timestamp?: string | null;
  recommendedNextStep?: string | null;
}

export const CounterSlipModal: React.FC<CounterSlipModalProps> = ({
  isOpen,
  onClose,
  documentId,
  overallStatus = 'ACTION_REQUIRED',
  extractedData,
  validationResults,
  passedCount,
  totalCount,
  timestamp,
  recommendedNextStep,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [copied, setCopied] = React.useState(false);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isPassed = overallStatus === 'PASSED' || validationResults.every((r) => r.passed);
  const totalRules = totalCount ?? validationResults.length;
  const passedRules = passedCount ?? validationResults.filter((r) => r.passed).length;
  const failedRules = validationResults.filter((r) => !r.passed);

  const formattedDate = timestamp
    ? new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

  const handlePrint = () => {
    window.print();
  };

  const handleCopyRef = () => {
    if (documentId) {
      navigator.clipboard.writeText(documentId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <div
        data-testid="counter-slip-backdrop"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-xs print:p-0 print:static print:bg-white print:backdrop-blur-none"
      >
        <motion.div
          variants={scaleInVariants}
          initial={shouldReduceMotion ? {} : 'hidden'}
          animate="visible"
          exit="exit"
          role="dialog"
          aria-modal="true"
          aria-labelledby="counter-slip-title"
          className="relative w-full max-w-3xl bg-surface border border-border-warm rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col print:max-h-none print:shadow-none print:border-none print:w-full print:m-0 print:rounded-none"
        >
          {/* Top Modal Controls (Hidden in Print) */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-warm/70 bg-surface print:hidden shrink-0">
            <div className="flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-civic" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ink">
                Pre-Submission Counter Slip
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                onClick={handlePrint}
                variant="primary"
                size="sm"
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer rounded-full min-h-[38px] px-5 bg-ink hover:bg-ink/90 text-on-ink shadow-xs"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print / Save PDF Slip</span>
              </Button>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close Counter Slip Modal"
                className="p-2 text-ink-muted hover:text-ink hover:bg-surface-light transition-colors cursor-pointer rounded-full border border-transparent hover:border-border-warm"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Printable Counter Slip Container */}
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto print:overflow-visible print:p-6 print:space-y-4 printable-slip bg-surface text-ink">
            {/* Header: DPI & Service Heading with Sovereign Logo */}
            <div className="border-b border-border-warm/70 pb-5 text-center space-y-2">
              <div className="flex items-center justify-center gap-3">
                <GovSkillLogo size={48} variant="icon" />
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-ink text-on-ink rounded-full font-mono text-[10px] font-bold uppercase tracking-[0.2em] print:bg-black print:text-white">
                  <span>National Digital Public Infrastructure • Local Governance Platform</span>
                </div>
              </div>
              <h1 id="counter-slip-title" className="font-sans font-bold text-2xl uppercase tracking-tight text-ink pt-2">
                PRE-SUBMISSION COUNTER SLIP
              </h1>
              <p className="text-[11px] font-mono font-medium text-ink-muted uppercase tracking-wider">
                GovAssist Self-Service Document Quality & Pre-Validation Inspection
              </p>
            </div>

            {/* Document Metadata & Status Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-surface-light rounded-2xl border border-border-warm print:bg-white print:border-slate-300">
              <div className="space-y-1 sm:col-span-2">
                <span className="font-mono text-[10px] font-bold text-ink-muted uppercase tracking-[0.2em] block">
                  Document Reference ID:
                </span>
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-ink">
                  <span className="truncate">{documentId}</span>
                  <button
                    type="button"
                    onClick={handleCopyRef}
                    className="p-1 text-ink-muted hover:text-ink transition-colors print:hidden cursor-pointer"
                    title="Copy Reference ID"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-sage" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1 sm:text-right">
                <span className="font-mono text-[10px] font-bold text-ink-muted uppercase tracking-[0.2em] block">
                  Inspection Timestamp:
                </span>
                <span className="text-xs font-mono font-medium text-ink flex items-center gap-1 sm:justify-end">
                  <Clock className="h-3 w-3 text-ink-muted print:hidden" />
                  {formattedDate}
                </span>
              </div>
            </div>

            {/* Extracted Certificate Profile */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-caption">
              <div className="p-3.5 bg-surface-light rounded-xl border border-border-warm space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.15em] font-bold text-ink-muted flex items-center gap-1">
                  <User className="h-3 w-3 text-civic" /> Applicant Name
                </span>
                <p className="font-bold text-ink text-sm">
                  {extractedData?.name || <span className="text-rose italic font-normal">Not Detected</span>}
                </p>
              </div>

              <div className="p-3.5 bg-surface-light rounded-xl border border-border-warm space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.15em] font-bold text-ink-muted flex items-center gap-1">
                  <Hash className="h-3 w-3 text-civic" /> Certificate Number
                </span>
                <p className="font-mono font-bold text-ink text-sm">
                  {extractedData?.certificate_number || <span className="text-rose italic font-normal">Not Detected</span>}
                </p>
              </div>

              <div className="p-3.5 bg-surface-light rounded-xl border border-border-warm space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.15em] font-bold text-ink-muted flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-civic" /> Validity / Expiry Date
                </span>
                <p className="font-mono font-bold text-ink text-sm">
                  {extractedData?.expiry_date || <span className="text-rose italic font-normal">Not Detected</span>}
                </p>
              </div>
            </div>

            {/* Authoritative Overall Status Banner */}
            <div
              className={`p-6 border-l-4 border border-border-warm rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isPassed
                  ? 'border-l-sage bg-surface-light print:bg-white print:border-emerald-600'
                  : 'border-l-rose bg-surface-light print:bg-white print:border-[#AF411E]'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`h-11 w-11 flex items-center justify-center shrink-0 font-bold rounded-xl border ${
                    isPassed
                      ? 'bg-sage/15 text-sage border-sage/30'
                      : 'bg-rose/15 text-rose border-rose/30'
                  }`}
                >
                  {isPassed ? <ShieldCheck className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase font-bold tracking-[0.2em] text-ink-muted block">
                    Pre-Submission Status Result
                  </span>
                  <h2 className="font-sans font-bold text-base uppercase tracking-tight text-ink">
                    {isPassed
                      ? 'READY FOR PHYSICAL COUNTER SUBMISSION'
                      : 'ACTION REQUIRED BEFORE COUNTER SUBMISSION'}
                  </h2>
                  {recommendedNextStep && (
                    <p className="text-caption text-ink-muted leading-snug pt-0.5 max-w-xl">
                      {recommendedNextStep}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:text-right shrink-0">
                <span className="inline-block px-3 py-1 font-mono text-xs uppercase font-bold bg-surface-elevated border border-border-warm rounded-full text-ink">
                  {passedRules} / {totalRules} Rules Compliant
                </span>
              </div>
            </div>

            {/* 4-Rule Compliance Checklist Matrix */}
            <div className="space-y-2.5">
              <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ink flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-civic" />
                <span>Deterministic Rule Verification Matrix</span>
              </h3>

              <div className="border border-border-warm rounded-xl bg-surface overflow-x-auto shadow-xs">
                <table className="w-full text-left text-caption border-collapse">
                  <thead className="bg-surface-light/60 border-b border-border-warm/70 text-ink-muted font-bold text-[10px] uppercase tracking-[0.12em] font-mono">
                    <tr>
                      <th className="px-4 py-2.5 border-r border-border-warm/50">Validation Rule</th>
                      <th className="px-4 py-2.5 border-r border-border-warm/50">Status</th>
                      <th className="px-4 py-2.5 border-r border-border-warm/50">Inspection Finding</th>
                      <th className="px-4 py-2.5">Required Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-warm/50 font-normal">
                    {validationResults.map((rule) => (
                      <tr
                        key={rule.ruleName}
                        className={rule.passed ? 'bg-surface' : 'bg-rose/5 font-medium'}
                      >
                        <td className="px-4 py-2.5 font-bold text-ink whitespace-nowrap border-r border-border-warm/50">
                          {rule.ruleName}
                        </td>
                        <td className="px-4 py-2.5 whitespace-nowrap border-r border-border-warm/50">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 font-mono text-[10px] font-bold uppercase rounded-full border ${
                              rule.passed
                                ? 'bg-sage/15 text-sage border-sage/30'
                                : 'bg-rose/15 text-rose border-rose/30'
                            }`}
                          >
                            {rule.passed ? 'PASSED' : 'ACTION REQUIRED'}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-ink-muted text-caption leading-snug border-r border-border-warm/50">
                          {rule.reason}
                        </td>
                        <td className="px-4 py-2.5 text-ink text-caption leading-snug">
                          {rule.passed ? (
                            <span className="text-sage font-medium">No action needed</span>
                          ) : (
                            <span className="text-rose font-bold">{rule.recommended_action}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Failure Action Callouts (if any rules failed) */}
            {failedRules.length > 0 && (
              <div className="p-4 bg-surface-light rounded-xl border-l-4 border-l-rose border-border-warm space-y-2">
                <div className="flex items-center gap-2 text-rose font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="h-4 w-4 text-rose shrink-0" />
                  <span>CRITICAL REMEDIAL STEPS REQUIRED BEFORE SUBMISSION:</span>
                </div>
                <ul className="list-disc list-inside text-caption text-ink space-y-1 pl-1">
                  {failedRules.map((r) => (
                    <li key={r.ruleName}>
                      <span className="font-bold">{r.ruleName}:</span> {r.recommended_action}
                      {r.explanation && (
                        <p className="text-caption text-ink-muted pl-5 italic">
                          Guidance: {r.explanation}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Physical Submission Preparation Checklist */}
            <div className="p-5 bg-surface-light rounded-2xl border border-border-warm space-y-3">
              <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ink flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-civic" />
                <span>Physical Documents Checklist (What to bring to the Counter)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-caption text-ink-muted">
                <label className="flex items-start gap-2.5 p-3 bg-surface rounded-xl border border-border-warm text-ink">
                  <input type="checkbox" defaultChecked={isPassed} className="mt-0.5 accent-ink" />
                  <span className="text-xs font-medium">Original Income Certificate for physical inspection</span>
                </label>
                <label className="flex items-start gap-2.5 p-3 bg-surface rounded-xl border border-border-warm text-ink">
                  <input type="checkbox" defaultChecked={isPassed} className="mt-0.5 accent-ink" />
                  <span className="text-xs font-medium">2 Self-attested photocopies of the certificate</span>
                </label>
                <label className="flex items-start gap-2.5 p-3 bg-surface rounded-xl border border-border-warm text-ink">
                  <input type="checkbox" defaultChecked={isPassed} className="mt-0.5 accent-ink" />
                  <span className="text-xs font-medium">Government Photo ID (Aadhaar / Voter ID / Ration Card)</span>
                </label>
                <label className="flex items-start gap-2.5 p-3 bg-surface rounded-xl border border-border-warm text-ink">
                  <input type="checkbox" defaultChecked={isPassed} className="mt-0.5 accent-ink" />
                  <span className="text-xs font-medium">2 Recent passport-size photographs of applicant</span>
                </label>
              </div>
            </div>

            {/* Official Disclaimer & Verification Stamp Block */}
            <div className="pt-3 border-t border-border-warm/70 text-caption text-ink-muted space-y-2">
              <p className="leading-relaxed text-[11px]">
                <strong className="font-bold text-ink">STATUTORY ADVISORY:</strong> This Pre-Submission Counter Slip is generated by the GovAssist automated pre-validation system to assist citizens with error-free application preparation. Pre-check pass status indicates technical compliance with standard document criteria and does not constitute final statutory approval, which is solely exercised by the authorized Revenue Officer / Tehsildar.
              </p>

              <div className="flex justify-between items-end pt-4 print:pt-6">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted block">
                    GOVSKILL-PRECHECK-{documentId?.slice(0, 8).toUpperCase()}
                  </span>
                  <span className="text-[11px] text-ink-muted">
                    System Generated • No Physical Signature Required
                  </span>
                </div>

                <div className="text-right border-t border-border-warm pt-1 px-4">
                  <span className="text-xs font-bold text-ink block uppercase tracking-wider">
                    Taluk / Citizen Service Counter
                  </span>
                  <span className="font-mono text-[10px] text-ink-muted">Date Received: ______________</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CounterSlipModal;
