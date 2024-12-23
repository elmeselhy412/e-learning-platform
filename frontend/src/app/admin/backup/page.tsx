'use client';
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
        const response = await axios.get<Backup[]>('http://localhost:4000/backup/list');
        setBackups(response.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch backups. Please try again later.');
        console.error('Error fetching backups:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBackups();
  }, []);

  const scheduleBackup = async () => {
    try {
      const response = await axios.post<{ message: string }>('http://localhost:4000/backup/schedule', { schedule });
      alert(`Backup scheduled successfully: ${response.data.message}`);
    } catch (err) {
      setError('Failed to schedule backup. Please try again later.');
      console.error('Error scheduling backup:', err);
    }
  };

  const triggerBackup = async () => {
    try {
      const response = await axios.post<{ message: string }>('http://localhost:4000/backup/trigger');
      alert(response.data.message);
      // Refresh backup list after triggering
      const refreshedBackups = await axios.get<Backup[]>('http://localhost:4000/backup/list');
      setBackups(refreshedBackups.data);
    } catch (err) {
      setError('Failed to trigger backup. Please try again later.');
      console.error('Error triggering backup:', err);
    }
  };

  const restoreBackup = async (id: string) => {
    try {
      const response = await axios.post<{ message: string }>(`http://localhost:4000/backup/restore/${id}`);
      alert(response.data.message);
    } catch (err) {
      setError('Failed to restore backup. Please try again later.');
      console.error('Error restoring backup:', err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333', fontSize: '24px' }}>Data Backup and Maintenance</h1>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#333', fontSize: '20px' }}>Schedule Backup</h2>
        <label htmlFor="schedule" style={{ fontWeight: 'bold' }}>Choose Frequency:</label>
        <select
          id="schedule"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
          style={{
            marginLeft: '10px',
            padding: '5px 10px',
            borderRadius: '5px',
            border: '1px solid #ddd',
            fontSize: '16px',
          }}
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
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Schedule
        </button>
        <button
          onClick={triggerBackup}
          style={{
            marginLeft: '10px',
            padding: '5px 10px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Trigger Now
        </button>
      </div>

      <div>
        <h2 style={{ color: '#333', fontSize: '20px' }}>Backup History</h2>
        {loading ? (
          <p>Loading backups...</p>
        ) : (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '20px',
              backgroundColor: '#fff',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left', color: '#333' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Timestamp</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
  {backups.length > 0 ? (
    backups.map((backup) => (
      <tr key={backup.id}>
        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
          {new Date(backup.timestamp).toLocaleString()} {/* Convert ISO to readable format */}
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
    ))
  ) : (
    <tr>
      <td colSpan={3} style={{ padding: '10px', textAlign: 'center' }}>
        No backups available.
      </td>
    </tr>
  )}
</tbody>

          </table>
        )}
      </div>
    </div>
  );
};

export default DataBackup;
