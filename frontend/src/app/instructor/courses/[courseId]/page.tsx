'use client';

import React, { use } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function CourseDetailsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params); // Unwrap params using React.use()
  const router = useRouter();

  const [course, setCourse] = useState<any>(null);
  const [newContent, setNewContent] = useState('');
  const [revisionHistory, setRevisionHistory] = useState<any[]>([]);
  const userId = localStorage.getItem('userId');

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/courses/${courseId}`);
      setCourse(response.data);
      setNewContent(response.data.content);
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  };

  const fetchRevisionHistory = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/courses/${courseId}/revisions`);
      setRevisionHistory(response.data);
    } catch (error) {
      console.error('Error fetching revision history:', error);
    }
  };

  useEffect(() => {
    if (!courseId) return;
    fetchCourseDetails();
    fetchRevisionHistory();
  }, [courseId]);

  const handleUpdateContent = async () => {
    if (!courseId) return;

    try {
      await axios.patch(`http://localhost:4000/courses/${courseId}/update`, {
        content: newContent,
        updatedBy: userId,
      });

      alert('Course updated successfully!');
      await fetchCourseDetails();
      await fetchRevisionHistory();
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Failed to update course content.');
    }
  };

  const handleRollback = async (content: string) => {
    if (!courseId) return;

    try {
      await axios.patch(`http://localhost:4000/courses/${courseId}/update`, {
        content,
        updatedBy: userId,
      });

      alert('Course content rolled back successfully!');
      await fetchCourseDetails();
      await fetchRevisionHistory();
    } catch (error) {
      console.error('Error during rollback:', error);
      alert('Failed to rollback course content.');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Course Details</h1>
      {course ? (
        <>
          <div className="mb-4">
            <h3>{course.title}</h3>
            <p><strong>Category:</strong> {course.category}</p>
            <p><strong>Difficulty:</strong> {course.difficultyLevel}</p>
            <textarea
              className="form-control"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={6}
              placeholder="Update course content here..."
            ></textarea>
            <button className="btn btn-success mt-3" onClick={handleUpdateContent}>
              Update Content
            </button>
          </div>

          <h2>Revision History</h2>
          <ul className="list-group">
            {revisionHistory.map((revision, index) => (
              <li key={index} className="list-group-item">
                <p><strong>Updated By:</strong> {revision.updatedBy}</p>
                <p><strong>Updated At:</strong> {new Date(revision.updatedAt).toLocaleString()}</p>
                <p><strong>Content:</strong> {revision.content}</p>
                <button
                  className="btn btn-secondary mt-2"
                  onClick={() => handleRollback(revision.content)}
                >
                  Rollback to This Version
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-center">Loading course details...</p>
      )}
    </div>
  );
}
