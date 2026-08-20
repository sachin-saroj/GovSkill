import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import Header from '@/layout/header';
import LoginPage from '@/pages/LoginPage';
import ModulePage from '@/pages/ModulePage';
import TutorChatPage from '@/pages/TutorChatPage';
import QuizPage from '@/pages/QuizPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import CitizenUploadPage from '@/pages/CitizenUploadPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({
  children,
  adminOnly = false,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-[#5A6472] text-sm">Loading session...</p>
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

import ProgressDashboardPage from '@/pages/ProgressDashboardPage';

export const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB]">
      <Header />
      <main className="flex-1">
        <Routes>
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
          <Route path="/" element={<Navigate to="/progress" replace />} />
          <Route path="*" element={<Navigate to="/progress" replace />} />
        </Routes>
      </main>
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
