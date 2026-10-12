import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Calendar,
  Grid,
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
import { useNotifications } from '../../context/NotificationContext';
import { SearchModal } from '../common/SearchModal';
import { Button } from '../common/Button';
import { dropdownVariants } from '../../animations/variants';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { totalCount: cartCount } = useCart();
  const { favoritesCount } = useFavorites();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
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
    { label: 'My Bookings', path: '/my-bookings' },
    { label: 'Contact', path: '/contact' },
  ];


  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'glass-nav shadow-sm py-3'
            : 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-600/25 group-hover:scale-105 transition-transform duration-300">
                <Sparkles className="w-5 h-5 fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                  Event<span className="text-red-600 dark:text-red-500">Nest</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-orange-500 font-semibold -mt-1">
                  Experiences
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 dark:bg-slate-900/60 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `relative px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-white dark:bg-slate-800 text-red-600 dark:text-red-500 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`
                  }
                >
                  {link.label}
                  {link.count > 0 && (
                    <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {link.count}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Right Action Icons & Auth */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              
              {/* Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search events"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span className="hidden md:inline">Search...</span>
                <kbd className="hidden md:inline-block text-[10px] font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-400">
                  ⌘K
                </kbd>
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle color theme"
                className="p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/80 dark:border-slate-800 transition-colors cursor-pointer"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-600" />
                )}
              </button>

              {/* Cart Button */}
              <Link
                to="/cart"
                aria-label="Shopping Cart"
                className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/80 dark:border-slate-800 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white text-[11px] font-black flex items-center justify-center shadow-sm shadow-red-600/40 animate-bounce">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Notification Bell Dropdown */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  aria-label="Notifications"
                  className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/80 dark:border-slate-800 transition-colors cursor-pointer"
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
                      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 overflow-hidden"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            Notifications
                          </h4>
                          {unreadCount > 0 && (
                            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
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
                                  : 'bg-indigo-50/50 dark:bg-indigo-950/20 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
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
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    aria-label="User profile menu"
                    className="flex items-center gap-2 px-3 py-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/80 dark:border-slate-800 transition-colors cursor-pointer"
                  >
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[130px] truncate">
                      {user?.name}
                    </span>
                    {user?.role === 'admin' && (
                      <span className="px-1.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[9px] font-black uppercase tracking-wider">
                        ADMIN
                      </span>
                    )}
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        variants={dropdownVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50"
                      >
                        {/* User Header (Only Name & Email) */}
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
                            <User className="w-4 h-4 text-indigo-500" />
                            <span>My Profile</span>
                          </Link>

                          <Link
                            to="/my-bookings"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Ticket className="w-4 h-4 text-indigo-500" />
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
                                to="/organizer"
                                onClick={() => setIsProfileOpen(false)}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-purple-700 dark:text-purple-300 bg-purple-50/70 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-950/70 transition-colors"
                              >
                                <LayoutDashboard className="w-4 h-4 text-purple-600" />
                                <span>Organizer Dashboard</span>
                              </Link>

                              <Link
                                to="/organizer/events"
                                onClick={() => setIsProfileOpen(false)}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              >
                                <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                                <span>Catalog Events</span>
                              </Link>

                              <Link
                                to="/host-event"
                                onClick={() => setIsProfileOpen(false)}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              >
                                <PlusCircle className="w-4 h-4 text-indigo-500" />
                                <span>Create Event</span>
                              </Link>
                            </>
                          ) : (
                            <>
                              <div className="my-1 border-t border-slate-100 dark:border-slate-800/80" />
                              <Link
                                to="/host-event"
                                onClick={() => setIsProfileOpen(false)}
                                className="flex items-center justify-between px-3 py-2 rounded-xl text-indigo-700 dark:text-indigo-300 bg-indigo-50/70 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-950/70 transition-colors"
                              >
                                <div className="flex items-center gap-2.5">
                                  <PlusCircle className="w-4 h-4 text-indigo-600" />
                                  <span>Host an Event</span>
                                </div>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
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
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left"
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
                className="lg:hidden p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/80 dark:border-slate-800 transition-colors"
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
              className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-5 py-6 space-y-4"
            >
              <nav className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.path === '/'}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
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

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                {user?.role === 'admin' && (
                  <Link
                    to="/organizer"
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/60"
                  >
                    <LayoutDashboard className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Admin Organizer Dashboard</span>
                  </Link>
                )}

                <Link
                  to="/host-event"
                  className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50"
                >
                  <div className="flex items-center gap-3">
                    <PlusCircle className="w-4 h-4" />
                    <span>Host an Event</span>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-200/60 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200">
                    ₹499 Fee
                  </span>
                </Link>
              </div>

              {!isAuthenticated && (
                <div className="pt-2 flex flex-col gap-2">
                  <Link to="/login" className="w-full">
                    <Button variant="outline" className="w-full">Sign In</Button>
                  </Link>
                  <Link to="/register" className="w-full">
                    <Button variant="primary" className="w-full">Get Started</Button>
                  </Link>
                </div>
              )}
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
