import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Next.js navigation hook
import styles from '../completeProfile.module.css';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const goToCourseList = () => {
    router.push('/instructor/courses');
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Welcome to the Instructor Portal</h1>
      <div className="text-center mb-4">
        <button className="btn btn-primary" onClick={handleOpenModal}>
          Complete Profile
        </button>
      </div>
      <div className="text-center">
        <button className="btn btn-secondary" onClick={goToCourseList}>
          Go to Course List
        </button>
      </div>
    </div>
  );
}
