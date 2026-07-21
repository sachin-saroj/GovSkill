import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Shield, LogOut, BookOpen, Bot, Award, FileText, LayoutDashboard } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
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

            <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-[#5A6472]">
              {user && (
                <>
                  <Link to="/module" className="flex items-center gap-1.5 hover:text-[#1E4D8C] transition-colors">
                    <BookOpen className="h-4 w-4" />
                    <span>Lessons</span>
                  </Link>
                  <Link to="/tutor" className="flex items-center gap-1.5 hover:text-[#1E4D8C] transition-colors">
                    <Bot className="h-4 w-4" />
                    <span>AI Tutor</span>
                  </Link>
                  <Link to="/quiz" className="flex items-center gap-1.5 hover:text-[#1E4D8C] transition-colors">
                    <Award className="h-4 w-4" />
                    <span>Quiz</span>
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="flex items-center gap-1.5 hover:text-[#1E4D8C] transition-colors">
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                </>
              )}
              <Link to="/citizen" className="flex items-center gap-1.5 text-[#1E4D8C] font-semibold hover:underline">
                <FileText className="h-4 w-4" />
                <span>GovAssist</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
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
                  className="flex items-center gap-1 rounded-lg border border-[#E2E6EB] px-3 py-1.5 text-xs font-medium text-[#5A6472] hover:bg-gray-50 transition-colors"
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
        </div>
      </div>
    </header>
  );
};
export default Header;
