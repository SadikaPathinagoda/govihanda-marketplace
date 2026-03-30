'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('govihanda_token');
    if (token) {
      authAPI
        .getProfile()
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem('govihanda_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token, ...userData } = res.data;
    localStorage.setItem('govihanda_token', token);
    setUser(userData);
    return userData;
  };

  const register = async (formData) => {
    const res = await authAPI.register(formData);
    const { token, ...userData } = res.data;
    localStorage.setItem('govihanda_token', token);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('govihanda_token');
    setUser(null);
  };

  const updateUser = (data) => setUser((prev) => ({ ...prev, ...data }));

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
