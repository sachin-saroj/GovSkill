import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
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
  it('renders sidebar navigation, brand wordmark, and top utility header with search', () => {
    render(
      <BrowserRouter>
        <DashboardLayout>
          <div>Main Dashboard Content</div>
        </DashboardLayout>
      </BrowserRouter>
    );

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
});
