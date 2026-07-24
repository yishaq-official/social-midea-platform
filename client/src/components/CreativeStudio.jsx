import React, { useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

export default function CreativeStudio({ onPostCreated }) {
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = useAuthStore(state => state.token);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async () => {
    if (!content.trim() && !selectedFile) return;
    setIsSubmitting(true);
    try {
      let uploadedMediaUrl = null;

      if (selectedFile) {
        const formData = new FormData();
        formData.append('media', selectedFile);
        
        const uploadRes = await axios.post(
          'http://localhost:5000/api/upload',
          formData,
          { headers: { Authorization: `Bearer ${token}` } } // multipart/form-data is auto-set
        );
        uploadedMediaUrl = uploadRes.data.url;
      }

      const res = await axios.post(
        'http://localhost:5000/api/posts', 
        { 
          content, 
          media: uploadedMediaUrl ? [uploadedMediaUrl] : [] 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      onPostCreated(res.data);
      setContent('');
      clearFile();
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
      {previewUrl && (
        <div style={{ padding: '0 1rem 1rem' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img 
              src={previewUrl} 
              alt="Preview" 
              style={{ maxHeight: '150px', borderRadius: '8px', border: '1px solid var(--border)' }} 
            />
            <button 
              onClick={clearFile}
              style={{ 
                position: 'absolute', top: 5, right: 5, background: 'rgba(0,0,0,0.6)', 
                color: 'white', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer' 
              }}>
              ×
            </button>
          </div>
        </div>
      )}
      <div className="studio-actions">
        <div>
          <label className="post-action-btn" style={{ cursor: 'pointer' }}>
            📷 Media
            <input 
              type="file" 
              accept="image/*,video/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </label>
        </div>
        <button 
          className="studio-btn" 
          onClick={handleSubmit}
          disabled={isSubmitting || (!content.trim() && !selectedFile)}
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  );
}
