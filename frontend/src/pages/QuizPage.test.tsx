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

const mockedGet = vi.mocked(api.get);
const mockedPost = vi.mocked(api.post);

const questions = [
  {
    id: 'question-1',
    question: 'What is the minimum certificate length?',
    options: ['4 characters', '6 characters'],
  },
  {
    id: 'question-2',
    question: 'Which format is required?',
    options: ['Numeric only', 'Alphanumeric'],
  },
];

const mockModules = [
  { id: 'cybersecurity-101', title: 'Cybersecurity Basics', content: 'Cyber content' },
  { id: 'default', title: 'Digital Document Handling', content: 'Default content' },
];

describe('QuizPage', () => {
  beforeEach(() => {
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

  it('keeps submission disabled until every question is answered', async () => {
    render(<QuizPage />);

    const submitButton = await screen.findByRole('button', { name: /submit quiz/i });
    expect(submitButton).toBeDisabled();

    fireEvent.click(screen.getByRole('radio', { name: '6 characters' }));
    expect(submitButton).toBeDisabled();

    fireEvent.click(screen.getByRole('radio', { name: 'Alphanumeric' }));
    expect(submitButton).toBeEnabled();
  });

  it('submits selected answers and renders the server score', async () => {
    mockedPost.mockResolvedValue({ data: { score: 2, total: 2 } });

    render(<QuizPage />);
    await screen.findByRole('button', { name: /submit quiz/i });
    fireEvent.click(screen.getByRole('radio', { name: '6 characters' }));
    fireEvent.click(screen.getByRole('radio', { name: 'Alphanumeric' }));
    fireEvent.click(screen.getByRole('button', { name: /submit quiz/i }));

    await waitFor(() => expect(mockedPost).toHaveBeenCalledWith('/quiz/default/submit', {
      answers: [
        { question_id: 'question-1', selected_option_index: 1 },
        { question_id: 'question-2', selected_option_index: 1 },
      ],
    }));
    expect(await screen.findByText('2 / 2')).toBeInTheDocument();
    expect(screen.getByText(/100%.*Passed/)).toBeInTheDocument();
  });

  it('fetches and submits answers to a module-specific quiz endpoint', async () => {
    mockModuleId = 'cybersecurity-101';
    mockedPost.mockResolvedValue({ data: { score: 1, total: 2 } });

    render(<QuizPage />);
    await screen.findByRole('button', { name: /submit quiz/i });

    expect(mockedGet).toHaveBeenCalledWith('/quiz/cybersecurity-101');

    fireEvent.click(screen.getByRole('radio', { name: '6 characters' }));
    fireEvent.click(screen.getByRole('radio', { name: 'Alphanumeric' }));
    fireEvent.click(screen.getByRole('button', { name: /submit quiz/i }));

    await waitFor(() => expect(mockedPost).toHaveBeenCalledWith('/quiz/cybersecurity-101/submit', {
      answers: [
        { question_id: 'question-1', selected_option_index: 1 },
        { question_id: 'question-2', selected_option_index: 1 },
      ],
    }));
  });

  it('disables input controls during submission', async () => {
    let resolvePost: any;
    const postPromise = new Promise((resolve) => {
      resolvePost = resolve;
    });
    mockedPost.mockReturnValue(postPromise);

    render(<QuizPage />);
    await screen.findByRole('button', { name: /submit quiz/i });

    const option1 = screen.getByRole('radio', { name: '6 characters' });
    const option2 = screen.getByRole('radio', { name: 'Alphanumeric' });
    fireEvent.click(option1);
    fireEvent.click(option2);

    const submitButton = screen.getByRole('button', { name: /submit quiz/i });
    fireEvent.click(submitButton);

    expect(option1).toBeDisabled();
    expect(option2).toBeDisabled();

    await resolvePost({ data: { score: 2, total: 2 } });
    await screen.findByText('2 / 2');
  });
});
