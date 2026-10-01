import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { getApiErrorMessage } from '@/lib/apiError';
import api from '@/lib/api';
import { AlertCircle } from 'lucide-react';
import { staggerContainerVariants, fadeUpVariants } from '@/lib/motion';

type ViewMode = 'login' | 'login-otp' | 'register' | 'register-otp';

export const LoginPage: React.FC = () => {
  const [view, setView] = useState<ViewMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSessionId, setOtpSessionId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await api.post<{
        access_token?: string;
        requires_otp?: boolean;
        otp_session_id?: string;
      }>('/auth/login', {
        email: email.trim().toLowerCase(),
        password,
      });

      if (res.data.access_token) {
        await login(res.data.access_token);
        navigate('/progress');
      } else if (res.data.requires_otp && res.data.otp_session_id) {
        setOtpSessionId(res.data.otp_session_id);
        setOtp('');
        setView('login-otp');
      }
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Invalid email or password.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await api.post<{ access_token: string }>('/auth/login/verify-otp', {
        otp_session_id: otpSessionId,
        otp: otp.trim(),
      });
      await login(res.data.access_token);
      navigate('/admin');
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Invalid or expired verification code.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/register', { email: cleanEmail, password });
      setOtp('');
      setView('register-otp');
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to send verification code.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await api.post<{ access_token: string }>('/auth/register/verify', {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        password,
      });
      await login(res.data.access_token);
      navigate('/progress');
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Invalid or expired verification code.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (view === 'login') return handleLoginSubmit(e);
    if (view === 'login-otp') return handleLoginOtpSubmit(e);
    if (view === 'register') return handleRegisterSubmit(e);
    if (view === 'register-otp') return handleRegisterOtpSubmit(e);
  };

  const getHeading = () => {
    switch (view) {
      case 'login-otp':
        return 'Two-factor authentication';
      case 'register':
        return 'Create staff account';
      case 'register-otp':
        return 'Verify your email';
      case 'login':
      default:
        return 'Welcome back!';
    }
  };

  const getSubheading = () => {
    switch (view) {
      case 'login-otp':
        return `Enter the verification code sent to ${email}`;
      case 'register':
        return 'Register with your official email to receive a verification code.';
      case 'register-otp':
        return `Enter the code sent to ${email}`;
      case 'login':
      default:
        return 'Your work, your team, your flow — all in one place.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#BBBBBB]">
      {/* ── Main Split Authentication Card ── */}
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
            {/* Header */}
            <div className="text-center space-y-1.5">
              <h1 className="font-sans text-[26px] sm:text-[30px] font-bold tracking-tight text-zinc-900 leading-tight">
                {getHeading()}
              </h1>
              <p className="font-sans text-[13px] text-zinc-500 leading-relaxed max-w-[320px] mx-auto break-words">
                {getSubheading()}
              </p>
            </div>

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
              {(view === 'login' || view === 'register') && (
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
              )}

              {(view === 'login' || view === 'register') && (
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
              )}

              {view === 'register' && (
                <div>
                  <label htmlFor="confirm-password-field" className="sr-only">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password-field"
                    type="password"
                    aria-label="Confirm Password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full bg-white border border-zinc-200/90 hover:border-zinc-300 focus:border-black focus:ring-1 focus:ring-black rounded-xl px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-all outline-none min-h-[44px]"
                  />
                </div>
              )}

              {(view === 'login-otp' || view === 'register-otp') && (
                <div>
                  <label htmlFor="otp-field" className="sr-only">
                    6-Digit Verification Code
                  </label>
                  <input
                    id="otp-field"
                    type="text"
                    aria-label="Verification Code"
                    placeholder="000000"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    required
                    autoFocus
                    className="w-full bg-white border border-zinc-200/90 hover:border-zinc-300 focus:border-black focus:ring-1 focus:ring-black rounded-xl px-4 py-2.5 text-center font-mono text-lg tracking-widest text-zinc-900 placeholder:text-zinc-300 transition-all outline-none min-h-[44px]"
                  />
                </div>
              )}

              {/* Primary Pill Button */}
              <div className="pt-1">
                <button
                  type="submit"
                  aria-label={
                    view === 'login'
                      ? 'Sign In'
                      : view === 'login-otp'
                      ? 'Verify & Sign In'
                      : view === 'register'
                      ? 'Send Verification Code'
                      : 'Complete Registration'
                  }
                  disabled={isLoading}
                  className="w-full rounded-full min-h-[44px] bg-[#111113] hover:bg-black text-white font-sans font-medium text-sm tracking-tight cursor-pointer shadow-sm transition-all hover:scale-[1.005] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : view === 'login' ? (
                    'Sign in with email'
                  ) : view === 'login-otp' ? (
                    'Verify & Sign In'
                  ) : view === 'register' ? (
                    'Send Verification Code'
                  ) : (
                    'Complete Registration'
                  )}
                </button>
              </div>
              {/* OTP Back Navigation Link (GAP 2) */}
              {(view === 'login-otp' || view === 'register-otp') && (
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (view === 'login-otp') {
                        setView('login');
                        setOtp('');
                        setOtpSessionId('');
                      } else {
                        setView('register');
                        setOtp('');
                      }
                      setError(null);
                    }}
                    className="text-xs text-zinc-500 hover:text-black transition-colors cursor-pointer"
                  >
                    ← Back
                  </button>
                </div>
              )}
            </form>

            {/* Mode Switch Navigation Link (GAP 1) */}
            <div className="text-center pt-1">
              {view === 'login' || view === 'login-otp' ? (
                <button
                  type="button"
                  onClick={() => {
                    setView('register');
                    setOtp('');
                    setOtpSessionId('');
                    setError(null);
                  }}
                  className="text-xs text-zinc-500 hover:text-black transition-colors cursor-pointer"
                >
                  New here? Create staff account
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setView('login');
                    setOtp('');
                    setError(null);
                  }}
                  className="text-xs text-zinc-500 hover:text-black transition-colors cursor-pointer"
                >
                  Already have an account? Sign in
                </button>
              )}
            </div>
          </div>

          {/* Bottom Footer Links */}
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

        {/* ── Right Column: Exact 1-Bit Dithered Architectural Landscape ── */}
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
