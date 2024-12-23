'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Log {
  userId: string;
  eventType: string;
  timestamp: string; // ISO string format
  reason?: string; // Optional
  ipAddress?: string; // Optional
}

interface FailedLogin {
  username: string;
  timestamp: string; // ISO string format
  reason: string;
}

const LogTable: React.FC = () => {
  const [authLogs, setAuthLogs] = useState<Log[]>([]);
  const [failedLogins, setFailedLogins] = useState<FailedLogin[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [displayCount, setDisplayCount] = useState<number>(5); // Rows to display initially

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        // Fetch authentication logs
        const authLogsResponse = await axios.get<Log[]>('http://localhost:4000/admin/auth-logs');
        setAuthLogs(authLogsResponse.data);

        // Fetch failed login logs
        const failedLoginResponse = await axios.get<FailedLogin[]>('http://localhost:4000/failed-logins');
        setFailedLogins(failedLoginResponse.data);

        setError('');
      } catch (err) {
        console.error('Error fetching logs:', err);
        setError('Failed to fetch logs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleShowMore = () => {
    setDisplayCount((prev) => prev + 5);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Security Monitoring</h2>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      {loading ? (
        <p>Loading logs...</p>
      ) : (
        <>
          <h3>Authentication Activity Logs</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead style={{ color: 'black' }}>
              <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>User ID</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Event Type</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {authLogs.slice(0, displayCount).map((log, index) => (
                <tr key={`authLog-${index}`}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{log.userId}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{log.eventType}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Failed Login Attempts</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead style={{ color: 'black' }}>
              <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Username</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Timestamp</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Reason</th>
              </tr>
            </thead>
            <tbody>
              {failedLogins.slice(0, displayCount).map((log, index) => (
                <tr key={`failedLog-${index}`}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{log.username}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{new Date(log.timestamp).toLocaleString()}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{log.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {(displayCount < authLogs.length || displayCount < failedLogins.length) && (
            <button
              onClick={handleShowMore}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Show More
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default LogTable;
