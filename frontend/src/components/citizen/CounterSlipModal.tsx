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
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-[#0A0A0A]/75 backdrop-blur-sm print:p-0 print:static print:bg-white print:backdrop-blur-none"
      >
        <motion.div
          variants={scaleInVariants}
          initial={shouldReduceMotion ? {} : 'hidden'}
          animate="visible"
          exit="exit"
          role="dialog"
          aria-modal="true"
          aria-labelledby="counter-slip-title"
          className="relative w-full max-w-3xl bg-[#F5EFE0] rounded-2xl shadow-2xl border border-[#D9CFBB] overflow-hidden my-auto max-h-[92vh] flex flex-col print:max-h-none print:shadow-none print:border-none print:rounded-none print:w-full print:m-0"
        >
          {/* Top Modal Controls (Hidden in Print) */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#D9CFBB] bg-[#EDE4D0] print:hidden shrink-0">
            <div className="flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-[#2A5B4A]" />
              <span className="font-mono text-micro font-semibold uppercase tracking-wider text-[#6B6357]">
                Pre-Submission Counter Slip
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={handlePrint}
                variant="primary"
                size="sm"
                className="flex items-center gap-1.5 text-caption font-semibold cursor-pointer rounded-full min-h-[40px] px-4"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print / Save PDF Slip</span>
              </Button>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close Counter Slip Modal"
                className="p-1.5 text-[#6B6357] hover:text-[#0A0A0A] hover:bg-[#D9CFBB]/50 rounded-full transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Printable Counter Slip Container */}
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto print:overflow-visible print:p-6 print:space-y-4 printable-slip bg-[#F5EFE0]">
            {/* Header: DPI & Service Heading */}
            <div className="border-b border-[#D9CFBB] pb-4 text-center space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A0A0A] text-[#F5EFE0] font-mono text-micro font-semibold uppercase tracking-wider print:bg-black print:text-white">
                <span>National Digital Public Infrastructure • Local Governance Platform</span>
              </div>
              <h1 id="counter-slip-title" className="font-serif text-page-title font-normal text-[#0A0A0A] tracking-tight pt-1">
                PRE-SUBMISSION COUNTER SLIP
              </h1>
              <p className="text-caption font-medium text-[#6B6357] uppercase tracking-wide">
                GovAssist Self-Service Document Quality & Pre-Validation Inspection
              </p>
            </div>

            {/* Document Metadata & Status Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#EDE4D0] border border-[#D9CFBB] rounded-xl print:bg-white print:border-slate-300">
              <div className="space-y-0.5 sm:col-span-2">
                <span className="font-mono text-micro font-semibold text-[#6B6357] uppercase tracking-wider block">
                  Document Reference ID:
                </span>
                <div className="flex items-center gap-2 font-mono text-caption font-bold text-[#0A0A0A]">
                  <span className="truncate">{documentId}</span>
                  <button
                    type="button"
                    onClick={handleCopyRef}
                    className="p-1 text-[#6B6357] hover:text-[#0A0A0A] transition-colors print:hidden cursor-pointer"
                    title="Copy Reference ID"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-[#2A5B4A]" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-0.5 sm:text-right">
                <span className="font-mono text-micro font-semibold text-[#6B6357] uppercase tracking-wider block">
                  Inspection Timestamp:
                </span>
                <span className="text-caption font-mono font-medium text-[#0A0A0A] flex items-center gap-1 sm:justify-end">
                  <Clock className="h-3 w-3 text-[#6B6357] print:hidden" />
                  {formattedDate}
                </span>
              </div>
            </div>

            {/* Extracted Certificate Profile */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-caption">
              <div className="p-3.5 bg-[#F5EFE0] border border-[#D9CFBB] rounded-xl space-y-1">
                <span className="text-micro font-semibold text-[#6B6357] uppercase flex items-center gap-1">
                  <User className="h-3 w-3 text-[#2A5B4A]" /> Applicant Name
                </span>
                <p className="font-semibold text-[#0A0A0A] text-caption">
                  {extractedData?.name || <span className="text-[#C97B5A] italic font-normal">Not Detected</span>}
                </p>
              </div>

              <div className="p-3.5 bg-[#F5EFE0] border border-[#D9CFBB] rounded-xl space-y-1">
                <span className="text-micro font-semibold text-[#6B6357] uppercase flex items-center gap-1">
                  <Hash className="h-3 w-3 text-[#2A5B4A]" /> Certificate Number
                </span>
                <p className="font-mono font-semibold text-[#0A0A0A] text-caption">
                  {extractedData?.certificate_number || <span className="text-[#C97B5A] italic font-normal">Not Detected</span>}
                </p>
              </div>

              <div className="p-3.5 bg-[#F5EFE0] border border-[#D9CFBB] rounded-xl space-y-1">
                <span className="text-micro font-semibold text-[#6B6357] uppercase flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-[#2A5B4A]" /> Validity / Expiry Date
                </span>
                <p className="font-mono font-semibold text-[#0A0A0A] text-caption">
                  {extractedData?.expiry_date || <span className="text-[#C97B5A] italic font-normal">Not Detected</span>}
                </p>
              </div>
            </div>

            {/* Authoritative Overall Status Banner */}
            <div
              className={`p-6 rounded-xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isPassed
                  ? 'bg-[#2A5B4A]/10 border-[#2A5B4A]/40 text-[#0A0A0A] print:bg-white print:border-[#2A5B4A]'
                  : 'bg-[#C97B5A]/10 border-[#C97B5A]/40 text-[#0A0A0A] print:bg-white print:border-[#C97B5A]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 font-semibold ${
                    isPassed ? 'bg-[#2A5B4A] text-white' : 'bg-[#C97B5A] text-white'
                  }`}
                >
                  {isPassed ? <ShieldCheck className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
                </div>
                <div>
                  <span className="font-mono text-micro uppercase font-semibold tracking-wider text-[#6B6357] block">
                    Pre-Submission Status Result
                  </span>
                  <h2 className="font-serif text-section-heading font-normal tracking-tight text-[#0A0A0A]">
                    {isPassed
                      ? 'READY FOR PHYSICAL COUNTER SUBMISSION'
                      : 'ACTION REQUIRED BEFORE COUNTER SUBMISSION'}
                  </h2>
                  {recommendedNextStep && (
                    <p className="text-caption text-[#6B6357] leading-snug pt-0.5 max-w-xl font-normal">
                      {recommendedNextStep}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:text-right shrink-0">
                <span className="inline-block px-3 py-1 rounded-full text-caption font-semibold bg-[#F5EFE0] border border-[#D9CFBB] text-[#0A0A0A]">
                  {passedRules} / {totalRules} Rules Compliant
                </span>
              </div>
            </div>

            {/* 4-Rule Compliance Checklist Matrix */}
            <div className="space-y-2.5">
              <h3 className="font-mono text-micro font-semibold uppercase tracking-wider text-[#6B6357] flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-[#2A5B4A]" />
                <span>Deterministic Rule Verification Matrix</span>
              </h3>

              <div className="border border-[#D9CFBB] rounded-xl overflow-hidden bg-[#F5EFE0]">
                <table className="w-full text-left text-caption">
                  <thead className="bg-[#EDE4D0] border-b border-[#D9CFBB] text-[#6B6357] font-semibold text-micro uppercase tracking-wider font-mono">
                    <tr>
                      <th className="px-3.5 py-2.5">Validation Rule</th>
                      <th className="px-3.5 py-2.5">Status</th>
                      <th className="px-3.5 py-2.5">Inspection Finding</th>
                      <th className="px-3.5 py-2.5">Required Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D9CFBB] font-normal">
                    {validationResults.map((rule) => (
                      <tr
                        key={rule.ruleName}
                        className={rule.passed ? 'bg-[#F5EFE0]' : 'bg-[#C97B5A]/5 font-medium'}
                      >
                        <td className="px-3.5 py-2.5 font-semibold text-[#0A0A0A] whitespace-nowrap">
                          {rule.ruleName}
                        </td>
                        <td className="px-3.5 py-2.5 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full font-mono text-micro font-semibold border ${
                              rule.passed
                                ? 'bg-[#2A5B4A]/15 text-[#2A5B4A] border-[#2A5B4A]/30'
                                : 'bg-[#C97B5A]/15 text-[#C97B5A] border-[#C97B5A]/30'
                            }`}
                          >
                            {rule.passed ? 'PASSED' : 'ACTION REQUIRED'}
                          </span>
                        </td>
                        <td className="px-3.5 py-2.5 text-[#6B6357] text-caption leading-snug font-normal">
                          {rule.reason}
                        </td>
                        <td className="px-3.5 py-2.5 text-[#0A0A0A] text-caption leading-snug">
                          {rule.passed ? (
                            <span className="text-[#2A5B4A] font-medium">No action needed</span>
                          ) : (
                            <span className="text-[#C97B5A] font-semibold">{rule.recommended_action}</span>
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
              <div className="p-4 rounded-xl bg-[#C97B5A]/10 border border-[#C97B5A]/30 space-y-2">
                <div className="flex items-center gap-2 text-[#C97B5A] font-semibold text-caption">
                  <AlertTriangle className="h-4 w-4 text-[#C97B5A] shrink-0" />
                  <span>CRITICAL REMEDIAL STEPS REQUIRED BEFORE SUBMISSION:</span>
                </div>
                <ul className="list-disc list-inside text-caption text-[#0A0A0A] space-y-1 pl-1 font-normal">
                  {failedRules.map((r) => (
                    <li key={r.ruleName}>
                      <span className="font-semibold">{r.ruleName}:</span> {r.recommended_action}
                      {r.explanation && (
                        <p className="text-caption text-[#6B6357] pl-5 font-normal italic">
                          Guidance: {r.explanation}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Physical Submission Preparation Checklist */}
            <div className="p-4 rounded-xl bg-[#EDE4D0] border border-[#D9CFBB] space-y-3">
              <h3 className="font-mono text-micro font-semibold uppercase tracking-wider text-[#6B6357] flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#2A5B4A]" />
                <span>Physical Documents Checklist (What to bring to the Counter)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-caption text-[#6B6357] font-normal">
                <label className="flex items-start gap-2 p-2.5 bg-[#F5EFE0] rounded-lg border border-[#D9CFBB] text-[#0A0A0A]">
                  <input type="checkbox" defaultChecked={isPassed} className="mt-0.5 rounded accent-[#0A0A0A]" />
                  <span>Original Income Certificate for physical inspection</span>
                </label>
                <label className="flex items-start gap-2 p-2.5 bg-[#F5EFE0] rounded-lg border border-[#D9CFBB] text-[#0A0A0A]">
                  <input type="checkbox" defaultChecked={isPassed} className="mt-0.5 rounded accent-[#0A0A0A]" />
                  <span>2 Self-attested photocopies of the certificate</span>
                </label>
                <label className="flex items-start gap-2 p-2.5 bg-[#F5EFE0] rounded-lg border border-[#D9CFBB] text-[#0A0A0A]">
                  <input type="checkbox" defaultChecked={isPassed} className="mt-0.5 rounded accent-[#0A0A0A]" />
                  <span>Government Photo ID (Aadhaar / Voter ID / Ration Card)</span>
                </label>
                <label className="flex items-start gap-2 p-2.5 bg-[#F5EFE0] rounded-lg border border-[#D9CFBB] text-[#0A0A0A]">
                  <input type="checkbox" defaultChecked={isPassed} className="mt-0.5 rounded accent-[#0A0A0A]" />
                  <span>2 Recent passport-size photographs of applicant</span>
                </label>
              </div>
            </div>

            {/* Official Disclaimer & Verification Stamp Block */}
            <div className="pt-2 border-t border-[#D9CFBB] text-caption text-[#6B6357] space-y-2 font-normal">
              <p className="leading-relaxed">
                <strong className="font-semibold text-[#0A0A0A]">STATUTORY ADVISORY:</strong> This Pre-Submission Counter Slip is generated by the GovAssist automated pre-validation system to assist citizens with error-free application preparation. Pre-check pass status indicates technical compliance with standard document criteria and does not constitute final statutory approval, which is solely exercised by the authorized Revenue Officer / Tehsildar.
              </p>

              <div className="flex justify-between items-end pt-4 print:pt-6">
                <div>
                  <span className="font-mono text-micro text-[#6B6357] block">
                    GOVSKILL-PRECHECK-{documentId?.slice(0, 8).toUpperCase()}
                  </span>
                  <span className="text-caption text-[#6B6357]">
                    System Generated • No Physical Signature Required
                  </span>
                </div>

                <div className="text-right border-t border-[#D9CFBB] pt-1 px-4">
                  <span className="text-caption font-semibold text-[#0A0A0A] block uppercase">
                    Taluk / Citizen Service Counter
                  </span>
                  <span className="font-mono text-micro text-[#6B6357]">Date Received: ______________</span>
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
