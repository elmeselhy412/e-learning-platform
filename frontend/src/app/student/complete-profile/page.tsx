'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CompleteProfile() {
  const userId = localStorage.getItem('userId'); // Get the user's ID from localStorage
  const [learningPreferences, setLearningPreferences] = useState<string[]>([]);
  const [subjectsOfInterest, setSubjectsOfInterest] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/users/studentDetails/${userId}`);
        const { learningPreferences, subjectsOfInterest } = response.data;
        setLearningPreferences(learningPreferences || []);
        setSubjectsOfInterest(subjectsOfInterest || []);
      } catch (err) {
        console.error('Error fetching profile details:', err);
      }
    };

    if (userId) fetchProfileDetails();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`http://localhost:4000/users/${userId}`, {
        learningPreferences,
        subjectsOfInterest,
      });
      setMessage('Profile updated successfully!');
      setError('');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
      setMessage('');
    }
  };

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '50px auto',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          fontSize: '24px',
          color: '#333',
          marginBottom: '20px',
        }}
      >
        Complete Your Profile
      </h1>

      {message && (
        <div
          style={{
            backgroundColor: '#d4edda',
            color: '#155724',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '20px',
            textAlign: 'center',
          }}
        >
          {message}
        </div>
      )}
      {error && (
        <div
          style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '20px',
            textAlign: 'center',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor="learningPreferences"
            style={{
              fontWeight: 'bold',
              marginBottom: '10px',
              display: 'block',
              color: '#555',
            }}
          >
            Learning Preferences
          </label>
          <input
            type="text"
            className="form-control"
            id="learningPreferences"
            placeholder="Enter preferences separated by commas (e.g., Visual, Audio)"
            value={learningPreferences.join(', ')}
            onChange={(e) =>
              setLearningPreferences(e.target.value.split(',').map((s) => s.trim()))
            }
            style={{
              padding: '10px',
              width: '100%',
              borderRadius: '5px',
              border: '1px solid #ddd',
              fontSize: '16px',
            }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor="subjectsOfInterest"
            style={{
              fontWeight: 'bold',
              marginBottom: '10px',
              display: 'block',
              color: '#555',
            }}
          >
            Subjects of Interest
          </label>
          <input
            type="text"
            className="form-control"
            id="subjectsOfInterest"
            placeholder="Enter subjects separated by commas (e.g., Math, Science)"
            value={subjectsOfInterest.join(', ')}
            onChange={(e) =>
              setSubjectsOfInterest(e.target.value.split(',').map((s) => s.trim()))
            }
            style={{
              padding: '10px',
              width: '100%',
              borderRadius: '5px',
              border: '1px solid #ddd',
              fontSize: '16px',
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '10px',
            width: '100%',
            backgroundColor: '#007bff',
            color: '#fff',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}
