'use client';

import { useState } from 'react';
import axios from 'axios';

export default function CertificatePage() {
  const [formData, setFormData] = useState({
    userName: '',
    courseName: '',
    feedback: '',
  });
  const [message, setMessage] = useState('');
  const [downloadLink, setDownloadLink] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/certificate/generate', formData);
      setMessage('Certificate generated successfully!');
      setDownloadLink(response.data.filePath); // The file path returned by the server
    } catch (error) {
      setMessage('Error generating certificate. Please try again.');
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Generate Certificate</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="userName">Your Name:</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="courseName">Course Name:</label>
          <input
            type="text"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="feedback">Feedback (optional):</label>
          <textarea
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none' }}>
          Generate Certificate
        </button>
      </form>
      {message && <p style={{ marginTop: '20px' }}>{message}</p>}
      {downloadLink && (
        <a href={`http://localhost:4000/${downloadLink}`} download style={{ marginTop: '20px', display: 'block' }}>
          Download Certificate
        </a>
      )}
    </div>
  );
}
