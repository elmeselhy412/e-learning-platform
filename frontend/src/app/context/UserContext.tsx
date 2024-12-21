'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserContextType {
  email: string;
  setEmail: (email: string) => void;
  role: string;
  setRole: (role: string) => void;
  userId: string;
  setUserId: (userId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState(() => {
    // Initialize from localStorage
    return localStorage.getItem('userId') || '';
  });

  useEffect(() => {
    if (userId) {
      localStorage.setItem('userId', userId); // Persist userId
    }
  }, [userId]);

  return (
    <UserContext.Provider value={{ email, setEmail, role, setRole, userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}
