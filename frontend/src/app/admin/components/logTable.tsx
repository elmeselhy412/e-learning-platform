import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Log {
  id: string;
  timestamp: string;
  email: string;
  reason: string;
}

export const LogTable: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Fetch logs from the API endpoint
        const response = await axios.get<Log[]>('/api/logs');
        setLogs(response.data); // Update logs state
        setError(''); // Clear any previous error
      } catch (err: unknown) {
        if (err instanceof Error && (err as any).response) {
          // Check if the error has a response property (Axios error)
          const axiosError = err as unknown as { response: { data: { message: string } } };
          setError(axiosError.response.data.message || 'Failed to fetch logs');
        } else if (err instanceof Error) {
          // Handle non-Axios errors
          setError(err.message);
        } else {
          // Handle unexpected errors
          setError('An unexpected error occurred');
        }
      }
    };

    fetchLogs();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Failed Login Attempts & Unauthorized Access Logs</h2>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Timestamp</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Reason</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                {new Date(log.timestamp).toLocaleString()}
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{log.email}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{log.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
