'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserContextType {
  email: string;
  setEmail: (email: string) => void;
  role: string;
  setRole: (role: string) => void;
  userId: string;
  setUserId: (userId: string) => void;
  token:string;
  setToken:(token:string)=> void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState('');
  const[token, setToken] = useState('');
  const [isClient, setIsClient] = useState(false);

  // Ensure rendering only happens on the client
  useEffect(() => {
    setIsClient(true);
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      localStorage.setItem('userId', userId); // Persist userId
    }
  }, [userId]);

  // Render nothing on the server to prevent hydration mismatch
  if (!isClient) {
    return null;
  }

  return (
    <UserContext.Provider value={{ email, setEmail, role, setRole, userId, setUserId, token, setToken }}>
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
