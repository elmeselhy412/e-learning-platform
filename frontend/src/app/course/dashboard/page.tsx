'use client';

import React, { useEffect, useState } from 'react';
import Multimedia from './Multimedia';
import Notes from './Notes';
import axios from 'axios';

export default function DashboardPage() {
  const [resources, setResources] = useState<{ type: string; url: string; title: string }[]>([]);
  const [courseId] = useState('6751adfbdca25805e6573771'); // Replace with actual course ID logic
  const [userId] = useState('67509ba6a4b5d2df9ce183bd'); // Replace with logged-in user ID
  const [completionRate, setCompletionRate] = useState<number>(0);
  const [averageScore, setAverageScore] = useState<number>(0);

  // Fetch multimedia resources
  useEffect(() => {
    async function fetchResources() {
      try {
        const response = await axios.get(`http://localhost:4000/courses/${courseId}/dashboard`);
        setResources(response.data.multimediaResources);
      } catch (error) {
        console.error('Error fetching multimedia resources:', error);
      }
    }
    fetchResources();
  }, [courseId]);

  // Fetch performance metrics
  useEffect(() => {
    async function fetchPerformanceMetrics() {
      try {
        const completionResponse = await axios.get(
          `http://localhost:4000/performance/user/${userId}/completion-rate/${courseId}`
        );
        const scoreResponse = await axios.get(
          `http://localhost:4000/performance/user/${userId}/average-score/${courseId}`
        );

        setCompletionRate(completionResponse.data);
        setAverageScore(scoreResponse.data);
      } catch (error) {
        console.error('Error fetching performance metrics:', error);
      }
    }
    fetchPerformanceMetrics();
  }, [userId, courseId]);

  // Handle certificate generation
  const handleGenerateCertificate = async () => {
    try {
      const response = await axios.post('http://localhost:4000/certificate/generate', {
        userName: 'John Doe', // Replace with actual user name
        courseName: 'Sample Course', // Replace with actual course name
        feedback: 'This course was great!', // Optional feedback
      });

      alert('Certificate generated successfully! Download it at: ' + response.data.filePath);
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Failed to generate certificate. Please try again.');
    }
  };

  return (
    <div>
      <h1>Course Dashboard</h1>

      {/* Multimedia Resources */}
      <Multimedia resources={resources} />

      {/* Notes Section */}
      <Notes courseId={courseId} userId={userId} />

      {/* Performance Metrics */}
      <div style={{ marginTop: '20px' }}>
        <h2>Performance Metrics</h2>
        <p>Completion Rate: {completionRate.toFixed(2)}%</p>
        <p>Average Quiz Score: {averageScore.toFixed(2)}</p>
      </div>

      {/* Certificate Generation */}
      <button
        onClick={handleGenerateCertificate}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Generate Certificate
      </button>
    </div>
  );
}
