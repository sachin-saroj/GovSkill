import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProgressDashboardPage from './ProgressDashboardPage';
import api from '@/lib/api';
import { EmployeeSkillStatusResponse } from '@/types';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
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

const mockCompetencyData: EmployeeSkillStatusResponse = {
  overall_skill_score: 50,
  total_modules: 2,
  certified_modules: 1,
  summary: {
    overall_score: 50,
    modules_completed: 1,
    certified_modules: 1,
    total_modules: 2,
    modules_remaining: 1,
    learning_status: 'In Progress',
    readiness_level: 'Substantial Readiness',
  },
  recommended_action: {
    action_type: 'take_quiz',
    module_id: 'records-202',
    module_title: 'Digital Record Management',
    title: 'Take Assessment: Digital Record Management',
    description: "You've completed the lesson guidelines. Take the scored assessment to verify your competency.",
    priority: 'high',
    link: '/quiz/records-202',
  },
  skill_gaps: [
    {
      module_id: 'records-202',
      skill: 'Digital Record Management',
      proficiency: 'Developing',
      current_score_pct: 0,
      target_threshold: 75,
      gap_percentage: 75,
      competency: 'Record Archival & Retention Standards',
      target_section_index: 1,
      target_section_title: 'Lesson 2: Record Retention & Destruction Policy',
      deep_link: '/module?id=records-202&section=1',
      tutor_prompt: 'Explain record archival standards.',
      evidence: 'Lesson curriculum completed, but mandatory certification assessment has not been attempted.',
      recommended_action: 'Take the module assessment to demonstrate digital competency.',
    },
  ],
  skills: [
    {
      module_id: 'cybersecurity-101',
      module_title: 'Cybersecurity Basics',
      lessons_completed: true,
      best_score: 4,
      total_questions: 5,
      score_percentage: 80,
      status: 'certified',
      proficiency: 'Strong',
      attempts_count: 1,
      last_activity_at: '2026-08-20T10:00:00Z',
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
      proficiency: 'Not Started',
      attempts_count: 0,
      last_activity_at: 'No activity',
      updated_at: '2026-08-20',
    },
  ],
  competency_mastery: [
    {
      competency: 'Record Archival & Retention Standards',
      module_id: 'records-202',
      module_title: 'Digital Record Management',
      mastery_score: 80,
      mastery_level: 'Mastered',
      attempts_evaluated: 1,
      recent_trend: 'Improving',
      target_section_index: 1,
      target_section_title: 'Lesson 2: Record Retention & Destruction Policy',
      deep_link: '/module?id=records-202&section=1',
      tutor_prompt: 'Explain record archival standards.',
    },
  ],
  assessment_history: [
    {
      attempt_id: 'att-1',
      module_id: 'cybersecurity-101',
      module_title: 'Cybersecurity Basics',
      score: 4,
      total: 5,
      score_percentage: 80,
      attempt_number: 1,
      passed: true,
      submitted_at: '2026-08-20T10:00:00Z',
    },
  ],
  recent_activity: [
    {
      activity_type: 'certification',
      title: 'Certification Standard Achieved',
      module_title: 'Cybersecurity Basics',
      timestamp: '2026-08-20T10:00:00Z',
      detail: 'Scored 80% (4/5) on assessment.',
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
    window.history.pushState({}, '', '/');
    mockedGet.mockReset();
    mockedPost.mockReset();
    mockedGet.mockImplementation((url: string) => {
      if (url === '/progress/my-skills') {
        return Promise.resolve({ data: mockCompetencyData });
      }
      if (url === '/credentials/my-credentials') {
        return Promise.resolve({ data: { credentials: [], total_count: 0 } });
      }
      return Promise.resolve({ data: mockCompetencyData });
    });
  });

  it('shows a loading spinner while fetching skill data', () => {
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

  it('renders complete Competency Dashboard with overview, recommendations, skill cards, gaps, history, and activity', async () => {
    renderPage();

    // 1. Overview & Hero
    expect(await screen.findByText('My Skill Progress & Credentials')).toBeInTheDocument();
    expect(screen.getAllByText(/Substantial Readiness/i).length).toBeGreaterThan(0);
    expect(screen.getByText('50%')).toBeInTheDocument();

    // 2. Recommended Next Action
    expect(screen.getByText('Take Assessment: Digital Record Management')).toBeInTheDocument();

    // 3. Skill Gaps Card with Targeted Remediation Actions
    expect(screen.getByText('Identified Skill Gaps & Action Items')).toBeInTheDocument();
    expect(screen.getByText(/mandatory certification assessment has not been attempted/i)).toBeInTheDocument();
    expect(screen.getAllByText('Record Archival & Retention Standards').length).toBeGreaterThan(0);
    expect(screen.getByText('Ask AI Tutor')).toBeInTheDocument();
    expect(screen.getAllByText('Review Section').length).toBeGreaterThan(0);

    // 4. Competency Mastery Breakdown (Phase 3)
    expect(screen.getByText('Competency Mastery Breakdown')).toBeInTheDocument();
    expect(screen.getByText('Practice in Copilot')).toBeInTheDocument();

    // 5. Core Skill Cards
    expect(screen.getAllByText('Cybersecurity Basics').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Digital Record Management').length).toBeGreaterThan(0);

    // 6. Assessment History Table
    expect(screen.getByText('Assessment Attempt History')).toBeInTheDocument();
    expect(screen.getByText(/Passed/i)).toBeInTheDocument();

    // 7. Recent Learning Activity
    expect(screen.getByText('Learning & Assessment Audit Trail')).toBeInTheDocument();
    expect(screen.getByText('Certification Standard Achieved')).toBeInTheDocument();

    // 7. Calculation Explainer Modal
    const explainerBtn = screen.getByRole('button', { name: /how is this calculated/i });
    expect(explainerBtn).toBeInTheDocument();
    fireEvent.click(explainerBtn);
    expect(await screen.findByText('Competency Scoring Standards')).toBeInTheDocument();
    expect(screen.getByText(/Certification Threshold: 75%/i)).toBeInTheDocument();

    const closeExplainer = screen.getByRole('button', { name: /close explainer/i });
    fireEvent.click(closeExplainer);

    // 8. Certificate modal interaction
    const certButton = screen.getByRole('button', { name: /certificate/i });
    expect(certButton).toBeInTheDocument();
    fireEvent.click(certButton);

    expect(await screen.findByText('Certificate of Digital Competency')).toBeInTheDocument();
    expect(screen.getByText('employee@govskill.test')).toBeInTheDocument();
  });

  it('renders empty state when no modules are assigned', async () => {
    mockedGet.mockResolvedValueOnce({
      data: {
        ...mockCompetencyData,
        skills: [],
        total_modules: 0,
        certified_modules: 0,
      },
    });

    renderPage();
    expect(await screen.findByText('No Skill Modules Assigned')).toBeInTheDocument();
  });

  it('calls the lesson-complete endpoint and refreshes data when toggle button is clicked', async () => {
    let callCount = 0;
    const updatedData = {
      ...mockCompetencyData,
      skills: mockCompetencyData.skills.map((s) =>
        s.module_id === 'records-202'
          ? { ...s, lessons_completed: true, status: 'in_progress' as const }
          : s
      ),
    };
    mockedGet.mockImplementation((url: string) => {
      if (url === '/progress/my-skills') {
        callCount++;
        return Promise.resolve({ data: callCount === 1 ? mockCompetencyData : updatedData });
      }
      if (url === '/credentials/my-credentials') {
        return Promise.resolve({ data: { credentials: [], total_count: 0 } });
      }
      return Promise.resolve({ data: {} });
    });
    mockedPost.mockResolvedValue({});

    renderPage();
    await screen.findByText('My Skill Progress & Credentials');

    const markReadButtons = screen.getAllByRole('button', { name: /mark as read/i });
    expect(markReadButtons).toHaveLength(1);

    fireEvent.click(markReadButtons[0]);

    await waitFor(() =>
      expect(mockedPost).toHaveBeenCalledWith('/progress/modules/records-202/complete-lessons')
    );

    await waitFor(() => {
      const completedButtons = screen.getAllByRole('button', { name: /completed/i });
      expect(completedButtons).toHaveLength(2);
    });
    expect(screen.queryAllByRole('button', { name: /mark as read/i })).toHaveLength(0);
  });
});
