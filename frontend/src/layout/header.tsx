import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  Shield,
  LogOut,
  BookOpen,
  Bot,
  Award,
  FileText,
  LayoutDashboard,
  Sparkles,
  Menu,
  X,
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
    <header className="border-b border-[#E2E6EB] bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 font-semibold text-xl text-[#1E4D8C]">
              <Shield className="h-6 w-6 text-[#1E4D8C]" />
              <span>GovSkill</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
              {user && (
                <>
                  <Link
                    to="/progress"
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                      isActive('/progress')
                        ? 'text-[#1E4D8C] font-semibold bg-[#1E4D8C]/10'
                        : 'text-[#5A6472] hover:text-[#1E4D8C]'
                    }`}
                  >
                    <Sparkles className="h-4 w-4 text-[#D98E04]" />
                    <span>My Skills</span>
                  </Link>

                  <Link
                    to="/module"
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                      isActive('/module')
                        ? 'text-[#1E4D8C] font-semibold bg-[#1E4D8C]/10'
                        : 'text-[#5A6472] hover:text-[#1E4D8C]'
                    }`}
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Lessons</span>
                  </Link>

                  <Link
                    to="/tutor"
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                      isActive('/tutor')
                        ? 'text-[#1E4D8C] font-semibold bg-[#1E4D8C]/10'
                        : 'text-[#5A6472] hover:text-[#1E4D8C]'
                    }`}
                  >
                    <Bot className="h-4 w-4" />
                    <span>AI Tutor</span>
                  </Link>

                  <Link
                    to="/quiz"
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                      isActive('/quiz')
                        ? 'text-[#1E4D8C] font-semibold bg-[#1E4D8C]/10'
                        : 'text-[#5A6472] hover:text-[#1E4D8C]'
                    }`}
                  >
                    <Award className="h-4 w-4" />
                    <span>Quiz</span>
                  </Link>

                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                        isActive('/admin')
                          ? 'text-[#1E4D8C] font-semibold bg-[#1E4D8C]/10'
                          : 'text-[#5A6472] hover:text-[#1E4D8C]'
                      }`}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                </>
              )}

              <Link
                to="/citizen"
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                  isActive('/citizen')
                    ? 'text-[#1E4D8C] font-semibold bg-[#1E4D8C]/10'
                    : 'text-[#1E4D8C] font-medium hover:underline'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>GovAssist</span>
              </Link>
            </nav>
          </div>

          {/* Desktop User Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-medium text-[#1A1F2B]">{user.email}</p>
                  <span className="inline-block px-2 py-0.5 text-[10px] font-semibold uppercase rounded bg-[#1E4D8C]/10 text-[#1E4D8C]">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 rounded-lg border border-[#E2E6EB] px-3 py-1.5 text-xs font-medium text-[#5A6472] hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="rounded-lg bg-[#1E4D8C] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#163A6B] transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#5A6472] hover:text-[#1E4D8C] rounded-lg border border-[#E2E6EB]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#E2E6EB] space-y-3">
            {user && (
              <div className="space-y-1">
                <Link
                  to="/progress"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    isActive('/progress') ? 'bg-[#1E4D8C]/10 text-[#1E4D8C] font-semibold' : 'text-[#5A6472]'
                  }`}
                >
                  <Sparkles className="h-4 w-4 text-[#D98E04]" />
                  <span>My Skills</span>
                </Link>

                <Link
                  to="/module"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    isActive('/module') ? 'bg-[#1E4D8C]/10 text-[#1E4D8C] font-semibold' : 'text-[#5A6472]'
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Lessons</span>
                </Link>

                <Link
                  to="/tutor"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    isActive('/tutor') ? 'bg-[#1E4D8C]/10 text-[#1E4D8C] font-semibold' : 'text-[#5A6472]'
                  }`}
                >
                  <Bot className="h-4 w-4" />
                  <span>AI Tutor</span>
                </Link>

                <Link
                  to="/quiz"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    isActive('/quiz') ? 'bg-[#1E4D8C]/10 text-[#1E4D8C] font-semibold' : 'text-[#5A6472]'
                  }`}
                >
                  <Award className="h-4 w-4" />
                  <span>Quiz</span>
                </Link>

                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                      isActive('/admin') ? 'bg-[#1E4D8C]/10 text-[#1E4D8C] font-semibold' : 'text-[#5A6472]'
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
              </div>
            )}

            <Link
              to="/citizen"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                isActive('/citizen') ? 'bg-[#1E4D8C]/10 text-[#1E4D8C] font-semibold' : 'text-[#1E4D8C]'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>GovAssist (Citizen Pre-check)</span>
            </Link>

            <div className="pt-3 border-t border-[#E2E6EB] flex items-center justify-between px-3">
              {user ? (
                <>
                  <div>
                    <p className="text-xs font-medium text-[#1A1F2B]">{user.email}</p>
                    <span className="text-[10px] text-[#5A6472] uppercase">{user.role}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-xs text-[#C0392B] font-semibold"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 bg-[#1E4D8C] text-white rounded-lg text-sm font-semibold"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
export default Header;
