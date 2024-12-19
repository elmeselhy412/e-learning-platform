'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '../context/UserContext'; // Adjust path as needed
import axios from 'axios';

export default function VerifyOTP() {
  const router = useRouter();
  const { email } = useUserContext(); // Retrieve email from context

  const [formData, setFormData] = useState({
    email: '',
    otp: '',
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!email) {
      router.push('/'); // Redirect to login if email is missing
    } else {
      setFormData((prev) => ({ ...prev, email })); // Set email in form data
    }
  }, [email, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/users/verify-otp', formData);
      setMessage('OTP verified successfully! Redirecting to homepage...');
      setTimeout(() => {
        router.push('/homepage');
      }, 2000);
    } catch (error) {
      console.error('OTP verification failed:', error);
      setMessage('Incorrect OTP. Please try again.');
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
      <h2 style={{ textAlign: 'center', marginBottom: '20px',color:'black'  }}>Verify OTP</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" value={formData.email} readOnly />
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="otp" style={{ display: 'block', marginBottom: '5px', color:'black'  }}>
            otp
          </label>
          <input
            type="otp"
            name="otp"
            value={formData.otp}
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
    </div>
  );
}
