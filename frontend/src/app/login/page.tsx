'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '../context/UserContext'; // Adjust path as needed
import axios from 'axios';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { setEmail } = useUserContext(); // Use context to set the email

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/users/login', formData);
      setEmail(formData.email); // Save email in the context
      setMessage('Login successful! Redirecting to OTP verification...');
      setTimeout(() => {
        router.push('/otp'); // Redirect to OTP page
      }, 2000);
    } catch (error) {
      console.error('Login failed:', error);
      setMessage('Login failed. Please check your input.');
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
      <h2 style={{ textAlign: 'center', marginBottom: '20px',color:'black'  }}>Login to your Account</h2>
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
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', color:'black'  }}>
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
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
        Don't have an account?{' '}
        <Link href="/" style={{ color: '#007bff' }}>
          Register
        </Link>
      </p>
    </div>
  );
}
