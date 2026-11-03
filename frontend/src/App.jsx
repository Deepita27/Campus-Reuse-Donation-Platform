import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './layouts/Navbar';
import Footer from './layouts/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import BrowseItemsPage from './pages/BrowseItemsPage';
import DonateItemPage from './pages/DonateItemPage';
import ItemDetailsPage from './pages/ItemDetailsPage';
import MyDonationsPage from './pages/MyDonationsPage';
import MyRequestsPage from './pages/MyRequestsPage';
import ReceivedRequestsPage from './pages/ReceivedRequestsPage';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-campus-bg text-campus-text">
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/browse" element={<BrowseItemsPage />} />
          <Route path="/items/:id" element={<ItemDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Student Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donate"
            element={
              <ProtectedRoute>
                <DonateItemPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-donations"
            element={
              <ProtectedRoute>
                <MyDonationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-requests"
            element={
              <ProtectedRoute>
                <MyRequestsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests/received"
            element={
              <ProtectedRoute>
                <ReceivedRequestsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
                <span className="text-6xl font-extrabold text-campus-primary">404</span>
                <h2 className="text-2xl font-bold text-campus-text">Page Not Found</h2>
                <p className="text-campus-textMuted text-sm max-w-sm">
                  The page you are looking for does not exist or has been moved.
                </p>
                <a
                  href="/"
                  className="px-5 py-2.5 bg-campus-primary text-white text-sm font-bold rounded-xl"
                >
                  Return to Home
                </a>
              </div>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
