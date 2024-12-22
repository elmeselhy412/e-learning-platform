'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import axios from 'axios';

interface StudentAnalytics {
  userId: string;
  completionPercentage: number;
  scores: number[];
  completedModules?: string[];
}

export default function CourseAnalyticsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const [analytics, setAnalytics] = useState<StudentAnalytics[]>([]);
  const [message, setMessage] = useState<string>('');
  const [overallPerformance, setOverallPerformance] = useState<any>({});
  const router = useRouter();

  // Unwrap params using React.use
  const { courseId } = use(params);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!courseId) {
        setMessage('Invalid course ID.');
        return;
      }

      try {
        // Fetch course analytics
        const analyticsResponse = await axios.get(`http://localhost:4000/performance/course/${courseId}`);
        setAnalytics(analyticsResponse.data);

        // Fetch course analysis
        const analysisResponse = await axios.get(`http://localhost:4000/performance/course/${courseId}/analysis`);
        setOverallPerformance(analysisResponse.data.overallPerformance);

        setMessage('');
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage('Failed to load analytics. Please try again later.');
      }
    };

    fetchAnalytics();
  }, [courseId]);

  const calculateAverageScore = (scores: number[]): number => {
    if (!scores || scores.length === 0) return 0;
    const total = scores.reduce((sum, score) => sum + score, 0);
    return Math.round(total / scores.length);
  };

  const goBack = () => {
    router.push('/instructor/courses');
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Course Analytics</h1>
      {message && <p className="text-danger text-center">{message}</p>}
      {!message && (
        <>
          <div className="mb-4">
            <h3>Overall Performance</h3>
            <p>Total Students: {overallPerformance.totalStudents || 0}</p>
            <p>Average Completion: {overallPerformance.averageCompletion || 0}%</p>
            <p>Average Quiz Score: {overallPerformance.averageScore || 0}%</p>
          </div>

          {analytics.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead className="thead-dark">
                  <tr>
                    <th>Student ID</th>
                    <th>Completion Percentage</th>
                    <th>Average Quiz Score</th>
                    <th>Modules Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.map((data, index) => (
                    <tr key={index}>
                      <td>{data.userId}</td>
                      <td>{data.completionPercentage || 0}%</td>
                      <td>{calculateAverageScore(data.scores)}%</td>
                      <td>{data.completedModules?.length || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center mt-4">No analytics data available for this course.</p>
          )}
        </>
      )}
      <div className="text-center mt-4">
        <button className="btn btn-secondary" onClick={goBack}>
          Back to Course List
        </button>
      </div>
    </div>
  );
}
