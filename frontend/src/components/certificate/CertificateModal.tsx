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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0A]/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#EDE4D0] rounded-3xl shadow-2xl overflow-hidden border border-[#D9CFBB]">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#EDE4D0] border-b border-[#D9CFBB] print:hidden">
          <div className="flex items-center gap-2 text-caption font-semibold text-[#0A0A0A]">
            <Award className="h-4 w-4 text-[#C9A24A]" />
            <span>Official Training Credential</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-caption rounded-full border-[#D9CFBB] bg-[#F5EFE0] hover:bg-[#EDE4D0] text-[#0A0A0A]"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save PDF</span>
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#6B6357] hover:text-[#0A0A0A] rounded-full hover:bg-[#D9CFBB]/50 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Frame */}
        <div className="p-6 sm:p-8 text-center bg-[#EDE4D0] print:p-0">
          <div className="border-2 border-[#C9A24A]/60 rounded-2xl p-8 sm:p-10 bg-[#F5EFE0] relative overflow-hidden shadow-inner">
            {/* Watermark Seal */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <Shield className="w-96 h-96 text-[#0A0A0A]" />
            </div>

            {/* Header / Seal */}
            <div className="inline-flex p-3 rounded-full bg-[#0A0A0A] text-[#C9A24A] mb-3">
              <Shield className="h-10 w-10" />
            </div>

            <p className="font-mono text-micro font-semibold uppercase tracking-widest text-[#6B6357] mb-1">
              Local Government Administration & Training Board
            </p>
            <h1 className="font-serif text-page-title font-normal text-[#0A0A0A] tracking-tight mb-4">
              Certificate of Digital Competency
            </h1>

            <p className="text-caption text-[#6B6357] mb-2 font-normal">This is to certify that</p>
            <div className="font-mono text-section-heading font-semibold text-[#0A0A0A] border-b border-[#D9CFBB] pb-1 max-w-md mx-auto mb-4">
              {employeeEmail}
            </div>

            <p className="text-caption text-[#6B6357] leading-relaxed max-w-lg mx-auto mb-6 font-normal">
              has successfully completed all prescribed official lesson guidelines and achieved verified mastery in the training module:
            </p>

            <div className="inline-block px-5 py-2.5 rounded-full bg-[#EDE4D0] border border-[#D9CFBB] text-[#0A0A0A] font-semibold text-section-heading mb-6">
              {moduleTitle}
            </div>

            {/* Score & Evaluation Details */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto bg-[#EDE4D0] p-4 rounded-xl border border-[#D9CFBB] text-caption mb-6">
              <div>
                <span className="block font-mono text-micro text-[#6B6357] uppercase font-semibold">Evaluation Score</span>
                <span className="font-semibold text-[#2A5B4A]">{scorePercentage}%</span>
              </div>
              <div>
                <span className="block font-mono text-micro text-[#6B6357] uppercase font-semibold">Questions Passed</span>
                <span className="font-semibold text-[#0A0A0A]">{bestScore} / {totalQuestions}</span>
              </div>
              <div>
                <span className="block font-mono text-micro text-[#6B6357] uppercase font-semibold">Verification</span>
                <span className="font-semibold text-[#2A5B4A] inline-flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-[#2A5B4A]" /> Verified
                </span>
              </div>
            </div>

            {/* Signature & Date Footer */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 pt-4 border-t border-[#D9CFBB] text-caption text-[#6B6357]">
              <div className="text-left space-y-1">
                <span className="block font-mono text-micro uppercase font-semibold">Credential ID</span>
                <span className="font-mono text-caption font-semibold text-[#0A0A0A]">{certificateId}</span>
                <a
                  href={`/verify/${certificateId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-micro font-semibold uppercase tracking-wider text-[#2A5B4A] hover:underline print:hidden"
                >
                  <span>Verify Authenticity Online</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div className="text-left sm:text-right">
                <span className="block font-mono text-micro uppercase font-semibold">Date of Issuance</span>
                <span className="font-semibold text-[#0A0A0A]">{issueDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;
