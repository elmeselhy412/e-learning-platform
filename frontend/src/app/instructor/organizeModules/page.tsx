'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ModuleManagement() {
  const [modules, setModules] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [newModule, setNewModule] = useState({ title: '', content: '', order: 1 });
  const [editModule, setEditModule] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchModules();
    fetchCourses();
  }, []);

  const fetchModules = async () => {
    try {
      const response = await axios.get('http://localhost:4000/modules');
      setModules(response.data.sort((a: any, b: any) => a.order - b.order)); // Sort modules by order on the frontend
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:4000/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleCreateModule = async () => {
    try {
      if (!selectedCourseId) {
        alert('Please select a course.');
        return;
      }

      await axios.post('http://localhost:4000/modules/create', {
        ...newModule,
        courseId: selectedCourseId,
      });

      fetchModules();
      setShowModal(false);
      setNewModule({ title: '', content: '', order: 1 });
    } catch (error) {
      console.error('Error creating module:', error);
    }
  };

  const handleEditModule = async () => {
    if (!editModule) return;

    try {
      await axios.put(`http://localhost:4000/modules/${editModule._id}`, {
        title: newModule.title,
        content: newModule.content,
        order: newModule.order,
      });
      fetchModules();
      setEditModule(null);
      setShowModal(false);
    } catch (error) {
      console.error('Error updating module:', error);
      alert('Failed to update module.');
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Are you sure you want to delete this module?')) return;
    try {
      await axios.delete(`http://localhost:4000/modules/${moduleId}`);
      fetchModules();
    } catch (error) {
      console.error('Error deleting module:', error);
    }
  };

  const handleOpenModal = (module?: any) => {
    if (module) {
      setEditModule(module);
      setNewModule({
        title: module.title,
        content: module.content,
        order: module.order,
      });
    } else {
      setEditModule(null);
      setNewModule({ title: '', content: '', order: 1 });
    }
    setShowModal(true);
  };

  const handleSaveModule = () => {
    if (editModule) {
      handleEditModule();
    } else {
      handleCreateModule();
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Module Management</h1>
      
      <button className="btn btn-primary mb-4" onClick={() => handleOpenModal()}>
        Add New Module
      </button>

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Content</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((module) => (
              <tr key={module._id}>
                <td>{module.title}</td>
                <td>{module.content}</td>
                <td>{module.order}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleOpenModal(module)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteModule(module._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editModule ? 'Edit Module' : 'Add New Module'}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <select
                  className="form-select mb-3"
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  disabled={!!editModule} // Disable course selection for editing
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Module Title"
                  value={newModule.title}
                  onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                />
                <textarea
                  className="form-control mb-3"
                  placeholder="Module Content"
                  value={newModule.content}
                  onChange={(e) => setNewModule({ ...newModule, content: e.target.value })}
                ></textarea>
                <input
                  type="number"
                  className="form-control mb-3"
                  placeholder="Order"
                  value={newModule.order}
                  onChange={(e) => setNewModule({ ...newModule, order: parseInt(e.target.value) })}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSaveModule}>
                  Save Module
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
