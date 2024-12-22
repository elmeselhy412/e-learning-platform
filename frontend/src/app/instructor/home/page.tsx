'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CompleteProfile() {
  const [expertise, setExpertise] = useState<string[]>([]);
  const [teachingInterests, setTeachingInterests] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const userId = localStorage.getItem('userId'); // Get the instructor ID from local storage

  // Fetch user profile data when the component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/users/instructor/${userId}` // Adjust the endpoint if needed
        );
        const { expertise, teachingInterests } = response.data;

        // Update the state with the fetched data
        setExpertise(expertise || []);
        setTeachingInterests(teachingInterests || []);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const handleAddExpertise = (item: string) => {
    setExpertise([...expertise, item]);
  };

  const handleAddTeachingInterest = (item: string) => {
    setTeachingInterests([...teachingInterests, item]);
  };

  const handleRemoveExpertise = (index: number) => {
    const updated = [...expertise];
    updated.splice(index, 1);
    setExpertise(updated);
  };

  const handleRemoveTeachingInterest = (index: number) => {
    const updated = [...teachingInterests];
    updated.splice(index, 1);
    setTeachingInterests(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.patch(
        `http://localhost:4000/users/updateInstructor/${userId}`,
        {
          expertise,
          teachingInterests,
        }
      );

      setMessage(response.data.message || 'Profile updated successfully!');
    } catch (error) {
      setMessage('Failed to update profile. Please try again.');
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Complete Your Profile</h1>
      {message && <div className="alert alert-info text-center">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="expertise" className="form-label">
            Expertise
          </label>
          <input
            type="text"
            id="expertise"
            className="form-control"
            placeholder="Add expertise (e.g., React, Machine Learning)"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                e.preventDefault();
                handleAddExpertise(e.currentTarget.value.trim());
                e.currentTarget.value = '';
              }
            }}
          />
          <div className="mt-2">
            {expertise.map((item, index) => (
              <span
                key={index}
                className="badge bg-primary me-2"
                style={{ cursor: 'pointer' }}
                onClick={() => handleRemoveExpertise(index)}
              >
                {item} ✕
              </span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="teachingInterests" className="form-label">
            Teaching Interests
          </label>
          <input
            type="text"
            id="teachingInterests"
            className="form-control"
            placeholder="Add teaching interest (e.g., Web Development)"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                e.preventDefault();
                handleAddTeachingInterest(e.currentTarget.value.trim());
                e.currentTarget.value = '';
              }
            }}
          />
          <div className="mt-2">
            {teachingInterests.map((item, index) => (
              <span
                key={index}
                className="badge bg-success me-2"
                style={{ cursor: 'pointer' }}
                onClick={() => handleRemoveTeachingInterest(index)}
              >
                {item} ✕
              </span>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Save Profile
        </button>
      </form>
    </div>
  );
}
