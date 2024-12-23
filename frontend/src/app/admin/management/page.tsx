'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ObjectId } from 'mongoose';


interface User {
  _id: ObjectId; // MongoDB's automatically generated ID
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor';
  status: 'active' | 'inactive';
}
interface FailedLogin {
  username: string;
  timestamp: string; // ISO string format
  reason: string;
}
const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [failedLogins, setFailedLogins] = useState<FailedLogin[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [failedLoginLoading, setFailedLoginLoading] = useState<boolean>(true);
  const [displayCount, setDisplayCount] = useState<number>(5); // Number of rows to display



  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get<User[]>('http://localhost:4000/users/getAll');
        const filteredUsers = response.data
          .filter((user) => user.role === 'student' || user.role === 'instructor')
          .map((user) => ({
            ...user,
            id: user._id.toString(), // Map _id from backend to id in the frontend
          }));
        setUsers(filteredUsers);
        setError('');
      } catch (err) {
        setError('Failed to fetch users. Please try again later.');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };
    const fetchFailedLogins = async () => {
      try {
        setFailedLoginLoading(true);
        const response = await axios.get<FailedLogin[]>('http://localhost:4000/failed-logins');
        setFailedLogins(response.data);
      } catch (err) {
        console.error('Error fetching failed login logs:', err);
      } finally {
        setFailedLoginLoading(false);
      }
    };
    fetchFailedLogins();
    fetchUsers();
  }, []);
  

  const updateUserStatus = async (id: string, status: 'active' | 'inactive') => {
    try {
      const response = await axios.patch(`http://localhost:4000/users/status/${id}`, { status });
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? { ...user, status: response.data.status } : user))
      );
      console.log(status)
      setError('');
    } catch (err) {
      setError('Failed to update user status. Please try again.');
      console.error('Error updating user status:', err);
    }
  };
  

  const getStatusBadge = (status: 'active' | 'inactive') => {
    return (
      <span
        style={{
          display: 'inline-block',
          padding: '5px 10px',
          color: status === 'active' ? '#fff' : '#000',
          backgroundColor: status === 'active' ? '#4CAF50' : '#f4f4f4',
          border: '1px solid #ddd',
          borderRadius: '20px',
          textAlign: 'center',
        }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  const handleShowMore = () => {
    setDisplayCount((prev) => prev + 5);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>User Management</h1>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead style={{ color: 'black' }}>
            <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Role</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={`user-${user.id}`}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.name}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.email}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.role}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                  {getStatusBadge(user.status)}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <select
                    value={user.status}
                    onChange={(e) => updateUserStatus(user.id, e.target.value as 'active' | 'inactive')}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      backgroundColor: '#ffffff',
                      color: '#333',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                      appearance: 'none',
                      outline: 'none',
                      width: '100%',
                    }}
                  >
                    <option value="active">Activate</option>
                    <option value="inactive">Deactivate</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 style={{ marginTop: '40px' }}>Failed Login Attempts</h2>
      {failedLoginLoading ? (
        <p>Loading failed login logs...</p>
      ) : (
        <>
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
                <tr key={`log-${index}`}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{log.username}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{log.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {displayCount < failedLogins.length && (
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

export default UserManagement;
