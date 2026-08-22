import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TutorChatPage from './TutorChatPage';
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
      <TutorChatPage />
    </BrowserRouter>
  );

describe('TutorChatPage', () => {
  beforeEach(() => {
    mockedGet.mockReset();
    mockedPost.mockReset();
    mockedGet.mockResolvedValue({
      data: [{ id: 'module-1', title: 'Digital Document Handling', content: 'Verification content' }],
    });
  });

  it('loads available modules and sends a grounded tutor question', async () => {
    mockedPost.mockResolvedValue({
      data: {
        answer: 'Verify the certificate number and expiry date.',
        matched_module_title: 'Digital Document Handling',
      },
    });

    renderPage();
    await screen.findByRole('option', { name: 'Digital Document Handling' });
    const input = screen.getByPlaceholderText(/Ask a question about document guidelines/i);
    fireEvent.change(input, { target: { value: 'How do I verify a certificate?' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => expect(mockedPost).toHaveBeenCalledWith('/tutor/ask', {
      module_id: 'auto',
      question: 'How do I verify a certificate?',
    }));
    expect(await screen.findByText('Verify the certificate number and expiry date.')).toBeInTheDocument();
    expect(screen.getByText('Source: Digital Document Handling')).toBeInTheDocument();
  });

  it('renders the tutor error when the request fails', async () => {
    mockedPost.mockRejectedValue({
      isAxiosError: true,
      response: { data: { detail: { error: { message: 'Tutor service unavailable' } } } },
    });

    renderPage();
    const input = screen.getByPlaceholderText(/Ask a question about document guidelines/i);
    fireEvent.change(input, { target: { value: 'How do I verify a certificate?' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    expect(await screen.findByText('Tutor service unavailable')).toBeInTheDocument();
  });
});