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
    window.history.pushState({}, '', '/');
    mockedGet.mockReset();
    mockedPost.mockReset();
    mockedGet.mockResolvedValue({
      data: [{ id: 'module-1', title: 'Digital Document Handling', content: 'Verification content' }],
    });
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
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
    expect(screen.getByRole('link', { name: /open lesson/i })).toHaveAttribute('href', '/module?id=module-1');
  });

  it('sends question when a prompt starter pill is clicked', async () => {
    mockedPost.mockResolvedValue({
      data: {
        answer: 'Mandatory verification checks include name, certificate number, and expiry date.',
        matched_module_title: 'Digital Document Handling',
      },
    });

    renderPage();
    const starterButton = await screen.findByRole('button', {
      name: /mandatory verification rules for income certificates/i,
    });
    fireEvent.click(starterButton);

    await waitFor(() => expect(mockedPost).toHaveBeenCalledWith('/tutor/ask', {
      module_id: 'auto',
      question: 'What are the mandatory verification rules for Income Certificates?',
    }));
    expect(await screen.findByText(/mandatory verification checks include/i)).toBeInTheDocument();
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