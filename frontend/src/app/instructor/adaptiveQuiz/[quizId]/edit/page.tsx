'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

type Quiz = {
  _id: string;
  title: string;
  questions: {
    question: string;
    options: { text: string; isCorrect: boolean }[];
    correctAnswer: string;
    difficulty: string;
  }[];
};

export default function EditQuizPage({ params }: { params: Promise<{ quizId: string }> }) {
  const [quizId, setQuizId] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Unwrap the params promise on component mount
  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await params;
        setQuizId(resolvedParams.quizId);
      } catch {
        setError('Failed to fetch quiz ID from URL.');
      }
    };
    resolveParams();
  }, [params]);

  // Fetch quiz details once quizId is available
  useEffect(() => {
    if (!quizId) return;

    const fetchQuizDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`http://localhost:4000/quizzes/${quizId}`);
        setQuiz(response.data);
      } catch (err: any) {
        console.error('Error fetching quiz details:', err);
        setError('Failed to fetch quiz details.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizDetails();
  }, [quizId]);

  const handleInputChange = (
    index: number,
    field: keyof Quiz['questions'][0],
    value: any
  ) => {
    if (!quiz) return;

    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value,
    };

    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    if (!quiz) return;

    const updatedQuestions = [...quiz.questions];
    const updatedOptions = [...updatedQuestions[questionIndex].options];
    updatedOptions[optionIndex].text = value;

    updatedQuestions[questionIndex].options = updatedOptions;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleSaveChanges = async () => {
    if (!quiz || !quizId) {
      alert('No quiz data to save.');
      return;
    }

    try {
      await axios.patch(`http://localhost:4000/quizzes/${quizId}/update`, quiz);
      alert('Quiz updated successfully!');
      router.push('/instructor/adaptiveQuiz');
    } catch (err) {
      console.error('Error updating quiz:', err);
      alert('Failed to update quiz.');
    }
  };

  if (loading) {
    return <p>Loading quiz details...</p>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <div className="container mt-5">
      {quiz ? (
        <>
          <h1 className="text-center mb-4">Edit Quiz: {quiz.title || 'Untitled Quiz'}</h1>
          <div className="mb-4">
            <h5>Questions:</h5>
            {quiz.questions.map((q, index) => (
              <div key={index} className="mb-4">
                <label>Question {index + 1}:</label>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) =>
                    handleInputChange(index, 'question', e.target.value)
                  }
                  className="form-control mb-2"
                />
                <label>Options:</label>
                {q.options.map((opt, optIndex) => (
                  <input
                    key={optIndex}
                    type="text"
                    value={opt.text}
                    onChange={(e) =>
                      handleOptionChange(index, optIndex, e.target.value)
                    }
                    className="form-control mb-2"
                  />
                ))}
                <label>Correct Answer:</label>
                <input
                  type="text"
                  value={q.correctAnswer}
                  onChange={(e) =>
                    handleInputChange(index, 'correctAnswer', e.target.value)
                  }
                  className="form-control mb-2"
                />
                <label>Difficulty:</label>
                <select
                  value={q.difficulty}
                  onChange={(e) =>
                    handleInputChange(index, 'difficulty', e.target.value)
                  }
                  className="form-select"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            ))}
          </div>
          <button className="btn btn-success" onClick={handleSaveChanges}>
            Save Changes
          </button>
        </>
      ) : (
        <p>No quiz found.</p>
      )}
    </div>
  );
}
