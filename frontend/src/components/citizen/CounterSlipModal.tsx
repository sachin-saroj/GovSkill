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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-sm print:p-0 print:static print:bg-white print:backdrop-blur-none">
        <motion.div
          variants={scaleInVariants}
          initial={shouldReduceMotion ? {} : 'hidden'}
          animate="visible"
          exit="exit"
          role="dialog"
          aria-modal="true"
          aria-labelledby="counter-slip-title"
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-civic-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col print:max-h-none print:shadow-none print:border-none print:rounded-none print:w-full print:m-0"
        >
          {/* Top Modal Controls (Hidden in Print) */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80 print:hidden shrink-0">
            <div className="flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-civic-800" />
              <span className="text-xs font-bold uppercase tracking-wider text-civic-900">
                Pre-Submission Counter Slip
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={handlePrint}
                variant="primary"
                size="sm"
                className="flex items-center gap-1.5 shadow-civic-xs text-xs font-bold cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print / Save PDF Slip</span>
              </Button>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close Counter Slip Modal"
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Printable Counter Slip Container */}
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto print:overflow-visible print:p-6 print:space-y-4 printable-slip">
            {/* Header: DPI & Service Heading */}
            <div className="border-b-2 border-civic-900/20 pb-4 text-center space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-civic-900 text-white text-[10px] font-bold uppercase tracking-widest print:bg-black print:text-white">
                <span>National Digital Public Infrastructure • Local Governance Platform</span>
              </div>
              <h1 id="counter-slip-title" className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight pt-1">
                PRE-SUBMISSION COUNTER SLIP
              </h1>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                GovAssist Self-Service Document Quality & Pre-Validation Inspection
              </p>
            </div>

            {/* Document Metadata & Status Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl print:bg-white print:border-slate-300">
              <div className="space-y-0.5 sm:col-span-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Document Reference ID:
                </span>
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-900">
                  <span className="truncate">{documentId}</span>
                  <button
                    type="button"
                    onClick={handleCopyRef}
                    className="p-1 text-slate-400 hover:text-civic-800 transition-colors print:hidden cursor-pointer"
                    title="Copy Reference ID"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-0.5 sm:text-right">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Inspection Timestamp:
                </span>
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1 sm:justify-end">
                  <Clock className="h-3 w-3 text-slate-400 print:hidden" />
                  {formattedDate}
                </span>
              </div>
            </div>

            {/* Extracted Certificate Profile */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <User className="h-3 w-3" /> Applicant Name
                </span>
                <p className="font-bold text-slate-900 text-sm">
                  {extractedData?.name || <span className="text-rose-600 italic">Not Detected</span>}
                </p>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Hash className="h-3 w-3" /> Certificate Number
                </span>
                <p className="font-mono font-bold text-slate-900 text-sm">
                  {extractedData?.certificate_number || <span className="text-rose-600 italic">Not Detected</span>}
                </p>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Validity / Expiry Date
                </span>
                <p className="font-mono font-bold text-slate-900 text-sm">
                  {extractedData?.expiry_date || <span className="text-rose-600 italic">Not Detected</span>}
                </p>
              </div>
            </div>

            {/* Authoritative Overall Status Banner */}
            <div
              className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isPassed
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950 print:bg-white print:border-emerald-700'
                  : 'bg-amber-50 border-amber-400 text-amber-950 print:bg-white print:border-amber-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                    isPassed ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                  }`}
                >
                  {isPassed ? <ShieldCheck className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 block">
                    Pre-Submission Status Result
                  </span>
                  <h2 className="text-base font-black tracking-tight">
                    {isPassed
                      ? 'READY FOR PHYSICAL COUNTER SUBMISSION'
                      : 'ACTION REQUIRED BEFORE COUNTER SUBMISSION'}
                  </h2>
                  {recommendedNextStep && (
                    <p className="text-xs opacity-90 leading-snug pt-0.5 max-w-xl">
                      {recommendedNextStep}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:text-right shrink-0">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-white border border-slate-300 text-slate-900 shadow-civic-xs">
                  {passedRules} / {totalRules} Rules Compliant
                </span>
              </div>
            </div>

            {/* 4-Rule Compliance Checklist Matrix */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-civic-800" />
                <span>Deterministic Rule Verification Matrix</span>
              </h3>

              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-civic-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/90 border-b border-slate-200 text-slate-700 font-bold text-[11px] uppercase tracking-wide">
                    <tr>
                      <th className="px-3.5 py-2.5">Validation Rule</th>
                      <th className="px-3.5 py-2.5">Status</th>
                      <th className="px-3.5 py-2.5">Inspection Finding</th>
                      <th className="px-3.5 py-2.5">Required Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {validationResults.map((rule) => (
                      <tr
                        key={rule.ruleName}
                        className={rule.passed ? 'bg-white' : 'bg-amber-50/40 font-medium'}
                      >
                        <td className="px-3.5 py-2.5 font-bold text-slate-900 whitespace-nowrap">
                          {rule.ruleName}
                        </td>
                        <td className="px-3.5 py-2.5 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              rule.passed
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : 'bg-rose-100 text-rose-800 border-rose-300'
                            }`}
                          >
                            {rule.passed ? 'PASSED' : 'ACTION REQUIRED'}
                          </span>
                        </td>
                        <td className="px-3.5 py-2.5 text-slate-700 text-[11px] leading-snug">
                          {rule.reason}
                        </td>
                        <td className="px-3.5 py-2.5 text-slate-800 text-[11px] leading-snug">
                          {rule.passed ? (
                            <span className="text-emerald-700 font-semibold">No action needed</span>
                          ) : (
                            <span className="text-rose-700 font-bold">{rule.recommended_action}</span>
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
              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
                <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
                  <AlertTriangle className="h-4 w-4 text-rose-700 shrink-0" />
                  <span>CRITICAL REMEDIAL STEPS REQUIRED BEFORE SUBMISSION:</span>
                </div>
                <ul className="list-disc list-inside text-xs text-rose-900 space-y-1 pl-1">
                  {failedRules.map((r) => (
                    <li key={r.ruleName}>
                      <span className="font-bold">{r.ruleName}:</span> {r.recommended_action}
                      {r.explanation && (
                        <p className="text-[11px] text-slate-700 pl-5 font-normal italic">
                          Guidance: {r.explanation}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Physical Submission Preparation Checklist */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-civic-800" />
                <span>Physical Documents Checklist (What to bring to the Counter)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                <label className="flex items-start gap-2 p-2 bg-white rounded-xl border border-slate-200">
                  <input type="checkbox" defaultChecked={isPassed} className="mt-0.5 rounded text-civic-800" />
                  <span>Original Income Certificate for physical inspection</span>
                </label>
                <label className="flex items-start gap-2 p-2 bg-white rounded-xl border border-slate-200">
                  <input type="checkbox" defaultChecked={isPassed} className="mt-0.5 rounded text-civic-800" />
                  <span>2 Self-attested photocopies of the certificate</span>
                </label>
                <label className="flex items-start gap-2 p-2 bg-white rounded-xl border border-slate-200">
                  <input type="checkbox" defaultChecked={isPassed} className="mt-0.5 rounded text-civic-800" />
                  <span>Government Photo ID (Aadhaar / Voter ID / Ration Card)</span>
                </label>
                <label className="flex items-start gap-2 p-2 bg-white rounded-xl border border-slate-200">
                  <input type="checkbox" defaultChecked={isPassed} className="mt-0.5 rounded text-civic-800" />
                  <span>2 Recent passport-size photographs of applicant</span>
                </label>
              </div>
            </div>

            {/* Official Disclaimer & Verification Stamp Block */}
            <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 space-y-2">
              <p className="leading-relaxed">
                <strong>STATUTORY ADVISORY:</strong> This Pre-Submission Counter Slip is generated by the GovAssist automated pre-validation system to assist citizens with error-free application preparation. Pre-check pass status indicates technical compliance with standard document criteria and does not constitute final statutory approval, which is solely exercised by the authorized Revenue Officer / Tehsildar.
              </p>

              <div className="flex justify-between items-end pt-4 print:pt-6">
                <div>
                  <span className="font-mono text-[9px] text-slate-400 block">
                    GOVSKILL-PRECHECK-{documentId?.slice(0, 8).toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    System Generated • No Physical Signature Required
                  </span>
                </div>

                <div className="text-right border-t border-slate-300 pt-1 px-4">
                  <span className="text-[10px] font-bold text-slate-600 block uppercase">
                    Taluk / Citizen Service Counter
                  </span>
                  <span className="text-[9px] text-slate-400">Date Received: ______________</span>
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
