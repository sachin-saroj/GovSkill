import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProgressDashboardPage from './ProgressDashboardPage';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockedGet = vi.mocked(api.get);

const mockSkillsData = {
  overall_skill_score: 50,
  total_modules: 2,
  certified_modules: 1,
  skills: [
    {
      module_id: 'cybersecurity-101',
      module_title: 'Cybersecurity Basics',
      lessons_completed: true,
      best_score: 4,
      total_questions: 5,
      score_percentage: 80,
      status: 'certified',
      updated_at: '2026-08-20',
    },
    {
      module_id: 'records-202',
      module_title: 'Digital Record Management',
      lessons_completed: false,
      best_score: 0,
      total_questions: 5,
      score_percentage: 0,
      status: 'not_started',
      updated_at: '2026-08-20',
    },
  ],
};

describe('ProgressDashboardPage', () => {
  beforeEach(() => {
    mockedGet.mockReset();
    mockedGet.mockResolvedValue({ data: mockSkillsData });
  });

  it('renders skill progress cards and verifies module-specific quiz links', async () => {
    render(
      <BrowserRouter>
        <ProgressDashboardPage />
      </BrowserRouter>
    );

    // Wait for the data to load
    await screen.findByText('My Skill Progress');

    // Verify module titles are displayed
    expect(screen.getByText('Cybersecurity Basics')).toBeInTheDocument();
    expect(screen.getByText('Digital Record Management')).toBeInTheDocument();

    // Verify "Take Quiz" links have correct module-specific URLs
    const takeQuizLinks = screen.getAllByRole('link', { name: /take quiz/i });
    expect(takeQuizLinks).toHaveLength(2);

    expect(takeQuizLinks[0]).toHaveAttribute('href', '/quiz/cybersecurity-101');
    expect(takeQuizLinks[1]).toHaveAttribute('href', '/quiz/records-202');
  });
});
