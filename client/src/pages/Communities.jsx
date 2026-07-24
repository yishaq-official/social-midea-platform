import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';
import './Communities.css';

export default function Communities() {
  const { user, token, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [communities, setCommunities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newComm, setNewComm] = useState({ name: '', description: '', icon: '🎨' });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (token) {
      fetchCommunities();
    }
  }, [token]);

  const fetchCommunities = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/communities', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCommunities(res.data);
    } catch (error) {
      console.error('Error fetching communities:', error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/communities', newComm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCommunities([...communities, res.data]);
      setIsModalOpen(false);
      setNewComm({ name: '', description: '', icon: '🎨' });
    } catch (error) {
      console.error('Error creating community:', error);
    }
  };

  const handleJoin = async (id) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/communities/${id}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCommunities(communities.map(c => c._id === id ? res.data : c));
    } catch (error) {
      console.error('Error joining community:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) return null;

  return (
    <div className="communities-container feed-container">
      {/* Sidebar Navigation */}
      <aside className="feed-sidebar">
        <Link to="/" className="auth-logo" style={{ padding: '0 1rem' }}>
          <span className="auth-logo__icon">◈</span>
          <span>SocialMidea</span>
        </Link>
        <nav style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link to="/feed" className="feed-nav-link">🏠 Home</Link>
          <Link to="/profile" className="feed-nav-link">👤 Profile</Link>
          <Link to="/messages" className="feed-nav-link">💬 Messages</Link>
          <Link to="/communities" className="feed-nav-link active">🎨 Communities</Link>
          <button onClick={handleLogout} className="feed-nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', marginTop: 'auto' }}>
            🚪 Logout
          </button>
        </nav>
      </aside>

      <main className="communities-main">
        <div className="communities-header">
          <h1>Discover Communities</h1>
          <button className="btn-join" onClick={() => setIsModalOpen(true)}>
            + Create Community
          </button>
        </div>

        <div className="communities-list">
          {communities.map(comm => {
            const isMember = comm.members.includes(user?._id);
            return (
              <div key={comm._id} className="community-card">
                <div className="community-icon">{comm.icon || '🎨'}</div>
                <h3 className="community-title">{comm.name}</h3>
                <p className="community-desc">{comm.description}</p>
                <div className="community-footer">
                  <span className="community-members">{comm.members.length} members</span>
                  <button 
                    className={`btn-join ${isMember ? 'joined' : ''}`}
                    onClick={() => !isMember && handleJoin(comm._id)}
                    disabled={isMember}
                  >
                    {isMember ? 'Joined' : 'Join'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Right widget spacer to keep layout centered */}
      <aside className="feed-widgets"></aside>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Create a Community</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  value={newComm.name} 
                  onChange={(e) => setNewComm({...newComm, name: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={newComm.description} 
                  onChange={(e) => setNewComm({...newComm, description: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Icon (Emoji)</label>
                <input 
                  type="text" 
                  value={newComm.icon} 
                  onChange={(e) => setNewComm({...newComm, icon: e.target.value})}
                  maxLength="2"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-join">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
