import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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

describe('CitizenUploadPage', () => {
  beforeEach(() => {
    mockedGet.mockReset();
    mockedPost.mockReset();
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

  it('uploads a document and renders extracted fields and validation results', async () => {
    mockedPost.mockResolvedValue({
      data: {
        document_id: '550e8400-e29b-41d4-a716-446655440000',
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
    expect(screen.getAllByText('Passed')).toHaveLength(4);
    expect(screen.getByText('550e8400-e29b-41d4-a716-446655440000')).toBeInTheDocument();
  });

  it('retrieves existing document validation by reference ID', async () => {
    mockedGet.mockResolvedValue({
      data: {
        document_id: '550e8400-e29b-41d4-a716-446655440000',
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

  it('renders the backend upload error', async () => {
    mockedPost.mockRejectedValue({
      isAxiosError: true,
      response: { data: { detail: { error: { message: 'File size exceeds maximum allowed 5MB limit' } } } },
    });

    renderPage();
    const file = new File(['certificate contents'], 'income-certificate.txt', { type: 'text/plain' });
    fireEvent.change(screen.getByLabelText('Choose a file to upload'), { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: 'Run Pre-check Validation' }));

    expect(await screen.findByText('File size exceeds maximum allowed 5MB limit')).toBeInTheDocument();
  });
});