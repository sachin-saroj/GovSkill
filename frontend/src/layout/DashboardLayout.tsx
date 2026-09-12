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
    <div className="min-h-screen bg-[#F5EFE0] text-[#0A0A0A] p-0 lg:p-4 xl:p-6 flex flex-col justify-center">
      {/* 1. Mobile Drawer Sidebar (hidden on desktop) */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-[#0A0A0A]/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <div
            className="relative flex-1 flex flex-col max-w-xs w-full bg-[#EDE4D0] z-10 border-r border-[#D9CFBB] shadow-2xl animate-slide-up"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation drawer"
          >
            <Sidebar isMobile onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* 2. Master Floating Canvas Shell */}
      <div className="w-full max-w-[1560px] mx-auto bg-[#EDE4D0]/40 lg:rounded-[28px] shadow-[0_24px_60px_-15px_rgba(10,10,10,0.08)] border border-[#D9CFBB] flex flex-col lg:flex-row min-h-[calc(100vh-3rem)] overflow-hidden">
        {/* Desktop Integrated Sidebar */}
        <div className="hidden lg:block shrink-0 border-r border-[#D9CFBB]/75 bg-[#EDE4D0]/60">
          <Sidebar />
        </div>

        {/* Main Application Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#F5EFE0]">
          <TopHeader onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
