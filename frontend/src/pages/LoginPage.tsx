import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getApiErrorMessage } from '@/lib/apiError';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Shield, User, Lock, Sparkles, FileText, ArrowRight } from 'lucide-react';

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
      const loggedInUser = await login(res.data.access_token);
      navigate(loggedInUser?.role === 'admin' ? '/admin' : '/progress');
    } catch (error: unknown) {
      setError(getApiErrorMessage(error, 'Authentication failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = (demoRole: 'employee' | 'admin') => {
    setError(null);
    setIsRegister(false);
    if (demoRole === 'admin') {
      setEmail('admin@govskill.test');
      setPassword('password123');
      setRole('admin');
    } else {
      setEmail('employee@govskill.test');
      setPassword('password123');
      setRole('employee');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 space-y-6">
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

        {/* Demo Fast-Fill Bar */}
        {!isRegister && (
          <div className="mb-5 p-3 rounded-xl bg-[#F7F9FB] border border-[#E2E6EB] space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5A6472] uppercase">
              <Sparkles className="h-3.5 w-3.5 text-[#D98E04]" />
              <span>Quick Demo Autofill:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo('employee')}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white border border-[#E2E6EB] hover:border-[#1E4D8C] text-[#1A1F2B] hover:text-[#1E4D8C] transition-colors flex items-center justify-center gap-1.5"
              >
                <User className="h-3.5 w-3.5 text-[#1E4D8C]" />
                <span>Employee</span>
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('admin')}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white border border-[#E2E6EB] hover:border-[#1E4D8C] text-[#1A1F2B] hover:text-[#1E4D8C] transition-colors flex items-center justify-center gap-1.5"
              >
                <Lock className="h-3.5 w-3.5 text-[#D98E04]" />
                <span>Supervisor (Admin)</span>
              </button>
            </div>
          </div>
        )}

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
              <label htmlFor="role-select" className="block text-sm font-medium text-[#1A1F2B] mb-1">
                Account Role
              </label>
              <select
                id="role-select"
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

      {/* Citizen Portal Direct Access Link */}
      <Link
        to="/citizen"
        className="w-full max-w-md p-3.5 bg-white rounded-xl border border-[#E2E6EB] hover:border-[#1E4D8C] shadow-sm flex items-center justify-between text-xs transition-colors group"
      >
        <div className="flex items-center gap-2 text-[#5A6472]">
          <FileText className="h-4 w-4 text-[#1E4D8C]" />
          <span>Visiting as a Citizen? Use the Self-Service Pre-checker</span>
        </div>
        <ArrowRight className="h-3.5 w-3.5 text-[#5A6472] group-hover:text-[#1E4D8C] group-hover:translate-x-0.5 transition-all" />
      </Link>
    </div>
  );
};
export default LoginPage;
