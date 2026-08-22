import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getApiErrorMessage } from '@/lib/apiError';
import api from '@/lib/api';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import {
  Shield,
  User,
  Lock,
  Sparkles,
  FileCheck,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

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
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12 bg-slate-50 animate-fade-in">
      <div className="w-full max-w-md space-y-6">
        {/* Main Authentication Card */}
        <Card className="border-slate-200 shadow-civic-lg p-6 sm:p-8 bg-white" variant="elevated">
          {/* Header Banner */}
          <div className="text-center mb-6 space-y-2">
            <div className="inline-flex p-3.5 rounded-2xl bg-civic-900 text-white shadow-civic-sm mb-1">
              <Shield className="h-7 w-7 text-saffron-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {isRegister ? 'Create GovSkill Account' : 'Sign in to GovSkill'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Local Government Officer & Supervisor Training Gateway
            </p>
          </div>

          {/* Quick Demo Autofill Switcher */}
          {!isRegister && (
            <div className="mb-6 p-3 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5 text-saffron-600" />
                  <span>Demo Credentials</span>
                </span>
                <span className="text-[10px] font-medium text-slate-400">One-click populate</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleFillDemo('employee')}
                  className="px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 hover:border-civic-700 text-slate-800 hover:text-civic-800 transition-all flex items-center justify-center gap-1.5 shadow-civic-xs active:scale-95 cursor-pointer"
                >
                  <User className="h-3.5 w-3.5 text-civic-700" />
                  <span>Employee</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('admin')}
                  className="px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 hover:border-saffron-600 text-slate-800 hover:text-saffron-700 transition-all flex items-center justify-center gap-1.5 shadow-civic-xs active:scale-95 cursor-pointer"
                >
                  <Lock className="h-3.5 w-3.5 text-saffron-600" />
                  <span>Supervisor (Admin)</span>
                </button>
              </div>
            </div>
          )}

          {/* Error Feedback Message */}
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2 animate-fade-in shadow-civic-xs">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Official Email Address"
              type="email"
              placeholder="employee@govskill.test"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              leftIcon={<User className="h-4 w-4" />}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              leftIcon={<Lock className="h-4 w-4" />}
            />

            {isRegister && (
              <div className="space-y-1.5">
                <label htmlFor="role-select" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Account Role
                </label>
                <select
                  id="role-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'employee' | 'admin')}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-civic-700/20 focus:border-civic-700 cursor-pointer"
                >
                  <option value="employee">Government Employee (Trainee Officer)</option>
                  <option value="admin">Department Supervisor (Admin)</option>
                </select>
              </div>
            )}

            <Button
              type="submit"
              className="w-full mt-2 font-semibold shadow-civic-sm cursor-pointer"
              size="lg"
              isLoading={isLoading}
              variant="primary"
            >
              {isRegister ? 'Register Account' : 'Sign In'}
            </Button>
          </form>

          {/* Toggle between Register and Sign In */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-600">
            {isRegister ? 'Already have an official account?' : "Don't have an officer account yet?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError(null);
              }}
              className="text-civic-800 font-bold hover:underline cursor-pointer ml-1"
            >
              {isRegister ? 'Sign In' : 'Register Here'}
            </button>
          </div>
        </Card>

        {/* Citizen GovAssist Shortcut Card */}
        <Link
          to="/citizen"
          className="w-full p-4 bg-emerald-50/70 hover:bg-emerald-50 rounded-xl border border-emerald-200/90 shadow-civic-xs flex items-center justify-between text-xs transition-all group hover:border-emerald-300"
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 shadow-civic-xs">
              <FileCheck className="h-4 w-4 text-emerald-700" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Visiting as a Citizen?</p>
              <p className="text-[11px] text-slate-600">Use the self-service Income Certificate pre-checker</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-emerald-700 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
