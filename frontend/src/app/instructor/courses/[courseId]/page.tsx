'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';

interface Course {
  _id?: string;
  title: string;
  description: string;
  category: string;
  difficultyLevel: string;
  createdBy?: string;
}

export default function CourseDetailsPage() {
  const [course, setCourse] = useState<Course | null>(null);
  const [message, setMessage] = useState<string>('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    category: '',
    difficultyLevel: '',
  });
  const params = useParams();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const courseId = params.courseId; // Extract `courseId` from `params`
        if (!courseId) throw new Error('Course ID is undefined.');
        const response = await axios.get(`http://localhost:4000/courses/${courseId}`);
        setCourse(response.data);
        setMessage('');
      } catch (error) {
        console.error('Error fetching course details:', error);
        setMessage('Failed to load course details. Please try again later.');
      }
    };

    fetchCourseDetails();
  }, [params]);

  const handleOpenEditModal = () => {
    if (course) {
      setEditData({
        title: course.title,
        description: course.description,
        category: course.category,
        difficultyLevel: course.difficultyLevel,
      });
      setIsEditModalOpen(true);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleEditFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    const courseId = params.courseId;
    try {
      await axios.patch(`http://localhost:4000/courses/details/${courseId}/`, editData);
      alert('Course updated successfully!');
      setCourse({ ...course, ...editData });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Failed to update course. Please try again.');
    }
  };

  const handleDeleteCourse = async () => {
    const courseId = params.courseId;
    const confirmDelete = window.confirm('Are you sure you want to delete this course?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:4000/courses/${courseId}`);
      alert('Course deleted successfully!');
      window.location.href = '/instructor/courses'; // Redirect to course list
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Course Details</h1>
      {message && <p className="text-danger text-center">{message}</p>}

      {course ? (
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="card-title">{course.title}</h3>
            <p className="card-text">
              <strong>Description:</strong> {course.description}
            </p>
            <p className="card-text">
              <strong>Category:</strong> {course.category}
            </p>
            <p className="card-text">
              <strong>Difficulty Level:</strong> {course.difficultyLevel}
            </p>
            <p className="card-text">
              <strong>Created By:</strong> {course.createdBy}
            </p>
            <div className="mt-4">
              <button className="btn btn-secondary me-2" onClick={handleOpenEditModal}>
                Edit Course
              </button>
              <button className="btn btn-danger" onClick={handleDeleteCourse}>
                Delete Course
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center mt-4">Loading course details...</p>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="modal d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Course</h5>
                <button type="button" className="btn-close" onClick={handleCloseEditModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Course Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={editData.title}
                    onChange={handleEditFieldChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Course Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={editData.description}
                    onChange={handleEditFieldChange}
                    rows={3}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    Category
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="category"
                    name="category"
                    value={editData.category}
                    onChange={handleEditFieldChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="difficultyLevel" className="form-label">
                    Difficulty Level
                  </label>
                  <select
                    className="form-select"
                    id="difficultyLevel"
                    name="difficultyLevel"
                    value={editData.difficultyLevel}
                    onChange={handleEditFieldChange}
                  >
                    <option value="">Select difficulty</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseEditModal}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleEditSubmit}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
