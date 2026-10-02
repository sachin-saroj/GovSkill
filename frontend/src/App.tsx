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
import Skeleton from '@/components/ui/Skeleton';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

const AdminDashboardPage = lazy(() => import('@/pages/AdminDashboardPage'));
const CitizenUploadPage = lazy(() => import('@/pages/CitizenUploadPage'));
const AdminInvitesPage = lazy(() => import('@/pages/AdminInvitesPage'));
const RegisterAdminPage = lazy(() => import('@/pages/RegisterAdminPage'));

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
      <div className="flex items-center justify-center min-h-[60vh] bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-none border-2 border-black border-t-transparent animate-spin" />
          <p className="text-[#71717A] text-sm font-medium font-sans">
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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register-admin" element={<RegisterAdminPage />} />

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
        <Route
          path="/quiz/:moduleId"
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
        <Route
          path="/admin/invites"
          element={
            <ProtectedRoute adminOnly>
              <DashboardLayout>
                <AdminInvitesPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Route 08: Citizen Pre-Submission Document Checker (GovAssist) */}
        <Route path="/citizen" element={<CitizenUploadPage />} />

        {/* Route 09: Public Certificate Verification */}
        <Route path="/verify" element={<PublicVerificationPage />} />
        <Route path="/verify/:credentialId" element={<PublicVerificationPage />} />

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
