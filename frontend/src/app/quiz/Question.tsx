'use client';

import React from 'react';

interface QuestionProps {
  question: {
    questionText: string;
    options: string[];
    correctOption: string;
  };
  onAnswer: (isCorrect: boolean) => void;
}

export default function Question({ question, onAnswer }: QuestionProps) {
  const handleAnswer = (selectedOption: string) => {
    const isCorrect = selectedOption === question.correctOption;
    onAnswer(isCorrect);
  };

  return (
    <div>
      <h2>{question.questionText}</h2>
      <div>
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            style={{
              display: 'block',
              margin: '10px 0',
              padding: '10px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #ccc',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
