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

describe('TutorChatPage & Copilot Interface', () => {
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
        answer: 'Verify the certificate number and expiry date accurately.',
        matched_module_id: 'module-1',
        matched_module_title: 'Digital Document Handling',
        grounding_status: 'grounded',
        suggested_followups: ['What is the minimum character length for certificate numbers?'],
        source_sections: ['Lesson 2: Verification Checklist'],
        mode: 'standard',
      },
    });

    renderPage();
    await screen.findByRole('option', { name: 'Digital Document Handling' });
    const input = screen.getByPlaceholderText(/Ask about verification rules/i);
    fireEvent.change(input, { target: { value: 'How do I verify a certificate?' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() =>
      expect(mockedPost).toHaveBeenCalledWith('/tutor/ask', {
        module_id: 'auto',
        question: 'How do I verify a certificate?',
        mode: 'standard',
      })
    );
    expect(await screen.findByText('Verify the certificate number and expiry date accurately.')).toBeInTheDocument();
    expect(screen.getByText('Grounded Curriculum')).toBeInTheDocument();
    expect(screen.getByText('Lesson 2: Verification Checklist')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /open lesson/i })).toHaveAttribute('href', '/module?id=module-1');
  });

  it('handles quick mode action chips (e.g. "Give procedure")', async () => {
    mockedPost.mockResolvedValueOnce({
      data: {
        answer: 'Step 1: Check mandatory fields. Step 2: Verify expiry.',
        matched_module_id: 'module-1',
        matched_module_title: 'Digital Document Handling',
        grounding_status: 'grounded',
        suggested_followups: [],
        source_sections: ['Lesson 2: Verification Checklist'],
        mode: 'standard',
      },
    }).mockResolvedValueOnce({
      data: {
        answer: '1. Review inbound documents.\n2. Verify 6-character format.\n3. Validate signatures.',
        matched_module_id: 'module-1',
        matched_module_title: 'Digital Document Handling',
        grounding_status: 'grounded',
        suggested_followups: [],
        source_sections: [],
        mode: 'procedure',
      },
    });

    renderPage();
    const input = screen.getByPlaceholderText(/Ask about verification rules/i);
    fireEvent.change(input, { target: { value: 'How to verify?' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    await screen.findByText(/Step 1: Check mandatory fields/i);

    const procedureBtn = screen.getByRole('button', { name: /give procedure/i });
    fireEvent.click(procedureBtn);

    await waitFor(() =>
      expect(mockedPost).toHaveBeenLastCalledWith('/tutor/ask', {
        module_id: 'auto',
        question: 'What is the exact sequential procedure for this?',
        mode: 'procedure',
      })
    );
  });

  it('sends question when a prompt starter pill is clicked', async () => {
    mockedPost.mockResolvedValue({
      data: {
        answer: 'Mandatory verification checks include name, certificate number, and expiry date.',
        matched_module_title: 'Digital Document Handling',
        grounding_status: 'grounded',
      },
    });

    renderPage();
    const starterButton = await screen.findByRole('button', {
      name: /mandatory verification rules for income certificates/i,
    });
    fireEvent.click(starterButton);

    await waitFor(() =>
      expect(mockedPost).toHaveBeenCalledWith('/tutor/ask', {
        module_id: 'auto',
        question: 'What are the mandatory verification rules for Income Certificates?',
        mode: 'standard',
      })
    );
    expect(await screen.findByText(/mandatory verification checks include/i)).toBeInTheDocument();
  });

  it('renders out-of-scope unverified disclaimer appropriately', async () => {
    mockedPost.mockResolvedValue({
      data: {
        answer: 'This topic cannot be verified from the approved training module.',
        matched_module_title: 'Digital Document Handling',
        grounding_status: 'insufficient_context',
      },
    });

    renderPage();
    const input = screen.getByPlaceholderText(/Ask about verification rules/i);
    fireEvent.change(input, { target: { value: 'What is the corporate tax law in France?' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    expect(await screen.findByText('Unverified / Out of Scope')).toBeInTheDocument();
    expect(screen.getByText(/This topic cannot be verified from the approved training module/i)).toBeInTheDocument();
  });

  it('renders error alert with retry button on request failure', async () => {
    mockedPost.mockRejectedValue({
      isAxiosError: true,
      response: { data: { detail: { error: { message: 'Copilot connection timeout' } } } },
    });

    renderPage();
    const input = screen.getByPlaceholderText(/Ask about verification rules/i);
    fireEvent.change(input, { target: { value: 'How do I verify a certificate?' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    expect(await screen.findByText('Copilot connection timeout')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('resets the conversation cleanly', async () => {
    renderPage();
    const resetBtn = screen.getByRole('button', { name: /reset/i });
    fireEvent.click(resetBtn);

    expect(screen.getByText(/I am your official Government Training Copilot/i)).toBeInTheDocument();
  });
});