import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ModulePage from './ModulePage';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockedGet = vi.mocked(api.get);
const mockedPost = vi.mocked(api.post);

const modules = [
  {
    id: 'module-1',
    title: 'Digital Document Handling',
    content: `# Lesson 1: Introduction to Handling\nCitizen applications require thorough verification.\n# Lesson 2: Verification Checklist\nCheck mandatory fields and 6-char numbers.\n# Lesson 3: Common Data Entry Errors\nAvoid misspelled names and expired dates.`,
  },
  {
    id: 'module-2',
    title: 'Government Portal Operations',
    content: `# Lesson 1: Portal Workflow\nRoute applications for supervisor sign-off.`,
  },
];

const renderPage = () =>
  render(
    <BrowserRouter>
      <ModulePage />
    </BrowserRouter>
  );

describe('ModulePage & Lesson Experience', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
    mockedGet.mockReset();
    mockedPost.mockReset();
    mockedGet.mockImplementation((url) => {
      if (url.includes('/modules')) {
        return Promise.resolve({ data: modules });
      }
      if (url.includes('/progress/my-skills')) {
        return Promise.resolve({
          data: {
            overall_skill_score: 0,
            total_modules: 2,
            certified_modules: 0,
            skills: [
              {
                module_id: 'module-1',
                module_title: 'Digital Document Handling',
                lessons_completed: false,
                best_score: 0,
                total_questions: 4,
                score_percentage: 0,
                status: 'in_progress',
                updated_at: '2026-08-23T10:00:00Z',
                last_accessed_section: 0,
              },
            ],
          },
        });
      }
      return Promise.resolve({ data: [] });
    });
  });

  it('renders the module with learning objectives, reading time, and section tabs', async () => {
    renderPage();

    expect(await screen.findByRole('heading', { name: 'Digital Document Handling' })).toBeInTheDocument();
    expect(screen.getByText(/Operational Learning Objective/i)).toBeInTheDocument();
    expect(screen.getByText(/min read/i)).toBeInTheDocument();
    expect(screen.getByText(/Section 1 of 3/i)).toBeInTheDocument();
    expect(screen.getByText('Citizen applications require thorough verification.')).toBeInTheDocument();
    expect(screen.getByText(/Workplace Scenario & Operational Impact/i)).toBeInTheDocument();
    expect(screen.getByText(/Common Mistakes & Red Flags to Avoid/i)).toBeInTheDocument();
    expect(screen.getByText(/Quick Understanding Check/i)).toBeInTheDocument();
  });

  it('navigates sequentially to the next section and persists section access', async () => {
    mockedPost.mockResolvedValue({ data: {} });
    renderPage();
    await screen.findByRole('heading', { name: 'Digital Document Handling' });

    const nextBtn = screen.getByRole('button', { name: /next section/i });
    fireEvent.click(nextBtn);

    await waitFor(() => {
      expect(screen.getByText(/Section 2 of 3/i)).toBeInTheDocument();
      expect(screen.getByText(/Check mandatory fields and 6-char numbers/i)).toBeInTheDocument();
    });

    expect(mockedPost).toHaveBeenCalledWith('/progress/modules/module-1/access-section', {
      section_index: 1,
    });
  });

  it('allows interactive self-check understanding checks', async () => {
    renderPage();
    await screen.findByRole('heading', { name: 'Digital Document Handling' });

    const optionBtn = screen.getAllByRole('button', { name: /Mandatory fields/i })[0];
    expect(optionBtn).toBeInTheDocument();

    fireEvent.click(optionBtn);

    expect(await screen.findByText(/Correct Understanding/i)).toBeInTheDocument();
  });

  it('resumes from saved last_accessed_section when loaded from server', async () => {
    mockedGet.mockImplementation((url) => {
      if (url.includes('/modules')) return Promise.resolve({ data: modules });
      if (url.includes('/progress/my-skills')) {
        return Promise.resolve({
          data: {
            overall_skill_score: 0,
            total_modules: 2,
            certified_modules: 0,
            skills: [
              {
                module_id: 'module-1',
                module_title: 'Digital Document Handling',
                lessons_completed: false,
                best_score: 0,
                total_questions: 4,
                score_percentage: 0,
                status: 'in_progress',
                updated_at: '2026-08-23T10:00:00Z',
                last_accessed_section: 2, // Saved at Section 3 (index 2)
              },
            ],
          },
        });
      }
      return Promise.resolve({ data: [] });
    });

    renderPage();
    await screen.findByRole('heading', { name: 'Digital Document Handling' });

    await waitFor(() => {
      expect(screen.getByText(/Section 3 of 3/i)).toBeInTheDocument();
      expect(screen.getByText(/Avoid misspelled names and expired dates/i)).toBeInTheDocument();
    });
  });

  it('marks lessons completed and reveals the scored quiz next step', async () => {
    mockedPost.mockResolvedValue({
      data: {
        module_id: 'module-1',
        module_title: 'Digital Document Handling',
        lessons_completed: true,
        best_score: 0,
        total_questions: 4,
        score_percentage: 0,
        status: 'in_progress',
        updated_at: '2026-08-23T10:00:00Z',
        completed_at: '2026-08-23T10:05:00Z',
      },
    });

    renderPage();
    await screen.findByRole('heading', { name: 'Digital Document Handling' });

    const markBtn = screen.getByRole('button', { name: /mark all lessons completed/i });
    fireEvent.click(markBtn);

    await waitFor(() =>
      expect(mockedPost).toHaveBeenCalledWith('/progress/modules/module-1/complete-lessons')
    );
    expect(await screen.findByText('Lesson progress recorded! Competency status updated.')).toBeInTheDocument();
    expect(await screen.findByText(/Next Step: Validate Your Competency/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /take scored quiz/i })).toBeInTheDocument();
  });

  it('shows an empty state when no modules are returned', async () => {
    mockedGet.mockImplementation((url) => {
      if (url.includes('/modules')) return Promise.resolve({ data: [] });
      return Promise.resolve({ data: {} });
    });

    renderPage();

    expect(await screen.findByRole('heading', { name: 'No training modules available' })).toBeInTheDocument();
  });
});