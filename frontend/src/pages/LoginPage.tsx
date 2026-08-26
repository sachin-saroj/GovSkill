import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
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
import { staggerContainerVariants, fadeUpVariants } from '@/lib/motion';

export const LoginPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'employee' | 'admin'>('employee');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const shouldReduceMotion = useReducedMotion();

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
      setEmail('admin@govskill.local');
      setPassword('AdminPass123!');
      setRole('admin');
    } else {
      setEmail('employee@govskill.local');
      setPassword('Employee123!');
      setRole('employee');
    }
  };


  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12 bg-slate-50 relative overflow-hidden">
      {/* Subtle Civic Ambient Background */}
      <div className="absolute inset-0 bg-civic-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-civic-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md space-y-6 relative z-10"
      >
        {/* Main Authentication Card */}
        <motion.div variants={fadeUpVariants}>
          <Card className="border-slate-200 shadow-civic-xl p-6 sm:p-8 bg-white/95 backdrop-blur-md rounded-civic-2xl" variant="elevated">
            {/* Header Banner */}
            <div className="text-center mb-6 space-y-2">
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.05, rotate: 2 }}
                className="inline-flex p-3.5 rounded-civic-xl bg-civic-900 text-white shadow-civic-sm mb-1"
              >
                <Shield className="h-7 w-7 text-saffron-400" />
              </motion.div>
              <h2 className="text-page-title font-semibold text-slate-900 tracking-tight">
                {isRegister ? 'Create GovSkill Account' : 'Sign in to GovSkill'}
              </h2>
              <p className="text-caption text-slate-500 font-normal">
                Local Government Officer & Supervisor Training Gateway
              </p>
            </div>

            {/* Quick Demo Autofill Switcher */}
            <AnimatePresence>
              {!isRegister && (
                <motion.div
                  initial={shouldReduceMotion ? {} : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={shouldReduceMotion ? {} : { opacity: 0, height: 0 }}
                  className="mb-6 p-3.5 rounded-civic-xl bg-slate-50 border border-slate-200/90 space-y-2 overflow-hidden shadow-civic-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-micro font-semibold text-slate-600 uppercase tracking-wider">
                      <Sparkles className="h-3.5 w-3.5 text-saffron-600" />
                      <span>Demo Credentials</span>
                    </span>
                    <span className="text-micro font-medium text-slate-400">One-click populate</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleFillDemo('employee')}
                      className="px-3 py-2 text-caption font-semibold rounded-civic-md bg-white border border-slate-200 hover:border-civic-700 text-slate-800 hover:text-civic-800 transition-all flex items-center justify-center gap-1.5 shadow-civic-xs cursor-pointer"
                    >
                      <User className="h-3.5 w-3.5 text-civic-700" />
                      <span>Employee</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFillDemo('admin')}
                      className="px-3 py-2 text-caption font-semibold rounded-civic-md bg-white border border-slate-200 hover:border-saffron-600 text-slate-800 hover:text-saffron-700 transition-all flex items-center justify-center gap-1.5 shadow-civic-xs cursor-pointer"
                    >
                      <Lock className="h-3.5 w-3.5 text-saffron-600" />
                      <span>Supervisor (Admin)</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Feedback Message with AnimatePresence */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? {} : { opacity: 0, y: -6 }}
                  className="mb-5 p-3.5 rounded-civic-xl bg-red-50 border border-red-200 text-caption text-red-700 flex items-start gap-2 shadow-civic-xs"
                >
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

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

              <AnimatePresence>
                {isRegister && (
                  <motion.div
                    initial={shouldReduceMotion ? {} : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={shouldReduceMotion ? {} : { opacity: 0, height: 0 }}
                    className="space-y-1.5 overflow-hidden"
                  >
                    <label htmlFor="role-select" className="block text-micro font-semibold uppercase tracking-wider text-slate-700">
                      Account Role
                    </label>
                    <select
                      id="role-select"
                      value={role}
                      onChange={(e) => setRole(e.target.value as 'employee' | 'admin')}
                      className="w-full rounded-civic-md border border-slate-300 bg-white px-3.5 py-2.5 text-caption text-slate-900 focus:outline-none focus:ring-2 focus:ring-civic-700/20 focus:border-civic-700 cursor-pointer"
                    >
                      <option value="employee">Government Employee (Trainee Officer)</option>
                      <option value="admin">Department Supervisor (Admin)</option>
                    </select>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-1">
                <Button
                  type="submit"
                  className="w-full font-semibold shadow-civic-sm cursor-pointer"
                  size="lg"
                  isLoading={isLoading}
                  variant="primary"
                >
                  {isRegister ? 'Register Account' : 'Sign In'}
                </Button>
              </div>
            </form>

            {/* Toggle between Register and Sign In */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center text-caption text-slate-600 font-normal">
              {isRegister ? 'Already have an official account?' : "Don't have an officer account yet?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError(null);
                }}
                className="text-civic-800 font-semibold hover:underline cursor-pointer ml-1"
              >
                {isRegister ? 'Sign In' : 'Register Here'}
              </button>
            </div>
          </Card>
        </motion.div>

        {/* Citizen GovAssist Shortcut Card */}
        <motion.div variants={fadeUpVariants}>
          <Link
            to="/citizen"
            className="w-full p-4 bg-emerald-50/70 hover:bg-emerald-50 rounded-civic-xl border border-emerald-200/90 shadow-civic-xs flex items-center justify-between text-caption transition-all group hover:border-emerald-300 hover:shadow-civic-md"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-civic-md bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 shadow-civic-xs group-hover:scale-105 transition-transform">
                <FileCheck className="h-4 w-4 text-emerald-700" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Visiting as a Citizen?</p>
                <p className="text-caption text-slate-600 font-normal">Use the self-service Income Certificate pre-checker</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-emerald-700 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
