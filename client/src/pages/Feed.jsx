import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';
import CreativeStudio from '../components/CreativeStudio';
import './Feed.css';

export default function Feed() {
  const { user, token, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (token) {
      fetchPosts();
    }
  }, [token]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(res.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handleLike = async (postId) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(posts.map(p => 
        p._id === postId ? { ...p, likes: res.data } : p
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) return null;

  return (
    <div className="feed-container">
      {/* Sidebar Navigation */}
      <aside className="feed-sidebar">
        <Link to="/" className="auth-logo" style={{ padding: '0 1rem' }}>
          <span className="auth-logo__icon">◈</span>
          <span>SocialMidea</span>
        </Link>
        <nav style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link to="/feed" className="feed-nav-link active">🏠 Home</Link>
          <Link to="/profile" className="feed-nav-link">👤 Profile</Link>
          <Link to="/messages" className="feed-nav-link">💬 Messages</Link>
          <Link to="#" className="feed-nav-link">🎨 Communities</Link>
          <button onClick={handleLogout} className="feed-nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', marginTop: 'auto' }}>
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* Main Feed Content */}
      <main className="feed-main">
        <div className="feed-header">
          <h1>Feed</h1>
        </div>
        
        <CreativeStudio onPostCreated={handlePostCreated} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {posts.map(post => {
            const isLiked = post.likes.includes(user?._id);
            return (
              <div key={post._id} className="post-card">
                <div className="post-header">
                  <div className="post-avatar">{post.user?.avatar || '👤'}</div>
                  <div className="post-meta">
                    <span className="post-author">{post.user?.name || 'Unknown User'}</span>
                    <span className="post-time">{new Date(post.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <div className="post-content">
                  {post.content}
                  {post.media && post.media.length > 0 && (
                    <div style={{ marginTop: '1rem', borderRadius: '8px', overflow: 'hidden' }}>
                      <img 
                        src={`http://localhost:5000${post.media[0]}`} 
                        alt="Post media" 
                        style={{ width: '100%', height: 'auto', display: 'block' }} 
                      />
                    </div>
                  )}
                </div>
                <div className="post-actions">
                  <button 
                    className={`post-action-btn ${isLiked ? 'liked' : ''}`}
                    onClick={() => handleLike(post._id)}
                  >
                    ❤️ {post.likes.length}
                  </button>
                  <button className="post-action-btn">💬 {post.comments?.length || 0}</button>
                  <button className="post-action-btn">↗ Share</button>
                </div>
              </div>
            );
          })}
          {posts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
              No posts yet. Be the first to post!
            </div>
          )}
        </div>
      </main>

      {/* Right Widgets */}
      <aside className="feed-widgets">
        <div className="creative-studio" style={{ padding: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Trending Topics</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', color: 'var(--text-dim)' }}>
            <li>#WebDevelopment</li>
            <li>#UIUXDesign</li>
            <li>#OpenSource</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
