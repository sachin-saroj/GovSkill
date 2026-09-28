import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('govskill_sidebar_collapsed') === 'true';
      } catch {
        return false;
      }
    }
    return false;
  });

  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('govskill_sidebar_collapsed', String(next));
      } catch {
        // Ignore local storage error in restricted contexts
      }
      return next;
    });
  }, []);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileSidebarOpen]);

  return (
    <div className="min-h-screen bg-canvas bg-[#FAF4E4] text-text-primary flex flex-col lg:flex-row relative selection:bg-rose-200 selection:text-text-primary">
      {/* Accessible Skip to Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-ink text-surface-light text-xs font-mono font-bold rounded-full shadow-md outline-none ring-2 ring-ink"
      >
        Skip to main content
      </a>

      {/* 1. Mobile Drawer Sidebar (hidden on desktop) */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-ink/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <div
            className="relative flex-1 flex flex-col max-w-xs w-full bg-transparent z-10 m-2 animate-slide-up"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation drawer"
          >
            <Sidebar isMobile onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* 2. Desktop Detached Floating Sidebar */}
      <div
        className={`hidden lg:flex flex-col shrink-0 my-3 ml-3 lg:my-4 lg:ml-4 transition-[width] duration-200 ease-out ${
          isCollapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        <Sidebar isCollapsed={isCollapsed} onToggleCollapse={handleToggleCollapse} />
      </div>

      {/* 3. Main Application Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen lg:min-h-[calc(100vh-2rem)] overflow-x-hidden">
        <TopHeader onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 p-4 sm:p-6 lg:p-8 w-full overflow-y-auto outline-none"
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
