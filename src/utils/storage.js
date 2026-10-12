/**
 * EventNest LocalStorage Management Layer
 * Provides safe, persistent access to local state across the application.
 */

export const STORAGE_KEYS = {
  USER: 'eventnest_user',
  USERS_LIST: 'eventnest_registered_users',
  FAVORITES: 'eventnest_favorites',
  CART: 'eventnest_cart',
  BOOKINGS: 'eventnest_bookings',
  THEME: 'eventnest_theme',
  RECENTLY_VIEWED: 'eventnest_recently_viewed',
  ORGANIZER_EVENTS: 'eventnest_custom_events',
  REVIEWS: 'eventnest_reviews',
  NOTIFICATIONS: 'eventnest_notifications',
  SEARCH_HISTORY: 'eventnest_search_history',
  PREFERENCES: 'eventnest_preferences',
  SEAT_RESERVATIONS: 'eventnest_seat_reservations', // Map of eventId -> array of reserved seat IDs
  ORGANIZATION_FEES: 'eventnest_organization_fees',
  ADMIN_SETTINGS: 'eventnest_admin_settings',
};

export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null || item === undefined) return defaultValue;
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error reading key "${key}" from LocalStorage:`, error);
    return defaultValue;
  }
};

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving key "${key}" to LocalStorage:`, error);
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing key "${key}" from LocalStorage:`, error);
  }
};

export const clearStorage = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing LocalStorage:', error);
  }
};
