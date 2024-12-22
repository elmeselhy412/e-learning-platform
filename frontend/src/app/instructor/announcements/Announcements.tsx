'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Announcements.module.css';

type Announcement = {
  _id: string;
  title?: string;
  message: string;
  createdAt: string;
};

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch announcements
  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const response = await axios.get('http://localhost:4000/notifications');
        setAnnouncements(response.data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    }
    fetchAnnouncements();
  }, []);

  // Post a new announcement
  const handlePostAnnouncement = async () => {
    if (!newMessage.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:4000/notifications', {
        message: newMessage,
      });
      setAnnouncements([response.data, ...announcements]); // Add the new announcement at the top
      setNewMessage(''); // Clear input
    } catch (error) {
      console.error('Error posting announcement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Course Announcements</h1>

      <div className={styles.announcementForm}>
        <textarea
          className={styles.textarea}
          placeholder="Write a new announcement..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className={styles.postButton}
          onClick={handlePostAnnouncement}
          disabled={isLoading}
        >
          {isLoading ? 'Posting...' : 'Post Announcement'}
        </button>
      </div>

      <div className={styles.announcementsList}>
        {announcements.map((announcement) => (
          <div key={announcement._id} className={styles.announcement}>
            <p className={styles.message}>{announcement.message}</p>
            <span className={styles.timestamp}>
              {new Date(announcement.createdAt).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
