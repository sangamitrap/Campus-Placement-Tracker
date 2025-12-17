import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';
import InterviewerRegister from './pages/InterviewerRegister';

// User Pages
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import Applications from './pages/Applications';
import Profile from './pages/Profile';
import PlacementStatus from './pages/PlacementStatus';

// Interviewer Pages
import InterviewerDashboard from './pages/InterviewerDashboard';
import StudentDetails from './pages/StudentDetails';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/interviewer/register" element={<InterviewerRegister />} />
            
            {/* User Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute requiredRole="user">
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/jobs" 
              element={
                <ProtectedRoute requiredRole="user">
                  <Jobs />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/applications" 
              element={
                <ProtectedRoute requiredRole="user">
                  <Applications />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute requiredRole="user">
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/placement-status" 
              element={
                <ProtectedRoute requiredRole="user">
                  <PlacementStatus />
                </ProtectedRoute>
              } 
            />

            {/* Interviewer Protected Routes */}
            <Route 
              path="/interviewer/dashboard" 
              element={
                <ProtectedRoute requiredRole="interviewer">
                  <InterviewerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/interviewer/student/:studentId" 
              element={
                <ProtectedRoute requiredRole="interviewer">
                  <StudentDetails />
                </ProtectedRoute>
              } 
            />

            {/* Default Redirects */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;