import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import QuizPage from './QuizPage';
import api from '@/lib/api';

const navigate = vi.fn();

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigate,
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

describe('QuizPage', () => {
  beforeEach(() => {
    mockedGet.mockReset();
    mockedPost.mockReset();
    navigate.mockReset();
    mockedGet.mockResolvedValue({ data: { questions } });
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
    expect(screen.getByText('100% — Passed')).toBeInTheDocument();
  });
});