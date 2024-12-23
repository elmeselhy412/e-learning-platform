'use client';

import { useEffect, useState } from 'react';
import CompleteProfileModal from '../completeProfile/CompleteProfileModal'; // Import the modal component
import Announcements from '../announcements/Announcements'; // Import the announcements component
import { useRouter } from 'next/navigation'; // Import router for navigation
import axios from 'axios';

interface Broadcast {
  id: string; // Ensure the backend sends a unique `id`
  title: string;
  message: string;
  createdAt: string;
}

export default function Home() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const router = useRouter(); // Initialize router
  const userId = localStorage.getItem('userId');

  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    difficultyLevel: '',
    createdBy: userId,
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:4000/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    const fetchBroadcasts = async () => {
      try {
        const response = await axios.get<Broadcast[]>('http://localhost:4000/broadcast/all');
        setBroadcasts(response.data);
      } catch (err) {
        console.error('Error fetching broadcasts:', err);
      }
    };

    fetchCourses();
    fetchBroadcasts();
  }, []);

  // Profile modal handlers
  const handleProfileModalOpen = () => setIsProfileModalOpen(true);
  const handleProfileModalClose = () => setIsProfileModalOpen(false);

  // Create course modal handlers
  const handleCreateCourseModalOpen = () => setIsCreateCourseModalOpen(true);
  const handleCreateCourseModalClose = () => {
    setIsCreateCourseModalOpen(false);
    setCourseData({ title: '', description: '', category: '', difficultyLevel: '', createdBy: userId });
  };

  const handleCourseFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCourseSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:4000/courses/create', courseData);
      if (!response.data) throw new Error('Failed to create course');
      alert('Course created successfully!');
      handleCreateCourseModalClose();
      router.refresh();
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course. Please try again.');
    }
  };

  // Multimedia upload modal handlers
  const handleOpenUploadModal = (courseId: string) => {
    setSelectedCourse(courseId);
    setShowUploadModal(true);
  };
  const handleCloseUploadModal = () => {
    setSelectedCourse(null);
    setMediaFiles([]);
    setShowUploadModal(false);
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setMediaFiles(Array.from(e.target.files));
  };

  const handleMediaUpload = async () => {
    if (!selectedCourse || mediaFiles.length === 0) {
      alert('Please select a course and upload files.');
      return;
    }
    const formData = new FormData();
    mediaFiles.forEach((file) => formData.append('files', file)); // Match backend's "files" field

    try {
      await axios.post(`http://localhost:4000/courses/${selectedCourse}/upload-media`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Media uploaded successfully!');
      handleCloseUploadModal();
    } catch (error) {
      console.error('Error uploading media:', error);
      alert('Failed to upload media. Please try again.');
    }
  };

  const goToCourseList = () => router.push('/instructor/courses');

  const handleOrganizeModules = () => router.push('/instructor/organizeModules');

  const handleAdaptiveQuizzes = () => router.push('/instructor/adaptiveQuiz');

  const handleNavigateToForums = () => router.push('/instructor/forum'); // Navigate to the forums page

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Welcome to the Instructor Portal</h1>

      <div className="text-center mb-4">
        <button className="btn btn-primary me-2" onClick={handleProfileModalOpen}>
          Complete Profile
        </button>
        <button className="btn btn-success me-2" onClick={handleCreateCourseModalOpen}>
          Create Course
        </button>
        <button className="btn btn-primary me-2" onClick={handleOrganizeModules}>
          Organize Modules
        </button>
        <button className="btn btn-success me-2" onClick={handleAdaptiveQuizzes}>
          Adaptive Quizzes
        </button>
        <button className="btn btn-secondary" onClick={goToCourseList}>
          Go to Course List
        </button>
      </div>

      <div className="text-center mb-4">
        <button className="btn btn-secondary me-2" onClick={handleNavigateToForums}>
          Forums
        </button>
      </div>

      {/* Profile Modal */}
      {isProfileModalOpen && <CompleteProfileModal onClose={handleProfileModalClose} />}

      {/* Create Course Modal */}
      {isCreateCourseModalOpen && (
        <div className="modal d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" style={{ color: 'black' }}>
                  Create a New Course
                </h5>
                <button type="button" className="btn-close" onClick={handleCreateCourseModalClose}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label" style={{ color: 'black' }}>
                    Course Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={courseData.title}
                    onChange={handleCourseFieldChange}
                    placeholder="Enter course title"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label" style={{ color: 'black' }}>
                    Course Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={courseData.description}
                    onChange={handleCourseFieldChange}
                    rows={3}
                    placeholder="Enter course description"
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="category" className="form-label" style={{ color: 'black' }}>
                    Category
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="category"
                    name="category"
                    value={courseData.category}
                    onChange={handleCourseFieldChange}
                    placeholder="Enter course category"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="difficultyLevel" className="form-label" style={{ color: 'black' }}>
                    Difficulty Level
                  </label>
                  <select
                    className="form-select"
                    id="difficultyLevel"
                    name="difficultyLevel"
                    value={courseData.difficultyLevel}
                    onChange={handleCourseFieldChange}
                  >
                    <option value="">Select difficulty</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCreateCourseModalClose}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleCourseSubmit}>
                  Create Course
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Courses Table */}
      <div className="mt-5">
        <h2 className="text-center mb-4">Courses</h2>
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="thead-dark">
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Category</th>
                <th>Difficulty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id}>
                  <td>{course.title}</td>
                  <td>{course.description}</td>
                  <td>{course.category}</td>
                  <td>{course.difficultyLevel}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleOpenUploadModal(course._id)}
                    >
                      Upload Multimedia
                    </button>
                    <button
                      className="btn btn-secondary ms-2"
                      onClick={() => router.push(`/instructor/courses/${course._id}/optimize`)}
                    >
                      Adjust & Optimize
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Multimedia Modal */}
      {showUploadModal && (
        <div className="modal d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" style={{ color: 'black' }}>
                  Upload Multimedia for Course
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseUploadModal}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="file"
                  className="form-control"
                  multiple
                  onChange={handleMediaChange}
                />
                {mediaFiles.length > 0 && (
                  <ul className="mt-3">
                    {mediaFiles.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseUploadModal}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleMediaUpload}>
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Announcements />
 
      {/* Broadcasts Section */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          width: '300px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '15px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
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
    </div>
  );
}
