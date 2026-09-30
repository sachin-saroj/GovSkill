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

describe('TutorChatPage & Dual-Mode Copilot Interface', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, '', '/tutor');
    mockedGet.mockReset();
    mockedPost.mockReset();
    mockedGet.mockResolvedValue({
      data: [{ id: 'module-1', title: 'Digital Document Handling', content: 'Verification content' }],
    });
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it('defaults to General AI Chat when visiting /tutor with no query parameters or saved preference', async () => {
    mockedPost.mockResolvedValue({
      data: {
        answer: 'Greetings! As your General AI Assistant, I can help you with anything.',
        matched_module_title: 'GovSkill General Assistant',
        grounding_status: 'general_chat',
        conversation_mode: 'general_chat',
        mode: 'general_chat',
        suggested_followups: ['Explain machine learning'],
        source_sections: [],
      },
    });

    renderPage();

    // Verify General AI Chat is active by default
    expect(screen.getByText(/General AI Chat & Copilot/i)).toBeInTheDocument();
    expect(screen.getAllByText(/GovSkill General AI Assistant/i)[0]).toBeInTheDocument();

    const input = screen.getByPlaceholderText(/Ask any question, explore technical concepts/i);
    fireEvent.change(input, { target: { value: 'hello' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() =>
      expect(mockedPost).toHaveBeenCalledWith('/tutor/ask', {
        module_id: 'auto',
        question: 'hello',
        mode: 'general_chat',
        conversation_mode: 'general_chat',
      })
    );
    expect(await screen.findByText('Greetings! As your General AI Assistant, I can help you with anything.')).toBeInTheDocument();
  });

  it('loads available modules and sends a grounded tutor question when grounded mode is active', async () => {
    window.history.pushState({}, '', '/tutor?mode=grounded_training');

    mockedPost.mockResolvedValue({
      data: {
        answer: 'Verify the certificate number and expiry date accurately.',
        matched_module_id: 'module-1',
        matched_module_title: 'Digital Document Handling',
        grounding_status: 'grounded',
        suggested_followups: ['What is the minimum character length for certificate numbers?'],
        source_sections: ['Lesson 2: Verification Checklist'],
        mode: 'standard',
        conversation_mode: 'grounded_training',
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
        conversation_mode: 'grounded_training',
      })
    );
    expect(await screen.findByText('Verify the certificate number and expiry date accurately.')).toBeInTheDocument();
    expect(screen.getByText('Grounded Curriculum')).toBeInTheDocument();
    expect(screen.getByText('Lesson 2: Verification Checklist')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /open lesson/i })).toHaveAttribute('href', '/module?id=module-1');
  });

  it('persists selected mode to localStorage and updates URL query parameters', async () => {
    renderPage();

    // Default mode is general_chat
    expect(screen.getByText(/General AI Chat & Copilot/i)).toBeInTheDocument();

    // Switch to Grounded Training
    const groundedBtn = screen.getByRole('button', { name: /grounded training/i });
    fireEvent.click(groundedBtn);

    expect(screen.getByText(/Administrative Assistant & Copilot/i)).toBeInTheDocument();
    expect(localStorage.getItem('govskill_tutor_mode')).toBe('grounded_training');
  });

  it('respects persisted localStorage mode when URL parameter is absent', async () => {
    localStorage.setItem('govskill_tutor_mode', 'grounded_training');
    window.history.pushState({}, '', '/tutor');

    renderPage();

    expect(screen.getByText(/Administrative Assistant & Copilot/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ask about verification rules/i)).toBeInTheDocument();
  });

  it('URL query parameter overrides persisted localStorage preference', async () => {
    localStorage.setItem('govskill_tutor_mode', 'grounded_training');
    window.history.pushState({}, '', '/tutor?mode=general_chat');

    renderPage();

    expect(screen.getByText(/General AI Chat & Copilot/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ask any question, explore technical concepts/i)).toBeInTheDocument();
  });

  it('strictly isolates conversation history when switching modes', async () => {
    mockedPost.mockResolvedValueOnce({
      data: {
        answer: 'General reply: Machine learning teaches algorithms from data.',
        matched_module_title: 'GovSkill General Assistant',
        grounding_status: 'general_chat',
        conversation_mode: 'general_chat',
        mode: 'general_chat',
      },
    }).mockResolvedValueOnce({
      data: {
        answer: 'Grounded reply: Standard verification requires checking 4 deterministic rules.',
        matched_module_title: 'Digital Document Handling',
        grounding_status: 'grounded',
        conversation_mode: 'grounded_training',
        mode: 'standard',
      },
    });

    renderPage();

    // 1. Send question in General Chat
    const generalInput = screen.getByPlaceholderText(/Ask any question, explore technical concepts/i);
    fireEvent.change(generalInput, { target: { value: 'Explain machine learning in simple words.' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    await screen.findByText(/General reply: Machine learning teaches algorithms/i);
    expect(screen.getByText('Explain machine learning in simple words.')).toBeInTheDocument();

    // 2. Switch to Grounded Training
    const groundedBtn = screen.getByRole('button', { name: /grounded training/i });
    fireEvent.click(groundedBtn);

    // Verify general messages are NOT visible in Grounded Training view
    expect(screen.queryByText('Explain machine learning in simple words.')).not.toBeInTheDocument();
    expect(screen.getByText(/I am your official Government Training Copilot/i)).toBeInTheDocument();

    // 3. Send question in Grounded Training
    const groundedInput = screen.getByPlaceholderText(/Ask about verification rules/i);
    fireEvent.change(groundedInput, { target: { value: 'What are verification rules?' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() =>
      expect(mockedPost).toHaveBeenLastCalledWith('/tutor/ask', {
        module_id: 'auto',
        question: 'What are verification rules?',
        mode: 'standard',
        conversation_mode: 'grounded_training',
      })
    );

    // 4. Switch back to General Chat
    const generalBtn = screen.getByRole('button', { name: /general ai chat/i });
    fireEvent.click(generalBtn);

    // Verify general message is restored and grounded message is absent
    expect(screen.getByText('Explain machine learning in simple words.')).toBeInTheDocument();
    expect(screen.queryByText('What are verification rules?')).not.toBeInTheDocument();
  });

  it('handles quick mode action chips in grounded training', async () => {
    window.history.pushState({}, '', '/tutor?mode=grounded_training');

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
        conversation_mode: 'grounded_training',
      })
    );
  });

  it('renders out-of-scope unverified disclaimer appropriately in grounded training', async () => {
    window.history.pushState({}, '', '/tutor?mode=grounded_training');

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

  it('renders targeted remediation banner and handles preloaded prompt', async () => {
    window.history.pushState(
      {},
      '',
      '/tutor?moduleId=module-1&competency=Verification%20Rules&mode=remediation&prompt=Explain%20verification%20rules'
    );

    mockedPost.mockResolvedValue({
      data: {
        answer: 'Targeted Remediation for Verification Rules:\n1. Core Rule Summary...',
        matched_module_title: 'Digital Document Handling',
        grounding_status: 'grounded',
        mode: 'remediation',
      },
    });

    renderPage();

    expect(await screen.findByText(/Targeted Remediation Active: Verification Rules/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /practice scenario/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /red flags/i })).toBeInTheDocument();

    await waitFor(() =>
      expect(mockedPost).toHaveBeenCalledWith('/tutor/ask', {
        module_id: 'module-1',
        question: 'Explain verification rules',
        mode: 'remediation',
        conversation_mode: 'grounded_training',
      })
    );
  });

  it('resets the conversation cleanly for the active mode', async () => {
    renderPage();
    const resetBtn = screen.getByRole('button', { name: /reset/i });
    fireEvent.click(resetBtn);

    expect(screen.getByText(/I am your GovSkill General AI Assistant/i)).toBeInTheDocument();
  });
});