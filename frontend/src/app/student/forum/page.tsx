'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useUserContext } from '@/app/context/UserContext';

type Forum = {
  _id: string;
  topic: string;
};

export default function StudentChat() {
  const [forums, setForums] = useState<Forum[]>([]);
  const router = useRouter(); // Use router for navigation  
localStorage.getItem('userId')
console.log(localStorage.getItem('userId')
)
  // Fetch all forums
  useEffect(() => {
    async function fetchForums() {
      try {
        const response = await axios.get('http://localhost:4000/forum');
        setForums(response.data);
      } catch (error) {
        console.error('Error fetching forums:', error);
      }
    }
    fetchForums();
  }, []);

  return (
    <div className="d-flex align-items-center p-3 flex-column">
      <h1>Student Forums</h1>
      {forums.map((forum) => (
        <div
          onClick={() => router.push(`/student/forum/${forum._id}`)} // Navigate to forum details
          className="p-2 border border-primary rounded"
          key={forum._id}
          style={{ cursor: 'pointer', margin: '10px 0', width: '80%' }}
        >
          <h3>{forum.topic}</h3>
        </div>
      ))}
    </div>
  );
}
