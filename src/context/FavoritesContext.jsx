import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const saved = getFromStorage(STORAGE_KEYS.FAVORITES);
    if (!saved || !Array.isArray(saved)) {
      return [];
    }
    // Clean up previous static seed data if it contained the legacy demo IDs
    const isOldStaticSeed =
      saved.length === 3 &&
      saved.includes('evt-001') &&
      saved.includes('evt-003') &&
      saved.includes('evt-010');
    if (isOldStaticSeed) {
      saveToStorage(STORAGE_KEYS.FAVORITES, []);
      return [];
    }
    return saved;
  });

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.FAVORITES, favorites);
  }, [favorites]);

  const toggleFavorite = (eventId) => {
    setFavorites(prev => {
      if (prev.includes(eventId)) {
        return prev.filter(id => id !== eventId);
      } else {
        return [...prev, eventId];
      }
    });
  };

  const isFavorite = (eventId) => favorites.includes(eventId);

  const clearFavorites = () => setFavorites([]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        favoritesCount: favorites.length,
        clearFavorites
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
};
