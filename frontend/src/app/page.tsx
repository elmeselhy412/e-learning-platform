'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import axios from 'axios';
import Link from 'next/link'; // Correct import

export default function Register() {
  const router = useRouter(); // Initialize the App Router
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    passwordHash: '',
    role: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/users/register', formData);
      setMessage('Registration successful! Redirecting to Login...');
      setTimeout(() => {
        router.push('/login'); // Ensure /homepage route exists
      }, 2000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error registering user:', error.response?.data || error.message);
        setMessage('Registration failed. Please check your input.');
      } else {
        console.error('Unexpected error:', error);
        setMessage('An unexpected error occurred.');
      }
    }
  };

  return (
    <div
      className="form_container"
      style={{
        marginLeft: '35%',
        marginTop: '5%',
        padding: '20px',
        backgroundColor: 'white',
        width: '30%',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '20px',color:'black'  }}>Signup Account</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px0', color:'black' }}>
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Enter your email"
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '5px',color:'black'  }}>
            Username
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Enter your username"
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="passwordHash" style={{ display: 'block', marginBottom: '5px', color:'black'  }}>
            Password
          </label>
          <input
            type="password"
            name="passwordHash"
            value={formData.passwordHash}
            placeholder="Enter your password"
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="role" style={{ display: 'block', marginBottom: '5px',color:'black'  }}>
            Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
            required
          >
            <option value="" disabled>
              Select a role
            </option>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Submit
        </button>
        {message && <p style={{ textAlign: 'center', marginTop: '10px',color:'black'  }}>{message}</p>}
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px', color:'black'  }}>
        Already have an account?{' '}
        <Link href="/login" style={{ color: '#007bff' }}>
          Login
        </Link>
      </p>
    </div>
  );
}
