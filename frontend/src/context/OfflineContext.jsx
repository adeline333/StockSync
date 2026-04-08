import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

const OfflineContext = createContext(null);

const QUEUE_KEY = 'stocksync_offline_queue';
const API_URL = 'http://localhost:5000/api';

export const OfflineProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState(() => {
    try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]'); } catch { return []; }
  });
  const [lastSync, setLastSync] = useState(null);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncQueue();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
  }, []);

  const saveQueue = (queue) => {
    setOfflineQueue(queue);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  };

  // Add a transaction to the offline queue
  const queueTransaction = useCallback((transaction) => {
    const item = { ...transaction, id: Date.now(), queued_at: new Date().toISOString() };
    const current = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
    const updated = [...current, item];
    saveQueue(updated);
    return item;
  }, []);

  // Remove a transaction from the queue
  const removeFromQueue = useCallback((id) => {
    const current = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
    saveQueue(current.filter(item => item.id !== id));
  }, []);

  // Sync all queued transactions
  const syncQueue = useCallback(async (token) => {
    const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
    if (queue.length === 0 || !navigator.onLine) return;

    setIsSyncing(true);
    const results = { success: 0, failed: 0 };

    for (const item of queue) {
      try {
        const res = await fetch(`${API_URL}/sales/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify(item.data)
        });
        if (res.ok) {
          removeFromQueue(item.id);
          results.success++;
        } else {
          results.failed++;
        }
      } catch (e) {
        results.failed++;
      }
    }

    setLastSync(new Date());
    setIsSyncing(false);
    return results;
  }, [removeFromQueue]);

  // Request push notification permission
  const requestPushPermission = async () => {
    if (!('Notification' in window)) return false;
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  };

  // Show a local push notification
  const showNotification = (title, body, url = '/') => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.ico', data: { url } });
    }
  };

  return (
    <OfflineContext.Provider value={{
      isOnline,
      isSyncing,
      offlineQueue,
      lastSync,
      queueTransaction,
      removeFromQueue,
      syncQueue,
      requestPushPermission,
      showNotification,
      queueCount: offlineQueue.length
    }}>
      {/* Offline Banner */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-[9998] bg-slate-900 text-white px-6 py-2.5 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"/>
            <span className="text-sm font-bold">You're offline. Sales will be queued and synced when reconnected.</span>
          </div>
          {offlineQueue.length > 0 && (
            <span className="text-xs font-black bg-amber-500 text-white px-2.5 py-1 rounded-full">
              {offlineQueue.length} queued
            </span>
          )}
        </div>
      )}
      {/* Syncing Banner */}
      {isSyncing && (
        <div className="fixed top-0 left-0 right-0 z-[9998] bg-sky-600 text-white px-6 py-2.5 flex items-center gap-3 shadow-lg">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
          <span className="text-sm font-bold">Syncing offline transactions...</span>
        </div>
      )}
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => useContext(OfflineContext);
