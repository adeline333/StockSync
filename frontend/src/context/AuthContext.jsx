import React, { createContext, useState, useEffect, useContext, useRef, useCallback } from 'react';

const AuthContext = createContext(null);

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes idle
const WARN_BEFORE_MS = 2 * 60 * 1000;       // warn 2 minutes before

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [sessionWarning, setSessionWarning] = useState(false);

  const timeoutRef = useRef(null);
  const warningRef = useRef(null);

  const API_URL = 'http://localhost:5000/api';

  const logout = useCallback(async () => {
    try {
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (_) {}
    setToken(null);
    setUser(null);
    setSessionWarning(false);
    localStorage.removeItem('token');
    clearTimeout(timeoutRef.current);
    clearTimeout(warningRef.current);
  }, [token]);

  // Reset idle timer on user activity
  const resetTimer = useCallback(() => {
    if (!token) return;
    setSessionWarning(false);
    clearTimeout(timeoutRef.current);
    clearTimeout(warningRef.current);

    warningRef.current = setTimeout(() => {
      setSessionWarning(true);
    }, SESSION_TIMEOUT_MS - WARN_BEFORE_MS);

    timeoutRef.current = setTimeout(() => {
      logout();
    }, SESSION_TIMEOUT_MS);
  }, [token, logout]);

  // Attach activity listeners
  useEffect(() => {
    if (!token) return;
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();
    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      clearTimeout(timeoutRef.current);
      clearTimeout(warningRef.current);
    };
  }, [token, resetTimer]);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) { setLoading(false); return; }
      // If user already set (e.g. just logged in), skip re-fetch
      if (user) { setLoading(false); return; }
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setToken(null);
          setUser(null);
          localStorage.removeItem('token');
        }
      } catch (_) {}
      finally { setLoading(false); }
    };
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      return { success: true, role: data.user.role };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (name, email, password, role, branch_id = null) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, branch_id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      return { success: true, role: data.user.role };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const extendSession = () => {
    setSessionWarning(false);
    resetTimer();
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, sessionWarning, extendSession }}>
      {/* Session Timeout Warning Banner */}
      {sessionWarning && (
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-amber-500 text-white px-6 py-3 flex items-center justify-between shadow-lg">
          <span className="font-semibold text-sm">
            ⚠️ Your session is about to expire due to inactivity. You'll be logged out in 2 minutes.
          </span>
          <div className="flex gap-3">
            <button
              onClick={extendSession}
              className="bg-white text-amber-600 font-bold text-sm px-4 py-1.5 rounded-lg hover:bg-amber-50 transition-colors"
            >
              Stay Logged In
            </button>
            <button
              onClick={logout}
              className="bg-amber-600 text-white font-bold text-sm px-4 py-1.5 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Logout Now
            </button>
          </div>
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
