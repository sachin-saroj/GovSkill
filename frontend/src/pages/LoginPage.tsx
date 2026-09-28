import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { getApiErrorMessage } from '@/lib/apiError';
import api from '@/lib/api';
import {
  User,
  Lock,
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
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#BBBBBB]">
      {/* ── Main Split Authentication Card (matches reference) ── */}
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[880px] bg-white rounded-[28px] sm:rounded-[32px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2"
      >
        {/* ── Left Column: Clean Minimalist White Authentication Form ── */}
        <motion.div
          variants={fadeUpVariants}
          className="p-7 sm:p-9 lg:p-11 flex flex-col justify-between"
        >
          {/* Top Row: Freestanding Lightning Emblem + Discreet Back Link */}
          <div className="relative flex items-center justify-center mb-4">
            <Link
              to="/"
              className="absolute left-0 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-black transition-colors"
              title="Return to GovSkill home"
            >
              ← GovSkill
            </Link>
            <div className="flex items-center justify-center my-1">
              <img
                src="/govskill-logo.png"
                alt="GovSkill Logo"
                className="h-20 sm:h-24 w-auto object-contain drop-shadow-md transition-transform hover:scale-105"
                loading="eager"
              />
            </div>
          </div>

          <div className="space-y-5">
            {/* Header: 'Welcome back!' + subtext */}
            <div className="text-center space-y-1.5">
              <h1 className="font-sans text-[26px] sm:text-[30px] font-bold tracking-tight text-zinc-900 leading-tight">
                {isRegister ? 'Create an account' : 'Welcome back!'}
              </h1>
              <p className="font-sans text-[13px] text-zinc-500 leading-relaxed max-w-[280px] mx-auto">
                Your work, your team, your flow — all in one place.
              </p>
            </div>

            {/* Quick Demo Pill Buttons (matches Google / Apple pill buttons in reference) */}
            {!isRegister && (
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleFillDemo('employee')}
                    className="px-3 py-2 rounded-full border border-zinc-200/90 hover:border-zinc-400 bg-white hover:bg-zinc-50/80 text-zinc-800 text-[12px] font-medium tracking-tight transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs min-h-[38px]"
                  >
                    <User className="h-3.5 w-3.5 text-zinc-600" />
                    <span>Sign in as Employee</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFillDemo('admin')}
                    className="px-3 py-2 rounded-full border border-zinc-200/90 hover:border-zinc-400 bg-white hover:bg-zinc-50/80 text-zinc-800 text-[12px] font-medium tracking-tight transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs min-h-[38px]"
                  >
                    <Lock className="h-3.5 w-3.5 text-zinc-600" />
                    <span>Sign in as Supervisor</span>
                  </button>
                </div>

                {/* 'Or' Divider */}
                <div className="relative flex items-center justify-center pt-1">
                  <div className="w-full border-t border-zinc-200/80" />
                  <span className="bg-white px-3 text-[11px] font-normal text-zinc-400">
                    Or
                  </span>
                </div>
              </div>
            )}

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? {} : { opacity: 0, y: -6 }}
                  className="p-3 rounded-xl bg-red-50 border border-red-200 text-[12px] text-red-700 flex items-start gap-2"
                >
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Authentication Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="official-email-address" className="sr-only">
                  Official Email Address
                </label>
                <input
                  id="official-email-address"
                  type="email"
                  aria-label="Official Email Address"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white border border-zinc-200/90 hover:border-zinc-300 focus:border-black focus:ring-1 focus:ring-black rounded-xl px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-all outline-none min-h-[44px]"
                />
              </div>

              <div>
                <label htmlFor="password-field" className="sr-only">
                  Password
                </label>
                <input
                  id="password-field"
                  type="password"
                  aria-label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white border border-zinc-200/90 hover:border-zinc-300 focus:border-black focus:ring-1 focus:ring-black rounded-xl px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-all outline-none min-h-[44px]"
                />
              </div>

              {/* Account Role Dropdown (Registration Mode) */}
              <AnimatePresence>
                {isRegister && (
                  <motion.div
                    initial={shouldReduceMotion ? {} : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={shouldReduceMotion ? {} : { opacity: 0, height: 0 }}
                    className="space-y-1 overflow-hidden"
                  >
                    <label
                      htmlFor="role-select"
                      className="block font-sans text-xs font-semibold text-zinc-700"
                    >
                      Account Role
                    </label>
                    <select
                      id="role-select"
                      value={role}
                      onChange={(e) => setRole(e.target.value as 'employee' | 'admin')}
                      className="w-full rounded-xl border border-zinc-200/90 bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black cursor-pointer min-h-[42px]"
                    >
                      <option value="employee">Government Employee (Trainee Officer)</option>
                      <option value="admin">Department Supervisor (Admin)</option>
                    </select>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Primary Pill Button (matches black pill in reference) */}
              <div className="pt-1">
                <button
                  type="submit"
                  aria-label={isRegister ? 'Register Account' : 'Sign In'}
                  disabled={isLoading}
                  className="w-full rounded-full min-h-[44px] bg-[#111113] hover:bg-black text-white font-sans font-medium text-sm tracking-tight cursor-pointer shadow-sm transition-all hover:scale-[1.005] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : isRegister ? (
                    'Register Account'
                  ) : (
                    'Sign in with email'
                  )}
                </button>
              </div>
            </form>

            {/* Toggle Between Sign In and Register */}
            <div className="text-center text-xs text-zinc-500 pt-1">
              <span>
                {isRegister ? 'Already have an account? ' : "Don't have an account? "}
              </span>
              <button
                type="button"
                aria-label={isRegister ? 'Sign In' : 'Register Here'}
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError(null);
                }}
                className="text-black font-semibold hover:underline cursor-pointer"
              >
                {isRegister ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
          </div>

          {/* Bottom Footer Links (matches 'Help / Terms / Privacy' in reference) */}
          <div className="pt-6 border-t border-zinc-100/80 flex items-center justify-center gap-3 text-[11px] text-zinc-400">
            <span className="hover:text-black cursor-pointer transition-colors">Help</span>
            <span>/</span>
            <span className="hover:text-black cursor-pointer transition-colors">Terms</span>
            <span>/</span>
            <span className="hover:text-black cursor-pointer transition-colors">Privacy</span>
            <span>/</span>
            <Link to="/citizen" className="hover:text-black transition-colors font-medium">
              Citizen Check
            </Link>
          </div>
        </motion.div>

        {/* ── Right Column: Exact 1-Bit Dithered Architectural Landscape from Reference ── */}
        <motion.div
          variants={fadeUpVariants}
          className="hidden lg:block h-full relative overflow-hidden bg-black select-none"
        >
          <img
            src="/illustrations/login_dithered_architecture.png"
            alt="Monochrome dithered pointillist architectural engraving of civic stone arches and reflection pool"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
