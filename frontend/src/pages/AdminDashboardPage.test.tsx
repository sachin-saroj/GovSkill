import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AdminDashboardPage from './AdminDashboardPage';
import api from '@/lib/api';
import {
  AdminSkillOverviewResponse,
  CitizenTelemetryResponse,
  ComplianceReportResponse,
} from '@/types';

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

const mockSkillsOverview: AdminSkillOverviewResponse = {
  total_employees: 12,
  total_certifications: 8,
  overall_certification_rate: 67,
  total_modules: 4,
  total_quiz_attempts: 25,
  average_quiz_score_pct: 88,
};

const mockComplianceReport: ComplianceReportResponse = {
  generated_at: '2026-08-26T10:00:00Z',
  total_records: 2,
  total_certified_count: 1,
  compliance_rate_pct: 50.0,
  records: [
    {
      employee_email: 'officer1@govskill.test',
      department: 'Municipal Operations',
      module_title: 'Cybersecurity Basics',
      progress_status: 'completed',
      best_score: 4,
      total_score: 4,
      percentage: 100,
      certified: true,
      credential_id: 'GS-CERT-2026-ABCD1234',
      certified_date: '2026-08-25T12:00:00Z',
    },
    {
      employee_email: 'officer2@govskill.test',
      department: 'Municipal Operations',
      module_title: 'Portal Operations',
      progress_status: 'in_progress',
      best_score: 2,
      total_score: 4,
      percentage: 50,
      certified: false,
      credential_id: null,
      certified_date: null,
    },
  ],
};

const mockCitizenTelemetry: CitizenTelemetryResponse = {
  total_submissions: 10,
  passed_count: 8,
  action_required_count: 2,
  pass_rate_pct: 80.0,
  defects_by_rule: [
    {
      rule_name: 'Name present',
      field: 'name',
      failure_count: 1,
      failure_rate_pct: 10.0,
      severity: 'critical',
    },
    {
      rule_name: 'Certificate number format',
      field: 'certificate_number',
      failure_count: 1,
      failure_rate_pct: 10.0,
      severity: 'critical',
    },
    {
      rule_name: 'Certificate not expired',
      field: 'expiry_date',
      failure_count: 0,
      failure_rate_pct: 0.0,
      severity: 'critical',
    },
    {
      rule_name: 'All required fields extracted',
      field: 'document',
      failure_count: 0,
      failure_rate_pct: 0.0,
      severity: 'critical',
    },
  ],
  recent_inspections: [
    {
      document_id: '123e4567-e89b-12d3-a456-426614174000',
      uploaded_at: '2026-08-25T14:00:00Z',
      overall_status: 'PASSED',
      failed_rules: [],
      extracted_name: 'Ramesh Sharma',
    },
    {
      document_id: '987e6543-e89b-12d3-a456-426614174999',
      uploaded_at: '2026-08-25T14:30:00Z',
      overall_status: 'ACTION_REQUIRED',
      failed_rules: ['Name present'],
      extracted_name: null,
    },
  ],
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
      if (url.includes('/admin/reports/export?format=json')) {
        return Promise.resolve({ data: mockComplianceReport });
      }
      if (url.includes('/admin/governance/citizen-telemetry')) {
        return Promise.resolve({ data: mockCitizenTelemetry });
      }
      return Promise.resolve({ data: [] });
    });
  });

  it('loads attempts, modules, and skills overview on mount and supports switching tabs', async () => {
    render(
      <BrowserRouter>
        <AdminDashboardPage />
      </BrowserRouter>
    );

    // Loader is visible initially
    expect(screen.getByText(/loading attempt logs/i)).toBeInTheDocument();

    // Wait for attempts to load and verify rendering
    await screen.findByText('employee@govskill.test');
    expect(screen.getByText('Cybersecurity Basics')).toBeInTheDocument();
    expect(screen.getByText('4 / 5')).toBeInTheDocument();

    // Verify skills overview stats render
    expect(await screen.findByText('12')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('88%')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('67%')).toBeInTheDocument();

    // Verify API fetches happened
    expect(mockedGet).toHaveBeenCalledWith('/modules');
    expect(mockedGet).toHaveBeenCalledWith('/progress/admin/skills-overview');

    // Switch to Module CMS Tab
    const cmsTabButton = screen.getByRole('button', { name: /module cms/i });
    fireEvent.click(cmsTabButton);

    // Verify modules render in tab 2
    await screen.findByText('Training Modules Management');
    expect(screen.getByText('Portal Operations')).toBeInTheDocument();
  });

  it('renders governance tab with workforce compliance metrics, ledger, and citizen defect telemetry', async () => {
    render(
      <BrowserRouter>
        <AdminDashboardPage />
      </BrowserRouter>
    );

    // Switch to Governance Tab
    const govTabButton = screen.getByRole('button', { name: /workforce governance & telemetry/i });
    fireEvent.click(govTabButton);

    // Verify Workforce Compliance section renders
    expect(await screen.findByText('Workforce Certification & Compliance Audit')).toBeInTheDocument();
    expect(screen.getByText('12 Officers')).toBeInTheDocument();
    expect(screen.getByText('8 Certificates')).toBeInTheDocument();

    // Verify ledger items render
    expect(screen.getByText('officer1@govskill.test')).toBeInTheDocument();
    expect(screen.getByText('GS-CERT-2026-ABCD1234')).toBeInTheDocument();
    expect(screen.getByText('officer2@govskill.test')).toBeInTheDocument();

    // Verify GovAssist Citizen Defect Telemetry renders
    expect(screen.getByText('GovAssist Pre-Check Defect Telemetry')).toBeInTheDocument();
    expect(screen.getByText('80% First-Pass Rate')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument(); // total submissions
    expect(screen.getAllByText('8').length).toBeGreaterThanOrEqual(1); // passed ready for filing
    expect(screen.getByText('2')).toBeInTheDocument(); // action required

    // Verify 4-rule distribution
    expect(screen.getAllByText('Name present').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Certificate number format').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Certificate not expired').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('All required fields extracted').length).toBeGreaterThanOrEqual(1);

    // Verify recent citizen inspection stream
    expect(screen.getByText('Ramesh Sharma')).toBeInTheDocument();
    expect(screen.getByText('Unidentified Scan')).toBeInTheDocument();
  });

  it('handles CSV and JSON export actions in governance tab', async () => {
    // Mock URL createObjectURL
    window.URL.createObjectURL = vi.fn().mockReturnValue('blob:test-url');

    mockedGet.mockImplementation((url) => {
      if (url.includes('/admin/reports/export?format=csv')) {
        return Promise.resolve({ data: 'Employee Email,Department\n' });
      }
      if (url.includes('/admin/reports/export?format=json')) {
        return Promise.resolve({ data: mockComplianceReport });
      }
      if (url.includes('/admin/governance/citizen-telemetry')) {
        return Promise.resolve({ data: mockCitizenTelemetry });
      }
      if (url.includes('/progress/admin/skills-overview')) {
        return Promise.resolve({ data: mockSkillsOverview });
      }
      if (url.includes('/modules')) {
        return Promise.resolve({ data: mockModules });
      }
      if (url.includes('/admin/attempts')) {
        return Promise.resolve({ data: mockAttempts });
      }
      return Promise.resolve({ data: [] });
    });

    render(
      <BrowserRouter>
        <AdminDashboardPage />
      </BrowserRouter>
    );

    // Switch to Governance Tab
    const govTabButton = screen.getByRole('button', { name: /workforce governance & telemetry/i });
    fireEvent.click(govTabButton);

    const exportCsvBtn = await screen.findByRole('button', { name: /export audit \(csv\)/i });
    fireEvent.click(exportCsvBtn);

    await waitFor(() => {
      expect(mockedGet).toHaveBeenCalledWith('/admin/reports/export?format=csv', { responseType: 'blob' });
    });

    const exportJsonBtn = screen.getByRole('button', { name: /export json/i });
    fireEvent.click(exportJsonBtn);

    await waitFor(() => {
      expect(mockedGet).toHaveBeenCalledWith('/admin/reports/export?format=json');
    });
  });

  it('renders explicit empty state when no citizen pre-submission records exist', async () => {
    mockedGet.mockImplementation((url) => {
      if (url.includes('/admin/governance/citizen-telemetry')) {
        return Promise.resolve({
          data: {
            total_submissions: 0,
            passed_count: 0,
            action_required_count: 0,
            pass_rate_pct: 100.0,
            defects_by_rule: [],
            recent_inspections: [],
          },
        });
      }
      if (url.includes('/admin/reports/export?format=json')) {
        return Promise.resolve({
          data: {
            generated_at: '2026-08-26T10:00:00Z',
            total_records: 0,
            total_certified_count: 0,
            compliance_rate_pct: 0.0,
            records: [],
          },
        });
      }
      if (url.includes('/progress/admin/skills-overview')) {
        return Promise.resolve({ data: mockSkillsOverview });
      }
      if (url.includes('/modules')) {
        return Promise.resolve({ data: mockModules });
      }
      if (url.includes('/admin/attempts')) {
        return Promise.resolve({ data: mockAttempts });
      }
      return Promise.resolve({ data: [] });
    });

    render(
      <BrowserRouter>
        <AdminDashboardPage />
      </BrowserRouter>
    );

    const govTabButton = screen.getByRole('button', { name: /workforce governance & telemetry/i });
    fireEvent.click(govTabButton);

    expect(await screen.findByText(/no citizen pre-submission records recorded yet/i)).toBeInTheDocument();
    expect(screen.getByText(/no compliance records found/i)).toBeInTheDocument();
  });

  it('renders explicit error banners when compliance or citizen telemetry APIs fail', async () => {
    mockedGet.mockImplementation((url) => {
      if (url.includes('/admin/governance/citizen-telemetry')) {
        return Promise.reject({
          response: { data: { detail: { error: { message: 'Citizen telemetry service unavailable' } } } },
        });
      }
      if (url.includes('/admin/reports/export?format=json')) {
        return Promise.reject({
          response: { data: { detail: { error: { message: 'Compliance audit export unavailable' } } } },
        });
      }
      if (url.includes('/progress/admin/skills-overview')) {
        return Promise.resolve({ data: mockSkillsOverview });
      }
      if (url.includes('/modules')) {
        return Promise.resolve({ data: mockModules });
      }
      if (url.includes('/admin/attempts')) {
        return Promise.resolve({ data: mockAttempts });
      }
      return Promise.resolve({ data: [] });
    });

    render(
      <BrowserRouter>
        <AdminDashboardPage />
      </BrowserRouter>
    );

    const govTabButton = screen.getByRole('button', { name: /workforce governance & telemetry/i });
    fireEvent.click(govTabButton);

    expect(await screen.findByText('Compliance audit export unavailable')).toBeInTheDocument();
    expect(screen.getByText('Citizen telemetry service unavailable')).toBeInTheDocument();
  });
});
