import React, { useState } from 'react';
import axios from 'axios';

// Define the structure of the API response
interface APIResponse {
  message: string;
}

const AnnouncementForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Use Axios Generics to specify the expected response type
      const response = await axios.post<APIResponse>('/api/announcements', { title, message });

      // Access the response data safely
      setResponseMessage(response.data.message || 'Announcement created successfully!');
      setTitle(''); // Clear the title input
      setMessage(''); // Clear the message input
    } catch (error) {
      setResponseMessage('Failed to create announcement. Please try again.');
      console.error('Error creating announcement:', error);
    }
  };

  return (
    <div>
      <h2>Create Announcement</h2>

      {/* Display response message */}
      {responseMessage && <p>{responseMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter announcement title"
          />
        </div>
        <div>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter announcement message"
          />
        </div>
        <button type="submit">Create Announcement</button>
      </form>
    </div>
  );
};

export default AnnouncementForm;
