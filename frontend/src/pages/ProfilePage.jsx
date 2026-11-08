import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Key, LogOut } from 'lucide-react';

const ProfilePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="page-container" style={{ maxWidth: '700px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)' }}>User Profile</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Account credentials and security information
        </p>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <div className="avatar-circle" style={{ width: '64px', height: '64px', fontSize: '1.75rem', fontWeight: '700' }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>{user?.name}</h2>
            <span className="badge badge-active" style={{ marginTop: '0.25rem' }}>{user?.role || 'USER'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '0.5rem' }}>
            <User color="var(--primary)" size={20} />
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Full Name</span>
              <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{user?.name}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '0.5rem' }}>
            <Mail color="var(--accent)" size={20} />
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Email Address</span>
              <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{user?.email}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '0.5rem' }}>
            <Key color="var(--warning)" size={20} />
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Password Security</span>
              <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Encrypted with BCrypt (Hidden)</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '0.5rem' }}>
            <Shield color="#c084fc" size={20} />
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Account ID</span>
              <p style={{ fontWeight: '600', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{user?.id}</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={logout} className="btn btn-danger" style={{ padding: '0.625rem 1.25rem' }}>
            <LogOut size={18} />
            <span>Sign Out Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
