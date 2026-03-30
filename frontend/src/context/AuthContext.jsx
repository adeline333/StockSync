import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Define API Base URL
  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    // If token exists, verify it and fetch user details
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          // Token is invalid or expired
          setToken(null);
          setUser(null);
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Failed to authenticate:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Login Function
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save to state & local storage
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Register Function
  const register = async (name, email, password, role) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }), // branch_id omitted for simple registration
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Save to state & local storage
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout Function
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
