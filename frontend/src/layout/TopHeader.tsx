import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { GovSkillLogo } from '@/components/GovSkillLogo';
import {
  Menu,
  Search,
  Sparkles,
  Award,
  BookOpen,
  Bot,
  FileCheck,
  LayoutDashboard,
  LogOut,
  Bell,
  ChevronDown,
  X,
} from 'lucide-react';

interface TopHeaderProps {
  onToggleMobileSidebar: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onToggleMobileSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global keyboard shortcut '/' or 'Cmd+K' / 'Ctrl+K' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && document.activeElement?.tagName !== 'INPUT')) {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setProfileDropdownOpen(false);
        setNotificationsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchItems = [
    { title: 'My Skills & Credentials', path: '/progress', category: 'Dashboard', icon: Sparkles },
    { title: 'Digital Document Handling', path: '/module?id=module-1', category: 'Training Module', icon: BookOpen },
    { title: 'Government Portal Operations', path: '/module?id=module-2', category: 'Training Module', icon: BookOpen },
    { title: 'Cybersecurity & Data Privacy', path: '/module?id=module-3', category: 'Training Module', icon: BookOpen },
    { title: 'Digital Record Management', path: '/module?id=module-4', category: 'Training Module', icon: BookOpen },
    { title: 'Training Copilot (AI Q&A)', path: '/tutor', category: 'AI Assistance', icon: Bot },
    { title: 'Scored Assessment / Quiz', path: '/quiz', category: 'Evaluation', icon: Award },
    { title: 'GovAssist Pre-Check', path: '/citizen', category: 'Citizen Pre-Validation', icon: FileCheck },
    ...(user?.role === 'admin'
      ? [{ title: 'Workforce Governance & Telemetry', path: '/admin', category: 'Administration', icon: LayoutDashboard }]
      : []),
  ];

  const filteredItems = searchQuery.trim()
    ? searchItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : searchItems;

  const handleSelectSearchItem = (path: string) => {
    setSearchOpen(false);
    setSearchQuery('');
    navigate(path);
  };

  const getPageTitle = () => {
    const p = location.pathname;
    if (p.startsWith('/progress')) return 'My Skills & Competency Profile';
    if (p.startsWith('/module')) return 'Curriculum & Interactive Lessons';
    if (p.startsWith('/tutor')) return 'Training Copilot';
    if (p.startsWith('/quiz')) return 'Competency Assessment';
    if (p.startsWith('/admin')) return 'Workforce Governance';
    if (p.startsWith('/citizen')) return 'GovAssist Pre-Submission Checker';
    if (p.startsWith('/verify')) return 'Official Credential Verification';
    return 'GovSkill Platform';
  };

  return (
    <header className="h-16 bg-white border-b border-[#E4E4E7] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 select-none">
      {/* Left: Mobile Sidebar Toggle & Contextual Section Heading */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-md text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <GovSkillLogo size={24} variant="icon" />
          <div className="hidden sm:flex flex-col">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] font-bold text-zinc-400">
              GovSkill Platform
            </span>
            <h2 className="font-sans text-[15px] font-bold text-black tracking-tight">
              {getPageTitle()}
            </h2>
          </div>
        </div>
      </div>

      {/* Center: Search Field Trigger */}
      <div className="flex-1 max-w-md mx-auto">
        <button
          type="button"
          onClick={() => {
            setSearchOpen(true);
            setTimeout(() => searchInputRef.current?.focus(), 50);
          }}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-md bg-zinc-50 hover:bg-zinc-100 border border-[#E4E4E7] text-[13px] font-sans text-zinc-500 hover:text-black transition-all cursor-pointer shadow-xs"
          aria-label="Search modules, skills, and tools"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Search className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
            <span className="truncate">Search lessons, assessments, tools...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-mono font-bold text-zinc-500 bg-white border border-[#E4E4E7] rounded-sm">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Utility Controls: Notifications & User Profile */}
      <div className="flex items-center gap-3 shrink-0" ref={dropdownRef}>
        {/* National DPI Status indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-emerald-50 border border-emerald-200 text-[10px] font-mono uppercase tracking-wider text-emerald-800 font-bold">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
          <span>Services Operational</span>
        </div>

        {/* Notifications button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-md text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors relative cursor-pointer border border-transparent hover:border-[#E4E4E7]"
            aria-label="View system notifications"
            aria-expanded={notificationsOpen}
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#EE8148]" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-md bg-white border border-[#E4E4E7] shadow-xl py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-[#E4E4E7] flex items-center justify-between">
                <span className="font-sans text-[13px] font-bold text-black">Notifications</span>
                <span className="font-mono text-[9px] uppercase font-bold text-zinc-500">Live</span>
              </div>
              <div className="p-3 space-y-2">
                <div className="p-2.5 rounded-md bg-zinc-50 border border-[#E4E4E7] space-y-1">
                  <div className="flex items-center gap-1.5 text-[12px] font-semibold text-black">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    <span>DPI Services Live</span>
                  </div>
                  <p className="text-[11px] font-sans text-zinc-500">
                    Local governance training curricula & GovAssist validation active.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Capsule Menu */}
        {user ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-white shadow-xs border border-[#E4E4E7] hover:border-black transition-all cursor-pointer"
              aria-label="User account menu"
              aria-expanded={profileDropdownOpen}
            >
              <div className="h-6 w-6 rounded-full bg-black text-white font-bold text-[11px] flex items-center justify-center">
                {user.email.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:flex flex-col text-left pr-1">
                <span className="text-[12px] font-bold text-black leading-tight">
                  {user.email.split('@')[0]}
                </span>
                <span className="text-[9.5px] font-mono text-zinc-500 uppercase tracking-wider">
                  {user.role} Track
                </span>
              </div>
              <ChevronDown className="h-3 w-3 text-zinc-500 hidden sm:inline-block" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-md bg-white border border-[#E4E4E7] shadow-xl py-1.5 z-50 animate-fade-in space-y-1">
                <div className="px-4 py-2.5 border-b border-[#E4E4E7]">
                  <p className="text-[12px] font-bold text-black truncate">{user.email}</p>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{user.role} Track</p>
                </div>

                <Link
                  to="/progress"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-[13px] font-sans font-medium text-black hover:bg-zinc-100"
                >
                  <Sparkles className="h-4 w-4 text-[#0E50B0]" />
                  <span>My Skills Dashboard</span>
                </Link>

                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-[13px] font-sans font-medium text-black hover:bg-zinc-100"
                  >
                    <LayoutDashboard className="h-4 w-4 text-[#AF411E]" />
                    <span>Workforce Admin</span>
                  </Link>
                )}

                <div className="pt-1 border-t border-[#E4E4E7]">
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setProfileDropdownOpen(false);
                      navigate('/login');
                    }}
                    className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-[13px] font-sans font-semibold text-[#AF411E] hover:bg-red-50 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="px-3.5 py-1.5 rounded-md bg-black text-white text-[12px] font-sans font-bold shadow-xs hover:bg-zinc-800 transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>

      {/* Quick Search Modal Overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-start justify-center pt-20 px-4"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-md border border-[#E4E4E7] shadow-2xl overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E4E4E7] bg-zinc-50">
              <Search className="h-4 w-4 text-zinc-500 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search modules, assessments, tools..."
                className="w-full text-[14px] bg-transparent text-black placeholder-zinc-400 focus:outline-none font-medium"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded-md text-zinc-500 hover:text-black hover:bg-zinc-200"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2 divide-y divide-[#E4E4E7]">
              {filteredItems.length === 0 ? (
                <div className="p-6 text-center text-[13px] text-zinc-500">
                  No matching lessons or tools found for "{searchQuery}".
                </div>
              ) : (
                filteredItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() => handleSelectSearchItem(item.path)}
                      className="w-full flex items-center justify-between p-2.5 rounded-md hover:bg-zinc-100 text-left transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="p-2 rounded-md bg-zinc-100 text-black border border-[#E4E4E7]">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-[13px] font-bold text-black">{item.title}</p>
                          <p className="text-[11px] font-mono text-zinc-500">{item.category}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-zinc-600">Jump →</span>
                    </button>
                  );
                })
              )}
            </div>
            <div className="p-2.5 bg-zinc-50 border-t border-[#E4E4E7] flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>Select item to navigate</span>
              <span>ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default TopHeader;
