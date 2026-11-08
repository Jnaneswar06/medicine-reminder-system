import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Pill, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        <div className="brand-icon">
          <Pill size={24} />
        </div>
        <span>MediRemind System</span>
      </Link>

      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/profile" className="user-profile-badge">
            <div className="avatar-circle">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                {user.name}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {user.email}
              </span>
            </div>
          </Link>

          <button 
            onClick={logout} 
            className="btn btn-secondary" 
            style={{ padding: '0.5rem 0.875rem' }}
            title="Sign Out"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
