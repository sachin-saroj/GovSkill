import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { GovSkillLogo } from '@/components/GovSkillLogo';
import {
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
        <h4 className="px-3 font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 select-none">
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
                className={`group flex items-center justify-between px-3 py-2 rounded-md text-[13px] font-sans transition-all duration-150 relative ${
                  active
                    ? 'bg-black text-white font-semibold shadow-xs'
                    : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`flex items-center justify-center h-6 w-6 rounded-md transition-colors ${
                      active
                        ? 'text-white'
                        : 'text-zinc-500 group-hover:text-black'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span className={`px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded-sm ${
                    active
                      ? 'bg-zinc-800 text-white border border-zinc-700'
                      : 'bg-zinc-100 text-black border border-zinc-300'
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
    <aside className="w-64 h-full flex flex-col justify-between bg-white p-4 select-none overflow-y-auto">
      {/* Top Branding & Close Button */}
      <div className="space-y-5">
        <div className="flex items-center justify-between px-2 pt-1">
          <Link
            to="/"
            onClick={onCloseMobile}
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-md p-0.5"
          >
            <GovSkillLogo size={30} variant="icon" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-sans text-[18px] font-black tracking-tight text-black">
                  GovSkill
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#0E50B0]" aria-hidden="true" />
                <span className="text-[9px] font-mono uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-sm bg-zinc-100 text-zinc-600 border border-zinc-300">
                  DPI
                </span>
              </div>
              <span className="text-[11px] font-sans text-zinc-500 font-medium">
                Digital Competency
              </span>
            </div>
          </Link>

          {isMobile && onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1.5 rounded-md text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors"
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
        <div className="bg-zinc-50 border border-[#E4E4E7] rounded-md p-3.5 text-black relative overflow-hidden shadow-xs">
          <div className="h-20 w-full rounded-sm overflow-hidden bg-white mb-2.5 flex items-center justify-center border border-[#E4E4E7]">
            <img
              src="/illustrations/sidebar_cta_illustration.jpg"
              alt="Continuous Learning"
              className="h-full w-full object-cover object-center"
              loading="lazy"
            />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#AF411E] block font-bold">
              Curriculum Goal
            </span>
            <p className="font-sans text-[13px] font-bold leading-snug text-black">
              Advance Public Service Mastery
            </p>
          </div>
          <Link
            to="/module"
            onClick={onCloseMobile}
            className="mt-2.5 block w-full py-1.5 bg-black text-white font-sans text-[12px] font-bold rounded-sm text-center shadow-xs hover:bg-zinc-800 transition-colors"
          >
            Continue Curriculum →
          </Link>
        </div>

        {/* User & System Status Card */}
        <div className="pt-2 border-t border-[#E4E4E7] space-y-2.5">
        {user ? (
          <div className="p-2.5 rounded-md bg-zinc-50 border border-[#E4E4E7] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-6 w-6 rounded-full bg-black text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-sans font-bold text-black truncate">
                    {user.email}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    {user.role}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                className="p-1 rounded-sm text-zinc-500 hover:text-black hover:bg-zinc-200 transition-colors"
                title="Log out"
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <Link
            to="/login"
            onClick={onCloseMobile}
            className="flex items-center justify-center gap-2 w-full py-2 bg-black text-white rounded-md text-[12px] font-sans font-bold shadow-xs hover:bg-zinc-800 transition-colors"
          >
            <span>Sign In to GovSkill</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
