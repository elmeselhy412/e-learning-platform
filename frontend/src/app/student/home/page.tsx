'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUserContext } from '../../context/UserContext';

// Define a Course type
type Course = {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficultyLevel: string;
};

export default function StudentHome() {
  const { userId } = useUserContext(); // Retrieve user ID from context
  const [courses, setCourses] = useState<Course[]>([]); // Initialize courses state
  const [searchParams, setSearchParams] = useState({ topic: '', instructor: '' });
  const [message, setMessage] = useState('');
// console.log(userId);
  useEffect(() => {
    fetchCourses(); // Fetch courses on component mount
  }, []);

  // Fetch courses based on search parameters
  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:4000/courses/search-courses', {
        params: searchParams,
      });
      setCourses(response.data.courses);
      setMessage(''); // Clear any existing message
    } catch (error) {
      console.error('Error fetching courses:', error);
      setMessage('Failed to load courses. Please try again later.');
    }
  };

  // Handle changes in search input fields
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission for search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCourses(); // Fetch courses with updated search params
  };

  // Handle course enrollment
  const handleEnroll = async (courseId: string) => {
    try {
      const response = await axios.post('http://localhost:4000/courses/enroll', {
        userId,
        courseId,
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error enrolling in course:', error);
      setMessage('Failed to enroll in the course. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h1 className="text-center mb-4">Browse and Enroll in Courses</h1>
        </div>
        <div>
        <button onClick={() => {
          window.location.replace('/student/forum');
        }} className="btn btn-primary w-100">
              Forum
            </button>
        </div>

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

      {/* Display Messages */}
      {message && <div className="alert alert-info text-center">{message}</div>}

      {/* Display Courses */}
      <div className="row">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div key={course._id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text">{course.description}</p>
                  <p className="card-text">
                    <small className="text-muted">Category: {course.category}</small>
                  </p>
                  <p className="card-text">
                    <small className="text-muted">Difficulty: {course.difficultyLevel}</small>
                  </p>
                  <button
                    className="btn btn-success w-100"
                    onClick={() => handleEnroll(course._id)}
                  >
                    Enroll
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No courses found. Try different search criteria.</p>
        )}
      </div>
    </div>
  );
}
