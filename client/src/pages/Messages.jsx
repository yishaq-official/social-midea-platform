import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useAuthStore from '../store/useAuthStore';
import { Link } from 'react-router-dom';
import './Messages.css';

export default function Messages() {
  const user = useAuthStore(state => state.user);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Connect to Socket.io
  useEffect(() => {
    if (user) {
      const newSocket = io('http://localhost:5000');
      setSocket(newSocket);

      newSocket.on('receive_message', (data) => {
        setMessages((prev) => [...prev, data]);
      });

      return () => newSocket.disconnect();
    }
  }, [user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() && socket) {
      const msgData = {
        senderId: user._id,
        senderName: user.name,
        text: input,
        createdAt: new Date().toISOString(),
      };
      // Send to server
      socket.emit('send_message', msgData);
      
      // Update local UI immediately
      setMessages((prev) => [...prev, msgData]);
      setInput('');
    }
  };

  return (
    <div className="messages-container">
      <Link to="/feed" style={{ color: 'var(--purple)', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>
        ← Back to Feed
      </Link>
      <div className="messages-layout">
        {/* Sidebar */}
        <aside className="chat-sidebar">
          <div className="chat-header">
            Messages
            <span style={{ fontSize: '0.8rem', color: 'var(--purple)', cursor: 'pointer' }}>+ New</span>
          </div>
          <div className="chat-list">
            {/* Mock Contacts for UI */}
            <div className="chat-contact active">
              <div className="contact-avatar">🌐</div>
              <div className="contact-info">
                <span className="contact-name">Global Chat</span>
                <span className="contact-status">Online</span>
              </div>
            </div>
            <div className="chat-contact">
              <div className="contact-avatar">👩🏾</div>
              <div className="contact-info">
                <span className="contact-name">Maya</span>
                <span className="contact-status" style={{color: 'var(--text-dim)'}}>Offline</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Chat Window */}
        <main className="chat-window">
          <div className="chat-window-header">
            <div className="contact-avatar">🌐</div>
            <h2 style={{ fontSize: '1.25rem' }}>Global Chat Room</h2>
          </div>
          
          <div className="chat-messages">
            {/* System welcome message */}
            <div className="message-bubble message-received" style={{ alignSelf: 'center', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
              Welcome to the Global Chat! Messages here are broadcasted in real-time.
            </div>

            {messages.map((msg, idx) => {
              const isMine = msg.senderId === user?._id;
              return (
                <div key={idx} className={`message-bubble ${isMine ? 'message-sent' : 'message-received'}`}>
                  {!isMine && <div style={{ fontSize: '0.75rem', color: 'var(--purple)', marginBottom: '0.25rem', fontWeight: 'bold' }}>{msg.senderName}</div>}
                  {msg.text}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-area" onSubmit={sendMessage}>
            <input 
              type="text" 
              className="chat-input" 
              placeholder="Type a message..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="chat-send-btn">
              ↗
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
