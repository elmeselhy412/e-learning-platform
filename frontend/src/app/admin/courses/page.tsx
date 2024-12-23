'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ObjectId } from 'mongoose';

interface Course {
  _id: ObjectId; // MongoDB's automatically generated ID
  id: string;
  title: string;
  category: string;
  description: string;
  status: 'active' | 'archived';
  createdAt: string;
  archived: boolean;
}

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null); // For course details modal
  const [showModal, setShowModal] = useState<boolean>(false); // To toggle the modal

  useEffect(() => {
    
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Course[]>('http://localhost:4000/courses');
      
      // Map MongoDB `_id` to `id`
      const mappedCourses = response.data.map((course) => ({
        ...course,
        id: course._id.toString(), // Map _id to id as a string
      }));

      setCourses(mappedCourses);
      setError('');
    } catch (err) {
      setError('Failed to fetch courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
 const archiveCourse = async (id: string, archived: boolean) => {
    try {
      await axios.patch(`http://localhost:4000/courses/${id}/archive`, { archived });
      await fetchCourses(); // Re-fetch courses to reflect changes in the table
    } catch (err) {
      setError('Failed to update the course archive status. Please try again later.');
      console.error('Error archiving/unarchiving the course:', err);
    }
  };
  
  const removeCourse = async (id: string) => {
    try {
        console.log(id)
        await axios.delete(`http://localhost:4000/courses/${id}`);
        setCourses((prev) => prev.filter((course) => course.id !== id));
    } catch (err) {
      setError('Failed to remove the course. Please try again later.');
    }
  };

  const viewCourse = (course: Course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedCourse(null);
    setShowModal(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Courses</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? (
        <p>Loading courses...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead style={{ color: 'black' }}>
            <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Title</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Category</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Created At</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Archive</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
  {courses.map((course) => (
    <tr key={course.id}>
      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{course.title}</td>
      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{course.category}</td>
      <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
        {course.archived ? 'True' : 'False'}
      </td>
      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
      {course.createdAt ? new Date(course.createdAt).toLocaleString() : 'N/A'}
      </td>
      <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
  <input
    type="checkbox"
    checked={course.archived} // Reflect the current archived status
    onChange={(e) => {
      e.preventDefault(); // Prevent default behavior to avoid page refresh
      archiveCourse(course.id, e.target.checked); // Update the archived status
    }}
  />
</td>

      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
        <button
          style={{
            padding: '5px 10px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            marginRight: '5px',
            cursor: 'pointer',
          }}
          onClick={() => viewCourse(course)}
        >
          View
        </button>
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

      {/* Modal for course details */}
      {showModal && selectedCourse && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '400px',
            backgroundColor: '#fff',
            padding: '20px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            zIndex: 1000,
            color:'black'
          }}
        >
          <h2>Course Details</h2>
          <p><strong>Title:</strong> {selectedCourse.title}</p>
          <p><strong>Category:</strong> {selectedCourse.category}</p>
          <p><strong>Description:</strong> {selectedCourse.description}</p>
          <p><strong>Created At:</strong> {new Date(selectedCourse.createdAt).toLocaleString()}</p>
          <button
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      )}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
          }}
          onClick={closeModal}
        />
      )}
    </div>
  );
};

export default Courses;
