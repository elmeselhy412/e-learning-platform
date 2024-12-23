'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Broadcast {
  id: string; // Ensure the backend sends a unique `id`
  title: string;
  message: string;
  createdAt: string;
}

export default function AdminHome() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchBroadcasts = async () => {
      try {
        const response = await axios.get<Broadcast[]>('http://localhost:4000/broadcast/all');
        setBroadcasts(response.data);
      } catch (err) {
        console.error('Error fetching broadcasts:', err);
      }
    };

    fetchBroadcasts();
  }, []);

  const handleUserManagement = () => {
    router.push('/admin/management');
  };
  const handleCourses = () => {
    router.push('/admin/courses');
  };
  const handleSecurity = () => {
    router.push('/admin/securityMonitoring');
  };
  const handleBackup = () => {
    router.push('/admin/backup');
  };

  return (
    <div className="container mt-5 d-flex">
      {/* Main Admin Section */}
      <div className="flex-grow-1">
        <h1 className="text-center mb-4">Welcome to the Admin Portal</h1>
        <div className="text-center">
          <button className="btn btn-secondary me-2" onClick={handleUserManagement}>
            Manage Users
          </button>
          <button className="btn btn-secondary me-2" onClick={handleCourses}>
            Courses
          </button>
          <button className="btn btn-secondary me-2" onClick={handleSecurity}>
            Security Monitoring
          </button>
          <button className="btn btn-secondary me-2" onClick={handleBackup}>
            Backup
          </button>
        </div>
      </div>

      {/* Broadcasts Section */}
      <div
        style={{
          width: '25%',
          backgroundColor: '#f8f9fa',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          marginLeft: '20px',
        }}
      >
        <h4 className="text-center mb-4" style={{ color: '#333' }}>
          Notifications
        </h4>
        {broadcasts.length > 0 ? (
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              maxHeight: '400px',
              overflowY: 'auto',
            }}
          >
            {broadcasts.map((broadcast, index) => (
              <li
                key={broadcast.id || index} // Use `broadcast.id` if available; fallback to `index`
                style={{
                  marginBottom: '15px',
                  padding: '10px',
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              >
                <h5
                  style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    color: '#007bff',
                  }}
                >
                  {broadcast.title}
                </h5>
                <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>
                  {broadcast.message}
                </p>
                <small style={{ color: '#888' }}>
                  {new Date(broadcast.createdAt).toLocaleString()}
                </small>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center" style={{ color: '#888' }}>
            No Notifications available.
          </p>
        )}
      </div>
    </div>
  );
}
