import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import ProgressDashboardPage from '@/pages/ProgressDashboardPage';
import ModulePage from '@/pages/ModulePage';
import TutorChatPage from '@/pages/TutorChatPage';
import QuizPage from '@/pages/QuizPage';
import PublicVerificationPage from '@/pages/PublicVerificationPage';
import DashboardLayout from '@/layout/DashboardLayout';
import Nav from '@/sections/Nav';
import Footer from '@/sections/Footer';
import Skeleton from '@/components/ui/Skeleton';

// Route-level lazy loading for heavier/infrequently first-visited pages
const AdminDashboardPage = lazy(() => import('@/pages/AdminDashboardPage'));
const CitizenUploadPage = lazy(() => import('@/pages/CitizenUploadPage'));

const RouteLoadingFallback: React.FC = () => (
  <div className="min-h-[60vh] p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in" data-testid="route-loading-fallback">
    <div className="flex items-center justify-between">
      <Skeleton className="h-9 w-56 bg-[#D9CFBB]/60" />
      <Skeleton className="h-9 w-32 bg-[#D9CFBB]/60" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Skeleton className="h-32 w-full bg-[#D9CFBB]/60" />
      <Skeleton className="h-32 w-full bg-[#D9CFBB]/60" />
      <Skeleton className="h-32 w-full bg-[#D9CFBB]/60" />
    </div>
    <Skeleton className="h-80 w-full bg-[#D9CFBB]/60" />
  </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({
  children,
  adminOnly = false,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#F5EFE0]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-[#0A0A0A] border-t-transparent animate-spin" />
          <p className="text-[#6B6357] text-sm font-medium font-sans">
            Verifying administrative credentials…
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/module" replace />;
  }

  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
        {/* Route 01: Reconstructed Editorial Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Route 02: Officer & Supervisor Authentication */}
        <Route
          path="/login"
          element={
            <div className="min-h-screen flex flex-col bg-[#F5EFE0] text-[#0A0A0A]">
              <Nav />
              <main className="flex-1 flex flex-col">
                <LoginPage />
              </main>
              <Footer />
            </div>
          }
        />

        {/* Route 03: Officer Competency Dashboard */}
        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProgressDashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Route 04: Structured Administrative Curriculum */}
        <Route
          path="/module"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ModulePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Route 05: Grounded Administrative AI Tutor */}
        <Route
          path="/tutor"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <TutorChatPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Route 06: Server-Scored Certification Examination */}
        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <QuizPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Route 07: Supervisor Governance Telemetry */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <DashboardLayout>
                <AdminDashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Route 08: Citizen Pre-Submission Document Checker (GovAssist) */}
        <Route path="/citizen" element={<CitizenUploadPage />} />

        {/* Route 09: Public Certificate Verification */}
        <Route path="/verify" element={<PublicVerificationPage />} />

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
