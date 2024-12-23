import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Course {
  id: string;
  title: string;
  category: string;
  status: 'active' | 'archived';
  updatedAt: string;
}

export const CourseOversight: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Course[]>('/api/courses'); // Replace with your API endpoint
        setCourses(response.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const archiveCourse = async (id: string) => {
    try {
      await axios.patch(`/api/courses/${id}`, { status: 'archived' }); // Replace with your API endpoint
      setCourses((prev) =>
        prev.map((course) =>
          course.id === id ? { ...course, status: 'archived' } : course
        )
      );
    } catch (err) {
      setError('Failed to archive the course. Please try again later.');
    }
  };

  const removeCourse = async (id: string) => {
    try {
      await axios.delete(`/api/courses/${id}`); // Replace with your API endpoint
      setCourses((prev) => prev.filter((course) => course.id !== id));
    } catch (err) {
      setError('Failed to remove the course. Please try again later.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Course Oversight</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? (
        <p>Loading courses...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Title</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Category</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Updated At</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{course.title}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{course.category}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{course.status}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  {new Date(course.updatedAt).toLocaleString()}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  {course.status === 'active' && (
                    <button
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#ffa500',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        marginRight: '5px',
                        cursor: 'pointer',
                      }}
                      onClick={() => archiveCourse(course.id)}
                    >
                      Archive
                    </button>
                  )}
                  <button
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#ff4d4f',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                    onClick={() => removeCourse(course.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
