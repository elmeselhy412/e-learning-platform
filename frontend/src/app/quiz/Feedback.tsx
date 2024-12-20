'use client';

import React from 'react';

interface FeedbackProps {
  isCorrect: boolean | null;
}

export default function Feedback({ isCorrect }: FeedbackProps) {
  if (isCorrect === null) return null;

  return (
    <div
      style={{
        marginTop: '20px',
        padding: '10px',
        borderRadius: '5px',
        backgroundColor: isCorrect ? '#d4edda' : '#f8d7da',
        color: isCorrect ? '#155724' : '#721c24',
      }}
    >
      {isCorrect ? 'Correct!' : 'Incorrect!'}
    </div>
  );
}
