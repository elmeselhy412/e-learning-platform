'use client';

import { useEffect, useState } from 'react';
import CompleteProfileModal from '../completeProfile/CompleteProfileModal'; // Import the modal component
import Announcements from '../announcements/Announcements'; // Import the announcements component
import { useRouter } from 'next/navigation'; // Import router for navigation
import axios from 'axios';

interface Broadcast {
  id: string; // Ensure the backend sends a unique `id`
  title: string;
  message: string;
  createdAt: string;
}
export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const router = useRouter(); // Initialize router

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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleNavigateToForums = () => {
    router.push('/instructor/forum'); // Navigate to the forums page
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Welcome to the Instructor Portal</h1>

      <div className="text-center">
        {/* Complete Profile Button */}
        <button
          className="btn btn-primary me-2"
          onClick={handleOpenModal}
        >
          Complete Profile
        </button>

        {/* Forums Button */}
        <button
          className="btn btn-secondary me-2"
          onClick={handleNavigateToForums}
        >
          Forums
        </button>
      </div>

      {/* Modal Component */}
      {isModalOpen && <CompleteProfileModal onClose={handleCloseModal} />}

      {/* Announcements Component */}
      <Announcements />
        {/* Broadcasts Section */}
        <div
  style={{
    position: 'fixed', // Ensure it stays in the top-right corner even during scrolling
    top: '20px', // Distance from the top
    right: '20px', // Distance from the right edge
    width: '300px', // Fixed width
    backgroundColor: '#f8f9fa', // Light background
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    zIndex: 1000, // Ensures it appears above other elements
  }}
>
  <h5 style={{ color: '#333', fontWeight: 'bold' }}>Notifications</h5>
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
          key={broadcast.id || index}
          style={{
            marginBottom: '10px',
            padding: '10px',
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '5px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h6 style={{ fontSize: '14px', fontWeight: 'bold', color: '#007bff' }}>
            {broadcast.title}
          </h6>
          <p style={{ margin: 0, fontSize: '12px', color: '#555' }}>
            {broadcast.message}
          </p>
          <small style={{ color: '#888' }}>
            {new Date(broadcast.createdAt).toLocaleString()}
          </small>
        </li>
      ))}
    </ul>
  ) : (
    <p style={{ color: '#888', fontSize: '14px' }}>No Notifications available.</p>
  )}
</div>

    </div>
  );
}
