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

   // Schedule backup
   const scheduleBackup = async () => {
    try {
      const response = await axios.post('http://localhost:4000/backup/schedule', { schedule });
      alert(`Backup schedule updated: ${response.data.message}`);
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
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', color: '#333' }}>
      <h1 style={{ color: 'white', fontSize: '26px', marginBottom: '20px' }}>Data Backup and Maintenance</h1>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      <div style={{ marginBottom: '30px', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ color: '#333', fontSize: '20px', marginBottom: '10px' }}>Schedule Backup</h2>
        <label htmlFor="schedule" style={{ fontWeight: 'bold', marginRight: '10px' }}>Choose Frequency:</label>
        <select
          id="schedule"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '16px',
            marginRight: '10px',
            color: '#333',
            backgroundColor: '#fff',
          }}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <button
          onClick={scheduleBackup}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginRight: '10px',
          }}
        >
          Schedule
        </button>
        <button
          onClick={triggerBackup}
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Trigger Now
        </button>
      </div>

      <div>
        <h2 style={{ color: 'white', fontSize: '20px', marginBottom: '10px' }}>Backup History</h2>
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
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#f4f4f4', color: '#333', textAlign: 'left' }}>
                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Timestamp</th>
                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Status</th>
                <th style={{ padding: '12px', border: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {backups.length > 0 ? (
                backups.map((backup) => (
                  <tr key={backup.id}>
                    <td style={{ padding: '10px', border: '1px solid #ddd', color: '#555' }}>
                      {new Date(backup.timestamp).toLocaleString()}
                    </td>
                    <td
                      style={{
                        padding: '10px',
                        border: '1px solid #ddd',
                        color: backup.status === 'Completed' ? '#28a745' : backup.status === 'Failed' ? '#dc3545' : '#ffc107',
                      }}
                    >
                      {backup.status}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      <button
                        onClick={() => restoreBackup(backup.id)}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: '#28a745',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
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
                  <td colSpan={3} style={{ padding: '12px', textAlign: 'center', color: '#555' }}>
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
