'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUserContext } from '../../context/UserContext';
import { useRouter } from 'next/navigation';

// Define a Course type
type Course = {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficultyLevel: string;
};

export default function StudentHome() {
  // const { userId } = useUserContext(); // Retrieve user ID from context
  const [courses, setCourses] = useState<Course[]>([]); // Initialize as an empty array
  const [searchParams, setSearchParams] = useState({ topic: '', instructor: '' });
  const [message, setMessage] = useState('');
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]); // List of enrolled course IDs
  const router = useRouter(); // Initialize router for navigation
const userId = localStorage.getItem('userId');
console.log(userId);

useEffect(() => {
  fetchCourses();
  if (userId) {
    fetchEnrolledCourses();
  }
}, [userId]);

const fetchCourses = async () => {
  try {
    const response = await axios.get('http://localhost:4000/courses');
    console.log('Courses Response:', response.data); // Log the data to inspect structure

    // Ensure _id exists and convert it to a string
    const formattedCourses = response.data.map((course: any) => ({
      ...course,
      _id: course._id ? course._id.toString() : '', // Safeguard _id conversion
    }));

    setCourses(formattedCourses);
    setMessage('');
  } catch (error) {
    console.error('Error fetching courses:', error);
    setMessage('Failed to load courses. Please try again later.');
  }
};


const fetchEnrolledCourses = async () => {
  try {
    const response = await axios.get(`http://localhost:4000/courses/enrolled-courses/${userId}`);
    console.log('Enrolled Courses:', response.data.courses);
    setEnrolledCourses(response.data.courses); // Ensure backend sends strings
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    setEnrolledCourses([]);
    setMessage('Failed to load enrolled courses. Please try again later.');
  }
};

const handleEnroll = async (courseId: string) => {
  if (!userId) {
    setMessage('User not logged in.');
    return;
  }
  try {
    const response = await axios.post('http://localhost:4000/courses/enroll', { userId, courseId });
    setMessage(response.data.message || 'Successfully enrolled in the course!');
    fetchEnrolledCourses();
  } catch (error) {
    console.error('Error enrolling in course:', error);
    setMessage('User Already Enrolled.');
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


  const handleDashboardRedirect = () => {
    router.push('/course/dashboard'); // Navigate to the dashboard page
  };

  const handleQuizRedirect = () => {
    router.push('/quiz'); // Navigate to the quiz page
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h1 className="text-center mb-4">Browse and Enroll in Courses</h1>
        </div>
        <div>
        <button
        onClick={() => {
          window.location.replace('/student/forum');
        }}
        style={{
          width: '200px', // Increased the width
          padding: '10px', // Optional: Add padding for better appearance
        }}
        className="btn btn-primary w-100"
      >
        Forum
      </button>
        
        </div>
 
      </div>
      <div>
        <button
          onClick={handleDashboardRedirect}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px',
            marginBottom:"20px"

          }}
        >
          Go to Dashboard
        </button>
        <button
          onClick={handleQuizRedirect}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom:"20px"
          }}
        >
          Start Quiz
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

      {/* Display Messages */}
      {message && <div className="alert alert-info text-center">{message}</div>}

      {/* Display Courses */}
     <div className="row">
     {courses && courses.length > 0 ? (
          courses.map((course) => {
            const isEnrolled = enrolledCourses.includes(course._id); // Proper comparison
            console.log('Course ID:', course._id, 'Is Enrolled:', isEnrolled);
            return (
              <div key={course._id} className="col-md-4 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{course.title}</h5>
                    <p className="card-text">{course.description}</p>
                    <button
                      className={`btn ${isEnrolled ? 'btn-secondary' : 'btn-success'} w-100`}
                      onClick={() => handleEnroll(course._id)}
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
