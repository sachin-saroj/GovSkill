import React from 'react';
import { AlertTriangle, Building2, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface ScenarioCalloutProps {
  moduleTitle: string;
  sectionIndex: number;
  sectionTitle: string;
}

interface CivicContext {
  scenario: string;
  workplaceImportance: string;
  commonMistakes: string[];
}

const getCivicContext = (moduleTitle: string, sectionIndex: number, sectionTitle: string): CivicContext => {
  const lowerMod = moduleTitle.toLowerCase();
  const lowerSec = sectionTitle.toLowerCase();

  // 1. Digital Document Handling
  if (lowerMod.includes('document')) {
    if (sectionIndex === 0 || lowerSec.includes('intro')) {
      return {
        scenario: 'Citizen application for an Income Certificate submitted at the municipal service center counter with physical and scanned attachments.',
        workplaceImportance: 'Accurate intake and cataloging ensure records are immediately findable for statutory verification without citizen rework.',
        commonMistakes: [
          'Failing to verify that scanned attachments match the physical applicant profile.',
          'Omitting mandatory category tags during document ingest.',
        ],
      };
    }
    if (sectionIndex === 1 || lowerSec.includes('checklist') || lowerSec.includes('verification')) {
      return {
        scenario: 'An applicant presents a caste certificate with a 5-character serial number and no issuing officer seal.',
        workplaceImportance: 'Enforcing the 4-point verification checklist prevents the issuance of invalid or fraudulent welfare benefits.',
        commonMistakes: [
          'Approving certificate numbers shorter than 6 alphanumeric characters.',
          'Overlooking expired dates on time-limited certificates.',
          'Processing documents with illegible authority signatures.',
        ],
      };
    }
    if (sectionIndex === 2 || lowerSec.includes('error') || lowerSec.includes('prevention')) {
      return {
        scenario: 'Applicant name on the revenue form differs by one letter from the uploaded Aadhaar card (e.g., "Suresh" vs "Suresha").',
        workplaceImportance: 'Identifying typos early prevents legal disputes and rejection during higher-level departmental auditing.',
        commonMistakes: [
          'Ignoring spelling mismatches between application forms and primary ID proofs.',
          'Approving low-resolution scans where text is degraded or unreadable.',
        ],
      };
    }
    return {
      scenario: 'Citizen requests a copy of a neighbour\'s land record or income certificate containing Aadhaar numbers.',
      workplaceImportance: 'PII protection is a legal requirement; unauthorized disclosure violates statutory privacy regulations.',
      commonMistakes: [
        'Sharing citizen documents with unauthorized third parties.',
        'Leaving unencrypted citizen files accessible on shared office drives.',
      ],
    };
  }

  // 2. Government Portal Operations
  if (lowerMod.includes('portal')) {
    if (sectionIndex === 0 || lowerSec.includes('overview') || lowerSec.includes('workflow')) {
      return {
        scenario: 'Daily queue of 50+ incoming citizen trade license and birth certificate applications in the portal.',
        workplaceImportance: 'Consistent daily processing maintains municipal service-level agreements (SLAs) and citizen satisfaction.',
        commonMistakes: [
          'Leaving applications unattended in the queue without initial status triage.',
          'Failing to update tracking status when forwarding to other officers.',
        ],
      };
    }
    if (sectionIndex === 1 || lowerSec.includes('processing') || lowerSec.includes('verification')) {
      return {
        scenario: 'Verification officer validates income proof and needs supervisor sign-off before official certificate dispatch.',
        workplaceImportance: 'Correct two-tier routing ensures administrative accountability and transparent approval workflows.',
        commonMistakes: [
          'Prematurely marking an application "Approved" before supervisor review.',
          'Rejecting an application without logging specific statutory reasons.',
        ],
      };
    }
    return {
      scenario: 'An application has been pending in the department queue for 6 business days with a 7-day SLA deadline approaching.',
      workplaceImportance: 'Timely escalation prevents SLA breaches, citizen grievance filings, and administrative penalties.',
      commonMistakes: [
        'Allowing files to exceed 7 business days without supervisor escalation notice.',
        'Closing escalated tickets without resolving root citizen discrepancies.',
      ],
    };
  }

  // 3. Cybersecurity & Data Privacy Basics
  if (lowerMod.includes('cybersecurity') || lowerMod.includes('privacy')) {
    if (sectionIndex === 0 || lowerSec.includes('network') || lowerSec.includes('credential')) {
      return {
        scenario: 'An officer steps away from their municipal workstation to attend a public hearing without locking the computer screen.',
        workplaceImportance: 'Workstation locking and strong credential hygiene safeguard sensitive citizen databases from unauthorized physical access.',
        commonMistakes: [
          'Leaving active administrative sessions unlocked and unattended.',
          'Sharing system login credentials or OTPs with colleagues.',
        ],
      };
    }
    if (sectionIndex === 1 || lowerSec.includes('phishing')) {
      return {
        scenario: 'An email arriving with the subject "Urgent: Update Administrative Portal Password" from an external non-gov domain.',
        workplaceImportance: 'Recognizing phishing prevents malware infections and state network credential breaches.',
        commonMistakes: [
          'Clicking links in unexpected emails without verifying the sender domain.',
          'Entering government credentials on non-government landing pages.',
        ],
      };
    }
    return {
      scenario: 'Officer needs to work on citizen pension beneficiary lists from home using an unencrypted USB flash drive.',
      workplaceImportance: 'Encrypted storage ensures citizen financial records remain confidential even if hardware is misplaced.',
      commonMistakes: [
        'Saving unencrypted spreadsheets with citizen Aadhaar or bank account numbers.',
        'Transmitting sensitive beneficiary lists via unsecured personal email accounts.',
      ],
    };
  }

  // 4. Digital Record Management & Default
  if (sectionIndex === 0 || lowerSec.includes('archival') || lowerSec.includes('index')) {
    return {
      scenario: 'Archiving 500 completed marriage certificates from the previous financial year into the digital repository.',
      workplaceImportance: 'Standardized metadata tags allow instant record retrieval during court inquiries or citizen Right to Information (RTI) requests.',
      commonMistakes: [
        'Archiving files with missing year or department category identifiers.',
        'Using inconsistent file naming conventions across branch offices.',
      ],
    };
  }
  if (sectionIndex === 1 || lowerSec.includes('retention') || lowerSec.includes('destruction')) {
    return {
      scenario: 'Reviewing 5-year-old income certificates vs permanent land title records during annual archive maintenance.',
      workplaceImportance: 'Adhering to statutory retention schedules prevents premature loss of permanent records while managing storage efficiently.',
      commonMistakes: [
        'Scheduling permanent records (e.g. land ownership) for automated deletion.',
        'Retaining temporary documents past authorized retention schedules without legal hold.',
      ],
    };
  }
  return {
    scenario: 'Auditors request a complete record of who accessed, viewed, and exported a disputed property deed over the last 12 months.',
    workplaceImportance: 'Immutable audit trails provide legal proof of chain of custody and defend officers against false allegations of tampering.',
    commonMistakes: [
      'Performing manual database edits outside the audited portal interface.',
      'Disabling system access logging to save disk space.',
    ],
  };
};

export const ScenarioCallout: React.FC<ScenarioCalloutProps> = ({
  moduleTitle,
  sectionIndex,
  sectionTitle,
}) => {
  const context = getCivicContext(moduleTitle, sectionIndex, sectionTitle);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
      {/* Practical Scenario Card */}
      <div className="rounded-civic-xl bg-slate-50 border border-slate-200/90 p-4 space-y-2.5 shadow-civic-xs">
        <div className="flex items-center gap-2 text-civic-900 font-semibold text-caption">
          <Building2 className="h-4 w-4 text-civic-700 shrink-0" />
          <span>Workplace Scenario & Operational Impact</span>
        </div>
        <p className="text-caption text-slate-700 leading-relaxed font-normal">
          <strong className="text-slate-900 font-semibold">Scenario: </strong>
          {context.scenario}
        </p>
        <div className="pt-1.5 border-t border-slate-200 text-caption text-slate-600 flex items-start gap-1.5 font-normal">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            <strong className="font-semibold text-slate-800">Why it matters: </strong>
            {context.workplaceImportance}
          </span>
        </div>
      </div>

      {/* Common Mistakes & Red Flags */}
      <div className="rounded-civic-xl bg-amber-50/70 border border-amber-200/80 p-4 space-y-2.5 shadow-civic-xs">
        <div className="flex items-center gap-2 text-amber-900 font-semibold text-caption">
          <ShieldAlert className="h-4 w-4 text-amber-700 shrink-0" />
          <span>Common Mistakes & Red Flags to Avoid</span>
        </div>
        <ul className="space-y-1.5 text-caption text-amber-950 font-normal">
          {context.commonMistakes.map((mistake, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span className="leading-snug">{mistake}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ScenarioCallout;
