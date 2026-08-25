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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E2E6EB]">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F7F9FB] border-b border-[#E2E6EB] print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1E4D8C]">
            <Award className="h-4 w-4 text-[#D98E04]" />
            <span>Official Training Credential</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} className="flex items-center gap-1.5 text-xs">
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save PDF</span>
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#5A6472] hover:text-[#1A1F2B] rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Frame */}
        <div className="p-8 sm:p-10 text-center bg-white print:p-0">
          <div className="border-4 border-double border-[#1E4D8C]/30 rounded-2xl p-8 sm:p-10 bg-gradient-to-b from-[#F7F9FB]/50 to-white relative overflow-hidden">
            {/* Watermark Seal */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <Shield className="w-96 h-96 text-[#1E4D8C]" />
            </div>

            {/* Header / Seal */}
            <div className="inline-flex p-3 rounded-full bg-[#1E4D8C]/10 text-[#1E4D8C] mb-3">
              <Shield className="h-10 w-10 text-[#1E4D8C]" />
            </div>

            <p className="text-[11px] font-bold uppercase tracking-widest text-[#5A6472] mb-1">
              Local Government Administration & Training Board
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1F2B] tracking-tight mb-4">
              Certificate of Digital Competency
            </h1>

            <p className="text-xs text-[#5A6472] mb-2">This is to certify that</p>
            <div className="text-lg sm:text-xl font-bold text-[#1E4D8C] border-b-2 border-[#1E4D8C]/30 pb-1 max-w-md mx-auto mb-4 font-mono">
              {employeeEmail}
            </div>

            <p className="text-xs text-[#5A6472] leading-relaxed max-w-lg mx-auto mb-6">
              has successfully completed all prescribed official lesson guidelines and achieved verified mastery in the training module:
            </p>

            <div className="inline-block px-5 py-2.5 rounded-xl bg-[#1E4D8C]/10 border border-[#1E4D8C]/20 text-[#1E4D8C] font-bold text-base sm:text-lg mb-6">
              {moduleTitle}
            </div>

            {/* Score & Evaluation Details */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto bg-[#F7F9FB] p-3.5 rounded-xl border border-[#E2E6EB] text-xs mb-6">
              <div>
                <span className="block text-[10px] text-[#5A6472] uppercase font-semibold">Evaluation Score</span>
                <span className="font-bold text-[#2E9E6B]">{scorePercentage}%</span>
              </div>
              <div>
                <span className="block text-[10px] text-[#5A6472] uppercase font-semibold">Questions Passed</span>
                <span className="font-bold text-[#1A1F2B]">{bestScore} / {totalQuestions}</span>
              </div>
              <div>
                <span className="block text-[10px] text-[#5A6472] uppercase font-semibold">Verification</span>
                <span className="font-bold text-[#1E4D8C] inline-flex items-center gap-0.5">
                  <CheckCircle2 className="h-3 w-3 text-[#2E9E6B]" /> Verified
                </span>
              </div>
            </div>

            {/* Signature & Date Footer */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 pt-4 border-t border-[#E2E6EB] text-xs text-[#5A6472]">
              <div className="text-left space-y-1">
                <span className="block text-[10px] uppercase font-semibold">Credential ID</span>
                <span className="font-mono text-[11px] font-bold text-[#1A1F2B]">{certificateId}</span>
                <a
                  href={`/verify/${certificateId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1E4D8C] hover:underline print:hidden"
                >
                  <span>Verify Authenticity Online</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>

              <div className="text-left sm:text-right">
                <span className="block text-[10px] uppercase font-semibold">Date of Issuance</span>
                <span className="font-semibold text-[#1A1F2B]">{issueDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;
