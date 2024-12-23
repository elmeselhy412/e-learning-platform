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

export default function StudentHome() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchParams, setSearchParams] = useState({ topic: '', instructor: '' });
  const [message, setMessage] = useState('');
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const router = useRouter();
  const userId = localStorage.getItem('userId');

  // Fetch all courses and enrolled courses
  useEffect(() => {
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
    <div className="container mt-5">
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
        <button
         className="btn btn-info"
         onClick={() => router.push('/student/announcements')}>
         View Announcements
        </button>
      </div>

      {/* Search Form */}
      <form className="mb-4" onSubmit={handleSearch}>
        <div className="row g-3">
          <div className="col-md-5">
            <input
              type="text"
              name="topic"
              value={searchParams.topic}
              placeholder="Search by topic"
              className="form-control"
              onChange={handleSearchChange}
            />
          </div>
          <div className="col-md-5">
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
