import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';

const NotificationContext = createContext();

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Booking Confirmed!',
    message: 'Your tickets for "Neon Horizon: Global Electronic Music Odyssey" are ready. View your digital ticket in My Bookings.',
    time: '10 mins ago',
    read: false,
    type: 'success',
    link: '/my-bookings'
  },
  {
    id: 'notif-2',
    title: '🔥 Trending in Mumbai',
    message: 'Tickets for Laugh Therapy with Zakir are selling out fast! 85% seats already claimed.',
    time: '2 hours ago',
    read: false,
    type: 'alert',
    link: '/events/evt-002'
  },
  {
    id: 'notif-3',
    title: 'Welcome to EventNest',
    message: 'Discover hand-curated concerts, masterclasses, and stadium spectacles near you. Enjoy booking fees discounts on your first 3 events!',
    time: '1 day ago',
    read: true,
    type: 'info',
    link: '/events'
  }
];

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    const saved = getFromStorage(STORAGE_KEYS.NOTIFICATIONS);
    if (saved !== null) return saved;
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    return INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }, [notifications]);

  const addNotification = ({ title, message, type = 'info', link = null }) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      message,
      time: 'Just now',
      read: false,
      type,
      link
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        unreadCount
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};
