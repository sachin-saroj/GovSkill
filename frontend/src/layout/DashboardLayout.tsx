import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black p-0 lg:p-4 flex flex-col justify-center selection:bg-[#0E50B0]/15 selection:text-black">
      {/* Accessible Skip to Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-black text-white text-xs font-mono font-bold shadow-md outline-none ring-2 ring-black"
      >
        Skip to main content
      </a>

      {/* 1. Mobile Drawer Sidebar (hidden on desktop) */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <div
            className="relative flex-1 flex flex-col max-w-xs w-full bg-white z-10 border-r border-[#E4E4E7] shadow-xl animate-slide-up"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation drawer"
          >
            <Sidebar isMobile onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* 2. Master Editorial Shell */}
      <div className="w-full max-w-[1580px] mx-auto bg-white lg:border border-[#E4E4E7] flex flex-col lg:flex-row min-h-[calc(100vh-2rem)] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        {/* Desktop Integrated Sidebar */}
        <div className="hidden lg:block shrink-0 border-r border-[#E4E4E7] bg-white">
          <Sidebar />
        </div>

        {/* Main Application Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          <TopHeader onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
          <main id="main-content" tabIndex={-1} className="flex-1 p-4 sm:p-6 lg:p-8 w-full overflow-y-auto outline-none">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
