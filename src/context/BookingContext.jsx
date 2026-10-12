import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';
import { generateBookingId } from '../utils/generateBookingId';

const BookingContext = createContext();

const LEGACY_STATIC_BOOKING_IDS = ['EN-2026-X8K9M2', 'EN-2026-P3M7W9'];

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState(() => {
    const saved = getFromStorage(STORAGE_KEYS.BOOKINGS);
    if (!saved || !Array.isArray(saved)) {
      return [];
    }
    // Clean up legacy static demo bookings so they do not show
    const cleaned = saved.filter((b) => !LEGACY_STATIC_BOOKING_IDS.includes(b?.id));
    if (cleaned.length !== saved.length) {
      saveToStorage(STORAGE_KEYS.BOOKINGS, cleaned);
    }
    return cleaned;
  });

  // Track reserved seats across events globally
  const [reservedSeatsMap, setReservedSeatsMap] = useState(() => {
    return getFromStorage(STORAGE_KEYS.SEAT_RESERVATIONS, {
      'evt-001': ['A1', 'A2', 'B4', 'B5', 'C1', 'D7', 'E10', 'E11'],
      'evt-002': ['A3', 'A4', 'B6', 'D2', 'D3'],
      'evt-003': ['A1', 'B2', 'B3', 'C8', 'D9'],
    });
  });

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);
  }, [bookings]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SEAT_RESERVATIONS, reservedSeatsMap);
  }, [reservedSeatsMap]);

  // Retrieve only the bookings belonging to a specific user
  const getUserBookings = (currentUser) => {
    if (!currentUser) return [];
    const targetEmail = currentUser.email?.toLowerCase().trim();
    const targetId = currentUser.id;
    return bookings.filter((b) => {
      const bEmail = (b.userEmail || b.customer?.email)?.toLowerCase().trim();
      const bId = b.userId;
      const matchesEmail = Boolean(targetEmail && bEmail && (targetEmail === bEmail || (targetEmail === 'user@eventnest.com' && bEmail === 'nishant@eventnest.com')));
      const matchesId = Boolean(targetId && bId && targetId === bId);
      return matchesEmail || matchesId;
    });
  };

  // Retrieve all booked & packed seats for an event across ALL users
  const getReservedSeatsForEvent = (eventId) => {
    if (!eventId) return [];
    const fromMap = reservedSeatsMap[eventId] || [];
    const fromBookings = bookings
      .filter((b) => b.eventId === eventId && b.status !== 'cancelled')
      .flatMap((b) => b.selectedSeats || []);
    return Array.from(new Set([...fromMap, ...fromBookings]));
  };

  const createBooking = ({
    items,
    pricing,
    customerInfo,
    paymentDetails,
    userId,
    userEmail
  }) => {
    const bookingId = generateBookingId();
    const primaryItem = items[0] || {};
    const event = primaryItem.event || {};
    const allSeats = items.flatMap((item) => item.selectedSeats || []);

    const assignedUserId = userId || customerInfo?.userId || 'usr-guest';
    const assignedUserEmail = (userEmail || customerInfo?.email || '').toLowerCase().trim();

    const newBooking = {
      id: bookingId,
      userId: assignedUserId,
      userEmail: assignedUserEmail,
      eventId: event.id,
      eventTitle: event.title,
      eventImage: event.image,
      category: event.category,
      date: event.date,
      time: event.time,
      venue: event.venue,
      location: event.location,
      city: event.city,
      items: items.map((item) => ({
        ticketTypeName: item.ticketType.name,
        ticketTypeId: item.ticketType.id,
        quantity: item.quantity,
        price: item.ticketType.price,
        seats: item.selectedSeats || []
      })),
      ticketTypeName: items.map((i) => `${i.ticketType.name} (x${i.quantity})`).join(', '),
      quantity: items.reduce((sum, i) => sum + i.quantity, 0),
      selectedSeats: allSeats,
      subtotal: pricing.subtotal,
      serviceFee: pricing.serviceFee,
      gst: pricing.gst,
      totalAmount: pricing.total,
      status: 'upcoming',
      bookedAt: new Date().toISOString(),
      customer: {
        ...customerInfo,
        email: assignedUserEmail || customerInfo?.email
      },
      paymentMethod: paymentDetails?.method || 'UPI',
      qrCodeData: `EVENTNEST-${bookingId}-${event.id}-VERIFIED`
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Update globally reserved seats for the event so other users see them as booked/packed
    if (event.id && allSeats.length > 0) {
      setReservedSeatsMap((prev) => {
        const existing = prev[event.id] || [];
        const updated = [...new Set([...existing, ...allSeats])];
        const nextMap = {
          ...prev,
          [event.id]: updated
        };
        saveToStorage(STORAGE_KEYS.SEAT_RESERVATIONS, nextMap);
        return nextMap;
      });
    }

    return newBooking;
  };

  const getBookingById = (id) => {
    return bookings.find((b) => b.id === id);
  };

  const cancelBooking = (id) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b))
    );
  };

  // Import a booking directly (e.g. when scanned from QR code on mobile)
  const importBooking = (importedBooking) => {
    if (!importedBooking || !importedBooking.id) return;
    setBookings((prev) => {
      const exists = prev.some((b) => b.id === importedBooking.id);
      if (exists) return prev;
      const updated = [importedBooking, ...prev];
      saveToStorage(STORAGE_KEYS.BOOKINGS, updated);
      return updated;
    });
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        createBooking,
        getBookingById,
        cancelBooking,
        importBooking,
        reservedSeatsMap,
        getUserBookings,
        getReservedSeatsForEvent
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used within BookingProvider');
  return context;
};
