import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'jest-axe';
import LoginPage from './LoginPage';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

const navigate = vi.fn();
const login = vi.fn();

vi.mock('@/lib/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

const mockedPost = vi.mocked(api.post);
const mockedUseAuth = vi.mocked(useAuth);

const renderPage = () =>
  render(
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>
  );

describe('LoginPage', () => {
  beforeEach(() => {
    mockedPost.mockReset();
    mockedUseAuth.mockReturnValue({
      user: null,
      token: null,
      isLoading: false,
      login,
      logout: vi.fn(),
    });
    login.mockReset();
    login.mockResolvedValue({ role: 'employee' });
    navigate.mockReset();
  });

  it('logs in an employee and navigates to the skill progress page', async () => {
    mockedPost.mockResolvedValue({ data: { access_token: 'employee-token' } });

    renderPage();
    fireEvent.change(screen.getByLabelText('Official Email Address'), {
      target: { value: 'employee@govskill.test' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => expect(login).toHaveBeenCalledWith('employee-token'));
    expect(mockedPost).toHaveBeenCalledWith('/auth/login', {
      email: 'employee@govskill.test',
      password: 'password123',
    });
    expect(navigate).toHaveBeenCalledWith('/progress');
  });

  it('navigates from login mode to register mode when the register link is clicked', () => {
    renderPage();
    const registerLink = screen.getByRole('button', { name: /create staff account/i });
    fireEvent.click(registerLink);

    expect(screen.getByRole('button', { name: 'Send Verification Code' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /employee/i })).toBeNull();
  });

  it('registers via two-step OTP flow and logs in', async () => {
    mockedPost
      .mockResolvedValueOnce({ data: { message: 'Verification code sent.' } })
      .mockResolvedValueOnce({ data: { access_token: 'staff-token' } });
    login.mockResolvedValue({ role: 'employee' });

    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /create staff account/i }));

    fireEvent.change(screen.getByLabelText('Official Email Address'), {
      target: { value: 'test-staff@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Send Verification Code' }));

    await waitFor(() =>
      expect(mockedPost).toHaveBeenCalledWith('/auth/register', {
        email: 'test-staff@example.com',
        password: 'password123',
      })
    );

    const otpInput = screen.getByLabelText('Verification Code');
    expect(otpInput).toBeInTheDocument();
    expect(otpInput).toHaveAttribute('maxLength', '6');

    fireEvent.change(otpInput, {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Complete Registration' }));

    await waitFor(() =>
      expect(mockedPost).toHaveBeenCalledWith('/auth/register/verify', {
        email: 'test-staff@example.com',
        otp: '123456',
        password: 'password123',
      })
    );
    expect(login).toHaveBeenCalledWith('staff-token');
    expect(navigate).toHaveBeenCalledWith('/progress');
  });

  it('renders the backend error when authentication fails', async () => {
    mockedPost.mockRejectedValue({
      response: { data: { detail: { error: { message: 'Invalid email or password' } } } },
      isAxiosError: true,
    });

    renderPage();
    fireEvent.change(screen.getByLabelText('Official Email Address'), {
      target: { value: 'employee@govskill.test' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrong-password' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(await screen.findByText('Invalid email or password')).toBeInTheDocument();
  });

  it('logs in an admin via OTP and navigates to admin dashboard', async () => {
    mockedPost
      .mockResolvedValueOnce({
        data: { requires_otp: true, otp_session_id: 'session-abc' },
      })
      .mockResolvedValueOnce({
        data: { access_token: 'admin-token' },
      });
    login.mockResolvedValue({ role: 'admin' });

    renderPage();
    fireEvent.change(screen.getByLabelText('Official Email Address'), {
      target: { value: 'sachhhinsrj@gmail.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() =>
      expect(screen.getByLabelText('Verification Code')).toBeInTheDocument()
    );

    const otpInput = screen.getByLabelText('Verification Code');
    fireEvent.change(otpInput, {
      target: { value: '654321' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Verify & Sign In' }));

    await waitFor(() =>
      expect(mockedPost).toHaveBeenCalledWith('/auth/login/verify-otp', {
        otp_session_id: 'session-abc',
        otp: '654321',
      })
    );
    expect(login).toHaveBeenCalledWith('admin-token');
    expect(navigate).toHaveBeenCalledWith('/admin');
  });

  it('shows two-factor authentication view for admin login', async () => {
    mockedPost.mockResolvedValueOnce({
      data: { requires_otp: true, otp_session_id: 'session-abc' },
    });

    renderPage();
    fireEvent.change(screen.getByLabelText('Official Email Address'), {
      target: { value: 'sachhhinsrj@gmail.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: /two-factor authentication/i })
      ).toBeInTheDocument()
    );
  });

  it('allows going back from OTP view to login view', async () => {
    mockedPost.mockResolvedValueOnce({
      data: { requires_otp: true, otp_session_id: 'session-abc' },
    });

    renderPage();
    fireEvent.change(screen.getByLabelText('Official Email Address'), {
      target: { value: 'sachhhinsrj@gmail.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() =>
      expect(screen.getByLabelText('Verification Code')).toBeInTheDocument()
    );

    fireEvent.click(screen.getByRole('button', { name: '← Back' }));

    expect(screen.getByLabelText('Official Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.queryByLabelText('Verification Code')).toBeNull();
  });

  it('passes automated accessibility audit without violations', async () => {
    const { container } = renderPage();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes automated accessibility audit in registration mode', async () => {
    const { container } = renderPage();
    fireEvent.click(screen.getByRole('button', { name: /create staff account/i }));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
