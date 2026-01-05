import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import api from '../api/axios';
import { User, ApiResponse, LoginResponse } from '../types';

/**
 * Defines the shape of the Authentication Context.
 */
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider component that wraps the application to provide session state.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Checks for an existing session in LocalStorage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  /**
   * Authenticates the user and stores the token/profile.
   */
  const login = async (email: string, password: string): Promise<void> => {
    // We expect the backend to return ApiResponse<LoginResponse>
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', { email, password });
    
    const { accessToken, user: userData } = response.data.data;

    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  /**
   * Clears the session and logs the user out.
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access the Auth Context.
 * @throws Error if used outside of AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};