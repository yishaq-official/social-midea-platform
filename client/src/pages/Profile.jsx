import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';
import './Profile.css';

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser, token } = useAuthStore();
  
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // If no ID is provided, show current user's profile
  const targetId = id || currentUser?._id;
  const isMyProfile = targetId === currentUser?._id;

  useEffect(() => {
    if (targetId && token) {
      fetchProfileData();
    }
  }, [targetId, token]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const userRes = await axios.get(`http://localhost:5000/api/users/${targetId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfileUser(userRes.data);

      const postsRes = await axios.get(`http://localhost:5000/api/posts/user/${targetId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(postsRes.data);
    } catch (error) {
      console.error('Error fetching profile data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/api/users/${targetId}/follow`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // The API returns the updated following array of current user, 
      // and the updated followers array of target user
      setProfileUser({ ...profileUser, followers: res.data.followers });
    } catch (error) {
      console.error('Error toggling follow', error);
    }
  };

  const handlePrivacyToggle = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/users/privacy`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfileUser({ ...profileUser, isPrivate: res.data.isPrivate });
    } catch (error) {
      console.error('Error toggling privacy', error);
    }
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

  if (loading) return <div style={{ color: 'white', padding: '2rem' }}>Loading profile...</div>;
  if (!profileUser) return <div style={{ color: 'white', padding: '2rem' }}>User not found.</div>;

  const totalLikes = posts.reduce((acc, post) => acc + post.likes.length, 0);
  // Followers are populated, so we need length. Wait, if populate wasn't called or follow returns IDs, it could be objects or strings.
  const followerCount = profileUser.followers?.length || 0;
  const followingCount = profileUser.following?.length || 0;
  const isFollowing = profileUser.followers?.some(f => 
    (typeof f === 'object' ? f._id : f) === currentUser?._id
  );

  return (
    <div className="profile-container feed-container">
      {/* Sidebar Navigation */}
      <aside className="feed-sidebar">
        <Link to="/" className="auth-logo" style={{ padding: '0 1rem' }}>
          <span className="auth-logo__icon">◈</span>
          <span>SocialMidea</span>
        </Link>
        <nav style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link to="/feed" className="feed-nav-link">🏠 Home</Link>
          <Link to="/profile" className="feed-nav-link active">👤 Profile</Link>
          <Link to="/messages" className="feed-nav-link">💬 Messages</Link>
          <Link to="/communities" className="feed-nav-link">🎨 Communities</Link>
        </nav>
      </aside>

      <main className="feed-main" style={{ padding: '0' }}>
        <div className="profile-header">
          <div className="profile-cover" />
          <div className="profile-avatar-lg" style={{ marginTop: '-40px', background: 'var(--bg-card)', padding: '5px', borderRadius: '50%' }}>
            {profileUser.avatar || '👤'}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <div>
              <h1 className="profile-name">
                {profileUser.name} {profileUser.isPrivate && '🔒'}
              </h1>
              <p className="profile-email">{profileUser.email}</p>
            </div>
            <div>
              {isMyProfile ? (
                <button className="btn-join" onClick={handlePrivacyToggle} style={{ background: profileUser.isPrivate ? 'var(--bg-card)' : 'var(--purple)', border: profileUser.isPrivate ? '1px solid var(--border)' : 'none' }}>
                  {profileUser.isPrivate ? 'Make Public' : 'Make Private'}
                </button>
              ) : (
                <button className={`btn-join ${isFollowing ? 'joined' : ''}`} onClick={handleFollowToggle}>
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          </div>
          
          <div className="profile-stats">
            <div className="profile-stat">
              <span className="stat-value">{posts.length}</span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="profile-stat">
              <span className="stat-value">{followerCount}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="profile-stat">
              <span className="stat-value">{followingCount}</span>
              <span className="stat-label">Following</span>
            </div>
            <div className="profile-stat">
              <span className="stat-value">{totalLikes}</span>
              <span className="stat-label">Total Likes</span>
            </div>
          </div>
        </div>

        <div className="profile-content" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'white' }}>Posts</h2>
          
          {posts.length === 0 ? (
            <div className="post-card" style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '3rem' }}>
              No posts to show.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {posts.map(post => {
                const isLiked = post.likes.includes(currentUser?._id);
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
            </div>
          )}
        </div>
      </main>

      <aside className="feed-widgets"></aside>
    </div>
  );
}
