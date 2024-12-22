import React from 'react';
import StudentDashboard from '../../../components/StudentDashboard';
import ModuleTrackingForm from '../../../components/ModuleTrackingForm';

const StudentHomePage = () => {
  const userId = 'studentUserId'; // Replace with the actual user ID from your context
  const courseId = 'courseId'; // Replace with the actual course ID from the state or context

  return (
    <div className="container mt-5">
      <h1>Welcome, Student!</h1>
      <StudentDashboard userId={userId} courseId={courseId} />
      <ModuleTrackingForm userId={userId} courseId={courseId} />
    </div>
  );
};

export default StudentHomePage;
