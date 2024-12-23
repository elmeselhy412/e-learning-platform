import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor';
  status: 'active' | 'inactive';
}

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]); // State for user data
  const [error, setError] = useState<string>(''); // State for error messages
  const [loading, setLoading] = useState<boolean>(true); // State for loading

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true); // Show loading state
        // Explicitly type the response as an array of User objects
        const response = await axios.get<User[]>('/api/users'); // Replace with your actual API endpoint
        setUsers(response.data); // TypeScript now knows response.data is User[]
        setError('');
      } catch (err) {
        setError('Failed to fetch users. Please try again later.');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false); // Hide loading state
      }
    };

    fetchUsers();
  }, []);

  const toggleUserStatus = async (id: string, currentStatus: 'active' | 'inactive') => {
    try {
      const updatedStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await axios.patch(`/api/users/${id}`, { status: updatedStatus }); // Replace with your actual API endpoint
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, status: updatedStatus } : user
        )
      );
      setError(''); // Clear any previous error messages
    } catch (err) {
      setError('Failed to update user status. Please try again.');
      console.error('Error updating user status:', err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>User Management</h1>

      {/* Display error message */}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      {/* Display loading spinner */}
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
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
              <tr key={user.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.name}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.email}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.role}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.status}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <button
                    style={{
                      padding: '5px 10px',
                      backgroundColor: user.status === 'active' ? '#ff4d4f' : '#4CAF50',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                    onClick={() => toggleUserStatus(user.id, user.status)}
                  >
                    {user.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
