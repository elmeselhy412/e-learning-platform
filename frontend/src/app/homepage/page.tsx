'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter(); // Initialize router for navigation

  const handleDashboardRedirect = () => {
    router.push('/course/dashboard'); // Navigate to the dashboard page
  };

  const handleQuizRedirect = () => {
    router.push('/quiz'); // Navigate to the quiz page
  };

  return (
    <div>
      <h1>Welcome to the Homepage!</h1>
      <p>Congratulations, you have successfully registered.</p>
      <button
        onClick={handleDashboardRedirect}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginRight: '10px',
        }}
      >
        Go to Dashboard
      </button>
      <button
        onClick={handleQuizRedirect}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Start Quiz
      </button>
    </div>
  );
}
