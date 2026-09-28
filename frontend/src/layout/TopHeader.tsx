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
    <header className="h-16 bg-canvas/95 backdrop-blur-xs border-b border-border-warm/60 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 select-none">
      {/* Left: Mobile Sidebar Toggle & Contextual Section Heading */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-full text-text-primary hover:bg-surface border border-border-warm transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="lg:hidden flex items-center gap-2">
            <GovSkillLogo size={32} variant="icon" />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] font-medium text-text-muted-aa">
              GovSkill Workspace
            </span>
            <h2 className="font-sans text-[15px] font-semibold text-text-primary tracking-tight">
              {getPageTitle()}
            </h2>
          </div>
        </div>
      </div>

      {/* Center: Search Field Trigger (Pill Shape) */}
      <div className="flex-1 max-w-md mx-auto">
        <button
          type="button"
          onClick={() => {
            setSearchOpen(true);
            setTimeout(() => searchInputRef.current?.focus(), 50);
          }}
          className="w-full flex items-center justify-between px-4 py-2 rounded-full bg-surface/70 hover:bg-surface border border-border-warm hover:border-border-strong text-[13px] font-sans text-text-muted-aa hover:text-text-primary transition-all cursor-pointer shadow-none min-h-[42px]"
          aria-label="Search modules, skills, and tools"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Search className="h-3.5 w-3.5 text-text-muted-aa shrink-0" />
            <span className="truncate">Search lessons, assessments, tools...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[9.5px] font-mono font-medium text-text-muted-aa bg-surface-light border border-border-warm rounded-full">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Utility Controls: Operational Status, Notifications & User Profile */}
      <div className="flex items-center gap-2.5 shrink-0" ref={dropdownRef}>
        {/* National DPI Operational Status Badge */}
        <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage-50 border border-sage-200/60 text-[11px] font-mono text-sage-800 font-medium select-none">
          <span className="h-2 w-2 rounded-full bg-sage-500 animate-pulse" aria-hidden="true" />
          <span>Services Operational</span>
        </div>

        {/* Notifications button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-full text-text-muted-aa hover:text-text-primary hover:bg-surface border border-transparent hover:border-border-warm transition-colors relative cursor-pointer"
            aria-label="View system notifications"
            aria-expanded={notificationsOpen}
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-rose-400" aria-hidden="true" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-surface border border-border-warm p-3 z-50 animate-fade-in space-y-2">
              <div className="px-2 py-1 border-b border-border-warm/60 flex items-center justify-between">
                <span className="font-sans text-[13px] font-semibold text-text-primary">Notifications</span>
                <span className="font-mono text-[9px] uppercase font-bold text-sage-700 bg-sage-100 px-1.5 py-0.5 rounded-full">
                  Live
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-light border border-border-warm/60 space-y-1">
                <div className="flex items-center gap-1.5 text-[12px] font-medium text-text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-sage-500" aria-hidden="true" />
                  <span>DPI Framework Active</span>
                </div>
                <p className="text-[11px] font-sans text-text-muted-aa leading-relaxed">
                  Competency records, quiz evaluation, and pre-submission validation engines operational.
                </p>
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
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-surface border border-border-warm hover:border-border-strong transition-all cursor-pointer"
              aria-label="User account menu"
              aria-expanded={profileDropdownOpen}
            >
              <div className="h-6 w-6 rounded-full bg-ink text-surface-light font-bold text-[11px] flex items-center justify-center select-none shadow-2xs">
                {user.email.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:flex flex-col text-left pr-1">
                <span className="text-[12px] font-medium text-text-primary leading-tight">
                  {user.email.split('@')[0]}
                </span>
                <span className="text-[9px] font-mono text-text-muted-aa uppercase tracking-wider">
                  {user.role} Track
                </span>
              </div>
              <ChevronDown className="h-3 w-3 text-text-muted-aa hidden sm:inline-block" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-surface border border-border-warm p-1.5 z-50 animate-fade-in space-y-1">
                <div className="px-3.5 py-2 border-b border-border-warm/60">
                  <p className="text-[12px] font-semibold text-text-primary truncate">{user.email}</p>
                  <p className="text-[9.5px] font-mono text-text-muted-aa uppercase tracking-wider">{user.role} Track</p>
                </div>

                <Link
                  to="/progress"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-sans font-medium text-text-primary hover:bg-surface-light rounded-xl transition-colors"
                >
                  <Sparkles className="h-4 w-4 text-azure-600" />
                  <span>My Skills Dashboard</span>
                </Link>

                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-sans font-medium text-text-primary hover:bg-surface-light rounded-xl transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4 text-gold-600" />
                    <span>Workforce Admin</span>
                  </Link>
                )}

                <div className="pt-1 border-t border-border-warm/60">
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setProfileDropdownOpen(false);
                      navigate('/login');
                    }}
                    className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-[13px] font-sans font-medium text-danger-700 hover:bg-danger-50 rounded-xl transition-colors cursor-pointer"
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
            className="px-4 py-1.5 rounded-full bg-ink text-surface-light text-[12px] font-sans font-medium hover:bg-[#252525] transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>

      {/* Quick Search Modal Overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 bg-ink/50 backdrop-blur-xs z-50 flex items-start justify-center pt-20 px-4"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-surface rounded-2xl border border-border-warm overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border-warm bg-surface-light">
              <Search className="h-4 w-4 text-text-muted-aa shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search modules, assessments, tools..."
                className="w-full text-[14px] bg-transparent text-text-primary placeholder:text-text-muted-aa focus:outline-none font-medium"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded-full text-text-muted-aa hover:text-text-primary hover:bg-surface transition-colors cursor-pointer"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2 divide-y divide-border-warm/40">
              {filteredItems.length === 0 ? (
                <div className="p-6 text-center text-[13px] text-text-muted-aa">
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
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-light text-left transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="p-2 rounded-lg bg-surface-light border border-border-warm text-text-primary group-hover:bg-surface">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-[13px] font-medium text-text-primary">{item.title}</p>
                          <p className="text-[11px] font-mono text-text-muted-aa">{item.category}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono font-medium text-text-muted-aa group-hover:text-text-primary">
                        Jump →
                      </span>
                    </button>
                  );
                })
              )}
            </div>
            <div className="p-3 bg-surface-light border-t border-border-warm flex items-center justify-between text-[11px] font-mono text-text-muted-aa">
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
