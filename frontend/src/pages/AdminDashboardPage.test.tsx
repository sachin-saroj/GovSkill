import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AdminDashboardPage from './AdminDashboardPage';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockedGet = vi.mocked(api.get);

const mockModules = [
  { id: 'module-1', title: 'Cybersecurity Basics', content: 'Cyber content' },
  { id: 'module-2', title: 'Portal Operations', content: 'Operations content' },
];

const mockAttempts = [
  {
    user_email: 'employee@govskill.test',
    module_title: 'Cybersecurity Basics',
    score: 4,
    total: 5,
    submitted_at: '2026-08-20T10:00:00Z',
  },
];

const mockSkillsOverview = {
  total_employees: 12,
  total_certifications: 8,
  overall_certification_rate: 67,
};

describe('AdminDashboardPage', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
    mockedGet.mockReset();
    mockedGet.mockImplementation((url) => {
      if (url.includes('/admin/attempts')) {
        return Promise.resolve({ data: mockAttempts });
      }
      if (url.includes('/modules')) {
        return Promise.resolve({ data: mockModules });
      }
      if (url.includes('/progress/admin/skills-overview')) {
        return Promise.resolve({ data: mockSkillsOverview });
      }
      return Promise.resolve({ data: [] });
    });
  });

  it('loads attempts, modules, and skills overview on mount and supports switching tabs', async () => {
    render(<AdminDashboardPage />);

    // Loader is visible initially
    expect(screen.getByText(/loading attempt logs/i)).toBeInTheDocument();

    // Wait for attempts to load and verify rendering
    await screen.findByText('employee@govskill.test');
    expect(screen.getByText('Cybersecurity Basics')).toBeInTheDocument();
    expect(screen.getByText('4 / 5')).toBeInTheDocument();

    // Verify skills overview stats render
    expect(await screen.findByText('12')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('67%')).toBeInTheDocument();

    // Verify API fetches happened
    expect(mockedGet).toHaveBeenCalledWith('/modules');
    expect(mockedGet).toHaveBeenCalledWith('/progress/admin/skills-overview');

    // Switch to Module CMS Tab
    const cmsTabButton = screen.getByRole('button', { name: /module cms/i });
    fireEvent.click(cmsTabButton);

    // Verify modules render in tab 2 and wait for state updates to settle
    await screen.findByText('Training Modules Management');
    expect(screen.getByText('Portal Operations')).toBeInTheDocument();
  });
});
