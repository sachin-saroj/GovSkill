import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ModulePage from './ModulePage';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock('react-router-dom', () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => <a href={to}>{children}</a>,
}));

const mockedGet = vi.mocked(api.get);

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

describe('ModulePage', () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it('renders the first module and its lesson content', async () => {
    mockedGet.mockResolvedValue({ data: modules });

    render(<ModulePage />);

    expect(await screen.findByRole('heading', { name: 'Digital Document Handling' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Verification Checklist' })).toBeInTheDocument();
    expect(screen.getByText('Check every required field.')).toBeInTheDocument();
  });

  it('switches the displayed module from the selector', async () => {
    mockedGet.mockResolvedValue({ data: modules });

    render(<ModulePage />);
    await screen.findByRole('heading', { name: 'Digital Document Handling' });

    fireEvent.change(screen.getByLabelText('Switch Training Module:'), {
      target: { value: 'module-2' },
    });

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Government Portal Operations' })).toBeInTheDocument());
    expect(screen.getByRole('heading', { name: 'Portal Workflow' })).toBeInTheDocument();
  });

  it('shows an empty state when no modules are returned', async () => {
    mockedGet.mockResolvedValue({ data: [] });

    render(<ModulePage />);

    expect(await screen.findByRole('heading', { name: 'No training modules available' })).toBeInTheDocument();
  });
});