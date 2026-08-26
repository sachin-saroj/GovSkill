import React from 'react';
import { Shield, Award, X, Printer, CheckCircle2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeEmail: string;
  moduleTitle: string;
  moduleId: string;
  scorePercentage: number;
  bestScore: number;
  totalQuestions: number;
  completedDate?: string;
  credentialId?: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  employeeEmail,
  moduleTitle,
  moduleId,
  scorePercentage,
  bestScore,
  totalQuestions,
  completedDate,
  credentialId,
}) => {
  if (!isOpen) return null;

  const certificateId = credentialId || `GS-CERT-${moduleId.replace(/-/g, '').slice(0, 8).toUpperCase()}`;
  const issueDate = completedDate
    ? new Date(completedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-civic-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2 text-caption font-semibold text-civic-900">
            <Award className="h-4 w-4 text-saffron-500" />
            <span>Official Training Credential</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} className="flex items-center gap-1.5 text-caption">
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save PDF</span>
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-900 rounded-civic-md hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Frame */}
        <div className="p-8 sm:p-10 text-center bg-white print:p-0">
          <div className="border-4 border-double border-civic-800/30 rounded-civic-xl p-8 sm:p-10 bg-gradient-to-b from-slate-50/50 to-white relative overflow-hidden">
            {/* Watermark Seal */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <Shield className="w-96 h-96 text-civic-900" />
            </div>

            {/* Header / Seal */}
            <div className="inline-flex p-3 rounded-full bg-civic-100 text-civic-900 mb-3">
              <Shield className="h-10 w-10 text-civic-800" />
            </div>

            <p className="text-micro font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Local Government Administration & Training Board
            </p>
            <h1 className="text-page-title font-semibold text-slate-900 tracking-tight mb-4">
              Certificate of Digital Competency
            </h1>

            <p className="text-caption text-slate-500 mb-2">This is to certify that</p>
            <div className="text-section-heading font-semibold text-civic-900 border-b-2 border-civic-700/30 pb-1 max-w-md mx-auto mb-4 font-mono">
              {employeeEmail}
            </div>

            <p className="text-caption text-slate-600 leading-relaxed max-w-lg mx-auto mb-6">
              has successfully completed all prescribed official lesson guidelines and achieved verified mastery in the training module:
            </p>

            <div className="inline-block px-5 py-2.5 rounded-civic-md bg-civic-50 border border-civic-200 text-civic-900 font-semibold text-section-heading mb-6">
              {moduleTitle}
            </div>

            {/* Score & Evaluation Details */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto bg-slate-50 p-4 rounded-civic-md border border-slate-200 text-caption mb-6">
              <div>
                <span className="block text-micro text-slate-500 uppercase font-semibold">Evaluation Score</span>
                <span className="font-semibold text-emerald-700">{scorePercentage}%</span>
              </div>
              <div>
                <span className="block text-micro text-slate-500 uppercase font-semibold">Questions Passed</span>
                <span className="font-semibold text-slate-900">{bestScore} / {totalQuestions}</span>
              </div>
              <div>
                <span className="block text-micro text-slate-500 uppercase font-semibold">Verification</span>
                <span className="font-semibold text-civic-900 inline-flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Verified
                </span>
              </div>
            </div>

            {/* Signature & Date Footer */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 pt-4 border-t border-slate-200 text-caption text-slate-500">
              <div className="text-left space-y-1">
                <span className="block text-micro uppercase font-semibold">Credential ID</span>
                <span className="font-mono text-caption font-semibold text-slate-900">{certificateId}</span>
                <a
                  href={`/verify/${certificateId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-micro font-semibold uppercase tracking-wider text-civic-700 hover:underline print:hidden"
                >
                  <span>Verify Authenticity Online</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div className="text-left sm:text-right">
                <span className="block text-micro uppercase font-semibold">Date of Issuance</span>
                <span className="font-semibold text-slate-900">{issueDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;
