import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { MobileNav } from './components/common/MobileNav';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { ExplorePage } from './pages/ExplorePage';
import { MapDiscoveryPage } from './pages/MapDiscoveryPage';
import { TripsPage } from './pages/TripsPage';
import { TripDetailsPage } from './pages/TripDetailsPage';
import { CreateTripPage } from './pages/CreateTripPage';
import { EditTripPage } from './pages/EditTripPage';
import { MeetupDiscoveryPage } from './pages/MeetupDiscoveryPage';
import { MeetupDetailsPage } from './pages/MeetupDetailsPage';
import { CreateMeetupPage } from './pages/CreateMeetupPage';
import { EditMeetupPage } from './pages/EditMeetupPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { EditProfilePage } from './pages/EditProfilePage';
import { ConnectionsPage } from './pages/ConnectionsPage';
import { InboxPage } from './pages/InboxPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminMeetupsPage } from './pages/AdminMeetupsPage';
import { AdminReportsPage } from './pages/AdminReportsPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Scroll restoration
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Route protection wrappers
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-xs text-[#777F79]">Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-xs text-[#777F79]">Loading...</div>;
  }
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#202522]">
      <ScrollToTop />
      <Navbar />

      <main className="flex-1 pb-16 md:pb-0">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/map" element={<MapDiscoveryPage />} />
          <Route path="/trips" element={<TripsPage />} />
          <Route path="/trips/:id" element={<TripDetailsPage />} />
          <Route path="/meetups" element={<MeetupDiscoveryPage />} />
          <Route path="/meetups/:id" element={<MeetupDetailsPage />} />
          <Route path="/users/:id" element={<UserProfilePage />} />

          {/* Protected Routes */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trips/create"
            element={
              <ProtectedRoute>
                <CreateTripPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trips/:id/edit"
            element={
              <ProtectedRoute>
                <EditTripPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meetups/create"
            element={
              <ProtectedRoute>
                <CreateMeetupPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meetups/:id/edit"
            element={
              <ProtectedRoute>
                <EditMeetupPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <EditProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/connections"
            element={
              <ProtectedRoute>
                <ConnectionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inbox"
            element={
              <ProtectedRoute>
                <InboxPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsersPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/meetups"
            element={
              <AdminRoute>
                <AdminMeetupsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <AdminRoute>
                <AdminReportsPage />
              </AdminRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
