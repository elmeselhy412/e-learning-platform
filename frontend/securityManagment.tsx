import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface AuthStatus {
  totalUsers: number;
  mfaEnabledUsers: number;
  passwordPolicy: string;
}

interface AuditLog {
  id: string;
  timestamp: string;
  email: string;
  activity: string;
}

export const SecurityMonitoring: React.FC = () => {
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSecurityData = async () => {
      try {
        setLoading(true);

        // Fetch authentication status
        const authResponse = await axios.get<AuthStatus>('/api/security/auth-status'); // Replace with your endpoint
        setAuthStatus(authResponse.data);

        // Fetch audit logs
        const auditResponse = await axios.get<AuditLog[]>('/api/security/audit-logs'); // Replace with your endpoint
        setAuditLogs(auditResponse.data);

        setError('');
      } catch (err) {
        setError('Failed to fetch security data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSecurityData();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Security Monitoring</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {loading ? (
        <p>Loading security data...</p>
      ) : (
        <>
          {/* Authentication Overview */}
          <div style={{ marginBottom: '20px' }}>
            <h2>Authentication Overview</h2>
            {authStatus ? (
              <ul>
                <li>Total Users: {authStatus.totalUsers}</li>
                <li>MFA Enabled Users: {authStatus.mfaEnabledUsers}</li>
                <li>Password Policy: {authStatus.passwordPolicy}</li>
              </ul>
            ) : (
              <p>No authentication data available.</p>
            )}
          </div>

          {/* Audit Logs */}
          <div>
            <h2>Audit Logs</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Timestamp</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Activity</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.length > 0 ? (
                  auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{log.email}</td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{log.activity}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} style={{ padding: '10px', textAlign: 'center' }}>
                      No suspicious activities found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
