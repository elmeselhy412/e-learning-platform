'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './Forum.module.css';

type Forum = {
  _id: string;
  topic: string;
};

export default function ForumPage() {
  const [forums, setForums] = useState<Forum[]>([]);
  const [isCreatingForum, setIsCreatingForum] = useState(false);
  const [newForumTopic, setNewForumTopic] = useState('');
  const router = useRouter();

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

  const handleCreateForum = async () => {
    if (!newForumTopic.trim()) {
      alert('Forum topic cannot be empty!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/forum/create', {
        topic: newForumTopic,
        instructorId: localStorage.getItem('userId'),
      });
      setForums([...forums, response.data]); // Add the new forum to the list
      setNewForumTopic(''); // Clear the input field
      setIsCreatingForum(false); // Close the create forum modal
    } catch (error) {
      console.error('Error creating forum:', error);
    }
  };

  return (
    <div className={styles.forumsPage}>
      <h1 className={styles.header}>Forums</h1>

      {/* Forum Cards */}
      <div className={styles.forumContainer}>
        {forums.length > 0 ? (
          forums.map((forum) => (
            <div
              key={forum._id}
              className={styles.forumCard}
              onClick={() => router.push(`/instructor/forum/${forum._id}`)}
            >
              <h3>{forum.topic}</h3>
            </div>
          ))
        ) : (
          <p className={styles.noForums}>No forums available. Create one to start chatting!</p>
        )}
      </div>

      {/* Create Forum Button */}
      <div className={styles.createForumContainer}>
        <button
          className={`${styles.actionButton} ${styles.btnPrimary}`}
          onClick={() => setIsCreatingForum(true)}
        >
          Create New Forum
        </button>
      </div>

      {/* Create Forum Modal */}
      {isCreatingForum && (
        <div className={styles.modalOverlay} onClick={() => setIsCreatingForum(false)}>
          <div
            className={styles.modalContainer}
            onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
          >
            <h2 className={styles.modalHeader}>Create New Forum</h2>
            <input
              type="text"
              placeholder="Enter forum topic"
              value={newForumTopic}
              onChange={(e) => setNewForumTopic(e.target.value)}
              className={styles.modalInput}
            />
            <div className={styles.modalActions}>
              <button
                className={`${styles.actionButton} ${styles.btnPrimary}`}
                onClick={handleCreateForum}
              >
                Create
              </button>
              <button
                className={`${styles.actionButton} ${styles.btnSecondary}`}
                onClick={() => setIsCreatingForum(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
