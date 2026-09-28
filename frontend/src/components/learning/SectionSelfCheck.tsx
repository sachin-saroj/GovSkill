import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

interface SectionSelfCheckProps {
  moduleTitle: string;
  sectionIndex: number;
  sectionTitle: string;
}

interface SelfCheckQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const getSelfCheckQuestion = (
  moduleTitle: string,
  sectionIndex: number,
  sectionTitle: string
): SelfCheckQuestion => {
  const lowerMod = moduleTitle.toLowerCase();
  const lowerSec = sectionTitle.toLowerCase();

  if (lowerMod.includes('document')) {
    if (sectionIndex === 1 || lowerSec.includes('checklist') || lowerSec.includes('verification')) {
      return {
        question: 'What is the minimum character length required for a valid alphanumeric certificate number in the standard checklist?',
        options: ['At least 4 characters', 'At least 6 characters', 'Exactly 12 characters', 'Any non-empty string'],
        correctIndex: 1,
        explanation: 'Rule requires certificate numbers to follow standard alphanumeric format and be at least 6 characters in length.',
      };
    }
    if (sectionIndex === 2 || lowerSec.includes('error') || lowerSec.includes('prevention')) {
      return {
        question: 'What should an officer do when finding a spelling mismatch between an application form and the uploaded certificate?',
        options: [
          'Approve it immediately to save processing time',
          'Flag or request clarification before approval to prevent data discrepancy',
          'Delete the application without notice',
          'Change the certificate name manually without supporting affidavit',
        ],
        correctIndex: 1,
        explanation: 'Name mismatches must be caught early and clarified with supporting documentation to prevent statutory errors.',
      };
    }
    return {
      question: 'Which of the following is considered mandatory when reviewing citizen certificate documents?',
      options: [
        'Mandatory fields (Name, Number, Issue/Expiry Date) must be legible with valid authority stamps',
        'Only the applicant photo is required',
        'Expiry dates do not need to be checked',
        'Signature is optional for official welfare certificates',
      ],
      correctIndex: 0,
      explanation: 'All mandatory fields, valid expiry dates, and issuing authority signatures/stamps must be verified.',
    };
  }

  if (lowerMod.includes('portal')) {
    if (sectionIndex === 2 || lowerSec.includes('sla') || lowerSec.includes('escalation')) {
      return {
        question: 'Under standard portal operations, when is an unresolved citizen application escalated to a supervisor?',
        options: ['After 24 hours', 'After 3 business days', 'After 7 business days', 'Never escalated automatically'],
        correctIndex: 2,
        explanation: 'Standard SLA guidelines state applications exceeding 7 business days without resolution are flagged for supervisor escalation.',
      };
    }
    return {
      question: 'What is the standard order of operations when processing an inbound portal application?',
      options: [
        'Immediately issue certificate -> Review documents later',
        'Review inbound details against supporting documents -> Route to supervisor -> Update status flags',
        'Reject all applications that have attachments',
        'Forward directly to citizen without status update',
      ],
      correctIndex: 1,
      explanation: 'Officers first review inbound details, route to designated supervisors for sign-off, and promptly update status flags.',
    };
  }

  if (lowerMod.includes('cybersecurity') || lowerMod.includes('privacy')) {
    if (sectionIndex === 1 || lowerSec.includes('phishing')) {
      return {
        question: 'If you receive an unexpected email requesting immediate login to an administrative link, what should you check first?',
        options: [
          'Click the link immediately to prevent account lock',
          'Verify the sender domain address and report unverified external links',
          'Forward the email to all colleagues',
          'Reply with your administrative credentials',
        ],
        correctIndex: 1,
        explanation: 'Never click unverified links in external emails; always verify the sender domain before entering credentials.',
      };
    }
    return {
      question: 'How must citizen Aadhaar numbers and sensitive PII be stored and handled on government workstations?',
      options: [
        'Saved as unencrypted plaintext on personal USB drives',
        'Encrypted at rest and in transit, never stored unencrypted on personal storage',
        'Posted on departmental notice boards',
        'Emailed to personal webmail addresses for weekend review',
      ],
      correctIndex: 1,
      explanation: 'Citizen records must be encrypted at rest and in transit, with strict prohibitions against personal storage of unencrypted PII.',
    };
  }

  // Record Management & default
  if (sectionIndex === 1 || lowerSec.includes('retention') || lowerSec.includes('destruction')) {
    return {
      question: 'According to standard record retention schedules, how long are Income Certificates retained before scheduled archive purging?',
      options: ['1 year', '5 years', 'Permanently', '6 months'],
      correctIndex: 1,
      explanation: 'Financial and land records are retained permanently, whereas income certificates are scheduled for archive retention for 5 years.',
    };
  }
  return {
    question: 'Why are standardized metadata tags (Year, Category, Issuing Office, Record ID) required for digital archives?',
    options: [
      'To enable fast retrieval, compliance tracking, and audit logging',
      'To increase file sizes artificially',
      'To restrict all access permanently',
      'They are purely decorative and optional',
    ],
    correctIndex: 0,
    explanation: 'Standardized metadata tags ensure fast retrieveability and clear audit trails for statutory inquiries.',
  };
};

export const SectionSelfCheck: React.FC<SectionSelfCheckProps> = ({
  moduleTitle,
  sectionIndex,
  sectionTitle,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const checkItem = getSelfCheckQuestion(moduleTitle, sectionIndex, sectionTitle);

  const handleSelect = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  const isCorrect = selectedOption === checkItem.correctIndex;

  return (
    <div className="border border-border-warm bg-surface rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border-warm">
        <div className="flex items-center gap-2 text-ink font-mono font-bold text-[11px] uppercase tracking-[0.14em]">
          <HelpCircle className="h-4 w-4 text-azure-600" />
          <span>Quick Understanding Check</span>
        </div>
        {isSubmitted && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-[11px] font-mono text-ink-muted hover:text-ink font-bold uppercase tracking-wider cursor-pointer rounded-full px-2.5 py-1 hover:bg-surface-light border border-transparent hover:border-border-warm transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Try Again</span>
          </button>
        )}
      </div>

      <p className="font-sans font-bold text-base text-ink">
        {checkItem.question}
      </p>

      {/* Options List */}
      <div className="space-y-2">
        {checkItem.options.map((option, idx) => {
          let btnStyle = 'border-border-warm bg-surface-light hover:bg-surface-elevated text-ink hover:border-ink/20';

          if (isSubmitted) {
            if (idx === checkItem.correctIndex) {
              btnStyle = 'border-sage-500 bg-sage-500/15 text-sage-900 font-bold';
            } else if (idx === selectedOption) {
              btnStyle = 'border-rose-500 bg-rose-500/15 text-rose-900 font-medium';
            } else {
              btnStyle = 'border-border-warm/60 bg-surface/50 opacity-40 text-ink-muted';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(idx)}
              disabled={isSubmitted}
              className={`w-full text-left px-4 py-3 rounded-xl border text-caption transition-all flex items-center justify-between gap-3 ${btnStyle} cursor-pointer disabled:cursor-default`}
            >
              <span className="leading-snug">{option}</span>
              {isSubmitted && idx === checkItem.correctIndex && (
                <CheckCircle2 className="h-4 w-4 text-sage-600 shrink-0" />
              )}
              {isSubmitted && idx === selectedOption && !isCorrect && (
                <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback Alert */}
      {isSubmitted && (
        <div
          className={`p-4 rounded-xl border text-caption leading-relaxed animate-fade-in ${
            isCorrect
              ? 'bg-sage-500/15 border-sage-500/30 text-sage-900'
              : 'bg-rose-500/15 border-rose-500/30 text-rose-900'
          }`}
        >
          <p className="font-sans font-bold mb-1">
            {isCorrect ? '✓ Correct Understanding!' : '⚠ Concept Clarification:'}
          </p>
          <p className="text-caption font-normal">{checkItem.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default SectionSelfCheck;
