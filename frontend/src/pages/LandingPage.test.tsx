import { render, screen } from '@testing-library/react';
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

describe('Editorial LandingPage Rebuild', () => {
  beforeEach(() => {
    mockedUseAuth.mockReturnValue({
      user: null,
      token: null,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });
  });

  it('renders editorial hero with display serif headline and single primary CTA', () => {
    renderLanding();

    expect(screen.getByText(/Civil Competency Platform/i)).toBeInTheDocument();
    expect(screen.getByText(/Public service,/i)).toBeInTheDocument();
    expect(screen.getByText(/mastered/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Explore the Curriculum/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Pre-check a citizen document/i })).toBeInTheDocument();
  });

  it('renders the partner trust marquee with statutory frameworks', () => {
    renderLanding();

    expect(screen.getByText(/Statutory Frameworks & Institutional Standards/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Department of Revenue & Land Records/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Kerala State IT Mission/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders the single dark rounded stage anchor section', () => {
    renderLanding();

    expect(screen.getByText(/Institutional Command/i)).toBeInTheDocument();
    expect(screen.getByText(/An administrative interface shaped for/i)).toBeInTheDocument();
    expect(screen.getByText(/unwavering/i)).toBeInTheDocument();
    expect(screen.getByText(/Officer Training View/i)).toBeInTheDocument();
  });

  it('renders the 5/7 asymmetric comparison section', () => {
    renderLanding();

    expect(screen.getByText(/The Traditional Process/i)).toBeInTheDocument();
    expect(screen.getByText(/The GovSkill Standard/i)).toBeInTheDocument();
    expect(screen.getByText(/Surprise Rejections/i)).toBeInTheDocument();
  });

  it('renders the core statement section with plate illustration', () => {
    renderLanding();

    expect(screen.getByText(/Institutional Purpose/i)).toBeInTheDocument();
    expect(screen.getAllByText(/GovSkill is crafted for the dedicated officers who/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/serve/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/the public./i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders the competency tag cloud', () => {
    renderLanding();

    expect(screen.getByText(/Competency Domains/i)).toBeInTheDocument();
    expect(screen.getByText('Income Certificate Verification')).toBeInTheDocument();
    expect(screen.getByText('Temporal Validity Horizons')).toBeInTheDocument();
    expect(screen.getByText('Statutory Counter Slips')).toBeInTheDocument();
  });

  it('renders asymmetric Feature A and Feature B sections', () => {
    renderLanding();

    expect(screen.getByText(/Citizen Pre-Submission Validation/i)).toBeInTheDocument();
    expect(screen.getByText(/Officer Competency Academy/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Launch the Pre-Check Tool/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View Administrative Curriculum/i })).toBeInTheDocument();
  });

  it('renders field dispatches testimonials and the dark green metric strip', () => {
    renderLanding();

    expect(screen.getByText(/Field Dispatches/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Voices from the/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/field./i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Deterministic Rule Processing/i)).toBeInTheDocument();
    expect(screen.getByText(/Passing Standard for Certification/i)).toBeInTheDocument();
  });

  it('renders final CTA and editorial footer with huge wordmark', () => {
    renderLanding();

    expect(screen.getAllByText(/Serve/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/better./i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: /Begin Document Pre-Check/i })).toBeInTheDocument();
    expect(screen.getByText(/DPDP Act 2023 Compliant • Statutory Data Safeguards/i)).toBeInTheDocument();
  });
});
