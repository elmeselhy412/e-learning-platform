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

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

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

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Course Announcements</h1>
      <div className={styles.announcementsList}>
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <div key={announcement._id} className={styles.announcement}>
              <p className={styles.message}>{announcement.message}</p>
              <span className={styles.timestamp}>
                {new Date(announcement.createdAt).toLocaleString()}
              </span>
            </div>
          ))
        ) : (
          <p className={styles.noAnnouncements}>No announcements available.</p>
        )}
      </div>
    </div>
  );
}
