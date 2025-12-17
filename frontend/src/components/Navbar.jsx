import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h2>Placement Portal</h2>
        <div>
          <span>Welcome, {user?.name || user?.email}</span>
          <button onClick={handleLogout} className="btn btn-primary" style={{marginLeft: '10px'}}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;