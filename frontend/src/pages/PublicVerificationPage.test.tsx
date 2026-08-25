import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PublicVerificationPage from './PublicVerificationPage';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

const mockedGet = vi.mocked(api.get);

describe('PublicVerificationPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the public verification header, portal badge, and search input', () => {
    render(
      <MemoryRouter initialEntries={['/verify']}>
        <Routes>
          <Route path="/verify" element={<PublicVerificationPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Official Credential Verification Portal')).toBeInTheDocument();
    expect(screen.getByText('HMAC-SHA256 Cryptographic Registry')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Enter Credential ID \(e.g., GS-CERT-2026-A1B2C3D4E5F6\)/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Verify Credential/i })).toBeInTheDocument();
  });

  it('performs verification lookup and displays verified credential card', async () => {
    mockedGet.mockResolvedValueOnce({
      data: {
        valid: true,
        credential_id: 'GS-CERT-2026-9A8B7C6D5E4F',
        module_id: '11111111-1111-1111-1111-111111111111',
        module_title: 'Digital Document Handling',
        issued_at: '2026-08-25T14:30:00Z',
        recipient_masked: 'S***** S****',
        score_achieved: 4,
        total_score: 4,
        percentage: 100,
        verification_hash: '9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e',
      },
    });

    render(
      <MemoryRouter initialEntries={['/verify/GS-CERT-2026-9A8B7C6D5E4F']}>
        <Routes>
          <Route path="/verify/:credentialId" element={<PublicVerificationPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Official Credential Verified')).toBeInTheDocument();
    });

    expect(screen.getByText('Digital Document Handling')).toBeInTheDocument();
    expect(screen.getByText('S***** S****')).toBeInTheDocument();
    expect(screen.getByText('4 / 4 (100%)')).toBeInTheDocument();
    expect(screen.getByText('GS-CERT-2026-9A8B7C6D5E4F')).toBeInTheDocument();
    expect(screen.getByText('9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Print Official Receipt/i })).toBeInTheDocument();
  });

  it('displays a graceful error alert when credential is not found', async () => {
    mockedGet.mockRejectedValueOnce({
      response: {
        status: 404,
        data: {
          detail: {
            error: {
              code: 'CREDENTIAL_NOT_FOUND',
              message: 'Official credential record not found.',
            },
          },
        },
      },
    });

    render(
      <MemoryRouter initialEntries={['/verify/GS-CERT-9999-NOTFOUND']}>
        <Routes>
          <Route path="/verify/:credentialId" element={<PublicVerificationPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Verification Failed')).toBeInTheDocument();
    });

    expect(
      screen.getByText(/Official credential record not found/i)
    ).toBeInTheDocument();
  });
});
