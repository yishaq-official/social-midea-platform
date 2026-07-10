import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import './Profile.css';

export default function Profile() {
  const user = useAuthStore(state => state.user);

  if (!user) return <div style={{ color: 'white', padding: '2rem' }}>Please log in to view your profile.</div>;

  return (
    <div className="profile-container">
      <Link to="/feed" style={{ color: 'var(--purple)', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>
        ← Back to Feed
      </Link>
      
      <div className="profile-header">
        <div className="profile-cover" />
        <div className="profile-avatar-lg">{user.avatar || '👤'}</div>
        <h1 className="profile-name">{user.name}</h1>
        <p className="profile-email">{user.email}</p>
        
        <div className="profile-stats">
          <div className="profile-stat">
            <span className="stat-value">0</span>
            <span className="stat-label">Posts</span>
          </div>
          <div className="profile-stat">
            <span className="stat-value">124</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="profile-stat">
            <span className="stat-value">89</span>
            <span className="stat-label">Following</span>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Recent Activity</h2>
        <div className="post-card" style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '3rem' }}>
          No posts to show yet.
        </div>
      </div>
    </div>
  );
}
