'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useUserContext } from '@/app/context/UserContext';

type Message = {
  userName: string;
  content: string;
  timestamp: string;
};

type Forum = {
  topic: string;
  messages: Message[];
};

export default function ForumPage() {
  const { id } = useParams();
  const [forum, setForum] = useState<Forum | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId')
  // console.log(localStorage.getItem('userId'))
  // console.log(userId);
  
  useEffect(() => {
    async function fetchForum() {
      try {
        const response = await axios.get(`http://localhost:4000/forum/${id}/messages`);
        setForum({
          topic: response.data.topic || 'Unknown Topic',
          messages: response.data.messages || [],
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching forum:', error);
        setLoading(false);
      }
    }
    fetchForum();
  }, [id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      console.error('Message content is empty');
      return;
    }
  
    if (!userId) {
      console.error('User ID is missing');
      return;
    }
  
    try {
      // Debug the payload
      console.log('Sending Message:', {
        forumId: id,
        userId,
        content: newMessage,
      });
  
      // Make API call
      const response = await axios.post('http://localhost:4000/forum/message', {
        forumId: id,
        userId,
        content: newMessage,
      });
  
      console.log('Message sent successfully:', response.data);
  
      // Fetch updated messages
      const updatedMessages = await axios.get(`http://localhost:4000/forum/${id}/messages`);
      setForum((prevForum) =>
        prevForum
          ? {
              ...prevForum,
              messages: updatedMessages.data.messages,
            }
          : null
      );
  
      // Clear input field
      setNewMessage('');
    } catch (error: any) {
      console.error('Error sending message:', error.response?.data || error.message);
    }
  };
  
  

  if (loading) return <div>Loading forum...</div>;
  if (!forum) return <div>Error: Forum not found</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <h1 style={{ color: '#333', fontSize: '32px', marginBottom: '20px', textAlign: 'center' }}>
        {forum.topic}
      </h1>
      <div style={{ marginTop: '20px', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        {forum.messages.length > 0 ? (
          forum.messages.map((message, index) => (
            <div
              key={index}
              style={{
                marginBottom: '15px',
                padding: '15px',
                borderRadius: '8px',
                backgroundColor: '#f1f5f9',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              <strong style={{ color: '#1e40af', fontSize: '16px' }}>{message.userName || 'Unknown User'}:</strong>
              <p style={{ margin: '10px 0', fontSize: '16px', color: '#334155' }}>{message.content}</p>
              <small style={{ color: '#64748b', fontSize: '14px' }}>
                {new Date(message.timestamp).toLocaleString()}
              </small>
            </div>
          ))
        ) : (
          <p style={{ color: '#6b7280', textAlign: 'center' }}>No messages yet. Be the first to post!</p>
        )}
      </div>
      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message here..."
          style={{
            width: '100%',
            maxWidth: '800px',
            marginTop: '10px',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            resize: 'none',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
          rows={4}
        ></textarea>
        <button
          onClick={handleSendMessage}
          style={{
            marginTop: '15px',
            padding: '12px 24px',
            backgroundColor: '#1e40af',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
