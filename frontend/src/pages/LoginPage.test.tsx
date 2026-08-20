import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigate,
}));

const mockedPost = vi.mocked(api.post);
const mockedUseAuth = vi.mocked(useAuth);

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
    navigate.mockReset();
  });

  it('logs in an employee and navigates to the module page', async () => {
    mockedPost.mockResolvedValue({ data: { access_token: 'employee-token' } });

    render(<LoginPage />);
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
    expect(navigate).toHaveBeenCalledWith('/module');
  });

  it('registers before logging in when account creation is selected', async () => {
    mockedPost
      .mockResolvedValueOnce({ data: {} })
      .mockResolvedValueOnce({ data: { access_token: 'new-token' } });

    render(<LoginPage />);
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

    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText('Official Email Address'), {
      target: { value: 'employee@govskill.test' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrong-password' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(await screen.findByText('Invalid email or password')).toBeInTheDocument();
  });
});