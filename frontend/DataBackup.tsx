import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Backup {
  id: string;
  timestamp: string;
  status: 'Completed' | 'In Progress' | 'Failed';
}

export const DataBackup: React.FC = () => {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [schedule, setSchedule] = useState<string>('daily'); // Default schedule

  useEffect(() => {
    const fetchBackups = async () => {
      try {
        setLoading(true);
        // Use generics to define the type of response.data
        const response = await axios.get<Backup[]>('/api/backups');
        setBackups(response.data); // Now TypeScript knows response.data is of type Backup[]
        setError('');
      } catch (err) {
        setError('Failed to fetch backups. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBackups();
  }, []);

  const scheduleBackup = async () => {
    try {
      const response = await axios.post<{ message: string }>('/api/backups/schedule', { schedule });
      alert(`Backup scheduled successfully: ${response.data.message}`);
    } catch (err) {
      setError('Failed to schedule backup. Please try again later.');
    }
  };

  const restoreBackup = async (id: string) => {
    try {
      await axios.post<{ message: string }>(`/api/backups/restore/${id}`);
      alert('Backup restored successfully.');
    } catch (err) {
      setError('Failed to restore backup. Please try again later.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Data Backup and Maintenance</h1>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      {/* Schedule Backup Section */}
      <div style={{ marginBottom: '20px' }}>
        <h2>Schedule Backup</h2>
        <label htmlFor="schedule">Choose Frequency:</label>
        <select
          id="schedule"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
          style={{ marginLeft: '10px' }}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <button
          onClick={scheduleBackup}
          style={{
            marginLeft: '10px',
            padding: '5px 10px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Schedule
        </button>
      </div>

      {/* Backup History Section */}
      <div>
        <h2>Backup History</h2>
        {loading ? (
          <p>Loading backups...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Timestamp</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {backups.map((backup) => (
                <tr key={backup.id}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {new Date(backup.timestamp).toLocaleString()}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{backup.status}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <button
                      onClick={() => restoreBackup(backup.id)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#28a745',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Restore
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
