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
    <div className="border border-[#E4E4E7] bg-white p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#E4E4E7]">
        <div className="flex items-center gap-2 text-black font-mono font-bold text-[11px] uppercase tracking-[0.14em]">
          <HelpCircle className="h-4 w-4 text-[#0E50B0]" />
          <span>Quick Understanding Check</span>
        </div>
        {isSubmitted && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-[11px] font-mono text-[#71717A] hover:text-black font-bold uppercase tracking-wider cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Try Again</span>
          </button>
        )}
      </div>

      <p className="font-sans font-bold text-base text-black">
        {checkItem.question}
      </p>

      {/* Options List */}
      <div className="space-y-2">
        {checkItem.options.map((option, idx) => {
          let btnStyle = 'border-[#E4E4E7] bg-white hover:bg-zinc-50 text-black';

          if (isSubmitted) {
            if (idx === checkItem.correctIndex) {
              btnStyle = 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold';
            } else if (idx === selectedOption) {
              btnStyle = 'border-[#EE8148] bg-orange-50 text-[#AF411E] font-medium';
            } else {
              btnStyle = 'border-[#E4E4E7] bg-zinc-50 opacity-50 text-[#71717A]';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(idx)}
              disabled={isSubmitted}
              className={`w-full text-left px-4 py-3 rounded-none border text-caption transition-all flex items-center justify-between gap-3 ${btnStyle} cursor-pointer disabled:cursor-default`}
            >
              <span className="leading-snug">{option}</span>
              {isSubmitted && idx === checkItem.correctIndex && (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              )}
              {isSubmitted && idx === selectedOption && !isCorrect && (
                <XCircle className="h-4 w-4 text-[#EE8148] shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback Alert */}
      {isSubmitted && (
        <div
          className={`p-4 rounded-none border text-caption leading-relaxed animate-fade-in ${
            isCorrect
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-orange-50 border-orange-300 text-[#AF411E]'
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
