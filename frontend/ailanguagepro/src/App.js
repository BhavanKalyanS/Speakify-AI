import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { learnerTheme, adminTheme } from './theme';

import LandingPage from './components/LandingPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AdminLogin from './components/Auth/AdminLogin';
import UserDashboard from './components/Dashboard/UserDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import ResultsPage from './components/ResultsPage';

const ProtectedRoute = ({ children, requiredRole }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('access_token');

  if (!token || !user.id) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider theme={learnerTheme}>
      <CssBaseline />
      <style>
        {`
          body {
            background-color: #F7F3EA;
            background-image: 
              radial-gradient(at 0% 0%, rgba(204, 120, 92, 0.15) 0, transparent 50%), 
              radial-gradient(at 100% 0%, rgba(107, 107, 99, 0.08) 0, transparent 50%), 
              radial-gradient(at 100% 100%, rgba(204, 120, 92, 0.1) 0, transparent 50%), 
              radial-gradient(at 0% 100%, rgba(27, 27, 24, 0.05) 0, transparent 50%);
            background-attachment: fixed;
          }
          .mono-emoji {
            filter: grayscale(100%) sepia(100%) hue-rotate(335deg) saturate(320%) brightness(85%);
            display: inline-block;
            vertical-align: middle;
            margin-right: 4px;
          }
        `}
      </style>
      <Router>
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin-login"
            element={
              <ThemeProvider theme={adminTheme}>
                <CssBaseline />
                <AdminLogin />
              </ThemeProvider>
            }
          />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <ResultsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <ThemeProvider theme={adminTheme}>
                  <CssBaseline />
                  <AdminDashboard />
                </ThemeProvider>
              </ProtectedRoute>
            }
          />

          {/* Test routes - remove in production */}
          <Route path="/test-user" element={<UserDashboard />} />
          <Route
            path="/test-admin"
            element={
              <ThemeProvider theme={adminTheme}>
                <CssBaseline />
                <AdminDashboard />
              </ThemeProvider>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;



