import React, { useState } from 'react';
import axios from 'axios';

// Define the structure of the API response
interface APIResponse {
  message: string;
}

const FeedbackForm: React.FC = () => {
  const [feedback, setFeedback] = useState(''); // Feedback entered by the user
  const [responseMessage, setResponseMessage] = useState(''); // Message to display after submission

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Use Axios Generics to define the expected response type
      const response = await axios.post<APIResponse>('/api/feedback', { feedback });

      // Access response data safely with the defined type
      setResponseMessage(response.data.message || 'Feedback submitted successfully!');
      setFeedback(''); // Clear the feedback textarea
    } catch (error) {
      setResponseMessage('Failed to submit feedback. Please try again.');
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div>
      <h2>Submit Feedback</h2>

      {/* Display the response message */}
      {responseMessage && <p>{responseMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter your feedback here..."
            style={{
              width: '100%',
              height: '100px',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              marginBottom: '10px',
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
