'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Question from './Question';
import Feedback from './Feedback';

export default function QuizPage() {
  const [question, setQuestion] = useState<any>(null);
  const [quizId] = useState(' '); // Replace with a valid quiz ID
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [feedback, setFeedback] = useState<boolean | null>(null);

  const fetchNextQuestion = async () => {
    try {
      console.log('Fetching question with:', { quizId, correctAnswers, totalQuestions });
  
      const response = await axios.get(
        `http://localhost:4000/quizzes/${quizId}/next-question?correctAnswers=${correctAnswers}&totalQuestions=${totalQuestions}`
      );
  
      console.log('Backend response:', response.data);
  
      if (response.data.nextQuestion) {
        setQuestion(response.data.nextQuestion);
      } else if (response.data.message) {
        alert(response.data.message);
      } else {
        alert('No more questions available.');
      }
  
      setFeedback(null); // Reset feedback
    } catch (error) {
      console.error('Error fetching next question:', error);
  
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
        alert(errorMessage);
      } else {
        alert('An unexpected error occurred. Please try again.');
      }
    }
  };
  

  const handleAnswer = (isCorrect: boolean) => {
    setFeedback(isCorrect);
    setTotalQuestions(totalQuestions + 1);
    if (isCorrect) setCorrectAnswers(correctAnswers + 1);

    setTimeout(() => {
      fetchNextQuestion();
    }, 2000);
  };

  useEffect(() => {
    fetchNextQuestion(); // Fetch the first question
  }, []);

  return (
    <div>
      <h1>Adaptive Quiz</h1>
      {question ? (
        <Question question={question} onAnswer={handleAnswer} />
      ) : (
        <p>Loading next question...</p>
      )}
      <Feedback isCorrect={feedback} />
      <div style={{ marginTop: '20px' }}>
        <p>
          Correct Answers: {correctAnswers} / Total Questions: {totalQuestions}
        </p>
      </div>
    </div>
  );
}
