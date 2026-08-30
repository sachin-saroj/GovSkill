import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  Shield,
  LogOut,
  BookOpen,
  Bot,
  Award,
  FileCheck,
  LayoutDashboard,
  Sparkles,
  Menu,
  X,
  User,
  ExternalLink,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-civic-xs font-body">
      {/* Official Civic Top Bar */}
      <div className="bg-ink text-slate-300 text-[11px] py-1.5 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono">
            <span className="inline-block w-2 h-2 rounded-full bg-marigold animate-pulse" />
            <span className="font-medium tracking-wide uppercase text-slate-200">
              National Digital Public Infrastructure • Local Governance Platform
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-400 font-mono text-[10px]">
            <span className="hover:text-slate-200 transition-colors">GovSkill v1.0</span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
              Services Operational
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="border-b border-stone-200/90 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Brand Logo */}
            <div className="flex items-center gap-8">
              <Link
                to="/"
                className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded-lg p-1"
              >
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-ink to-slate-900 text-white flex items-center justify-center shadow-civic-sm group-hover:scale-105 transition-transform duration-200 border border-slate-700">
                  <Shield className="h-5 w-5 text-marigold" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xl tracking-tight text-ink font-display">GovSkill</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200/60 font-mono">
                      Portal
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium hidden sm:inline-block">
                    Digital Skills & Document Verification
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
                {user && (
                  <>
                    <Link
                      to="/progress"
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                        isActive('/progress')
                          ? 'bg-amber-50 text-ink border border-amber-200/80 shadow-civic-xs'
                          : 'text-slate-600 hover:text-ink hover:bg-paper'
                      }`}
                    >
                      <Sparkles className="h-4 w-4 text-marigold" />
                      <span>My Skills</span>
                    </Link>

                    <Link
                      to="/module"
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                        isActive('/module')
                          ? 'bg-amber-50 text-ink border border-amber-200/80 shadow-civic-xs'
                          : 'text-slate-600 hover:text-ink hover:bg-paper'
                      }`}
                    >
                      <BookOpen className="h-4 w-4 text-ink" />
                      <span>Lessons</span>
                    </Link>

                    <Link
                      to="/tutor"
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                        isActive('/tutor')
                          ? 'bg-amber-50 text-ink border border-amber-200/80 shadow-civic-xs'
                          : 'text-slate-600 hover:text-ink hover:bg-paper'
                      }`}
                    >
                      <Bot className="h-4 w-4 text-blue-600" />
                      <span>AI Tutor</span>
                    </Link>

                    <Link
                      to="/quiz"
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                        isActive('/quiz')
                          ? 'bg-amber-50 text-ink border border-amber-200/80 shadow-civic-xs'
                          : 'text-slate-600 hover:text-ink hover:bg-paper'
                      }`}
                    >
                      <Award className="h-4 w-4 text-marigold" />
                      <span>Quiz</span>
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                          isActive('/admin')
                            ? 'bg-amber-50 text-ink border border-amber-200/80 shadow-civic-xs'
                            : 'text-slate-600 hover:text-ink hover:bg-paper'
                        }`}
                      >
                        <LayoutDashboard className="h-4 w-4 text-purple-700" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                  </>
                )}
              </nav>
            </div>

            {/* Desktop Right Action Area */}
            <div className="hidden lg:flex items-center gap-3">
              {/* GovAssist Citizen Shortcut Pill */}
              <Link
                to="/citizen"
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                  isActive('/citizen')
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-civic-xs'
                    : 'bg-paper text-slate-700 border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-900'
                }`}
              >
                <FileCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>GovAssist Pre-Check</span>
                <span className="text-[10px] bg-emerald-700 text-white px-1.5 py-0.2 rounded font-medium">
                  Citizen
                </span>
              </Link>

              <div className="h-5 w-px bg-stone-200" />

              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2.5 bg-paper border border-stone-200 px-3 py-1.5 rounded-lg">
                    <div className="h-6 w-6 rounded-full bg-ink text-white flex items-center justify-center text-[10px] font-bold">
                      <User className="h-3.5 w-3.5" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-ink leading-tight max-w-[140px] truncate">
                        {user.email}
                      </p>
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-marigold font-mono">
                        {user.role}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span className="hidden xl:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="rounded-lg bg-ink px-4 py-2 text-xs font-semibold text-white shadow-civic-sm hover:bg-slate-900 transition-all"
                >
                  Officer Login
                </Link>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex lg:hidden items-center gap-2">
              <Link
                to="/citizen"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200"
              >
                <FileCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>GovAssist</span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-ink rounded-lg border border-stone-200 hover:bg-paper transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-stone-200 space-y-3 animate-slide-up bg-white">
              {user && (
                <div className="space-y-1">
                  <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Employee Training
                  </div>
                  <Link
                    to="/progress"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                      isActive('/progress')
                        ? 'bg-amber-50 text-ink font-semibold border border-amber-200/80'
                        : 'text-slate-600 hover:bg-paper'
                    }`}
                  >
                    <Sparkles className="h-4 w-4 text-marigold" />
                    <span>My Skills & Progress</span>
                  </Link>

                  <Link
                    to="/module"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                      isActive('/module')
                        ? 'bg-amber-50 text-ink font-semibold border border-amber-200/80'
                        : 'text-slate-600 hover:bg-paper'
                    }`}
                  >
                    <BookOpen className="h-4 w-4 text-ink" />
                    <span>Lessons & Curriculum</span>
                  </Link>

                  <Link
                    to="/tutor"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                      isActive('/tutor')
                        ? 'bg-amber-50 text-ink font-semibold border border-amber-200/80'
                        : 'text-slate-600 hover:bg-paper'
                    }`}
                  >
                    <Bot className="h-4 w-4 text-blue-600" />
                    <span>AI Tutor Assistance</span>
                  </Link>

                  <Link
                    to="/quiz"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                      isActive('/quiz')
                        ? 'bg-amber-50 text-ink font-semibold border border-amber-200/80'
                        : 'text-slate-600 hover:bg-paper'
                    }`}
                  >
                    <Award className="h-4 w-4 text-marigold" />
                    <span>Module Certification Quiz</span>
                  </Link>

                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                        isActive('/admin')
                          ? 'bg-amber-50 text-ink font-semibold border border-amber-200/80'
                          : 'text-slate-600 hover:bg-paper'
                      }`}
                    >
                      <LayoutDashboard className="h-4 w-4 text-purple-700" />
                      <span>Admin Management Dashboard</span>
                    </Link>
                  )}
                </div>
              )}

              <div className="space-y-1">
                <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Citizen Services
                </div>
                <Link
                  to="/citizen"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive('/citizen')
                      ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200'
                      : 'text-slate-700 hover:bg-paper'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileCheck className="h-4 w-4 text-emerald-600" />
                    <span>GovAssist Pre-Submission Checker</span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                </Link>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-between px-3">
                {user ? (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-ink text-white flex items-center justify-center text-xs font-bold">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-ink">{user.email}</p>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-marigold font-mono">
                          {user.role}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1.5 text-xs text-red-600 font-semibold px-2.5 py-1 rounded-md hover:bg-red-50"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 bg-ink text-white rounded-lg text-sm font-semibold shadow-civic-sm"
                  >
                    Officer Sign In
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
