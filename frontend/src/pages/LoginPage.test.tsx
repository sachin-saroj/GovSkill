import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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

  it('fills demo credentials when Employee demo button is clicked', async () => {
    renderPage();
    const demoEmployeeBtn = screen.getByRole('button', { name: /employee/i });
    fireEvent.click(demoEmployeeBtn);

    const emailInput = screen.getByLabelText('Official Email Address') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;

    expect(emailInput.value).toBe('employee@govskill.local');
    expect(passwordInput.value).toBe('Employee123!');
  });

  it('registers before logging in when account creation is selected', async () => {
    mockedPost
      .mockResolvedValueOnce({ data: {} })
      .mockResolvedValueOnce({ data: { access_token: 'new-token' } });

    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Register Here' }));
    fireEvent.change(screen.getByLabelText('Official Email Address'), {
      target: { value: 'new.employee@govskill.test' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Register Account' }));

    await waitFor(() => expect(login).toHaveBeenCalledWith('new-token'));
    expect(mockedPost.mock.calls[0]).toEqual([
      '/auth/register',
      { email: 'new.employee@govskill.test', password: 'password123', role: 'employee' },
    ]);
    expect(mockedPost.mock.calls[1]).toEqual([
      '/auth/login',
      { email: 'new.employee@govskill.test', password: 'password123' },
    ]);
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

  it('logs in an admin and navigates to the admin dashboard page', async () => {
    mockedPost.mockResolvedValue({ data: { access_token: 'admin-token' } });
    login.mockResolvedValue({ role: 'admin' });

    renderPage();
    fireEvent.change(screen.getByLabelText('Official Email Address'), {
      target: { value: 'admin@govskill.test' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => expect(login).toHaveBeenCalledWith('admin-token'));
    expect(navigate).toHaveBeenCalledWith('/admin');
  });
});
