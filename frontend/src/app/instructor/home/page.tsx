'use client';

import { useState } from 'react';
import CompleteProfileModal from '../completeProfile/CompleteProfileModal'; // Import the modal component
import Announcements from '../announcements/Announcements'; // Import the announcements component
import { useRouter } from 'next/navigation'; // Import router for navigation

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter(); // Initialize router

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
    </div>
  );
}
