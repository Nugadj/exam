import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthContextType } from '../types';
import { v4 as uuidv4 } from 'uuid';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('examUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Check if trial has expired
      if (parsedUser.status === 'trial' && parsedUser.trialEndDate) {
        const trialEnd = new Date(parsedUser.trialEndDate);
        if (trialEnd < new Date()) {
          parsedUser.status = 'expired';
          localStorage.setItem('examUser', JSON.stringify(parsedUser));
        }
      }
      setUser(parsedUser);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication
    const users = JSON.parse(localStorage.getItem('examUsers') || '[]');
    const foundUser = users.find((u: User) => u.email === email);
    
    if (foundUser) {
      // Check if trial has expired
      if (foundUser.status === 'trial' && foundUser.trialEndDate) {
        const trialEnd = new Date(foundUser.trialEndDate);
        if (trialEnd < new Date()) {
          foundUser.status = 'expired';
        }
      }
      
      foundUser.lastActive = new Date();
      const updatedUsers = users.map((u: User) => u.id === foundUser.id ? foundUser : u);
      localStorage.setItem('examUsers', JSON.stringify(updatedUsers));
      localStorage.setItem('examUser', JSON.stringify(foundUser));
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('examUsers') || '[]');
    const existingUser = users.find((u: User) => u.email === email);
    
    if (existingUser) {
      return false;
    }

    const trialStartDate = new Date();
    const trialEndDate = new Date(trialStartDate);
    trialEndDate.setDate(trialEndDate.getDate() + 2);

    const newUser: User = {
      id: uuidv4(),
      email,
      name,
      role: 'student',
      status: 'trial',
      trialStartDate,
      trialEndDate,
      joinDate: new Date(),
      lastActive: new Date(),
      paymentStatus: 'none'
    };

    users.push(newUser);
    localStorage.setItem('examUsers', JSON.stringify(users));
    localStorage.setItem('examUser', JSON.stringify(newUser));
    setUser(newUser);
    return true;
  };

 const logout = () => {
  localStorage.removeItem('examUser');
  setUser(null);
  // Optionally, redirect to login page if using React Router
  // navigate('/login');
};

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    const users = JSON.parse(localStorage.getItem('examUsers') || '[]');
    const updatedUsers = users.map((u: User) => u.id === user.id ? updatedUser : u);
    
    localStorage.setItem('examUsers', JSON.stringify(updatedUsers));
    localStorage.setItem('examUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
