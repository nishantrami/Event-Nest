import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';
import { calculatePricing } from '../utils/calculateTotal';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    return getFromStorage(STORAGE_KEYS.CART, []);
  });

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CART, items);
  }, [items]);

  const addToCart = ({ event, ticketType, quantity = 1, selectedSeats = [] }) => {
    setItems(prev => {
      // Check if this event and ticket type already exist in cart
      const existingIndex = prev.findIndex(
        item => item.event.id === event.id && item.ticketType.id === ticketType.id
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const existing = updated[existingIndex];
        const newQty = existing.quantity + quantity;
        
        // Merge seats uniquely
        const mergedSeats = Array.from(new Set([...existing.selectedSeats, ...selectedSeats]));

        updated[existingIndex] = {
          ...existing,
          quantity: newQty,
          selectedSeats: mergedSeats,
          subtotal: ticketType.price * newQty
        };
        return updated;
      }

      const newItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        event: {
          id: event.id,
          title: event.title,
          category: event.category,
          image: event.image,
          date: event.date,
          time: event.time,
          venue: event.venue,
          city: event.city,
          location: event.location,
        },
        ticketType,
        quantity,
        selectedSeats: selectedSeats || [],
        subtotal: ticketType.price * quantity,
        addedAt: new Date().toISOString()
      };

      return [...prev, newItem];
    });
  };

  const removeFromCart = (cartItemId) => {
    setItems(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems(prev =>
      prev.map(item => {
        if (item.id === cartItemId) {
          return {
            ...item,
            quantity: newQty,
            subtotal: item.ticketType.price * newQty
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const pricing = calculatePricing(items);
  const totalCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        ...pricing
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
