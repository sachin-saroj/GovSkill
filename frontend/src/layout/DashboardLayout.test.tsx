import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import DashboardLayout from '@/layout/DashboardLayout';

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'user-1', email: 'officer@govskill.test', role: 'employee' },
    token: 'test-token',
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

describe('DashboardLayout & Navigation Shell', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders sidebar navigation, brand wordmark, and top utility header with search', () => {
    render(
      <BrowserRouter>
        <DashboardLayout>
          <div>Main Dashboard Content</div>
        </DashboardLayout>
      </BrowserRouter>
    );

    // Skip link
    expect(screen.getByText('Skip to main content')).toBeInTheDocument();

    // Sidebar branding & navigation
    expect(screen.getAllByText('GovSkill').length).toBeGreaterThan(0);
    expect(screen.getAllByText('My Skills').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Training Modules').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Training Copilot').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Scored Quiz').length).toBeGreaterThan(0);
    expect(screen.getAllByText('GovAssist Pre-Check').length).toBeGreaterThan(0);

    // Top Header & user controls
    expect(screen.getByRole('button', { name: /search modules, skills, and tools/i })).toBeInTheDocument();
    expect(screen.getByText('Services Operational')).toBeInTheDocument();
    expect(screen.getByText('Main Dashboard Content')).toBeInTheDocument();

    // Admin-only route is hidden for employee role
    expect(screen.queryByText('Workforce Admin')).not.toBeInTheDocument();
  });

  it('opens and closes quick search overlay on button click or Escape key', () => {
    render(
      <BrowserRouter>
        <DashboardLayout>
          <div>Content</div>
        </DashboardLayout>
      </BrowserRouter>
    );

    const searchButton = screen.getByRole('button', { name: /search modules, skills, and tools/i });
    fireEvent.click(searchButton);

    expect(screen.getByText('Select item to navigate')).toBeInTheDocument();

    // Escape closes modal
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByText('Select item to navigate')).not.toBeInTheDocument();
  });

  it('toggles sidebar collapse state and updates localStorage', () => {
    render(
      <BrowserRouter>
        <DashboardLayout>
          <div>Content</div>
        </DashboardLayout>
      </BrowserRouter>
    );

    const collapseButton = screen.getByRole('button', { name: /collapse navigation sidebar/i });
    expect(collapseButton).toBeInTheDocument();

    // Collapse
    fireEvent.click(collapseButton);
    expect(localStorage.getItem('govskill_sidebar_collapsed')).toBe('true');

    // Expand
    const expandButton = screen.getByRole('button', { name: /expand navigation sidebar/i });
    expect(expandButton).toBeInTheDocument();
    fireEvent.click(expandButton);
    expect(localStorage.getItem('govskill_sidebar_collapsed')).toBe('false');
  });

  it('opens mobile drawer on menu toggle and closes on Escape', () => {
    render(
      <BrowserRouter>
        <DashboardLayout>
          <div>Content</div>
        </DashboardLayout>
      </BrowserRouter>
    );

    const menuButton = screen.getByRole('button', { name: /open navigation menu/i });
    fireEvent.click(menuButton);

    expect(screen.getByRole('dialog', { name: /navigation drawer/i })).toBeInTheDocument();

    // Press Escape to close
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: /navigation drawer/i })).not.toBeInTheDocument();
  });
});
