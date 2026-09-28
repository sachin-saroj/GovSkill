import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { GovSkillLogo } from '@/components/GovSkillLogo';
import Tooltip from '@/components/ui/Tooltip';
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
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export interface SidebarProps {
  onCloseMobile?: () => void;
  isMobile?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onCloseMobile,
  isMobile = false,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/module') return location.pathname.startsWith('/module');
    if (path === '/quiz') return location.pathname.startsWith('/quiz');
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
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
        {!isCollapsed && (
          <h4 className="px-3 font-mono text-[10px] uppercase tracking-[0.18em] font-medium text-white/40 select-none">
            {title}
          </h4>
        )}
        {isCollapsed && <div className="w-8 mx-auto h-[1px] bg-white/10 my-2" aria-hidden="true" />}
        <nav className="space-y-1" aria-label={title}>
          {visibleItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;

            const linkContent = (
              <Link
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={`group flex items-center ${
                  isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
                } rounded-xl text-[13px] font-sans transition-all duration-150 relative select-none ${
                  active
                    ? 'bg-white/15 text-white font-medium'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
                aria-current={active ? 'page' : undefined}
                aria-label={isCollapsed ? item.name : undefined}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} min-w-0`}>
                  <span
                    className={`flex items-center justify-center shrink-0 transition-colors ${
                      active ? 'text-white' : 'text-white/60 group-hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </div>

                {!isCollapsed && item.badge && (
                  <span
                    className={`px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded-full ${
                      active
                        ? 'bg-azure-200 text-azure-900 border border-azure-300'
                        : 'bg-white/10 text-white/80 border border-white/15'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );

            if (isCollapsed) {
              return (
                <Tooltip key={item.path} content={item.name} position="bottom" className="w-full justify-center">
                  {linkContent}
                </Tooltip>
              );
            }

            return linkContent;
          })}
        </nav>
      </div>
    );
  };

  return (
    <aside
      className={`h-full flex flex-col justify-between bg-ink text-white p-3.5 select-none overflow-y-auto overflow-x-hidden rounded-3xl border border-white/5 transition-all duration-200 ${
        isCollapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      {/* Top Branding & Collapse Control */}
      <div className="space-y-4">
        <div
          className={`flex items-center ${
            isCollapsed ? 'flex-col gap-2.5' : 'justify-between'
          } px-1.5 pt-1 min-h-[40px]`}
        >
          <Link
            to="/"
            onClick={onCloseMobile}
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'} group focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-xl p-1`}
            aria-label="GovSkill Home"
          >
            <GovSkillLogo size={36} variant="icon" />
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-sans text-[17px] font-bold tracking-tight text-white">
                    GovSkill
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-azure-400" aria-hidden="true" />
                  <span className="text-[9px] font-mono uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-full bg-white/10 text-white/80 border border-white/15">
                    DPI
                  </span>
                </div>
                <span className="text-[10.5px] font-sans text-white/50 font-normal truncate">
                  Digital Competency
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle Button */}
          {!isMobile && onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer shrink-0"
              aria-label={isCollapsed ? 'Expand navigation sidebar' : 'Collapse navigation sidebar'}
            >
              {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
            </button>
          )}

          {/* Mobile Drawer Close Button */}
          {isMobile && onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1.5 rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-colors"
              aria-label="Close navigation sidebar"
            >
              <X className="h-4 w-4" />
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

      {/* Bottom Section: User Profile & Actions */}
      <div className="pt-3 border-t border-white/10 space-y-2">
        {user ? (
          <div
            className={`rounded-2xl bg-white/5 border border-white/10 p-2.5 transition-all ${
              isCollapsed ? 'flex flex-col items-center gap-2 p-2' : 'flex items-center justify-between gap-2'
            }`}
          >
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'} min-w-0`}>
              <div
                className="h-7 w-7 rounded-full bg-white text-ink font-bold text-[11px] flex items-center justify-center shrink-0 select-none shadow-xs"
                title={user.email}
              >
                {user.email.charAt(0).toUpperCase()}
              </div>
              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-sans font-medium text-white truncate">
                    {user.email.split('@')[0]}
                  </div>
                  <div className="text-[9.5px] font-mono uppercase tracking-wider text-white/50">
                    {user.role} Track
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={logout}
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Log out"
              aria-label="Log out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            onClick={onCloseMobile}
            className={`flex items-center justify-center gap-2 w-full py-2.5 bg-white text-ink rounded-full text-[12px] font-sans font-medium transition-colors hover:bg-surface-light ${
              isCollapsed ? 'px-2' : 'px-4'
            }`}
            aria-label="Sign In"
          >
            {!isCollapsed && <span>Sign In</span>}
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
