import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '@/lib/api';
import { AuthProvider, useAuth } from './useAuth';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

const mockedGet = vi.mocked(api.get);

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    mockedGet.mockReset();
  });

  it('loads the authenticated user from a stored token', async () => {
    const user = { id: 'user-1', email: 'employee@govskill.test', role: 'employee' as const };
    localStorage.setItem('token', 'stored-token');
    mockedGet.mockResolvedValue({ data: user });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.user).toEqual(user));

    expect(result.current.token).toBe('stored-token');
    expect(result.current.isLoading).toBe(false);
    expect(mockedGet).toHaveBeenCalledWith('/auth/me');
  });

  it('stores a new token and clears the session when user loading fails', async () => {
    mockedGet.mockRejectedValue(new Error('Unauthorized'));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('invalid-token');
    });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
  });
});