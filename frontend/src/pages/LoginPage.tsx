import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { getApiErrorMessage } from '@/lib/apiError';
import api from '@/lib/api';
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
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12 bg-[#F5EFE0] relative overflow-hidden">
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10"
      >
        {/* Left Side: Editorial Archival Illustration Plate (Desktop) */}
        <motion.div variants={fadeUpVariants} className="hidden lg:flex lg:col-span-5 flex-col space-y-3">
          <div className="relative rounded-2xl overflow-hidden border border-[#D9CFBB] bg-[#EDE4D0] p-3 shadow-md">
            {/* Archival corner registration marks */}
            <span className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-[#0A0A0A]/20 pointer-events-none" aria-hidden="true" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-[#0A0A0A]/20 pointer-events-none" aria-hidden="true" />
            <span className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b border-l border-[#0A0A0A]/20 pointer-events-none" aria-hidden="true" />
            <span className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r border-[#0A0A0A]/20 pointer-events-none" aria-hidden="true" />

            <div className="aspect-[3/4] w-full rounded-xl overflow-hidden border border-[#D9CFBB]/70 bg-[#F5EFE0]">
              <img
                src="/illustrations/login_civic_portal.jpg"
                alt="Civic Governance Portico"
                className="w-full h-full object-cover object-top"
                loading="eager"
              />
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#D9CFBB] flex items-center justify-between text-[11px] font-mono text-[#6B6357]">
              <span>CIVIC PORTICO 01</span>
              <span>EST. 2026</span>
            </div>
          </div>
          <p className="text-center text-[12px] font-serif italic text-[#6B6357]">
            Dedicated Public Service & Competency Advancement
          </p>
        </motion.div>

        {/* Right Side: Main Authentication Flow */}
        <div className="w-full lg:col-span-7 space-y-5">
        {/* Main Authentication Card */}
        <motion.div variants={fadeUpVariants}>
          <div className="relative group p-6 sm:p-8 rounded-2xl bg-[#EDE4D0]/85 border border-[#D9CFBB] shadow-[0_20px_50px_-15px_rgba(10,10,10,0.08)]">
            {/* Corner Archival Registration Brackets */}
            <span className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#0A0A0A]/25 pointer-events-none" aria-hidden="true" />
            <span className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#0A0A0A]/25 pointer-events-none" aria-hidden="true" />
            <span className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-[#0A0A0A]/25 pointer-events-none" aria-hidden="true" />
            <span className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[#0A0A0A]/25 pointer-events-none" aria-hidden="true" />

            {/* Header Banner */}
            <div className="text-center mb-6 space-y-1.5">
              <div className="inline-flex p-2.5 rounded-full bg-[#0A0A0A] text-[#F5EFE0] shadow-xs mb-1">
                <Shield className="h-5 w-5 text-[#C9A24A]" />
              </div>
              <h2
                className="font-serif text-[24px] sm:text-[26px] font-normal text-[#0A0A0A] tracking-[-0.02em]"
                style={{ fontFamily: '"Fraunces", Georgia, serif' }}
              >
                {isRegister ? 'Create GovSkill Account' : 'Sign in to GovSkill'}
              </h2>
              <p className="font-sans text-[13px] text-[#6B6357]">
                Official Digital Training Gateway for Local Governance
              </p>
            </div>

            {/* Quick Demo Autofill Switcher */}
            <AnimatePresence>
              {!isRegister && (
                <motion.div
                  initial={shouldReduceMotion ? {} : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={shouldReduceMotion ? {} : { opacity: 0, height: 0 }}
                  className="mb-5 p-3.5 rounded-xl bg-[#F5EFE0] border border-[#D9CFBB] space-y-2 overflow-hidden shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-[#0A0A0A] uppercase tracking-wider">
                      <Sparkles className="h-3 w-3 text-[#C9A24A]" />
                      <span>Demo Credentials</span>
                    </span>
                    <span className="font-mono text-[10px] text-[#6B6357]">One-click populate</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleFillDemo('employee')}
                      className="px-3 py-1.5 text-[12px] font-sans font-medium rounded-full bg-[#EDE4D0] border border-[#D9CFBB] hover:border-[#0A0A0A]/50 text-[#0A0A0A] transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer min-h-[36px]"
                    >
                      <User className="h-3 w-3 text-[#6B6357]" />
                      <span>Employee</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFillDemo('admin')}
                      className="px-3 py-1.5 text-[12px] font-sans font-medium rounded-full bg-[#EDE4D0] border border-[#D9CFBB] hover:border-[#C9A24A] text-[#0A0A0A] transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer min-h-[36px]"
                    >
                      <Lock className="h-3 w-3 text-[#C9A24A]" />
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
                  className="mb-5 p-3.5 rounded-xl bg-[#C97B5A]/12 border border-[#C97B5A]/35 text-[13px] text-[#8F3E22] flex items-start gap-2.5 shadow-xs"
                >
                  <AlertCircle className="h-4 w-4 text-[#C97B5A] shrink-0 mt-0.5" />
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
                className="rounded-full min-h-[44px]"
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                leftIcon={<Lock className="h-4 w-4" />}
                className="rounded-full min-h-[44px]"
              />

              <AnimatePresence>
                {isRegister && (
                  <motion.div
                    initial={shouldReduceMotion ? {} : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={shouldReduceMotion ? {} : { opacity: 0, height: 0 }}
                    className="space-y-1.5 overflow-hidden"
                  >
                    <label htmlFor="role-select" className="block font-mono text-[10.5px] uppercase tracking-wider text-[#6B6357]">
                      Account Role
                    </label>
                    <select
                      id="role-select"
                      value={role}
                      onChange={(e) => setRole(e.target.value as 'employee' | 'admin')}
                      className="w-full rounded-full border border-[#D9CFBB] bg-[#F5EFE0] px-4 py-2.5 text-[13px] text-[#0A0A0A] focus:outline-none focus:ring-2 focus:ring-[#0A0A0A]/10 focus:border-[#0A0A0A] cursor-pointer min-h-[44px]"
                    >
                      <option value="employee">Government Employee (Trainee Officer)</option>
                      <option value="admin">Department Supervisor (Admin)</option>
                    </select>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full font-sans font-medium shadow-sm cursor-pointer rounded-full min-h-[44px]"
                  size="lg"
                  isLoading={isLoading}
                  variant="primary"
                >
                  {isRegister ? 'Register Account' : 'Sign In'}
                </Button>
              </div>
            </form>

            {/* Toggle between Register and Sign In */}
            <div className="mt-5 pt-4 border-t border-[#D9CFBB]/70 text-center text-[13px] text-[#6B6357]">
              {isRegister ? 'Already have an official account?' : "Don't have an officer account yet?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError(null);
                }}
                className="text-[#0A0A0A] font-semibold hover:underline cursor-pointer ml-1"
              >
                {isRegister ? 'Sign In' : 'Register Here'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Citizen GovAssist Shortcut Card */}
        <motion.div variants={fadeUpVariants}>
          <Link
            to="/citizen"
            className="w-full p-4 bg-[#EDE4D0]/70 hover:bg-[#EDE4D0] rounded-2xl border border-[#D9CFBB] shadow-xs flex items-center justify-between text-[13px] transition-all group hover:border-[#0A0A0A]/40"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-[#F5EFE0] text-[#2A5B4A] border border-[#D9CFBB] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <FileCheck className="h-4 w-4 text-[#2A5B4A]" />
              </div>
              <div>
                <p className="font-serif text-[14px] text-[#0A0A0A] font-normal">Visiting as a Citizen?</p>
                <p className="text-[12px] text-[#6B6357]">Use the self-service Income Certificate pre-checker</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-[#0A0A0A] group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
