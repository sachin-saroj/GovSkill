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
    content: '# Verification Checklist\nCheck every required field.',
  },
  {
    id: 'module-2',
    title: 'Government Portal Operations',
    content: '# Portal Workflow\nRoute applications for supervisor sign-off.',
  },
];

const renderPage = () =>
  render(
    <BrowserRouter>
      <ModulePage />
    </BrowserRouter>
  );

describe('ModulePage', () => {
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
            skills: [],
          },
        });
      }
      return Promise.resolve({ data: [] });
    });
  });

  it('renders the first module and its lesson content', async () => {
    renderPage();

    expect(await screen.findByRole('heading', { name: 'Digital Document Handling' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Verification Checklist' })).toBeInTheDocument();
    expect(screen.getByText('Check every required field.')).toBeInTheDocument();
  });

  it('switches the displayed module from the selector', async () => {
    renderPage();
    await screen.findByRole('heading', { name: 'Digital Document Handling' });

    fireEvent.change(screen.getByLabelText('Switch Training Module:'), {
      target: { value: 'module-2' },
    });

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Government Portal Operations' })).toBeInTheDocument());
    expect(screen.getByRole('heading', { name: 'Portal Workflow' })).toBeInTheDocument();
  });

  it('marks lessons completed for the active module', async () => {
    mockedPost.mockResolvedValue({ data: {} });

    renderPage();
    await screen.findByRole('heading', { name: 'Digital Document Handling' });

    const markBtn = screen.getByRole('button', { name: /mark lessons as completed/i });
    fireEvent.click(markBtn);

    await waitFor(() =>
      expect(mockedPost).toHaveBeenCalledWith('/progress/modules/module-1/complete-lessons')
    );
    expect(await screen.findByText('Lesson progress recorded! Competency status updated.')).toBeInTheDocument();
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