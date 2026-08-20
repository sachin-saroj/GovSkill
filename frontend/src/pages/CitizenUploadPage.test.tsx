import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CitizenUploadPage from './CitizenUploadPage';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

const mockedPost = vi.mocked(api.post);

describe('CitizenUploadPage', () => {
  beforeEach(() => {
    mockedPost.mockReset();
  });

  it('requires a document before starting validation', async () => {
    render(<CitizenUploadPage />);

    const submitButton = screen.getByRole('button', { name: 'Run Pre-check Validation' });
    expect(submitButton).toBeDisabled();
    fireEvent.submit(submitButton.closest('form') as HTMLFormElement);

    expect(await screen.findByText('Please select an Income Certificate document image or PDF first.')).toBeInTheDocument();
    expect(mockedPost).not.toHaveBeenCalled();
  });

  it('uploads a document and renders extracted fields and validation results', async () => {
    mockedPost.mockResolvedValue({
      data: {
        document_id: 'document-1',
        extracted_data: {
          name: 'Asha Rao',
          certificate_number: 'INC123456',
          expiry_date: '2030-12-31',
        },
        validation_results: [
          { ruleName: 'Name present', passed: true },
          { ruleName: 'Certificate number format', passed: true },
          { ruleName: 'Certificate not expired', passed: true },
          { ruleName: 'All required fields extracted', passed: true },
        ],
      },
    });

    render(<CitizenUploadPage />);
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
    expect(screen.getAllByText('Passed')).toHaveLength(4);
  });

  it('renders the backend upload error', async () => {
    mockedPost.mockRejectedValue({
      isAxiosError: true,
      response: { data: { detail: { error: { message: 'File size exceeds maximum allowed 5MB limit' } } } },
    });

    render(<CitizenUploadPage />);
    const file = new File(['certificate contents'], 'income-certificate.txt', { type: 'text/plain' });
    fireEvent.change(screen.getByLabelText('Choose a file to upload'), { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: 'Run Pre-check Validation' }));

    expect(await screen.findByText('File size exceeds maximum allowed 5MB limit')).toBeInTheDocument();
  });
});