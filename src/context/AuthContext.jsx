import React, { createContext, useContext, useState } from 'react';
import { getFromStorage, saveToStorage, removeFromStorage, STORAGE_KEYS } from '../utils/storage';

const AuthContext = createContext();

// Static Admin Credentials & Profile
export const STATIC_ADMIN = {
  id: 'usr-admin-root',
  name: 'Platform Admin',
  email: 'admin@eventnest.com',
  phone: '+91 98888 77777',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  role: 'admin', // Sole authorized role for Organizer Dashboard
  city: 'Mumbai',
  bio: 'Platform Master Administrator with exclusive access to Organizer Dashboard and platform organization fees.',
  joinedDate: 'January 2025',
  preferences: {
    favoriteCategories: ['music', 'technology', 'festivals'],
    emailNotifications: true,
    smsAlerts: true,
    themeMode: 'system'
  }
};

// Standard Demo User (Non-admin)
export const DEFAULT_USER = {
  id: 'usr-default-01',
  name: 'Nishant Rami',
  email: 'user@eventnest.com',
  phone: '+91 98765 43210',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
  role: 'user', // Regular user: can book tickets and host events with admin charge
  city: 'Mumbai',
  bio: 'Event curator, music festival enthusiast, and community explorer.',
  joinedDate: 'January 2026',
  preferences: {
    favoriteCategories: ['music', 'technology', 'festivals'],
    emailNotifications: true,
    smsAlerts: false,
    themeMode: 'system'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = getFromStorage(STORAGE_KEYS.USER);
    if (savedUser !== null) {
      // Normalize legacy roles: only static admin has 'admin' role
      if (savedUser.email?.toLowerCase() === 'admin@eventnest.com') {
        const adminObj = { ...STATIC_ADMIN, ...savedUser, role: 'admin' };
        saveToStorage(STORAGE_KEYS.USER, adminObj);
        return adminObj;
      }
      if (savedUser.role === 'organizer' || !savedUser.role) {
        const normalized = { ...savedUser, role: 'user' };
        saveToStorage(STORAGE_KEYS.USER, normalized);
        return normalized;
      }
      return savedUser;
    }
    // Pre-populate with standard regular user for instant testing
    saveToStorage(STORAGE_KEYS.USER, DEFAULT_USER);
    return DEFAULT_USER;
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const savedList = getFromStorage(STORAGE_KEYS.USERS_LIST, []);
    if (savedList.length === 0) {
      const initialList = [
        { ...STATIC_ADMIN, password: 'admin123' },
        { ...DEFAULT_USER, password: 'password123' },
        { ...DEFAULT_USER, email: 'nishant@eventnest.com', password: 'password123' }
      ];
      saveToStorage(STORAGE_KEYS.USERS_LIST, initialList);
      return initialList;
    }
    return savedList;
  });

  const register = ({ name, email, phone, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    
    // Check if user already exists
    const existing = registeredUsers.find(u => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    // Check if trying to register static admin email
    const isAdminEmail = normalizedEmail === 'admin@eventnest.com';
    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      phone: phone?.trim() || '',
      password,
      role: isAdminEmail ? 'admin' : 'user',
      avatar: isAdminEmail 
        ? STATIC_ADMIN.avatar 
        : `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80`,
      city: 'Mumbai',
      bio: 'New EventNest explorer.',
      joinedDate: new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date()),
      preferences: {
        favoriteCategories: ['music', 'festivals'],
        emailNotifications: true,
        smsAlerts: true,
        themeMode: 'system'
      }
    };

    const updatedList = [...registeredUsers, newUser];
    setRegisteredUsers(updatedList);
    saveToStorage(STORAGE_KEYS.USERS_LIST, updatedList);

    // Set logged in user (without plain password in session)
    const { password: _, ...sessionUser } = newUser;
    setUser(sessionUser);
    saveToStorage(STORAGE_KEYS.USER, sessionUser);

    return { success: true, user: sessionUser };
  };

  const login = ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Static Admin Login (Static Credentials)
    if (
      (normalizedEmail === 'admin@eventnest.com' || normalizedEmail === 'admin@event.com' || normalizedEmail === 'admin@gmail.com') &&
      (password === 'admin123' || password === 'admin')
    ) {
      setUser(STATIC_ADMIN);
      saveToStorage(STORAGE_KEYS.USER, STATIC_ADMIN);
      return { success: true, user: STATIC_ADMIN };
    }

    // 2. Demo User Fallback
    if (
      (normalizedEmail === 'user@eventnest.com' || normalizedEmail === 'nishant@eventnest.com') &&
      (password === 'password123' || password === 'user123' || password === 'password')
    ) {
      setUser(DEFAULT_USER);
      saveToStorage(STORAGE_KEYS.USER, DEFAULT_USER);
      return { success: true, user: DEFAULT_USER };
    }

    // 3. Registered Users check
    const matched = registeredUsers.find(
      u => u.email.toLowerCase() === normalizedEmail && u.password === password
    );

    if (matched) {
      const { password: _, ...sessionUser } = matched;
      // If user registered with admin email, ensure admin role
      if (normalizedEmail === 'admin@eventnest.com') {
        sessionUser.role = 'admin';
      }
      setUser(sessionUser);
      saveToStorage(STORAGE_KEYS.USER, sessionUser);
      return { success: true, user: sessionUser };
    }

    return { success: false, error: 'Invalid email or password. Please use static admin or test user credentials.' };
  };

  const logout = () => {
    setUser(null);
    removeFromStorage(STORAGE_KEYS.USER);
  };

  const updateProfile = (updatedFields) => {
    if (!user) return;
    const updated = { ...user, ...updatedFields };
    // Preserve admin role if email is admin
    if (user.email === 'admin@eventnest.com') {
      updated.role = 'admin';
    }
    setUser(updated);
    saveToStorage(STORAGE_KEYS.USER, updated);

    // Also update in registered list
    const updatedList = registeredUsers.map(u => (u.id === user.id ? { ...u, ...updatedFields } : u));
    setRegisteredUsers(updatedList);
    saveToStorage(STORAGE_KEYS.USERS_LIST, updatedList);
    return { success: true, user: updated };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isUser: user?.role === 'user',
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
