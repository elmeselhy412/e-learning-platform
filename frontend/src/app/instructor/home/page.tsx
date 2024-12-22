'use client';
import { useState } from 'react';
import CompleteProfileModal from '../completeProfile/CompleteProfileModal'; // Import the modal component

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Welcome to the Instructor Portal</h1>
      <div className="text-center">
        <button
          className="btn btn-primary"
          onClick={handleOpenModal}
        >
          Complete Profile
        </button>
      </div>
      {/* Modal Component */}
      {isModalOpen && <CompleteProfileModal onClose={handleCloseModal} />}
    </div>
  );
}
