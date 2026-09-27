import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/api';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string) => Promise<User | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUser = async (): Promise<User | null> => {
    try {
      const res = await api.get<User>('/auth/me');
      setUser(res.data);
      return res.data;
    } catch (err: any) {
      // Differentiate credential failure from temporary network or infrastructure failure:
      // Invalidate session ONLY if server explicitly rejected credentials (401/403 or Unauthorized)
      const isAuthError =
        err?.response?.status === 401 ||
        err?.response?.status === 403 ||
        (typeof err?.message === 'string' && err.message.toLowerCase().includes('unauthorized'));

      if (isAuthError) {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        return null;
      }
      // For network drops, timeouts, or 5xx server glitches, preserve token in localStorage
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleSessionExpired = () => {
      setToken(null);
      setUser(null);
      setIsLoading(false);
    };

    window.addEventListener('govskill:session_expired', handleSessionExpired);
    return () => {
      window.removeEventListener('govskill:session_expired', handleSessionExpired);
    };
  }, []);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = async (newToken: string): Promise<User | null> => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setIsLoading(true);
    return await fetchUser();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
