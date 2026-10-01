import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { getApiErrorMessage } from '@/lib/apiError';
import api from '@/lib/api';
import { AlertCircle, ShieldAlert } from 'lucide-react';
import { staggerContainerVariants, fadeUpVariants } from '@/lib/motion';

export const RegisterAdminPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isTerminalError, setIsTerminalError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const { login } = useAuth();
  const navigate = useNavigate();

  const isInvalidLink = !token.trim() || !email.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

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
      const res = await api.post<{ access_token: string }>('/auth/register/admin', {
        email: email.trim().toLowerCase(),
        password,
        invite_token: token.trim(),
      });

      await login(res.data.access_token);
      navigate('/admin');
    } catch (err: unknown) {
      const message = getApiErrorMessage(err, 'Registration failed.');
      if (message.toLowerCase().includes('invite invalid or expired')) {
        setIsTerminalError(true);
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#BBBBBB]">
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[880px] bg-white rounded-[28px] sm:rounded-[32px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2"
      >
        {/* Left Column */}
        <motion.div
          variants={fadeUpVariants}
          className="p-7 sm:p-9 lg:p-11 flex flex-col justify-between"
        >
          {/* Top Branding */}
          <div className="relative flex items-center justify-center mb-4">
            <Link
              to="/login"
              className="absolute left-0 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-black transition-colors"
            >
              ← Sign In
            </Link>
            <div className="flex items-center justify-center my-1">
              <img
                src="/govskill-logo.png"
                alt="GovSkill Logo"
                className="h-20 sm:h-24 w-auto object-contain drop-shadow-md"
                loading="eager"
              />
            </div>
          </div>

          <div className="space-y-5">
            {isInvalidLink ? (
              <div className="text-center space-y-3 py-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <ShieldAlert className="h-6 w-6 text-red-600" />
                </div>
                <h1 className="font-sans text-[22px] sm:text-[26px] font-bold text-zinc-900 leading-tight">
                  Invalid Invitation
                </h1>
                <p className="font-sans text-[13px] text-zinc-500 leading-relaxed max-w-[280px] mx-auto">
                  This invite link is invalid or incomplete.
                </p>
                <div className="pt-2">
                  <Link
                    to="/login"
                    className="inline-block px-5 py-2.5 rounded-full bg-[#111113] hover:bg-black text-white text-xs font-medium tracking-tight transition-all"
                  >
                    Return to Sign In
                  </Link>
                </div>
              </div>
            ) : isTerminalError ? (
              <div className="text-center space-y-3 py-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <ShieldAlert className="h-6 w-6 text-red-600" />
                </div>
                <h1 className="font-sans text-[22px] sm:text-[26px] font-bold text-zinc-900 leading-tight">
                  Invite Expired
                </h1>
                <p className="font-sans text-[13px] text-zinc-500 leading-relaxed max-w-[280px] mx-auto">
                  Invite invalid or expired.
                </p>
                <div className="pt-2">
                  <Link
                    to="/login"
                    className="inline-block px-5 py-2.5 rounded-full bg-[#111113] hover:bg-black text-white text-xs font-medium tracking-tight transition-all"
                  >
                    Return to Sign In
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center space-y-1.5">
                  <h1 className="font-sans text-[26px] sm:text-[30px] font-bold tracking-tight text-zinc-900 leading-tight">
                    Admin Registration
                  </h1>
                  <p className="font-sans text-[13px] text-zinc-500 leading-relaxed max-w-[300px] mx-auto">
                    Complete your administrator account setup.
                  </p>
                </div>

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

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block font-sans text-xs font-semibold text-zinc-700 mb-1">
                      Invited Email
                    </label>
                    <div className="w-full bg-zinc-50 border border-zinc-200/90 rounded-xl px-4 py-2.5 text-sm text-zinc-700 font-mono select-all">
                      {email}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="admin-password-field" className="sr-only">
                      Password
                    </label>
                    <input
                      id="admin-password-field"
                      type="password"
                      aria-label="Password"
                      placeholder="Create your administrator password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-white border border-zinc-200/90 hover:border-zinc-300 focus:border-black focus:ring-1 focus:ring-black rounded-xl px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-all outline-none min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label htmlFor="admin-confirm-password-field" className="sr-only">
                      Confirm Password
                    </label>
                    <input
                      id="admin-confirm-password-field"
                      type="password"
                      aria-label="Confirm Password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full bg-white border border-zinc-200/90 hover:border-zinc-300 focus:border-black focus:ring-1 focus:ring-black rounded-xl px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-all outline-none min-h-[44px]"
                    />
                  </div>

                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full rounded-full min-h-[44px] bg-[#111113] hover:bg-black text-white font-sans font-medium text-sm tracking-tight cursor-pointer shadow-sm transition-all hover:scale-[1.005] flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      ) : (
                        'Register as Administrator'
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>

          <div className="pt-6 border-t border-zinc-100/80 flex items-center justify-center gap-3 text-[11px] text-zinc-400">
            <Link to="/login" className="hover:text-black transition-colors font-medium">
              Return to Login
            </Link>
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div
          variants={fadeUpVariants}
          className="hidden lg:block h-full relative overflow-hidden bg-black select-none"
        >
          <img
            src="/illustrations/login_dithered_architecture.png"
            alt="Monochrome architectural engraving"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterAdminPage;
