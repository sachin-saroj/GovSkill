import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'jest-axe';
import CitizenUploadPage from './CitizenUploadPage';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockedGet = vi.mocked(api.get);
const mockedPost = vi.mocked(api.post);

const renderPage = () =>
  render(
    <BrowserRouter>
      <CitizenUploadPage />
    </BrowserRouter>
  );

describe('CitizenUploadPage & GovAssist Workflow', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
    mockedGet.mockReset();
    mockedPost.mockReset();
    if (!window.URL.createObjectURL) {
      window.URL.createObjectURL = vi.fn(() => 'blob:mock-preview-url');
      window.URL.revokeObjectURL = vi.fn();
    }
  });

  it('requires a document before starting validation', async () => {
    renderPage();

    const submitButton = screen.getByRole('button', { name: 'Run Pre-check Validation' });
    expect(submitButton).toBeDisabled();
    fireEvent.submit(submitButton.closest('form') as HTMLFormElement);

    expect(
      await screen.findByText('Please select an Income Certificate document image or PDF first.')
    ).toBeInTheDocument();
    expect(mockedPost).not.toHaveBeenCalled();
  });

  it('uploads a document and renders extracted fields and passing validation results', async () => {
    mockedPost.mockResolvedValue({
      data: {
        document_id: '550e8400-e29b-41d4-a716-446655440000',
        overall_status: 'PASSED',
        passed_rules_count: 4,
        total_rules_count: 4,
        recommended_next_step: 'All pre-submission validation checks passed! Proceed with formal submission.',
        extracted_data: {
          name: 'Asha Rao',
          certificate_number: 'INC123456',
          expiry_date: '2030-12-31',
        },
        validation_results: [
          { ruleName: 'Name present', passed: true, reason: 'Name verified' },
          { ruleName: 'Certificate number format', passed: true, reason: 'Alphanumeric valid' },
          { ruleName: 'Certificate not expired', passed: true, reason: 'Valid date' },
          { ruleName: 'All required fields extracted', passed: true, reason: 'All fields intact' },
        ],
      },
    });

    renderPage();
    const file = new File(['certificate contents'], 'income-certificate.txt', { type: 'text/plain' });
    fireEvent.change(screen.getByLabelText('Choose a file to upload'), { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: 'Run Pre-check Validation' }));

    await waitFor(() => expect(mockedPost).toHaveBeenCalled());
    const [url, body, config] = mockedPost.mock.calls[0];
    expect(url).toBe('/documents/upload');
    expect(body).toBeInstanceOf(FormData);
    expect((body as FormData).get('file')).toBe(file);
    expect(config).toEqual({ headers: { 'Content-Type': 'multipart/form-data' } });

    expect(await screen.findByText('Asha Rao')).toBeInTheDocument();
    expect(screen.getByText('Pre-Submission Verification: PASSED')).toBeInTheDocument();
    expect(screen.getByText('4/4 Rules Passed')).toBeInTheDocument();
    expect(screen.getByText('550e8400-e29b-41d4-a716-446655440000')).toBeInTheDocument();
  });

  it('renders failed validation with corrective actions and AI explanation accordion', async () => {
    mockedPost.mockResolvedValue({
      data: {
        document_id: '550e8400-e29b-41d4-a716-446655440001',
        overall_status: 'ACTION_REQUIRED',
        passed_rules_count: 2,
        total_rules_count: 4,
        recommended_next_step: 'One or more pre-check rules failed. Review guidance before formal submission.',
        extracted_data: {
          name: 'Prakash Rao',
          certificate_number: '12',
          expiry_date: '2020-01-01',
        },
        validation_results: [
          { ruleName: 'Name present', passed: true },
          {
            ruleName: 'Certificate number format',
            passed: false,
            reason: 'Certificate number 12 is invalid (min 6 chars).',
            recommended_action: 'Check certificate number on original document.',
            explanation: 'Your certificate number is too short. It must contain at least 6 alphanumeric characters.',
          },
          {
            ruleName: 'Certificate not expired',
            passed: false,
            reason: 'Certificate expired on 2020-01-01.',
            recommended_action: 'Apply for renewal at your Taluk office.',
            explanation: 'This certificate has expired. Please obtain an updated certificate.',
          },
          { ruleName: 'All required fields extracted', passed: false },
        ],
      },
    });

    renderPage();
    const file = new File(['expired certificate'], 'expired.txt', { type: 'text/plain' });
    fireEvent.change(screen.getByLabelText('Choose a file to upload'), { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: 'Run Pre-check Validation' }));

    expect(await screen.findByText('Pre-Submission Notice: CORRECTIONS NEEDED')).toBeInTheDocument();
    expect(screen.getByText('2/4 Rules Passed')).toBeInTheDocument();

    // Click on failed rule to expand accordion
    const failedRuleButton = screen.getByRole('button', { name: /certificate number format/i });
    fireEvent.click(failedRuleButton);

    expect(await screen.findByText(/Check certificate number on original document/i)).toBeInTheDocument();
    expect(screen.getByText(/Your certificate number is too short/i)).toBeInTheDocument();
  });

  it('retrieves existing document validation by reference ID', async () => {
    mockedGet.mockResolvedValue({
      data: {
        document_id: '550e8400-e29b-41d4-a716-446655440000',
        overall_status: 'PASSED',
        passed_rules_count: 4,
        total_rules_count: 4,
        extracted_data: {
          name: 'Prakash Rao',
          certificate_number: 'INC999888',
          expiry_date: '2028-06-30',
        },
        validation_results: [
          { ruleName: 'Name present', passed: true },
          { ruleName: 'Certificate number format', passed: true },
          { ruleName: 'Certificate not expired', passed: true },
          { ruleName: 'All required fields extracted', passed: true },
        ],
      },
    });

    renderPage();

    // Switch to Lookup tab
    fireEvent.click(screen.getByRole('button', { name: /lookup by reference id/i }));

    const input = screen.getByLabelText(/document reference id/i);
    fireEvent.change(input, { target: { value: '550e8400-e29b-41d4-a716-446655440000' } });
    fireEvent.click(screen.getByRole('button', { name: /lookup reference id/i }));

    await waitFor(() =>
      expect(mockedGet).toHaveBeenCalledWith('/documents/550e8400-e29b-41d4-a716-446655440000')
    );
    expect(await screen.findByText('Prakash Rao')).toBeInTheDocument();
    expect(screen.getByText('INC999888')).toBeInTheDocument();
  });

  it('renders the backend upload error with retry option', async () => {
    renderPage();
    const file = new File(['certificate contents'], 'income-certificate.txt', { type: 'text/plain' });
    fireEvent.change(screen.getByLabelText('Choose a file to upload'), { target: { files: [file] } });
    mockedPost.mockRejectedValue({
      isAxiosError: true,
      response: { data: { detail: { error: { message: 'Rate limit exceeded. Maximum 20 requests per 60s.' } } } },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Run Pre-check Validation' }));

    expect(await screen.findByText('Rate limit exceeded. Maximum 20 requests per 60s.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('renders Vision-assisted extraction badge and uncertain field indicators', async () => {
    mockedPost.mockResolvedValue({
      data: {
        document_id: '550e8400-e29b-41d4-a716-446655440099',
        overall_status: 'ACTION_REQUIRED',
        document_type: 'income_certificate',
        display_name: 'Income Certificate',
        extraction_source: 'VISION_AI',
        ocr_quality: 'LOW',
        passed_rules_count: 3,
        total_rules_count: 4,
        extracted_data: {
          name: 'Sunita Sharma',
          certificate_number: 'INC112233',
          expiry_date: null,
        },
        field_details: {
          name: { value: 'Sunita Sharma', confidence: 0.95, status: 'extracted' },
          certificate_number: { value: 'INC112233', confidence: 0.65, status: 'uncertain' },
          expiry_date: { value: null, confidence: 0.0, status: 'unreadable' },
        },
        validation_results: [
          { ruleName: 'Name present', passed: true },
          { ruleName: 'Certificate number format', passed: true },
          { ruleName: 'Certificate not expired', passed: false, reason: 'Expiry date missing' },
          { ruleName: 'All required fields extracted', passed: false },
        ],
        detected_issues: ['Low contrast scan required vision fallback', 'Expiry date unreadable due to watermark'],
      },
    });

    renderPage();
    const file = new File(['blurry scan'], 'blurry.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText('Choose a file to upload'), { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: 'Run Pre-check Validation' }));

    // Verify Vision-assisted badge rendered
    expect(await screen.findByText('Vision-assisted extraction')).toBeInTheDocument();
    // Verify Uncertain indicator for certificate number
    expect(screen.getByText('Uncertain')).toBeInTheDocument();
    // Verify Unable to read for expiry date
    expect(screen.getByText('Unable to read')).toBeInTheDocument();
    // Verify detected issues rendered
    expect(screen.getByText(/Low contrast scan required vision fallback/i)).toBeInTheDocument();
  });

  it('renders unknown document state transparently with actionable guidance', async () => {
    mockedPost.mockResolvedValue({
      data: {
        document_id: '550e8400-e29b-41d4-a716-446655440088',
        overall_status: 'UNKNOWN_DOCUMENT',
        document_type: 'unknown_document',
        display_name: 'Unknown Document',
        extraction_source: 'LOCAL_OCR',
        ocr_quality: 'INSUFFICIENT',
        passed_rules_count: 0,
        total_rules_count: 1,
        recommended_next_step: 'Document type could not be confidently identified. Please ensure the document is a supported civic certificate with clear headers.',
        extracted_data: {},
        validation_results: [
          { ruleName: 'Document classification check', passed: false, reason: 'Could not identify civic certificate type' },
        ],
      },
    });

    renderPage();
    const file = new File(['random text'], 'receipt.txt', { type: 'text/plain' });
    fireEvent.change(screen.getByLabelText('Choose a file to upload'), { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: 'Run Pre-check Validation' }));

    expect(await screen.findByText('Pre-Submission Notice: DOCUMENT TYPE UNRECOGNIZED')).toBeInTheDocument();
    expect(screen.getByText('Unrecognized Document')).toBeInTheDocument();
    expect(screen.getByText(/Document type could not be confidently identified/i)).toBeInTheDocument();
  });

  it('passes automated accessibility audit without violations', async () => {
    const { container } = renderPage();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
