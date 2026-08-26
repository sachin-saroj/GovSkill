import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CounterSlipModal from './CounterSlipModal';
import { ValidationRuleResult } from '@/types';

const mockPassedRules: ValidationRuleResult[] = [
  {
    ruleName: 'Name present',
    passed: true,
    field: 'name',
    reason: "Applicant name 'Ramesh Kumar' verified on document.",
    severity: 'critical',
    recommended_action: 'No action required.',
  },
  {
    ruleName: 'Certificate number format',
    passed: true,
    field: 'certificate_number',
    reason: "Certificate number 'INC2026889' matches alphanumeric standard (>=6 chars).",
    severity: 'critical',
    recommended_action: 'No action required.',
  },
  {
    ruleName: 'Certificate not expired',
    passed: true,
    field: 'expiry_date',
    reason: 'Certificate is valid until 2027-12-31.',
    severity: 'critical',
    recommended_action: 'No action required.',
  },
  {
    ruleName: 'All required fields extracted',
    passed: true,
    field: 'document',
    reason: 'All mandatory certificate fields were successfully extracted and verified.',
    severity: 'critical',
    recommended_action: 'No action required.',
  },
];

const mockFailedRules: ValidationRuleResult[] = [
  {
    ruleName: 'Name present',
    passed: true,
    field: 'name',
    reason: "Applicant name 'Suresh Patel' verified on document.",
    severity: 'critical',
    recommended_action: 'No action required.',
  },
  {
    ruleName: 'Certificate number format',
    passed: false,
    field: 'certificate_number',
    reason: "Certificate number '123' is invalid. Must be alphanumeric with at least 6 characters.",
    severity: 'critical',
    recommended_action: 'Verify the certificate number format or check for missing digits in the scan.',
    explanation: 'The certificate number detected on your document is too short or incomplete.',
  },
  {
    ruleName: 'Certificate not expired',
    passed: false,
    field: 'expiry_date',
    reason: 'Certificate expired on 2024-01-01.',
    severity: 'critical',
    recommended_action: 'Apply for a certificate renewal at your local Taluk/Revenue office before submission.',
    explanation: 'Your income certificate has exceeded its statutory validity period.',
  },
  {
    ruleName: 'All required fields extracted',
    passed: false,
    field: 'document',
    reason: 'Missing or unverified mandatory fields: Certificate Number, Valid Expiry Date.',
    severity: 'critical',
    recommended_action: 'Upload a high-contrast, uncropped scan showing all document headers and official seals.',
  },
];

describe('CounterSlipModal', () => {
  it('does not render when isOpen is false', () => {
    render(
      <CounterSlipModal
        isOpen={false}
        onClose={vi.fn()}
        documentId="550e8400-e29b-41d4-a716-446655440000"
        validationResults={mockPassedRules}
      />
    );

    expect(screen.queryByText('PRE-SUBMISSION COUNTER SLIP')).not.toBeInTheDocument();
  });

  it('renders passed Counter Slip with READY status, metadata, and physical checklist', () => {
    const handleClose = vi.fn();

    render(
      <CounterSlipModal
        isOpen={true}
        onClose={handleClose}
        documentId="550e8400-e29b-41d4-a716-446655440000"
        overallStatus="PASSED"
        extractedData={{
          name: 'Ramesh Kumar',
          certificate_number: 'INC2026889',
          expiry_date: '2027-12-31',
        }}
        validationResults={mockPassedRules}
        passedCount={4}
        totalCount={4}
        timestamp="2026-08-26T10:00:00Z"
      />
    );

    expect(screen.getByText('PRE-SUBMISSION COUNTER SLIP')).toBeInTheDocument();
    expect(screen.getByText('550e8400-e29b-41d4-a716-446655440000')).toBeInTheDocument();
    expect(screen.getByText('Ramesh Kumar')).toBeInTheDocument();
    expect(screen.getByText('INC2026889')).toBeInTheDocument();
    expect(screen.getByText('2027-12-31')).toBeInTheDocument();

    // Overall Status
    expect(screen.getByText('READY FOR PHYSICAL COUNTER SUBMISSION')).toBeInTheDocument();
    expect(screen.getByText('4 / 4 Rules Compliant')).toBeInTheDocument();

    // Checklist matrix
    expect(screen.getAllByText('PASSED')).toHaveLength(4);
    expect(screen.getByText('Physical Documents Checklist (What to bring to the Counter)')).toBeInTheDocument();
    expect(screen.getByText(/Original Income Certificate for physical inspection/i)).toBeInTheDocument();
  });

  it('renders action required Counter Slip with failed rule callouts and remedial steps', () => {
    render(
      <CounterSlipModal
        isOpen={true}
        onClose={vi.fn()}
        documentId="doc-defect-12345"
        overallStatus="ACTION_REQUIRED"
        extractedData={{
          name: 'Suresh Patel',
          certificate_number: '123',
          expiry_date: '2024-01-01',
        }}
        validationResults={mockFailedRules}
        passedCount={1}
        totalCount={4}
      />
    );

    expect(screen.getByText('ACTION REQUIRED BEFORE COUNTER SUBMISSION')).toBeInTheDocument();
    expect(screen.getByText('1 / 4 Rules Compliant')).toBeInTheDocument();

    // Critical remedial section
    expect(screen.getByText(/CRITICAL REMEDIAL STEPS REQUIRED BEFORE SUBMISSION/i)).toBeInTheDocument();
    expect(
      screen.getAllByText(/Apply for a certificate renewal at your local Taluk\/Revenue office before submission/i)
        .length
    ).toBeGreaterThan(0);
    expect(screen.getByText(/Your income certificate has exceeded its statutory validity period/i)).toBeInTheDocument();
  });

  it('triggers window.print when Print button is clicked', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});

    render(
      <CounterSlipModal
        isOpen={true}
        onClose={vi.fn()}
        documentId="550e8400-e29b-41d4-a716-446655440000"
        validationResults={mockPassedRules}
      />
    );

    const printButton = screen.getByRole('button', { name: /Print \/ Save PDF Slip/i });
    fireEvent.click(printButton);

    expect(printSpy).toHaveBeenCalledTimes(1);
    printSpy.mockRestore();
  });

  it('calls onClose when close button is clicked, when Escape key is pressed, and when backdrop is clicked', () => {
    const handleClose = vi.fn();

    render(
      <CounterSlipModal
        isOpen={true}
        onClose={handleClose}
        documentId="550e8400-e29b-41d4-a716-446655440000"
        validationResults={mockPassedRules}
      />
    );

    const closeBtn = screen.getByRole('button', { name: /Close Counter Slip Modal/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(2);

    const backdrop = screen.getByTestId('counter-slip-backdrop');
    fireEvent.click(backdrop);
    expect(handleClose).toHaveBeenCalledTimes(3);
  });

  it('handles missing extracted data gracefully with Not Detected fallbacks', () => {
    render(
      <CounterSlipModal
        isOpen={true}
        onClose={vi.fn()}
        documentId="doc-fallback-test"
        extractedData={null}
        validationResults={mockFailedRules}
      />
    );

    expect(screen.getAllByText('Not Detected')).toHaveLength(3);
    expect(screen.getByText('doc-fallback-test')).toBeInTheDocument();
  });
});
