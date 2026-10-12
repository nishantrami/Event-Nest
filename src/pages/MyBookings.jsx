import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Sparkles } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { BookingCard } from '../components/booking/BookingCard';
import { Button } from '../components/common/Button';

export const MyBookings = () => {
  const { cancelBooking, getUserBookings, bookings } = useBooking();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'completed' | 'cancelled'

  // Strictly filter bookings for the currently logged-in user
  const userBookings = getUserBookings ? getUserBookings(user) : bookings.filter((b) => {
    if (!user) return false;
    const targetEmail = user.email?.toLowerCase().trim();
    const bEmail = (b.userEmail || b.customer?.email)?.toLowerCase().trim();
    return (targetEmail && bEmail && targetEmail === bEmail) || (user.id && b.userId === user.id);
  });

  const filteredBookings = userBookings.filter((b) => b.status === activeTab);

  const tabs = [
    { id: 'upcoming', label: 'Upcoming', count: userBookings.filter((b) => b.status === 'upcoming').length },
    { id: 'completed', label: 'Completed', count: userBookings.filter((b) => b.status === 'completed').length },
    { id: 'cancelled', label: 'Cancelled', count: userBookings.filter((b) => b.status === 'cancelled').length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              Personal Passports & Tickets
            </span>
            {user && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900">
                {user.email}
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            My Bookings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your personal digital tickets, reserved seats, and verified entry passes.
          </p>
        </div>

        <Link to="/events">
          <Button variant="primary" size="sm" icon={Sparkles}>
            Explore More Events
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Bookings List or Empty State */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={cancelBooking}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-orange-50 dark:bg-orange-950 text-orange-500 mx-auto flex items-center justify-center">
            <Ticket className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            No {activeTab} bookings found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {activeTab === 'upcoming'
              ? `You currently have no upcoming bookings for ${user?.email || 'this account'}. Explore our live concerts, comedy specials, and events to reserve your seats.`
              : `You don’t have any ${activeTab} reservations.`}
          </p>
          {activeTab === 'upcoming' && (
            <Link to="/events">
              <Button variant="primary">Discover Experiences</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};
