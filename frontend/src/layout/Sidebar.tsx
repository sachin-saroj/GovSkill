import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  Shield,
  Sparkles,
  BookOpen,
  Bot,
  Award,
  FileCheck,
  ShieldCheck,
  LayoutDashboard,
  LogOut,
  X,
  ExternalLink,
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
  isMobile?: boolean;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
  badge?: string;
  badgeVariant?: 'mint' | 'saffron' | 'civic';
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile, isMobile = false }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const learningNavItems: NavItem[] = [
    { name: 'My Skills', path: '/progress', icon: Sparkles },
    { name: 'Training Modules', path: '/module', icon: BookOpen },
    { name: 'Training Copilot', path: '/tutor', icon: Bot, badge: 'AI' },
    { name: 'Scored Quiz', path: '/quiz', icon: Award },
  ];

  const serviceNavItems: NavItem[] = [
    { name: 'GovAssist Pre-Check', path: '/citizen', icon: FileCheck },
    { name: 'Verify Credentials', path: '/verify', icon: ShieldCheck },
  ];

  const adminNavItems: NavItem[] = [
    { name: 'Workforce Admin', path: '/admin', icon: LayoutDashboard, adminOnly: true },
  ];

  const renderNavGroup = (title: string, items: NavItem[]) => {
    const visibleItems = items.filter((item) => !item.adminOnly || user?.role === 'admin');
    if (visibleItems.length === 0) return null;

    return (
      <div className="space-y-1 pt-3 first:pt-0">
        <h4 className="px-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#6B6357] select-none">
          {title}
        </h4>
        <nav className="space-y-0.5" aria-label={title}>
          {visibleItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={`group flex items-center justify-between px-3 py-2 rounded-full text-[13px] font-sans transition-all duration-150 relative ${
                  active
                    ? 'bg-[#0A0A0A] text-[#F5EFE0] font-medium shadow-sm'
                    : 'text-[#6B6357] hover:text-[#0A0A0A] hover:bg-[#EDE4D0]/90'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`flex items-center justify-center h-6 w-6 rounded-full transition-colors ${
                      active
                        ? 'text-[#F5EFE0]'
                        : 'text-[#6B6357] group-hover:text-[#0A0A0A]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span className={`px-1.5 py-0.2 text-[9px] font-mono font-semibold uppercase tracking-wider rounded-full ${
                    active
                      ? 'bg-[#222222] text-[#F5EFE0] border border-white/20'
                      : 'bg-[#EDE4D0] text-[#0A0A0A] border border-[#D9CFBB]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    );
  };

  return (
    <aside className="w-64 h-full flex flex-col justify-between bg-transparent p-4 select-none overflow-y-auto">
      {/* Top Branding & Close Button */}
      <div className="space-y-5">
        <div className="flex items-center justify-between px-2 pt-1">
          <Link
            to="/"
            onClick={onCloseMobile}
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A] rounded-lg p-0.5"
          >
            <div className="h-8 w-8 rounded-xl bg-[#0A0A0A] text-[#F5EFE0] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200">
              <Shield className="h-4 w-4 text-[#C9A24A]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span
                  className="font-serif text-[18px] font-normal tracking-[-0.02em] text-[#0A0A0A]"
                  style={{ fontFamily: '"Fraunces", Georgia, serif' }}
                >
                  GovSkill
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8964A]" aria-hidden="true" />
                <span className="text-[9px] font-mono uppercase font-semibold tracking-wider px-1.5 py-0.2 rounded-full bg-[#EDE4D0] text-[#6B6357] border border-[#D9CFBB]">
                  DPI
                </span>
              </div>
              <span className="text-[11px] font-sans text-[#6B6357] font-normal">
                Digital Competency
              </span>
            </div>
          </Link>

          {isMobile && onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-[#6B6357] hover:text-[#0A0A0A] hover:bg-[#EDE4D0] transition-colors"
              aria-label="Close navigation sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="space-y-3">
          {renderNavGroup('Curriculum & Skills', learningNavItems)}
          {renderNavGroup('Public Services', serviceNavItems)}
          {renderNavGroup('Administration', adminNavItems)}
        </div>
      </div>

      {/* Bottom Section: Editorial Learning CTA Card + User Profile */}
      <div className="pt-3 space-y-3">
        {/* Editorial Learning CTA Card */}
        <div className="bg-[#EDE4D0]/85 border border-[#D9CFBB] rounded-2xl p-3.5 text-[#0A0A0A] relative overflow-hidden shadow-xs">
          <div className="h-20 w-full rounded-xl overflow-hidden bg-[#F5EFE0] mb-2.5 flex items-center justify-center border border-[#D9CFBB]/60">
            <img
              src="/illustrations/sidebar_cta_illustration.jpg"
              alt="Continuous Learning"
              className="h-full w-full object-cover object-center"
              loading="lazy"
            />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#C97B5A] block font-semibold">
              Curriculum Goal
            </span>
            <p className="font-serif text-[13px] font-normal leading-snug text-[#0A0A0A]">
              Advance Public Service Mastery
            </p>
          </div>
          <Link
            to="/module"
            onClick={onCloseMobile}
            className="mt-2.5 block w-full py-1.5 bg-[#0A0A0A] text-[#F5EFE0] font-sans text-[12px] font-medium rounded-full text-center shadow-xs hover:bg-[#222222] transition-colors"
          >
            Continue Curriculum →
          </Link>
        </div>

        {/* User & System Status Card */}
        <div className="pt-2 border-t border-[#D9CFBB]/70 space-y-2.5">
        {user ? (
          <div className="p-2.5 rounded-xl bg-[#EDE4D0]/80 border border-[#D9CFBB] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-6 w-6 rounded-full bg-[#0A0A0A] text-[#F5EFE0] font-semibold text-[11px] flex items-center justify-center shrink-0">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-medium text-[#0A0A0A] truncate">
                    {user.email.split('@')[0]}
                  </p>
                  <p className="text-[10px] font-mono text-[#6B6357] uppercase tracking-wider">
                    {user.role} Track
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  if (onCloseMobile) onCloseMobile();
                }}
                className="p-1.5 rounded-lg text-[#6B6357] hover:text-[#C97B5A] hover:bg-[#EDE4D0] transition-colors cursor-pointer"
                title="Sign out of GovSkill session"
                aria-label="Sign out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-2.5 rounded-xl bg-[#EDE4D0]/80 border border-[#D9CFBB] shadow-xs text-center">
            <Link
              to="/login"
              onClick={onCloseMobile}
              className="inline-flex items-center justify-center w-full px-3 py-1.5 rounded-full bg-[#0A0A0A] hover:bg-[#222222] text-[#F5EFE0] text-[12px] font-medium transition-colors"
            >
              Sign In to Session
            </Link>
          </div>
        )}

        {/* DPI Operational Indicator */}
        <div className="px-1 flex items-center justify-between text-[11px] font-mono text-[#6B6357]">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2A5B4A] inline-block animate-pulse" />
            <span>GovSkill v1.0</span>
          </span>
          <Link
            to="/"
            onClick={onCloseMobile}
            className="hover:text-[#0A0A0A] transition-colors inline-flex items-center gap-0.5"
          >
            <span>Overview</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  </aside>
);
};

export default Sidebar;
