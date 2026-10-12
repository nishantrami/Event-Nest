import React, { useState } from 'react';
import {
  Mail,
  MapPin,
  CheckCircle2,
  Lock,
  Save
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { useFavorites } from '../context/FavoritesContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { bookings, getUserBookings } = useBooking();
  const { favoritesCount } = useFavorites();

  const userBookings = getUserBookings ? getUserBookings(user) : bookings;
  const upcomingCount = userBookings.filter((b) => b.status === 'upcoming').length;

  const [name, setName] = useState(user?.name || 'Nishant Rami');
  const [email, setEmail] = useState(user?.email || 'nishant@eventnest.com');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [city, setCity] = useState(user?.city || 'Mumbai');
  const [bio, setBio] = useState(user?.bio || 'Event curator, music festival enthusiast, and tech explorer.');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Security password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      phone,
      city,
      bio,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }
    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Profile Header Card (Only Name & Bio, No Photo) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {name}
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              Verified Member
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 justify-center sm:justify-start">
            <Mail className="w-3.5 h-3.5" /> {email} • <MapPin className="w-3.5 h-3.5" /> {city}
          </p>

          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md pt-1">
            "{bio}"
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center min-w-[90px]">
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 block">
              {userBookings.length}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Bookings
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center min-w-[90px]">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block">
              {upcomingCount}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Upcoming
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center min-w-[90px]">
            <span className="text-2xl font-black text-rose-500 block">
              {favoritesCount}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Favorites
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Personal Information Form */}
        <div className="lg:col-span-8 space-y-8">
          <form
            onSubmit={handleProfileSave}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Personal Information
                </h3>
                <p className="text-xs text-slate-500">
                  Update your contact details and account information.
                </p>
              </div>

              {saveSuccess && (
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Saved!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Input
                label="Primary City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <div className="sm:col-span-2 space-y-1.5 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Bio / Tagline
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900/80 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary" icon={Save}>
                Save Profile Changes
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Security & Preferences */}
        <div className="lg:col-span-4 space-y-6">
          {/* Security Card */}
          <form
            onSubmit={handlePasswordChange}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4"
          >
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-500" />
              Security & Password
            </h3>

            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <Input
              label="New Password"
              type="password"
              placeholder="Minimum 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            {passwordSuccess && (
              <p className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Password updated!
              </p>
            )}

            <Button type="submit" variant="secondary" size="sm" className="w-full">
              Update Password
            </Button>
          </form>

          {/* Account Badges */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              EventNest Badges
            </span>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                ⭐ Founding Explorer
              </span>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                🎟️ Verified Attendee
              </span>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                🌟 VIP Reviewer
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
