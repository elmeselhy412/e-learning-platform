'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface NotesProps {
  courseId: string;
  userId: string;
}

export default function Notes({ courseId, userId }: NotesProps) {
  const [notes, setNotes] = useState<{ content: string }[]>([]);
  const [noteContent, setNoteContent] = useState('');

  // Fetch notes for the course
  useEffect(() => {
    async function fetchNotes() {
      try {
        console.log('Fetching notes for course:', courseId, 'and user:', userId);
        const response = await axios.get(
          `http://localhost:4000/courses/${courseId}/notes?userId=${userId}`
        );
        setNotes(response.data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    }
    fetchNotes();
  }, [courseId, userId]);

  // Handle note submission
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:4000/courses/${courseId}/notes`, {
        userId,
        content: noteContent,
      });
      setNotes([...notes, response.data]);
      setNoteContent('');
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  return (
    <div>
      <h2>Quick Notes</h2>
      <form onSubmit={handleAddNote} style={{ marginBottom: '20px' }}>
        <textarea
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder="Write a note..."
          required
          style={{
            width: '100%',
            height: '80px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '8px',
          }}
        ></textarea>
        <button
          type="submit"
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Add Note
        </button>
      </form>
      <div>
        {notes.map((note, index) => (
          <div key={index} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc' }}>
            {note.content}
          </div>
        ))}
      </div>
    </div>
  );
}
