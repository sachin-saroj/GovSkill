import React from 'react';
import { Shield, Award, X, Printer, CheckCircle2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GovSkillLogo } from '@/components/GovSkillLogo';

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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-surface rounded-3xl shadow-2xl overflow-hidden border border-border-warm">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-surface-light border-b border-border-warm print:hidden">
          <div className="flex items-center gap-2 text-caption font-bold uppercase tracking-wider text-ink">
            <Award className="h-4 w-4 text-azure-700" />
            <span>Official Training Credential</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-caption rounded-full border-border-warm bg-surface hover:bg-surface-strong text-ink font-bold uppercase tracking-wider min-h-[36px]"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save PDF</span>
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-ink-muted hover:text-ink rounded-full hover:bg-surface-strong transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Frame */}
        <div className="p-6 sm:p-8 text-center bg-surface-light print:p-0">
          <div className="border border-border-warm rounded-2xl p-8 sm:p-10 bg-surface relative overflow-hidden shadow-none">
            {/* Top Accent Rule */}
            <div className="absolute top-0 left-0 right-0 h-[4px] bg-azure-600" />

            {/* Watermark Seal */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
              <Shield className="w-96 h-96 text-ink" />
            </div>

            {/* Header / Sovereign GovSkill Seal */}
            <div className="flex justify-center mb-4">
              <GovSkillLogo size={76} variant="icon" />
            </div>

            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted mb-1">
              Local Government Administration & Training Board
            </p>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold uppercase text-ink tracking-tight mb-4">
              Certificate of Digital Competency
            </h1>

            <p className="text-caption text-ink-muted mb-2 font-normal">This is to certify that</p>
            <div className="font-mono text-section-heading font-bold text-ink border-b border-border-warm pb-1 max-w-md mx-auto mb-4">
              {employeeEmail}
            </div>

            <p className="text-caption text-ink-muted leading-relaxed max-w-lg mx-auto mb-6 font-normal">
              has successfully completed all prescribed official lesson guidelines and achieved verified mastery in the training module:
            </p>

            <div className="inline-block px-5 py-2.5 rounded-xl bg-surface-light border border-border-warm text-ink font-bold text-section-heading uppercase tracking-wide mb-6">
              {moduleTitle}
            </div>

            {/* Score & Evaluation Details */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto bg-surface-light p-4 rounded-xl border border-border-warm text-caption mb-6">
              <div>
                <span className="block font-mono text-[10px] text-ink-muted uppercase font-bold">Evaluation Score</span>
                <span className="font-bold text-sage-800 font-mono">{scorePercentage}%</span>
              </div>
              <div>
                <span className="block font-mono text-[10px] text-ink-muted uppercase font-bold">Questions Passed</span>
                <span className="font-bold text-ink font-mono">{bestScore} / {totalQuestions}</span>
              </div>
              <div>
                <span className="block font-mono text-[10px] text-ink-muted uppercase font-bold">Verification</span>
                <span className="font-bold text-sage-800 inline-flex items-center gap-1 font-mono">
                  <CheckCircle2 className="h-3 w-3 text-sage-700" /> Verified
                </span>
              </div>
            </div>

            {/* Signature & Date Footer */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 pt-4 border-t border-border-warm text-caption text-ink-muted">
              <div className="text-left space-y-1">
                <span className="block font-mono text-[10px] uppercase font-bold">Credential ID</span>
                <span className="font-mono text-caption font-bold text-ink">{certificateId}</span>
                <a
                  href={`/verify/${certificateId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-[10.5px] font-bold uppercase tracking-wider text-azure-700 hover:underline print:hidden"
                >
                  <span>Verify Authenticity Online</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div className="text-left sm:text-right">
                <span className="block font-mono text-[10px] uppercase font-bold">Date of Issuance</span>
                <span className="font-bold text-ink font-mono">{issueDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;
