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
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-xs print:p-0 print:static print:bg-white print:backdrop-blur-none"
      >
        <motion.div
          variants={scaleInVariants}
          initial={shouldReduceMotion ? {} : 'hidden'}
          animate="visible"
          exit="exit"
          role="dialog"
          aria-modal="true"
          aria-labelledby="counter-slip-title"
          className="relative w-full max-w-3xl bg-white border border-[#E4E4E7] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col print:max-h-none print:shadow-none print:border-none print:w-full print:m-0"
        >
          {/* Top Modal Controls (Hidden in Print) */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E4E4E7] bg-white print:hidden shrink-0">
            <div className="flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-[#AF411E]" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#09090B]">
                Pre-Submission Counter Slip
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                onClick={handlePrint}
                variant="primary"
                size="sm"
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer rounded-none min-h-[38px] px-4 bg-[#09090B] hover:bg-[#27272A] text-white"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print / Save PDF Slip</span>
              </Button>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close Counter Slip Modal"
                className="p-1.5 text-[#71717A] hover:text-[#09090B] hover:bg-[#F4F4F5] transition-colors cursor-pointer border border-transparent hover:border-[#E4E4E7]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Printable Counter Slip Container */}
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto print:overflow-visible print:p-6 print:space-y-4 printable-slip bg-white text-[#09090B]">
            {/* Header: DPI & Service Heading with Sovereign Logo */}
            <div className="border-b border-[#E4E4E7] pb-5 text-center space-y-2">
              <div className="flex items-center justify-center gap-3">
                <GovSkillLogo size={32} variant="icon" />
                <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-[#09090B] text-white font-mono text-[10px] font-bold uppercase tracking-[0.2em] print:bg-black print:text-white">
                  <span>National Digital Public Infrastructure • Local Governance Platform</span>
                </div>
              </div>
              <h1 id="counter-slip-title" className="font-sans font-black text-2xl uppercase tracking-tight text-[#09090B] pt-2">
                PRE-SUBMISSION COUNTER SLIP
              </h1>
              <p className="text-[11px] font-mono font-medium text-[#71717A] uppercase tracking-wider">
                GovAssist Self-Service Document Quality & Pre-Validation Inspection
              </p>
            </div>

            {/* Document Metadata & Status Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#FAFAFA] border border-[#E4E4E7] print:bg-white print:border-slate-300">
              <div className="space-y-1 sm:col-span-2">
                <span className="font-mono text-[10px] font-bold text-[#71717A] uppercase tracking-[0.2em] block">
                  Document Reference ID:
                </span>
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#09090B]">
                  <span className="truncate">{documentId}</span>
                  <button
                    type="button"
                    onClick={handleCopyRef}
                    className="p-1 text-[#71717A] hover:text-[#09090B] transition-colors print:hidden cursor-pointer"
                    title="Copy Reference ID"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1 sm:text-right">
                <span className="font-mono text-[10px] font-bold text-[#71717A] uppercase tracking-[0.2em] block">
                  Inspection Timestamp:
                </span>
                <span className="text-xs font-mono font-medium text-[#09090B] flex items-center gap-1 sm:justify-end">
                  <Clock className="h-3 w-3 text-[#71717A] print:hidden" />
                  {formattedDate}
                </span>
              </div>
            </div>

            {/* Extracted Certificate Profile */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-caption">
              <div className="p-3.5 bg-white border border-[#E4E4E7] space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.15em] font-bold text-[#71717A] flex items-center gap-1">
                  <User className="h-3 w-3 text-[#AF411E]" /> Applicant Name
                </span>
                <p className="font-bold text-[#09090B] text-sm">
                  {extractedData?.name || <span className="text-[#AF411E] italic font-normal">Not Detected</span>}
                </p>
              </div>

              <div className="p-3.5 bg-white border border-[#E4E4E7] space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.15em] font-bold text-[#71717A] flex items-center gap-1">
                  <Hash className="h-3 w-3 text-[#AF411E]" /> Certificate Number
                </span>
                <p className="font-mono font-bold text-[#09090B] text-sm">
                  {extractedData?.certificate_number || <span className="text-[#AF411E] italic font-normal">Not Detected</span>}
                </p>
              </div>

              <div className="p-3.5 bg-white border border-[#E4E4E7] space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.15em] font-bold text-[#71717A] flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-[#AF411E]" /> Validity / Expiry Date
                </span>
                <p className="font-mono font-bold text-[#09090B] text-sm">
                  {extractedData?.expiry_date || <span className="text-[#AF411E] italic font-normal">Not Detected</span>}
                </p>
              </div>
            </div>

            {/* Authoritative Overall Status Banner */}
            <div
              className={`p-6 border-l-4 border border-[#E4E4E7] flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isPassed
                  ? 'border-l-emerald-600 bg-white print:bg-white print:border-emerald-600'
                  : 'border-l-[#AF411E] bg-[#FAFAFA] print:bg-white print:border-[#AF411E]'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`h-11 w-11 flex items-center justify-center shrink-0 font-bold border ${
                    isPassed
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-orange-50 text-[#AF411E] border-orange-200'
                  }`}
                >
                  {isPassed ? <ShieldCheck className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase font-bold tracking-[0.2em] text-[#71717A] block">
                    Pre-Submission Status Result
                  </span>
                  <h2 className="font-sans font-black text-base uppercase tracking-tight text-[#09090B]">
                    {isPassed
                      ? 'READY FOR PHYSICAL COUNTER SUBMISSION'
                      : 'ACTION REQUIRED BEFORE COUNTER SUBMISSION'}
                  </h2>
                  {recommendedNextStep && (
                    <p className="text-caption text-[#52525B] leading-snug pt-0.5 max-w-xl">
                      {recommendedNextStep}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:text-right shrink-0">
                <span className="inline-block px-3 py-1 font-mono text-xs uppercase font-bold bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B]">
                  {passedRules} / {totalRules} Rules Compliant
                </span>
              </div>
            </div>

            {/* 4-Rule Compliance Checklist Matrix */}
            <div className="space-y-2.5">
              <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#09090B] flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-[#AF411E]" />
                <span>Deterministic Rule Verification Matrix</span>
              </h3>

              <div className="border border-[#E4E4E7] bg-white overflow-x-auto">
                <table className="w-full text-left text-caption border-collapse">
                  <thead className="bg-[#FAFAFA] border-b border-[#E4E4E7] text-[#71717A] font-bold text-[10px] uppercase tracking-[0.15em] font-mono">
                    <tr>
                      <th className="px-4 py-2.5 border-r border-[#E4E4E7]">Validation Rule</th>
                      <th className="px-4 py-2.5 border-r border-[#E4E4E7]">Status</th>
                      <th className="px-4 py-2.5 border-r border-[#E4E4E7]">Inspection Finding</th>
                      <th className="px-4 py-2.5">Required Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4E4E7] font-normal">
                    {validationResults.map((rule) => (
                      <tr
                        key={rule.ruleName}
                        className={rule.passed ? 'bg-white' : 'bg-orange-50/20 font-medium'}
                      >
                        <td className="px-4 py-2.5 font-bold text-[#09090B] whitespace-nowrap border-r border-[#E4E4E7]">
                          {rule.ruleName}
                        </td>
                        <td className="px-4 py-2.5 whitespace-nowrap border-r border-[#E4E4E7]">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 font-mono text-[10px] font-bold uppercase border ${
                              rule.passed
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-orange-50 text-[#AF411E] border-orange-200'
                            }`}
                          >
                            {rule.passed ? 'PASSED' : 'ACTION REQUIRED'}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-[#52525B] text-caption leading-snug border-r border-[#E4E4E7]">
                          {rule.reason}
                        </td>
                        <td className="px-4 py-2.5 text-[#09090B] text-caption leading-snug">
                          {rule.passed ? (
                            <span className="text-emerald-700 font-medium">No action needed</span>
                          ) : (
                            <span className="text-[#AF411E] font-bold">{rule.recommended_action}</span>
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
              <div className="p-4 bg-white border-l-4 border-l-[#AF411E] border-[#E4E4E7] space-y-2">
                <div className="flex items-center gap-2 text-[#AF411E] font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="h-4 w-4 text-[#AF411E] shrink-0" />
                  <span>CRITICAL REMEDIAL STEPS REQUIRED BEFORE SUBMISSION:</span>
                </div>
                <ul className="list-disc list-inside text-caption text-[#09090B] space-y-1 pl-1">
                  {failedRules.map((r) => (
                    <li key={r.ruleName}>
                      <span className="font-bold">{r.ruleName}:</span> {r.recommended_action}
                      {r.explanation && (
                        <p className="text-caption text-[#71717A] pl-5 italic">
                          Guidance: {r.explanation}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Physical Submission Preparation Checklist */}
            <div className="p-5 bg-[#FAFAFA] border border-[#E4E4E7] space-y-3">
              <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#09090B] flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#AF411E]" />
                <span>Physical Documents Checklist (What to bring to the Counter)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-caption text-[#52525B]">
                <label className="flex items-start gap-2.5 p-3 bg-white border border-[#E4E4E7] text-[#09090B]">
                  <input type="checkbox" defaultChecked={isPassed} className="mt-0.5 accent-[#09090B]" />
                  <span className="text-xs font-medium">Original Income Certificate for physical inspection</span>
                </label>
                <label className="flex items-start gap-2.5 p-3 bg-white border border-[#E4E4E7] text-[#09090B]">
                  <input type="checkbox" defaultChecked={isPassed} className="mt-0.5 accent-[#09090B]" />
                  <span className="text-xs font-medium">2 Self-attested photocopies of the certificate</span>
                </label>
                <label className="flex items-start gap-2.5 p-3 bg-white border border-[#E4E4E7] text-[#09090B]">
                  <input type="checkbox" defaultChecked={isPassed} className="mt-0.5 accent-[#09090B]" />
                  <span className="text-xs font-medium">Government Photo ID (Aadhaar / Voter ID / Ration Card)</span>
                </label>
                <label className="flex items-start gap-2.5 p-3 bg-white border border-[#E4E4E7] text-[#09090B]">
                  <input type="checkbox" defaultChecked={isPassed} className="mt-0.5 accent-[#09090B]" />
                  <span className="text-xs font-medium">2 Recent passport-size photographs of applicant</span>
                </label>
              </div>
            </div>

            {/* Official Disclaimer & Verification Stamp Block */}
            <div className="pt-3 border-t border-[#E4E4E7] text-caption text-[#71717A] space-y-2">
              <p className="leading-relaxed text-[11px]">
                <strong className="font-bold text-[#09090B]">STATUTORY ADVISORY:</strong> This Pre-Submission Counter Slip is generated by the GovAssist automated pre-validation system to assist citizens with error-free application preparation. Pre-check pass status indicates technical compliance with standard document criteria and does not constitute final statutory approval, which is solely exercised by the authorized Revenue Officer / Tehsildar.
              </p>

              <div className="flex justify-between items-end pt-4 print:pt-6">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#71717A] block">
                    GOVSKILL-PRECHECK-{documentId?.slice(0, 8).toUpperCase()}
                  </span>
                  <span className="text-[11px] text-[#71717A]">
                    System Generated • No Physical Signature Required
                  </span>
                </div>

                <div className="text-right border-t border-[#E4E4E7] pt-1 px-4">
                  <span className="text-xs font-bold text-[#09090B] block uppercase tracking-wider">
                    Taluk / Citizen Service Counter
                  </span>
                  <span className="font-mono text-[10px] text-[#71717A]">Date Received: ______________</span>
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
