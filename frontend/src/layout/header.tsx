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
    <header className="sticky top-0 z-50 bg-white shadow-civic-xs">
      {/* Official Civic Top Bar */}
      <div className="bg-civic-950 text-slate-300 text-micro py-1.5 px-4 sm:px-6 lg:px-8 border-b border-civic-900">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-saffron-500 animate-pulse" />
            <span className="font-semibold tracking-wider uppercase text-slate-200">
              National Digital Public Infrastructure • Local Governance Platform
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-400 font-normal">
            <span className="hover:text-slate-200 transition-colors">GovSkill v1.0</span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
              Services Operational
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Brand Logo */}
            <div className="flex items-center gap-8">
              <Link
                to="/"
                className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-civic-700 rounded-civic-md p-1"
              >
                <div className="h-10 w-10 rounded-civic-xl bg-gradient-to-br from-civic-800 to-civic-950 text-white flex items-center justify-center shadow-civic-sm group-hover:scale-105 transition-transform duration-200">
                  <Shield className="h-5 w-5 text-saffron-400" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-section-heading tracking-tight text-civic-950">GovSkill</span>
                    <span className="text-micro uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded-civic-sm bg-civic-100 text-civic-800">
                      Portal
                    </span>
                  </div>
                  <span className="text-micro text-slate-500 font-medium hidden sm:inline-block">
                    Digital Skills & Document Verification
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1 text-caption font-semibold">
                {user && (
                  <>
                    <Link
                      to="/progress"
                      className={`flex items-center gap-2 px-3 py-2 rounded-civic-md text-caption font-semibold transition-all duration-150 ${
                        isActive('/progress')
                          ? 'bg-civic-50 text-civic-800 border border-civic-200/80 shadow-civic-xs'
                          : 'text-slate-600 hover:text-civic-800 hover:bg-slate-50'
                      }`}
                    >
                      <Sparkles className="h-4 w-4 text-saffron-600" />
                      <span>My Skills</span>
                    </Link>

                    <Link
                      to="/module"
                      className={`flex items-center gap-2 px-3 py-2 rounded-civic-md text-caption font-semibold transition-all duration-150 ${
                        isActive('/module')
                          ? 'bg-civic-50 text-civic-800 border border-civic-200/80 shadow-civic-xs'
                          : 'text-slate-600 hover:text-civic-800 hover:bg-slate-50'
                      }`}
                    >
                      <BookOpen className="h-4 w-4 text-civic-700" />
                      <span>Lessons</span>
                    </Link>

                    <Link
                      to="/tutor"
                      className={`flex items-center gap-2 px-3 py-2 rounded-civic-md text-caption font-semibold transition-all duration-150 ${
                        isActive('/tutor')
                          ? 'bg-civic-50 text-civic-800 border border-civic-200/80 shadow-civic-xs'
                          : 'text-slate-600 hover:text-civic-800 hover:bg-slate-50'
                      }`}
                    >
                      <Bot className="h-4 w-4 text-civic-600" />
                      <span>AI Tutor</span>
                    </Link>

                    <Link
                      to="/quiz"
                      className={`flex items-center gap-2 px-3 py-2 rounded-civic-md text-caption font-semibold transition-all duration-150 ${
                        isActive('/quiz')
                          ? 'bg-civic-50 text-civic-800 border border-civic-200/80 shadow-civic-xs'
                          : 'text-slate-600 hover:text-civic-800 hover:bg-slate-50'
                      }`}
                    >
                      <Award className="h-4 w-4 text-saffron-600" />
                      <span>Quiz</span>
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className={`flex items-center gap-2 px-3 py-2 rounded-civic-md text-caption font-semibold transition-all duration-150 ${
                          isActive('/admin')
                            ? 'bg-civic-50 text-civic-800 border border-civic-200/80 shadow-civic-xs'
                            : 'text-slate-600 hover:text-civic-800 hover:bg-slate-50'
                        }`}
                      >
                        <LayoutDashboard className="h-4 w-4 text-civic-700" />
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
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-civic-md text-caption font-semibold border transition-all duration-150 ${
                  isActive('/citizen')
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-civic-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-800'
                }`}
              >
                <FileCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>GovAssist Pre-Check</span>
                <span className="text-micro bg-emerald-600 text-white px-1.5 py-0.5 rounded-full font-semibold">
                  Citizen
                </span>
              </Link>

              <div className="h-5 w-px bg-slate-200" />

              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-civic-md">
                    <div className="h-6 w-6 rounded-full bg-civic-800 text-white flex items-center justify-center text-micro font-semibold">
                      <User className="h-3.5 w-3.5" />
                    </div>
                    <div className="text-left">
                      <p className="text-caption font-semibold text-slate-900 leading-tight max-w-[140px] truncate">
                        {user.email}
                      </p>
                      <span className="inline-block text-micro font-semibold uppercase tracking-wider text-civic-700">
                        {user.role}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="flex items-center gap-1.5 rounded-civic-md border border-slate-200 bg-white px-3 py-2 text-caption font-semibold text-slate-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span className="hidden xl:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="rounded-civic-md bg-civic-800 px-4 py-2 text-caption font-semibold text-white shadow-civic-sm hover:bg-civic-900 transition-all active:scale-95"
                >
                  Officer Login
                </Link>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex lg:hidden items-center gap-2">
              <Link
                to="/citizen"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-civic-md text-caption font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
              >
                <FileCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>GovAssist</span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-civic-900 rounded-civic-md border border-slate-200 hover:bg-slate-50 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-slate-200 space-y-3 animate-slide-up">
              {user && (
                <div className="space-y-1">
                  <div className="px-3 py-2 text-micro font-semibold uppercase tracking-wider text-slate-400">
                    Employee Training
                  </div>
                  <Link
                    to="/progress"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-civic-md text-caption font-semibold ${
                      isActive('/progress')
                        ? 'bg-civic-50 text-civic-800 border border-civic-200/80'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Sparkles className="h-4 w-4 text-saffron-600" />
                    <span>My Skills & Progress</span>
                  </Link>

                  <Link
                    to="/module"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-civic-md text-caption font-semibold ${
                      isActive('/module')
                        ? 'bg-civic-50 text-civic-800 border border-civic-200/80'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <BookOpen className="h-4 w-4 text-civic-700" />
                    <span>Lessons & Curriculum</span>
                  </Link>

                  <Link
                    to="/tutor"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-civic-md text-caption font-semibold ${
                      isActive('/tutor')
                        ? 'bg-civic-50 text-civic-800 border border-civic-200/80'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Bot className="h-4 w-4 text-civic-600" />
                    <span>AI Tutor Assistance</span>
                  </Link>

                  <Link
                    to="/quiz"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-civic-md text-caption font-semibold ${
                      isActive('/quiz')
                        ? 'bg-civic-50 text-civic-800 border border-civic-200/80'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Award className="h-4 w-4 text-saffron-600" />
                    <span>Module Certification Quiz</span>
                  </Link>

                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-civic-md text-caption font-semibold ${
                        isActive('/admin')
                          ? 'bg-civic-50 text-civic-800 border border-civic-200/80'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <LayoutDashboard className="h-4 w-4 text-civic-700" />
                      <span>Admin Management Dashboard</span>
                    </Link>
                  )}
                </div>
              )}

              <div className="space-y-1">
                <div className="px-3 py-2 text-micro font-semibold uppercase tracking-wider text-slate-400">
                  Citizen Services
                </div>
                <Link
                  to="/citizen"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-civic-md text-caption font-semibold ${
                    isActive('/citizen')
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileCheck className="h-4 w-4 text-emerald-600" />
                    <span>GovAssist Pre-Submission Checker</span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                </Link>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between px-3">
                {user ? (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-civic-800 text-white flex items-center justify-center text-micro font-semibold">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-caption font-semibold text-slate-900">{user.email}</p>
                        <span className="text-micro font-semibold uppercase tracking-wider text-civic-700">
                          {user.role}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1.5 text-caption text-red-600 font-semibold px-2.5 py-1 rounded-civic-md hover:bg-red-50"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 bg-civic-800 text-white rounded-civic-md text-caption font-semibold shadow-civic-sm"
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
