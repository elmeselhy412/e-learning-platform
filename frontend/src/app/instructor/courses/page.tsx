'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Course {
  _id: string;
  title: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [message, setMessage] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:4000/courses');
        setCourses(response.data);
      } catch (error) {
        setMessage('Failed to load courses.');
      }
    };

    fetchCourses();
  }, []);

  const viewAnalytics = (courseId: string) => {
    router.push(`/instructor/analytics/${courseId}`);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Courses</h1>
      {message && <p className="text-danger">{message}</p>}
      {courses.length > 0 && (
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Course Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id}>
                <td>{course.title}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => viewAnalytics(course._id)}>
                    View Analytics
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
