'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 

export default function AdminHome() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter(); 

  const handleUserManagement = () => {
    router.push('/admin/management'); 
  };
  const handleCourses = () => {
    router.push('/admin/courses') 
  };
  const handleSecurity = () => {
    router.push('/admin/securityMonitoring');
  };
  const handleBackup = () => {
    router.push('/admin/backup'); 
  };
  

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Welcome to the Admin Portal</h1>

      <div className="text-center">
        <button
          className="btn btn-secondary me-2"
          onClick={handleUserManagement}
        >
          Manage Users
        </button>
        <button
          className="btn btn-secondary me-2"
          onClick={handleCourses}
        >
          Courses
        </button>
        <button
          className="btn btn-secondary me-2"
          onClick={handleSecurity}
        >
          Security Monitoring
        </button>
        <button
          className="btn btn-secondary me-2"
          onClick={handleBackup}
        >
         Backup
        </button>
      </div>
    </div>
  );
}
