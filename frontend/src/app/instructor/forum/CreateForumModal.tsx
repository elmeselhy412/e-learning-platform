'use client';
import { useState } from 'react';
import axios from 'axios';
import styles from './Forum.module.css';

type CreateForumModalProps = {
  onClose: () => void;
};

export default function CreateForumModal({ onClose }: CreateForumModalProps) {
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userId = localStorage.getItem('userId'); // Get instructor ID
      if (!userId) throw new Error('User ID not found in localStorage');

      const response = await axios.post('http://localhost:4000/forum/create', {
        instructorId: userId,
        topic,
      });

      setMessage('Forum created successfully!');
      setTopic(''); // Clear input field
    } catch (error) {
      setMessage('Failed to create forum. Please try again.');
      console.error('Error creating forum:', error);
    }
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains(styles.modalOverlay)) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClickOutside}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2>Create New Forum</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        {message && <div className={styles.alert}>{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="topic" className="form-label">
              Forum Topic
            </label>
            <input
              type="text"
              id="topic"
              className={`form-control ${styles.input}`}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter forum topic"
              required
            />
          </div>
          <button type="submit" className={`actionButton btn-primary`}>
            Create Forum
          </button>
        </form>
      </div>
    </div>
  );
}
