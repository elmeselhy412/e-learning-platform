'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Course {
  _id: string;
  title: string;
  category: string;
  difficultyLevel: string;
}

export default function CourseListPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [message, setMessage] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:4000/courses');
        setCourses(response.data); // Assuming API returns an array of courses
        setMessage('');
      } catch (error) {
        console.error('Error fetching courses:', error);
        setMessage('Failed to load courses. Please try again later.');
      }
    };

    fetchCourses();
  }, []);

  const navigateToAnalytics = (courseId: string) => {
    router.push(`/instructor/analytics/${courseId}`);
};
const navigateToDetails = (courseId: string) => {
  router.push(`/instructor/courses/${courseId}`);
};


  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Available Courses</h1>
      {message && <p className="text-danger text-center">{message}</p>}

      {courses.length > 0 ? (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {courses.map((course) => (
            <div className="col" key={course._id}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text">
                    <strong>Category:</strong> {course.category}
                  </p>
                  <p className="card-text">
                    <strong>Difficulty:</strong> {course.difficultyLevel}
                  </p>
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => navigateToAnalytics(course._id)}
                  >
                    View Analytics
                  </button>
                  <button
                      className="btn btn-secondary"
                      onClick={() => navigateToDetails(course._id)}
                    >
                      View Details
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center mt-4">No courses available at the moment.</p>
      )}
    </div>
  );
}
