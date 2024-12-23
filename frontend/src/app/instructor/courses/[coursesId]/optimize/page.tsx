'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation'; // For extracting params and navigation
import axios from 'axios';

export default function OptimizeCoursePage() {
  const params = useParams();
  const { moduleId } = params; // Extract moduleId from URL params
  const router = useRouter();

  const [quizzes, setQuizzes] = useState<any[]>([]);

  // Fetch quizzes
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/quizzes/modules/${moduleId}/quizzes`);
        setQuizzes(response.data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };

    if (moduleId) {
      fetchQuizzes();
    }
  }, [moduleId]);

  const handleEditQuiz = (quizId: string) => {
    // Redirect to the edit page for the specific quiz
    router.push(`/instructor/adaptiveQuiz/${quizId}/edit`);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Manage Quizzes</h1>

      {quizzes.length > 0 ? (
        <ul className="list-group">
          {quizzes.map((quiz) => (
            <li key={quiz._id} className="list-group-item">
              <h5>{quiz.title || 'Untitled Quiz'}</h5>
              <p><strong>Number of Questions:</strong> {quiz.questions.length}</p>
              <button
                className="btn btn-primary"
                onClick={() => handleEditQuiz(quiz._id)}
              >
                Edit Quiz
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No quizzes available for this module.</p>
      )}
    </div>
  );
}
