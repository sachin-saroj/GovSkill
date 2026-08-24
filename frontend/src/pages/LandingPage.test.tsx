import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LandingPage from './LandingPage';
import { useAuth } from '@/hooks/useAuth';

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);

const renderLanding = () =>
  render(
    <BrowserRouter>
      <LandingPage />
    </BrowserRouter>
  );

describe('LandingPage', () => {
  beforeEach(() => {
    mockedUseAuth.mockReturnValue({
      user: null,
      token: null,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });
  });

  it('renders national DPI badge, main headline, and key trust pillars', () => {
    renderLanding();

    expect(
      screen.getByText(/National Digital Public Infrastructure • Local Governance Platform/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Precision Digital Skills &/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Citizen Document Verification/i)
    ).toBeInTheDocument();

    expect(screen.getAllByText(/100% Deterministic Rules/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Grounded Gemini AI Tutor/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Server-Scored Quiz Scoring/i).length).toBeGreaterThanOrEqual(1);
  });

  it('shows sign-in link when user is not logged in', () => {
    renderLanding();
    expect(screen.getByRole('button', { name: /Officer & Supervisor Login/i })).toBeInTheDocument();
  });

  it('shows officer workspace button when user is logged in as employee', () => {
    mockedUseAuth.mockReturnValue({
      user: { id: '1', email: 'employee@govskill.test', role: 'employee' },
      token: 'test-token',
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderLanding();
    expect(screen.getByRole('button', { name: /Go to Officer Workspace/i })).toBeInTheDocument();
  });

  it('renders interactive architecture diagram and switches active node on click', async () => {
    renderLanding();

    // Verify initial active node is deterministic rule engine
    expect(screen.getAllByText(/100% Code-Driven Validation Protocol/i).length).toBeGreaterThanOrEqual(1);

    // Click on Citizen Pre-Check node
    const citizenNodeBtn = screen.getByRole('button', {
      name: /Inspect Citizen Document Pre-Check architecture node/i,
    });
    fireEvent.click(citizenNodeBtn);

    // Verify details updated for citizen pre-check
    expect(
      await screen.findByText(/Self-Service Pre-Submission OCR Extraction/i)
    ).toBeInTheDocument();
  });

  it('toggles interactive tour play/pause state', () => {
    renderLanding();

    const tourBtn = screen.getByRole('button', { name: /Play architecture tour/i });
    expect(tourBtn).toBeInTheDocument();

    fireEvent.click(tourBtn);
    expect(screen.getByRole('button', { name: /Pause architecture tour/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Pause architecture tour/i }));
    expect(screen.getByRole('button', { name: /Play architecture tour/i })).toBeInTheDocument();
  });

  it('renders GovSkill and GovAssist 3D tilt cards with feature breakdowns', () => {
    renderLanding();

    expect(screen.getByText(/Employee Competency & Training Platform/i)).toBeInTheDocument();
    expect(screen.getByText(/Citizen Pre-Submission Document Checker/i)).toBeInTheDocument();
    expect(screen.getByText(/4-Rule Deterministic Evaluation/i)).toBeInTheDocument();
    expect(screen.getByText(/Structured Administrative Modules/i)).toBeInTheDocument();
  });

  it('renders the 4-step workflow journey', () => {
    renderLanding();

    expect(screen.getByText('Citizen Pre-Checks')).toBeInTheDocument();
    expect(screen.getByText('Officer Curriculum')).toBeInTheDocument();
    expect(screen.getByText('Certified Assessment')).toBeInTheDocument();
    expect(screen.getByText('Supervisor Oversight')).toBeInTheDocument();
  });
});
