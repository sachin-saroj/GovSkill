import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Shield } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'employee' | 'admin'>('employee');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isRegister) {
        await api.post('/auth/register', { email, password, role });
      }
      const res = await api.post<{ access_token: string }>('/auth/login', { email, password });
      await login(res.data.access_token);
      navigate(role === 'admin' ? '/admin' : '/module');
    } catch (err: any) {
      const msg = err.response?.data?.detail?.error?.message || err.response?.data?.message || 'Authentication failed';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-full bg-[#1E4D8C]/10 text-[#1E4D8C] mb-3">
            <Shield className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-semibold text-[#1A1F2B]">
            {isRegister ? 'Create GovSkill Account' : 'Sign in to GovSkill'}
          </h2>
          <p className="text-sm text-[#5A6472] mt-1">
            Local Government Office Digital Training Platform
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-[#C0392B]/10 border border-[#C0392B]/30 text-xs text-[#C0392B]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Official Email Address"
            type="email"
            placeholder="employee@office.gov"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-[#1A1F2B] mb-1">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'employee' | 'admin')}
                className="w-full rounded-lg border border-[#E2E6EB] bg-white px-3 py-2 text-sm text-[#1A1F2B] focus:outline-none focus:ring-2 focus:ring-[#1E4D8C]/30 focus:border-[#1E4D8C]"
              >
                <option value="employee">Government Employee (Trainee)</option>
                <option value="admin">Office Admin / Supervisor</option>
              </select>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Processing...' : isRegister ? 'Register Account' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-[#5A6472]">
          {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
            }}
            className="text-[#1E4D8C] font-semibold hover:underline"
          >
            {isRegister ? 'Sign In' : 'Register Here'}
          </button>
        </div>
      </Card>
    </div>
  );
};
export default LoginPage;
