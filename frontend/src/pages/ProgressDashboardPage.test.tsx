import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
const mockedPost = vi.mocked(api.post);

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

const renderPage = () =>
  render(
    <BrowserRouter>
      <ProgressDashboardPage />
    </BrowserRouter>
  );

describe('ProgressDashboardPage', () => {
  beforeEach(() => {
    mockedGet.mockReset();
    mockedPost.mockReset();
    mockedGet.mockResolvedValue({ data: mockSkillsData });
  });

  it('shows a loading spinner while fetching skill data', () => {
    // Never resolve — keeps the component in loading state
    mockedGet.mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByText(/loading your digital skill profile/i)).toBeInTheDocument();
  });

  it('shows an error message when the API call fails', async () => {
    mockedGet.mockRejectedValue({
      isAxiosError: true,
      response: {
        data: { detail: { error: { message: 'Skill data unavailable' } } },
      },
    });
    renderPage();
    expect(await screen.findByText('Skill data unavailable')).toBeInTheDocument();
  });

  it('renders skill progress cards and verifies module-specific quiz links', async () => {
    renderPage();

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

  it('calls the lesson-complete endpoint and refreshes data when toggle button is clicked', async () => {
    // Second GET returns updated state: records-202 is now completed
    const updatedData = {
      ...mockSkillsData,
      skills: mockSkillsData.skills.map((s) =>
        s.module_id === 'records-202'
          ? { ...s, lessons_completed: true, status: 'in_progress' }
          : s
      ),
    };
    mockedGet
      .mockResolvedValueOnce({ data: mockSkillsData })
      .mockResolvedValueOnce({ data: updatedData });
    mockedPost.mockResolvedValue({});

    renderPage();
    await screen.findByText('My Skill Progress');

    // Initial state: Cybersecurity Basics already shows "Completed",
    // Digital Record Management shows "Mark as Read"
    const markReadButtons = screen.getAllByRole('button', { name: /mark as read/i });
    expect(markReadButtons).toHaveLength(1);

    fireEvent.click(markReadButtons[0]);

    // POST to the correct endpoint
    await waitFor(() =>
      expect(mockedPost).toHaveBeenCalledWith('/progress/modules/records-202/complete-lessons')
    );

    // After refresh (second GET), both modules now have lessons_completed=true,
    // so there should be 2 "Completed" buttons and 0 "Mark as Read" buttons
    await waitFor(() => {
      const completedButtons = screen.getAllByRole('button', { name: /completed/i });
      expect(completedButtons).toHaveLength(2);
    });
    expect(screen.queryAllByRole('button', { name: /mark as read/i })).toHaveLength(0);
  });
});
