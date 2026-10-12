import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_EVENTS } from '../data/events';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';

const EventsContext = createContext();

const INITIAL_REVIEWS_SEED = {
  'evt-001': [
    { id: 'rev-1', userName: 'Aryan Mehta', rating: 5, date: '2026-09-15', text: 'The visual production and sound system were truly world class! Unforgettable night.' },
    { id: 'rev-2', userName: 'Sneha Rao', rating: 5, date: '2026-09-12', text: 'VIP SkyDeck was worth every single rupee. Smooth entry and great crowd.' }
  ],
  'evt-002': [
    { id: 'rev-3', userName: 'Rohan Gupta', rating: 5, date: '2026-09-20', text: 'Laughed till my stomach hurt! Zakir’s new material is absolute genius.' }
  ],
  'evt-003': [
    { id: 'rev-4', userName: 'Devika Sharma', rating: 5, date: '2026-09-18', text: 'Unmatched networking. Connected with three venture funds directly during the breakout.' }
  ]
};

// Initial Seed of User Event Organization Charges (in Indian Currency ₹ INR)
export const INITIAL_ORGANIZATION_FEES = [
  {
    id: 'tx-fee-01',
    eventId: 'evt-custom-seed-01',
    eventTitle: 'Monsoon Acoustic Sessions Live',
    userId: 'usr-u1',
    userName: 'Ananya Verma',
    userEmail: 'ananya.verma@gmail.com',
    amount: 499,
    currency: 'INR',
    currencySymbol: '₹',
    paymentMethod: 'UPI (Google Pay)',
    transactionId: 'UPI-GPAY-984210',
    status: 'Paid',
    paidAt: '2026-09-27T14:32:00.000Z',
    category: 'music',
    city: 'Mumbai',
    venue: 'Royal Opera House'
  },
  {
    id: 'tx-fee-02',
    eventId: 'evt-custom-seed-02',
    eventTitle: 'Bandra Indie Food & Craft Brew Fest',
    userId: 'usr-u2',
    userName: 'Kabir Mehta',
    userEmail: 'kabir@indiefood.in',
    amount: 499,
    currency: 'INR',
    currencySymbol: '₹',
    paymentMethod: 'RuPay Debit Card',
    transactionId: 'TXN-RUPAY-482103',
    status: 'Paid',
    paidAt: '2026-09-28T18:15:00.000Z',
    category: 'festivals',
    city: 'Mumbai',
    venue: 'Bandra Amphitheatre'
  },
  {
    id: 'tx-fee-03',
    eventId: 'evt-custom-seed-03',
    eventTitle: 'Bangalore AI Founders & Tech Hackathon',
    userId: 'usr-u3',
    userName: 'Rahul Nair',
    userEmail: 'rahul@techstart.io',
    amount: 499,
    currency: 'INR',
    currencySymbol: '₹',
    paymentMethod: 'PhonePe UPI',
    transactionId: 'UPI-PHONEPE-773129',
    status: 'Paid',
    paidAt: '2026-09-29T11:45:00.000Z',
    category: 'technology',
    city: 'Bengaluru',
    venue: 'Koramangala Tech Club'
  },
  {
    id: 'tx-fee-04',
    eventId: 'evt-custom-seed-04',
    eventTitle: 'Goa Sunset Yoga & Sound Meditation',
    userId: 'usr-u4',
    userName: 'Maya Sen',
    userEmail: 'maya@soulyoga.com',
    amount: 499,
    currency: 'INR',
    currencySymbol: '₹',
    paymentMethod: 'Paytm UPI',
    transactionId: 'UPI-PAYTM-661209',
    status: 'Paid',
    paidAt: '2026-09-30T09:20:00.000Z',
    category: 'festivals',
    city: 'Goa',
    venue: 'Anjuna Beach Lawn'
  },
  {
    id: 'tx-fee-05',
    eventId: 'evt-custom-seed-05',
    eventTitle: 'Delhi Underground Comedy Night',
    userId: 'usr-u5',
    userName: 'Vikram Malhotra',
    userEmail: 'vikram@delhistandup.com',
    amount: 499,
    currency: 'INR',
    currencySymbol: '₹',
    paymentMethod: 'BHIM UPI',
    transactionId: 'UPI-BHIM-552104',
    status: 'Paid',
    paidAt: '2026-10-01T08:10:00.000Z',
    category: 'comedy',
    city: 'Delhi',
    venue: 'Hauz Khas Social'
  }
];

export const EventsProvider = ({ children }) => {
  // Normalize event tiers so ticket tier prices start from ₹550 and stay capped at ₹1,500
  const normalizeEventTiers = (eventsList) => {
    if (!Array.isArray(eventsList)) return [];
    return eventsList.map((evt) => {
      if (!evt.ticketTypes || !Array.isArray(evt.ticketTypes)) return evt;
      const sanitizedTiers = evt.ticketTypes.map((tier, idx) => {
        let p = Number(tier.price) || 550;
        if (p > 1500) {
          p = idx === 0 ? 550 : idx === 1 ? 950 : 1450;
        } else if (p < 550) {
          p = 550;
        }
        return { ...tier, price: p };
      });
      return {
        ...evt,
        price: sanitizedTiers[0]?.price || 550,
        ticketTypes: sanitizedTiers
      };
    });
  };

  const [customEvents, setCustomEvents] = useState(() => {
    const raw = getFromStorage(STORAGE_KEYS.ORGANIZER_EVENTS, []);
    return normalizeEventTiers(raw);
  });

  const [reviewsMap, setReviewsMap] = useState(() => {
    return getFromStorage(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS_SEED);
  });

  const [recentlyViewedIds, setRecentlyViewedIds] = useState(() => {
    return getFromStorage(STORAGE_KEYS.RECENTLY_VIEWED, ['evt-001', 'evt-002', 'evt-003']);
  });

  // Organization Fees collected by Admin from users (in Indian Rupee ₹)
  const [organizationFees, setOrganizationFees] = useState(() => {
    const saved = getFromStorage(STORAGE_KEYS.ORGANIZATION_FEES);
    if (saved && Array.isArray(saved) && saved.length > 0) return saved;
    saveToStorage(STORAGE_KEYS.ORGANIZATION_FEES, INITIAL_ORGANIZATION_FEES);
    return INITIAL_ORGANIZATION_FEES;
  });

  // Admin platform organization fee (default: ₹499 INR)
  const [adminFeeAmount, setAdminFeeAmount] = useState(() => {
    const saved = getFromStorage(STORAGE_KEYS.ADMIN_SETTINGS);
    if (saved?.feeAmount) return Number(saved.feeAmount);
    return 499;
  });

  // Combined events list: custom organizer events placed first, then initial events
  const [allEvents, setAllEvents] = useState(() => {
    const raw = getFromStorage(STORAGE_KEYS.ORGANIZER_EVENTS, []);
    const normalized = normalizeEventTiers(raw);
    return [...normalized, ...INITIAL_EVENTS];
  });

  // Keep allEvents updated whenever customEvents changes
  useEffect(() => {
    setAllEvents([...customEvents, ...INITIAL_EVENTS]);
    saveToStorage(STORAGE_KEYS.ORGANIZER_EVENTS, customEvents);
  }, [customEvents]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.REVIEWS, reviewsMap);
  }, [reviewsMap]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.RECENTLY_VIEWED, recentlyViewedIds);
  }, [recentlyViewedIds]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ORGANIZATION_FEES, organizationFees);
  }, [organizationFees]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ADMIN_SETTINGS, { feeAmount: adminFeeAmount });
  }, [adminFeeAmount]);

  const getEventById = (id) => {
    return allEvents.find(e => String(e.id) === String(id));
  };

  // Record an organization fee transaction collected by Admin from a user
  const recordOrganizationFee = ({
    eventId,
    eventTitle,
    userId,
    userName,
    userEmail,
    paymentMethod = 'UPI',
    transactionId,
    amount = adminFeeAmount,
    category,
    city,
    venue
  }) => {
    const txId = transactionId || `TXN-ADM-${Date.now().toString().slice(-6)}`;
    const feeRecord = {
      id: `tx-fee-${Date.now()}`,
      eventId,
      eventTitle,
      userId: userId || 'usr-anonymous',
      userName: userName || 'Event Host',
      userEmail: userEmail || 'host@eventnest.com',
      amount: Number(amount) || adminFeeAmount,
      currency: 'INR',
      currencySymbol: '₹',
      paymentMethod,
      transactionId: txId,
      status: 'Paid',
      paidAt: new Date().toISOString(),
      category: category || 'music',
      city: city || 'Mumbai',
      venue: venue || 'Live Venue'
    };

    setOrganizationFees(prev => [feeRecord, ...prev]);
    return feeRecord;
  };

  const updateAdminFeeAmount = (newAmount) => {
    const validAmount = Math.max(0, Number(newAmount) || 0);
    setAdminFeeAmount(validAmount);
  };

  const createEvent = (newEventData) => {
    const id = `evt-custom-${Date.now()}`;
    const feeAmount = newEventData.adminFeePaid !== undefined ? newEventData.adminFeePaid : adminFeeAmount;

    const newEvent = {
      ...newEventData,
      id,
      rating: 5.0,
      reviewsCount: 0,
      trending: false,
      featured: false,
      availableSeats: newEventData.totalSeats || 100,
      adminFeePaid: feeAmount,
      adminFeeCurrency: 'INR',
      adminFeeCurrencySymbol: '₹',
      paymentStatus: newEventData.paymentStatus || 'Paid',
      transactionId: newEventData.transactionId || `TXN-ORG-${Date.now().toString().slice(-6)}`,
      organizedByUser: newEventData.organizedByUser !== undefined ? newEventData.organizedByUser : true,
      organizerEmail: newEventData.organizerEmail || 'user@eventnest.com',
      ticketTypes: newEventData.ticketTypes || [
        {
          id: 'gen',
          name: 'General Admission',
          price: Math.max(550, Math.min(750, Number(newEventData.price) || 550)),
          benefits: ['Standard Entry', 'Access to general areas'],
          available: newEventData.totalSeats || 100
        },
        {
          id: 'prem',
          name: 'Prime Pass',
          price: Math.min(1150, Math.max(750, Math.round((Number(newEventData.price) || 550) * 1.5))),
          benefits: ['Reserved mid-row seating', 'Complimentary refreshment'],
          available: 35
        },
        {
          id: 'vip',
          name: 'VIP Front Row Pass',
          price: Math.min(1500, Math.max(1150, Math.round((Number(newEventData.price) || 550) * 2))),
          benefits: ['Front row premium view', 'Priority entry', 'Free event merchandise'],
          available: 15
        }
      ],
      organizer: {
        name: newEventData.organizerName || 'EventNest Partner',
        verified: true,
        avatar: newEventData.organizerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        followers: '10K',
        bio: newEventData.organizerBio || 'Verified event organizer on EventNest.'
      },
      createdAt: new Date().toISOString()
    };

    setCustomEvents(prev => [newEvent, ...prev]);

    // If user paid admin organization fee, log it in organization fees
    if (newEventData.recordFee !== false) {
      recordOrganizationFee({
        eventId: id,
        eventTitle: newEvent.title,
        userId: newEventData.userId,
        userName: newEventData.organizerName,
        userEmail: newEventData.organizerEmail,
        paymentMethod: newEventData.paymentMethod || 'UPI',
        transactionId: newEvent.transactionId,
        amount: feeAmount,
        category: newEvent.category,
        city: newEvent.city,
        venue: newEvent.venue
      });
    }

    return newEvent;
  };

  const updateEvent = (id, updatedFields) => {
    setCustomEvents(prev =>
      prev.map(evt => (evt.id === id ? { ...evt, ...updatedFields } : evt))
    );
  };

  const deleteEvent = (id) => {
    setCustomEvents(prev => prev.filter(evt => evt.id !== id));
  };

  const duplicateEvent = (id) => {
    const target = allEvents.find(e => e.id === id);
    if (!target) return null;

    const cloned = {
      ...target,
      id: `evt-clone-${Date.now()}`,
      title: `${target.title} (Copy)`,
      createdAt: new Date().toISOString()
    };

    setCustomEvents(prev => [cloned, ...prev]);
    return cloned;
  };

  const addReview = (eventId, { rating, reviewText, userName }) => {
    const newRev = {
      id: `rev-${Date.now()}`,
      userName: userName || 'Event Attendee',
      rating: Number(rating) || 5,
      text: reviewText,
      date: new Date().toISOString().split('T')[0]
    };

    setReviewsMap(prev => {
      const existing = prev[eventId] || [];
      return {
        ...prev,
        [eventId]: [newRev, ...existing]
      };
    });

    setAllEvents(prev =>
      prev.map(evt => {
        if (evt.id === eventId) {
          const count = (evt.reviewsCount || 0) + 1;
          const currentRating = evt.rating || 5.0;
          const newAvg = Number(((currentRating * (count - 1) + rating) / count).toFixed(1));
          return {
            ...evt,
            rating: newAvg,
            reviewsCount: count
          };
        }
        return evt;
      })
    );
  };

  const trackRecentlyViewed = (eventId) => {
    if (!eventId) return;
    setRecentlyViewedIds(prev => {
      const filtered = prev.filter(id => id !== eventId);
      return [eventId, ...filtered].slice(0, 8);
    });
  };

  const recentlyViewedEvents = recentlyViewedIds
    .map(id => getEventById(id))
    .filter(Boolean);

  const totalOrganizationFees = organizationFees.reduce(
    (sum, fee) => sum + (Number(fee.amount) || 0),
    0
  );

  return (
    <EventsContext.Provider
      value={{
        events: allEvents,
        customEvents,
        getEventById,
        createEvent,
        updateEvent,
        deleteEvent,
        duplicateEvent,
        reviewsMap,
        addReview,
        trackRecentlyViewed,
        recentlyViewedEvents,
        // Organization Fee features (Indian Rupee ₹ INR)
        organizationFees,
        adminFeeAmount,
        totalOrganizationFees,
        updateAdminFeeAmount,
        recordOrganizationFee
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) throw new Error('useEvents must be used within EventsProvider');
  return context;
};
