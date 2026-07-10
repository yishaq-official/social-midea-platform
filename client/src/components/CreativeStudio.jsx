import React, { useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

export default function CreativeStudio({ onPostCreated }) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = useAuthStore(state => state.token);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await axios.post(
        'http://localhost:5000/api/posts', 
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onPostCreated(res.data);
      setContent('');
    } catch (error) {
      console.error('Error creating post', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="creative-studio">
      <textarea 
        className="studio-input" 
        placeholder="What's happening?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="studio-actions">
        <div>
          <button className="post-action-btn">📷 Media</button>
        </div>
        <button 
          className="studio-btn" 
          onClick={handleSubmit}
          disabled={isSubmitting || !content.trim()}
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  );
}
