import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import Header from '@/layout/header';
import Footer from '@/layout/footer';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import ProgressDashboardPage from '@/pages/ProgressDashboardPage';
import ModulePage from '@/pages/ModulePage';
import TutorChatPage from '@/pages/TutorChatPage';
import QuizPage from '@/pages/QuizPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import CitizenUploadPage from '@/pages/CitizenUploadPage';
import PublicVerificationPage from '@/pages/PublicVerificationPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({
  children,
  adminOnly = false,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-civic-700 border-t-transparent animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Verifying officer session...</p>
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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <ProgressDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/module"
            element={
              <ProtectedRoute>
                <ModulePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tutor"
            element={
              <ProtectedRoute>
                <TutorChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:moduleId"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/citizen" element={<CitizenUploadPage />} />
          <Route path="/verify/:credentialId" element={<PublicVerificationPage />} />
          <Route path="/verify" element={<PublicVerificationPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
