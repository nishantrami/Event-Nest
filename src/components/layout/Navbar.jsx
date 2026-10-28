import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Ticket,
  ShoppingBag,
  Search,
  Sun,
  Moon,
  Bell,
  User,
  PlusCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  CheckCheck,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useBooking } from '../../context/BookingContext';
import { useNotifications } from '../../context/NotificationContext';
import { SearchModal } from '../common/SearchModal';
import { Button } from '../common/Button';
import { dropdownVariants } from '../../animations/variants';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { totalCount: cartCount } = useCart();
  const { favoritesCount } = useFavorites();
  const { getUserBookings, bookings } = useBooking();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  // Active bookings for currently authenticated user
  const userBookings = user ? (getUserBookings ? getUserBookings(user) : bookings) : [];
  const bookingsCount = userBookings.filter((b) => b.status === 'upcoming').length;
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [showMobileNotifs, setShowMobileNotifs] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll effect on navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsNotifOpen(false);
    setShowMobileNotifs(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Discover', path: '/' },
    { label: 'Events', path: '/events' },
    { label: 'Categories', path: '/categories' },
    { label: 'Favorites', path: '/favorites', count: favoritesCount },
    { label: 'My Bookings', path: '/my-bookings', count: bookingsCount },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'glass-nav shadow-lg shadow-black/5 py-3'
            : 'bg-white/80 dark:bg-[#050814]/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-white/10 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-600/30 group-hover:scale-105 group-hover:shadow-rose-600/50 transition-all duration-300 shrink-0">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center">
                  Event<span className="text-gradient-rose">Nest</span>
                </span>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-bold -mt-0.5">
                  Live Experiences
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-slate-200/80 dark:border-white/10 shrink-0 shadow-inner">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `relative px-3 xl:px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-xs ring-1 ring-black/5 dark:ring-white/10'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
                    }`
                  }
                >
                  <span className="whitespace-nowrap">{link.label}</span>
                  {link.count > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shrink-0 shadow-xs shadow-rose-500/40">
                      {link.count}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Right Action Icons & Auth */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              
              {/* Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search events"
                className="flex items-center gap-1.5 sm:gap-2 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-900/80 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-white/10 transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4 text-slate-400" />
                <span className="hidden xl:inline">Search...</span>
                <kbd className="hidden xl:inline-block text-[10px] font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-400 shadow-2xs">
                  ⌘K
                </kbd>
              </button>

              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                className="relative p-2 sm:p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/80 dark:border-white/10 transition-all duration-200 cursor-pointer group active:scale-95"
              >
                <div className="relative w-4 h-4 flex items-center justify-center">
                  <motion.div
                    key={theme}
                    initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === 'dark' ? (
                      <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
                    ) : (
                      <Moon className="w-4 h-4 text-slate-700 group-hover:-rotate-12 transition-transform" />
                    )}
                  </motion.div>
                </div>
              </button>

              {/* Cart Button */}
              <Link
                to="/cart"
                aria-label="Shopping Cart"
                className="relative p-2 sm:p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/80 dark:border-white/10 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-black flex items-center justify-center shadow-md shadow-rose-500/40">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Notification Bell Dropdown (Shown on tablet/desktop, in drawer on mobile) */}
              <div className="hidden sm:block relative" ref={notifRef}>
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  aria-label="Notifications"
                  className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/80 dark:border-white/10 transition-colors cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
                  )}
                </button>

                <AnimatePresence>
                  {isNotifOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 p-4 z-50 overflow-hidden"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            Notifications
                          </h4>
                          {unreadCount > 0 && (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                          >
                            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 py-2">
                        {notifications.length > 0 ? (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => {
                                markAsRead(notif.id);
                                if (notif.link) {
                                 setIsNotifOpen(false);
                                  navigate(notif.link);
                                }
                              }}
                              className={`p-3 rounded-2xl transition-colors cursor-pointer ${
                                notif.read
                                  ? 'hover:bg-slate-50 dark:hover:bg-slate-800/40 opacity-70'
                                  : 'bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                              }`}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                                  {notif.title}
                                </h5>
                                <span className="text-[10px] text-slate-400 shrink-0">
                                  {notif.time}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                                {notif.message}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="py-8 text-center text-xs text-slate-400">
                            No notifications yet
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Avatar / Profile Dropdown */}
              {isAuthenticated ? (
                <div className="hidden sm:block relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    aria-label="User profile menu"
                    className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/80 dark:border-white/10 transition-colors cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 text-white text-xs font-black flex items-center justify-center shrink-0 shadow-xs">
                      {user?.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden sm:inline max-w-[120px] truncate">
                      {user?.name}
                    </span>
                    {user?.role === 'admin' && (
                      <span className="hidden sm:inline px-1.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[9px] font-black uppercase tracking-wider">
                        ADMIN
                      </span>
                    )}
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        variants={dropdownVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-xs sm:w-64 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 p-2 z-50"
                      >
                        {/* User Header */}
                        <div className="p-3 border-b border-slate-100 dark:border-slate-800/80">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                              {user?.name}
                            </h4>
                            {user?.role === 'admin' && (
                              <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                                ADMIN
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {user?.email}
                          </p>
                        </div>

                        {/* Menu Options */}
                        <div className="py-2 space-y-1 text-xs font-semibold">
                          <Link
                            to="/profile"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <User className="w-4 h-4 text-rose-500" />
                            <span>My Profile</span>
                          </Link>

                          <Link
                            to="/my-bookings"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Ticket className="w-4 h-4 text-rose-500" />
                            <span>My Bookings</span>
                          </Link>

                          <Link
                            to="/favorites"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Heart className="w-4 h-4 text-rose-500" />
                            <span>Saved Events ({favoritesCount})</span>
                          </Link>

                          {/* Conditional Admin vs User Sections */}
                          {user?.role === 'admin' ? (
                            <>
                              <div className="my-1 border-t border-slate-100 dark:border-slate-800/80" />
                              <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                                Admin Control Center
                              </div>
                              <Link
                                to="/admin"
                                onClick={() => setIsProfileOpen(false)}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-purple-700 dark:text-purple-300 bg-purple-50/70 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-950/70 transition-colors"
                              >
                                <LayoutDashboard className="w-4 h-4 text-purple-600" />
                                <span>Admin Panel (Full Control)</span>
                              </Link>

                              <Link
                                to="/organizer/events"
                                onClick={() => setIsProfileOpen(false)}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              >
                                <LayoutDashboard className="w-4 h-4 text-rose-500" />
                                <span>Catalog Events</span>
                              </Link>

                              <Link
                                to="/host-event"
                                onClick={() => setIsProfileOpen(false)}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              >
                                <PlusCircle className="w-4 h-4 text-rose-500" />
                                <span>Create Event</span>
                              </Link>
                            </>
                          ) : (
                            <>
                              <div className="my-1 border-t border-slate-100 dark:border-slate-800/80" />
                              <Link
                                to="/host-event"
                                onClick={() => setIsProfileOpen(false)}
                                className="flex items-center justify-between px-3 py-2 rounded-xl text-rose-700 dark:text-rose-300 bg-rose-50/70 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/70 transition-colors"
                              >
                                <div className="flex items-center gap-2.5">
                                  <PlusCircle className="w-4 h-4 text-rose-600" />
                                  <span>Host an Event</span>
                                </div>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300">
                                  ₹499 Fee
                                </span>
                              </Link>
                            </>
                          )}

                          <div className="my-1 border-t border-slate-100 dark:border-slate-800/80" />

                          <button
                            onClick={() => {
                              logout();
                              setIsProfileOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="primary" size="sm">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/80 dark:border-white/10 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-slate-200 dark:border-white/10 bg-white/98 dark:bg-[#050814]/98 backdrop-blur-2xl px-4 py-5 space-y-4 max-h-[85vh] overflow-y-auto"
            >
              {/* Mobile User Header or Auth Actions */}
              {isAuthenticated ? (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm shadow-rose-500/20">
                      {user?.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {user?.name}
                        </span>
                        {user?.role === 'admin' && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                            ADMIN
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
                        {user?.email}
                      </span>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-1.5 text-xs font-bold rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs shrink-0"
                  >
                    Profile
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                    <Button variant="outline" className="w-full text-xs font-bold justify-center">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                    <Button variant="primary" className="w-full text-xs font-bold justify-center">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}

              {/* Quick Utility Strip: Theme + Notifications */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {theme === 'dark' ? (
                      <Moon className="w-4 h-4 text-rose-400" />
                    ) : (
                      <Sun className="w-4 h-4 text-amber-500" />
                    )}
                    <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                  </div>
                  <span className="text-[10px] text-rose-600 dark:text-rose-400 uppercase font-mono">
                    Toggle
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowMobileNotifs(!showMobileNotifs)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl border text-xs font-bold transition-colors cursor-pointer ${
                    showMobileNotifs
                      ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                      : 'bg-slate-100 dark:bg-slate-900 border-slate-200/80 dark:border-white/10 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-slate-500" />
                    <span>Alerts</span>
                  </div>
                  {unreadCount > 0 ? (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                      {unreadCount}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-normal">0 new</span>
                  )}
                </button>
              </div>

              {/* Expandable Mobile Notifications List */}
              <AnimatePresence>
                {showMobileNotifs && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-2 overflow-hidden"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/70 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        Notifications ({unreadCount} unread)
                      </span>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={markAllAsRead}
                          className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold hover:underline cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-1.5 pr-0.5">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => {
                              markAsRead(notif.id);
                              if (notif.link) {
                                setIsMobileMenuOpen(false);
                                navigate(notif.link);
                              }
                            }}
                            className={`p-2.5 rounded-xl text-xs cursor-pointer transition-colors ${
                              notif.read
                                ? 'bg-white/80 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                                : 'bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/50 dark:border-rose-800/40 text-slate-900 dark:text-white'
                            }`}
                          >
                            <div className="flex justify-between items-center gap-1">
                              <span className="font-bold truncate">{notif.title}</span>
                              <span className="text-[9px] text-slate-400 shrink-0">{notif.time}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                              {notif.message}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-xs text-slate-400 py-3">No notifications yet</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-1 pt-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.path === '/'}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                      }`
                    }
                  >
                    <span>{link.label}</span>
                    {link.count > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-xs font-bold">
                        {link.count}
                      </span>
                    )}
                  </NavLink>
                ))}
              </nav>

              {/* Host & Admin Section */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/60"
                  >
                    <LayoutDashboard className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Admin Command Center</span>
                  </Link>
                )}

                <Link
                  to="/host-event"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold text-rose-700 dark:text-rose-300 bg-rose-50/80 dark:bg-rose-950/50 border border-rose-100 dark:border-rose-900/60"
                >
                  <div className="flex items-center gap-2.5">
                    <PlusCircle className="w-4 h-4 text-rose-600" />
                    <span>Host an Event</span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-200/80 dark:bg-rose-900 text-rose-800 dark:text-rose-200">
                    ₹499 Fee
                  </span>
                </Link>

                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};
