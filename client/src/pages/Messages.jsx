import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useAuthStore from '../store/useAuthStore';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Messages.css';

export default function Messages() {
  const { user, token } = useAuthStore();
  const [socket, setSocket] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const getRoomId = (id1, id2) => {
    return [id1, id2].sort().join('_');
  };

  useEffect(() => {
    if (user && token) {
      const newSocket = io('http://localhost:5000');
      setSocket(newSocket);

      newSocket.on('receive_private_message', (msg) => {
        setMessages((prev) => [...prev, msg]);
      });

      // Fetch contacts
      axios.get('http://localhost:5000/api/messages/contacts', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setContacts(res.data))
        .catch(err => console.error(err));

      return () => newSocket.disconnect();
    }
  }, [user, token]);

  useEffect(() => {
    if (activeContact && socket) {
      const roomId = getRoomId(user._id, activeContact._id);
      socket.emit('join_chat', roomId);
      
      // Fetch chat history
      axios.get(`http://localhost:5000/api/messages/${activeContact._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setMessages(res.data))
        .catch(err => console.error(err));
    }
  }, [activeContact, socket, user, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() && socket && activeContact) {
      const roomId = getRoomId(user._id, activeContact._id);
      const msgData = {
        sender: user._id,
        receiver: activeContact._id,
        content: input,
        room: roomId
      };
      // Send to server
      socket.emit('send_private_message', msgData);
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
          </div>
          <div className="chat-list">
            {contacts.map(contact => (
              <div 
                key={contact._id} 
                className={`chat-contact ${activeContact?._id === contact._id ? 'active' : ''}`}
                onClick={() => setActiveContact(contact)}
              >
                <div className="contact-avatar">{contact.avatar || '👤'}</div>
                <div className="contact-info">
                  <span className="contact-name">{contact.name}</span>
                </div>
              </div>
            ))}
            {contacts.length === 0 && (
              <div style={{ padding: '1rem', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                No contacts found.
              </div>
            )}
          </div>
        </aside>

        {/* Chat Window */}
        <main className="chat-window">
          {activeContact ? (
            <>
              <div className="chat-window-header">
                <div className="contact-avatar">{activeContact.avatar || '👤'}</div>
                <h2 style={{ fontSize: '1.25rem' }}>{activeContact.name}</h2>
              </div>
              
              <div className="chat-messages">
                {messages.map((msg, idx) => {
                  const isMine = msg.sender?._id ? (msg.sender._id === user._id) : (msg.sender === user._id);
                  return (
                    <div key={idx} className={`message-bubble ${isMine ? 'message-sent' : 'message-received'}`}>
                      {msg.content}
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
            </>
          ) : (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
              Select a contact to start messaging
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
