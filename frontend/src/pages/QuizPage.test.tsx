import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import QuizPage from './QuizPage';
import api from '@/lib/api';

const navigate = vi.fn();
let mockModuleId: string | undefined = undefined;

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigate,
  useParams: () => ({ moduleId: mockModuleId }),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'user-1', email: 'employee@govskill.test', role: 'employee' },
    token: 'test-token',
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

const mockedGet = vi.mocked(api.get);
const mockedPost = vi.mocked(api.post);

const questions = [
  {
    id: 'question-1',
    question: 'What is the minimum certificate length?',
    options: ['4 characters', '6 characters'],
    competency: 'Document Formatting & Standards',
  },
  {
    id: 'question-2',
    question: 'Which format is required?',
    options: ['Numeric only', 'Alphanumeric'],
    competency: 'Document Formatting & Standards',
  },
];

const mockModules = [
  { id: 'cybersecurity-101', title: 'Cybersecurity Basics', content: 'Cyber content' },
  { id: 'default', title: 'Digital Document Handling', content: 'Default content' },
];

describe('QuizPage & Competency Assessment Engine', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
    window.scrollTo = vi.fn() as any;
    mockModuleId = undefined;
    mockedGet.mockReset();
    mockedPost.mockReset();
    navigate.mockReset();
    mockedGet.mockImplementation((url) => {
      if (url.includes('/modules')) {
        return Promise.resolve({ data: mockModules });
      }
      return Promise.resolve({ data: { questions } });
    });
  });

  it('renders assessment guidelines and question navigator', async () => {
    render(<QuizPage />);

    expect(await screen.findByText(/Assessment Guidelines & Instructions/i)).toBeInTheDocument();
    expect(screen.getByText(/Question Navigator:/i)).toBeInTheDocument();
    expect(screen.getByText('2 Unanswered')).toBeInTheDocument();
  });

  it('flags a question for review and updates navigator indicator', async () => {
    render(<QuizPage />);

    const flagButtons = await screen.findAllByRole('button', { name: /flag question/i });
    fireEvent.click(flagButtons[0]);

    expect(await screen.findByText('1 Flagged')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /flagged for review/i })).toBeInTheDocument();
  });

  it('opens confirmation modal and submits answers, displaying competency results', async () => {
    mockedPost.mockResolvedValue({
      data: {
        score: 2,
        total: 2,
        percentage: 100,
        passed: true,
        attempt_number: 1,
        best_score: 2,
        status: 'certified',
        competency_breakdown: [
          {
            competency: 'Document Formatting & Standards',
            score: 2,
            total: 2,
            percentage: 100,
            passed: true,
          },
        ],
        strengths: ['Document Formatting & Standards'],
        weak_areas: [],
        recommended_action: 'Mastery achieved! Proceed to next module.',
        submitted_at: new Date().toISOString(),
      },
    });

    render(<QuizPage />);
    await screen.findByRole('button', { name: /submit assessment/i });

    fireEvent.click(screen.getByRole('radio', { name: '6 characters' }));
    fireEvent.click(screen.getByRole('radio', { name: 'Alphanumeric' }));

    // Click submit button to open confirmation modal
    fireEvent.click(screen.getByRole('button', { name: /submit assessment/i }));
    expect(await screen.findByText(/Confirm Assessment Submission/i)).toBeInTheDocument();

    // Confirm submission inside modal
    const modalSubmitBtn = screen.getAllByRole('button', { name: /submit assessment/i })[1];
    fireEvent.click(modalSubmitBtn);

    await waitFor(() =>
      expect(mockedPost).toHaveBeenCalledWith('/quiz/default/submit', {
        answers: [
          { question_id: 'question-1', selected_option_index: 1 },
          { question_id: 'question-2', selected_option_index: 1 },
        ],
      })
    );

    expect(await screen.findByText('100%')).toBeInTheDocument();
    expect(screen.getByText('Certified Competency')).toBeInTheDocument();
    expect(screen.getAllByText('Document Formatting & Standards')[0]).toBeInTheDocument();
    expect(screen.getByText('Mastery achieved! Proceed to next module.')).toBeInTheDocument();
  });

  it('allows retaking assessment to reset state', async () => {
    mockedPost.mockResolvedValue({
      data: {
        score: 2,
        total: 2,
        percentage: 100,
        passed: true,
        attempt_number: 1,
        best_score: 2,
        status: 'certified',
        competency_breakdown: [],
        strengths: [],
        weak_areas: [],
        recommended_action: 'Good work',
        submitted_at: new Date().toISOString(),
      },
    });

    render(<QuizPage />);
    await screen.findByRole('button', { name: /submit assessment/i });
    fireEvent.click(screen.getByRole('radio', { name: '6 characters' }));
    fireEvent.click(screen.getByRole('button', { name: /submit assessment/i }));

    const modalSubmitBtn = screen.getAllByRole('button', { name: /submit assessment/i })[1];
    fireEvent.click(modalSubmitBtn);

    const retakeBtn = await screen.findByRole('button', { name: /retake assessment/i });
    fireEvent.click(retakeBtn);

    expect(screen.getByText(/Question Navigator:/i)).toBeInTheDocument();
    expect(screen.getByText('2 Unanswered')).toBeInTheDocument();
  });

  it('renders adaptive question selection banner when assessment is tailored', async () => {
    mockedGet.mockImplementation((url) => {
      if (url.includes('/modules')) {
        return Promise.resolve({ data: mockModules });
      }
      return Promise.resolve({
        data: {
          questions,
          adaptive_meta: {
            is_adaptive: true,
            focus_competencies: ['Document Formatting & Standards'],
            message: 'Assessment adapted to prioritize focus on: Document Formatting & Standards',
          },
        },
      });
    });

    render(<QuizPage />);

    expect(await screen.findByText('Adaptive Question Selection Active')).toBeInTheDocument();
    expect(screen.getByText(/Assessment adapted to prioritize focus on/i)).toBeInTheDocument();
    expect(screen.getAllByText('Document Formatting & Standards').length).toBeGreaterThan(0);
  });

  it('renders View Official Certificate button on passing assessment and opens certificate modal', async () => {
    mockedPost.mockResolvedValue({
      data: {
        score: 2,
        total: 2,
        percentage: 100,
        passed: true,
        attempt_number: 1,
        best_score: 2,
        status: 'certified',
        credential_id: 'GS-CERT-2026-QUIZ9999',
        competency_breakdown: [],
        strengths: ['Document Formatting & Standards'],
        weak_areas: [],
        recommended_action: 'Mastery achieved!',
        submitted_at: '2026-08-26T12:00:00Z',
      },
    });

    render(<QuizPage />);
    await screen.findByRole('button', { name: /submit assessment/i });
    fireEvent.click(screen.getByRole('radio', { name: '6 characters' }));
    fireEvent.click(screen.getByRole('button', { name: /submit assessment/i }));

    const modalSubmitBtn = screen.getAllByRole('button', { name: /submit assessment/i })[1];
    fireEvent.click(modalSubmitBtn);

    const viewCertBtn = await screen.findByRole('button', { name: /view & print official certificate/i });
    expect(viewCertBtn).toBeInTheDocument();

    fireEvent.click(viewCertBtn);

    expect(await screen.findByText('Certificate of Digital Competency')).toBeInTheDocument();
    expect(screen.getByText('GS-CERT-2026-QUIZ9999')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /verify authenticity online/i })).toHaveAttribute(
      'href',
      '/verify/GS-CERT-2026-QUIZ9999'
    );
  });
});

