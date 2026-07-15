import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const { data } = await getMe();
      setUser(data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
      localStorage.removeItem('profile'); // Clear invalid session
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const profile = localStorage.getItem('profile');
    if (profile) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = (data) => {
    localStorage.setItem('profile', JSON.stringify({ token: data.token }));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('profile');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};
