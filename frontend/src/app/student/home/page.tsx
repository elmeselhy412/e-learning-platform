'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type Course = {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficultyLevel: string;
};

interface Broadcast {
  id: string; // Ensure the backend sends a unique `id`
  title: string;
  message: string;
  createdAt: string;
}
export default function StudentHome() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchParams, setSearchParams] = useState({ topic: '', instructor: '' });
  const [message, setMessage] = useState('');
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const router = useRouter();
  const userId = localStorage.getItem('userId');
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);

  // Fetch all courses and enrolled courses
  useEffect(() => {
    const fetchBroadcasts = async () => {
      try {
        const response = await axios.get<Broadcast[]>('http://localhost:4000/broadcast/all');
        setBroadcasts(response.data);
      } catch (err) {
        console.error('Error fetching broadcasts:', err);
      }
    };

    fetchBroadcasts();
    fetchCourses();
    if (userId) fetchEnrolledCourses();
  }, [userId]);

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:4000/courses');
      setCourses(response.data.map((course: any) => ({ ...course, _id: course._id.toString() })));
      setMessage('');
    } catch (error) {
      console.error('Error fetching courses:', error);
      setMessage('Failed to load courses. Please try again later.');
    }
  };

  // Fetch enrolled courses
  const fetchEnrolledCourses = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/courses/enrolled-courses/${userId}`);
      setEnrolledCourses(response.data.courses || []);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      setEnrolledCourses([]);
      setMessage('Failed to load enrolled courses. Please try again later.');
    }
  };

  // Enroll in a course
  const handleEnroll = async (courseId: string) => {
    if (!userId) {
      setMessage('You must be logged in to enroll in courses.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:4000/courses/enroll', { userId, courseId });
      setMessage(response.data.message || 'Successfully enrolled in the course!');
      fetchEnrolledCourses();
    } catch (error) {
      console.error('Error enrolling in course:', error);
      setMessage('You are already enrolled in this course.');
    }
  };

  // Handle search inputs
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCourses();
  };

  // Navigation buttons
  const handleDashboardRedirect = () => router.push('/course/dashboard');
  const handleQuizRedirect = () => router.push('/quiz');
  const handleForumRedirect = () => router.push('/student/forum');
  const handleProfileRedirect = () => router.push('/student/complete-profile');
  const handleAnnouncementsRedirect = () => router.push('/student/announcements'); // Add this for announcements
  return (
    <div className="container mt-5" style={{ position: 'relative' }}>
      {/* Notifications Box */}
      <div
  style={{
    position: 'fixed', // Ensure it stays in the top-right corner even during scrolling
    top: '20px', // Distance from the top
    right: '20px', // Distance from the right edge
    width: '300px', // Fixed width
    backgroundColor: '#f8f9fa', // Light background
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    zIndex: 1000, // Ensures it appears above other elements
  }}
>
  <h5 style={{ color: '#333', fontWeight: 'bold' }}>Notifications</h5>
  {broadcasts.length > 0 ? (
    <ul
      style={{
        listStyle: 'none',
        padding: 0,
        maxHeight: '400px',
        overflowY: 'auto',
      }}
    >
      {broadcasts.map((broadcast, index) => (
        <li
          key={broadcast.id || index}
          style={{
            marginBottom: '10px',
            padding: '10px',
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '5px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h6 style={{ fontSize: '14px', fontWeight: 'bold', color: '#007bff' }}>
            {broadcast.title}
          </h6>
          <p style={{ margin: 0, fontSize: '12px', color: '#555' }}>
            {broadcast.message}
          </p>
          <small style={{ color: '#888' }}>
            {new Date(broadcast.createdAt).toLocaleString()}
          </small>
        </li>
      ))}
    </ul>
  ) : (
    <p style={{ color: '#888', fontSize: '14px' }}>No Notifications available.</p>
  )}
</div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Browse and Enroll in Courses</h1>
        <button className="btn btn-primary" onClick={handleForumRedirect}>
          Forum
        </button>
      </div>

      {/* Action Buttons */}
      <div className="mb-4">
        <button className="btn btn-primary me-2" onClick={handleDashboardRedirect}>
          Go to Dashboard
        </button>
        <button className="btn btn-success me-2" onClick={handleQuizRedirect}>
          Start Quiz
        </button>
        <button className="btn btn-info" onClick={handleAnnouncementsRedirect}>
          View Announcements
        </button>
        <button className="btn btn-info" onClick={handleProfileRedirect}>
          Complete profile
        </button>
      </div>

      {/* Search Form */}
      <form className="mb-4" onSubmit={handleSearch}>
        <div className="row g-3">
        <div className="col-md-4"> {/* Adjusted width */}
        <input
              type="text"
              name="topic"
              value={searchParams.topic}
              placeholder="Search by topic"
              className="form-control"
              onChange={handleSearchChange}
            />
          </div>
          <div className="col-md-4"> {/* Adjusted width */}
          <input
              type="text"
              name="instructor"
              value={searchParams.instructor}
              placeholder="Search by instructor (ID)"
              className="form-control"
              onChange={handleSearchChange}
            />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100">
              Search
            </button>
          </div>
        </div>
      </form>

      {/* Message */}
      {message && <div className="alert alert-info text-center">{message}</div>}

      {/* Courses */}
      <div className="row">
        {courses && courses.length > 0 ? (
          courses.map((course) => {
            const isEnrolled = enrolledCourses.includes(course._id);
            return (
              <div key={course._id} className="col-md-4 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{course.title}</h5>
                    <p className="card-text">{course.description}</p>
                    <button
                      className={`btn ${isEnrolled ? 'btn-secondary' : 'btn-success'} w-100`}
                      onClick={() => handleEnroll(course._id)}
                      disabled={isEnrolled}
                    >
                      {isEnrolled ? 'Enrolled' : 'Enroll'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center">No courses available at the moment.</p>
        )}
      </div>
    </div>
  );
}