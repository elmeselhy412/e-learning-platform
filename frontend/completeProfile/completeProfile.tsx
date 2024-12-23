'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../completeProfile.module.css'; // Import the CSS module
import React from 'react';

// Define props and interface
type CompleteProfileModalProps = {
  onClose: () => void;
};

interface UserProfile {
  expertise: string[];
  teachingInterests: string[];
}

// CompleteProfileModal component
export default function CompleteProfileModal({ onClose }: CompleteProfileModalProps) {
  const [expertise, setExpertise] = useState<string[]>([]);
  const [teachingInterests, setTeachingInterests] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get<UserProfile>(
          `http://localhost:4000/users/instructor/${userId}`
        );
        const { expertise, teachingInterests } = response.data;
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
      const response = await axios.patch<{ message: string }>(
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

  const handleClickOutside = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains(styles['modal-overlay'])) {
      onClose();
    }
  };

  return (
    <div className={styles['modal-overlay']} onClick={handleClickOutside}>
      <div className={styles['modal-container']}>
        <div className={styles['modal-header']}>
          <h2>Complete Your Profile</h2>
          <button className={styles['btn-close']} onClick={onClose}>
            ✕
          </button>
        </div>
        {message && <div className={styles.alert}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="expertise" className="form-label">
              Expertise
            </label>
            <input
              type="text"
              id="expertise"
              className={`form-control ${styles['form-control']}`}
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
                  className={`badge bg-primary ${styles.badge}`}
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
              className={`form-control ${styles['form-control']}`}
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
                  className={`badge bg-success ${styles.badge}`}
                  onClick={() => handleRemoveTeachingInterest(index)}
                >
                  {item} ✕
                </span>
              ))}
            </div>
          </div>

          <button type="submit" className={`btn btn-primary ${styles['btn-primary']}`}>
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}

// Define the CompleteProfile component
const CompleteProfile = () => {
  return <div>Complete Profile Component</div>;
};

// Export the CompleteProfile component
export { CompleteProfile };
