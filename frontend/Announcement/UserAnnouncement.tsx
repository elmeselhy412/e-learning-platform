import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Announcement {
  _id: string;
  title: string;
  message: string;
  date: string;
}

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]); 
  const [error, setError] = useState(''); 

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get<Announcement[]>('/api/announcements');
        setAnnouncements(response.data); 
      } catch (err) {
        setError('Failed to fetch announcements.');
        console.error('Error fetching announcements:', err);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div>
      <h2>Announcements</h2>

      {/* Display error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display announcements */}
      {announcements.map((announcement) => (
        <div key={announcement._id}>
          <h3>{announcement.title}</h3>
          <p>{announcement.message}</p>
          <small>{new Date(announcement.date).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
};

export default Announcements;
