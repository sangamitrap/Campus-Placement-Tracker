import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isUser, isInterviewer } = useAuth();

  if (!isUser && !isInterviewer) return null;

  const userNavItems = [
    { path: '/dashboard', label: 'Home', icon: '🏠' },
    { path: '/jobs', label: 'Jobs', icon: '💼' },
    { path: '/applications', label: 'Applied', icon: '📋' },
    { path: '/placement-status', label: 'Status', icon: '📊' },
    { path: '/profile', label: 'Profile', icon: '👤' }
  ];

  const interviewerNavItems = [
    { path: '/interviewer/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/interviewer/messages', label: 'Messages', icon: '💬' }
  ];

  const navItems = isUser ? userNavItems : interviewerNavItems;

  return (
    <div className="bottom-nav">
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          style={{
            backgroundColor: location.pathname === item.path ? '#007bff' : 'transparent',
            color: location.pathname === item.path ? 'white' : '#333'
          }}
        >
          <div>{item.icon}</div>
          <div>{item.label}</div>
        </button>
      ))}
    </div>
  );
};

export default BottomNav;