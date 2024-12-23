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
  const [overallPerformance, setOverallPerformance] = useState<any>({});
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [newRecommendation, setNewRecommendation] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
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
  const addRecommendation = () => {
    if (newRecommendation.trim()) {
      setRecommendations((prev) => [...prev, newRecommendation]);
      setNewRecommendation('');
      setShowModal(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setNewRecommendation(''); // Reset the input field
  };
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Course Analytics</h1>
      {message && <p className="text-danger text-center">{message}</p>}
      {!message && (
        <>
          <div className="mb-4 card p-4">
            <h3 className="mb-3">Overall Performance</h3>
            <p><strong>Total Students:</strong> {overallPerformance.totalStudents || 0}</p>
            <p><strong>Average Completion:</strong> {overallPerformance.averageCompletion || 0}%</p>
            <p><strong>Average Quiz Score:</strong> {overallPerformance.averageScore || 0}%</p>
          </div>

          <div className="table-responsive mb-4">
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

          <div className="mt-4 card p-4">
            <h3>Teaching Recommendations</h3>
            <ul className="list-group">
              {recommendations.length > 0 ? (
                recommendations.map((rec, index) => (
                  <li key={index} className="list-group-item">
                    {rec}
                  </li>
                ))
              ) : (
                <p className="text-muted">No recommendations yet. Add one below!</p>
              )}
            </ul>
            <button
              className="btn btn-primary mt-3"
              onClick={() => setShowModal(true)}
            >
              Add Recommendation
            </button>
          </div>

          {showModal && (
            <div className="modal d-block" tabIndex={-1}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" style={{color:'black'}}>Add a Recommendation</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={handleModalClose}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <textarea
                      className="form-control"
                      rows={3}
                      value={newRecommendation}
                      onChange={(e) => setNewRecommendation(e.target.value)}
                      placeholder="Write your recommendation here..."
                    ></textarea>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleModalClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={addRecommendation}
                    >
                      Save Recommendation
                    </button>
                  </div>
                </div>
              </div>
            </div>
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