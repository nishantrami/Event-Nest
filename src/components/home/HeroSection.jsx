import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Sparkles,
  ArrowRight,
  MapPin,
  Calendar,
  Flame,
  Star,
  ShieldCheck,
  Zap,
  Ticket,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Music,
  Smile,
  Cpu,
  Trophy,
  X
} from 'lucide-react';
import { calculateCountdown } from '../../utils/formatDate';
import heroBg from '../../assets/hero-bg.jpg';

const CITIES = ['All Cities', 'Mumbai', 'Bengaluru', 'Delhi', 'Hyderabad', 'Goa', 'Kolkata'];

const QUICK_CATEGORIES = [
  { slug: 'music', name: 'Music', icon: Music, badge: 'Live DJ & Bands' },
  { slug: 'comedy', name: 'Standup', icon: Smile, badge: 'Top Comics' },
  { slug: 'technology', name: 'Tech & AI', icon: Cpu, badge: 'Summits' },
  { slug: 'sports', name: 'Sports', icon: Trophy, badge: 'Tournaments' }
];

export const HeroSection = ({ events = [] }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [isAudioVisualizerActive, setIsAudioVisualizerActive] = useState(true);

  // Spotlight events selection (first 4 featured, or first 4 events)
  const spotlightEvents = React.useMemo(() => {
    const featured = events.filter((e) => e.featured);
    return (featured.length > 0 ? featured : events).slice(0, 4);
  }, [events]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Active spotlight event
  const currentEvent = spotlightEvents[activeIndex] || events[0];

  // Auto rotation for featured events
  useEffect(() => {
    if (spotlightEvents.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % spotlightEvents.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [spotlightEvents.length, isPaused]);

  // Real-time countdown state for current event
  const [countdown, setCountdown] = useState(() =>
    calculateCountdown(currentEvent?.date, currentEvent?.time)
  );

  useEffect(() => {
    if (!currentEvent) return;
    const updateCountdown = () => {
      setCountdown(calculateCountdown(currentEvent.date, currentEvent.time));
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [currentEvent]);




  // Search Submission Handler
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.append('search', searchQuery.trim());
    }
    if (selectedCity && selectedCity !== 'All Cities') {
      params.append('city', selectedCity.toLowerCase());
    }
    if (params.toString()) {
      navigate(`/events?${params.toString()}`);
    } else {
      navigate('/events');
    }
  };

  const handleNextSpotlight = () => {
    setActiveIndex((prev) => (prev + 1) % spotlightEvents.length);
  };

  const handlePrevSpotlight = () => {
    setActiveIndex((prev) => (prev - 1 + spotlightEvents.length) % spotlightEvents.length);
  };

  return (
    <section className="relative flex items-center justify-center py-8 sm:py-14 lg:py-20 min-h-0 lg:min-h-[92vh] overflow-hidden bg-slate-950 text-white">
      {/* 1. Background Image with Cinematic Overlays */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <img
          src={heroBg}
          alt="Live Concert Crowd"
          className="w-full h-full object-cover object-center scale-105 filter brightness-90 contrast-105"
        />
        
        {/* Deep Multi-layer Gradient Mask */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/70" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-slate-950/60 to-slate-950/95" />

        {/* Ambient Stage Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-rose-500/15 rounded-full blur-3xl" />

        {/* Subtle Bottom Transition into page content */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent via-slate-950/80 to-slate-50 dark:to-slate-950" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* ================= LEFT COLUMN: Typography & Command Bar ================= */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-5 sm:space-y-7 text-center lg:text-left"
          >
            {/* Live Hub Glowing Radar Badge */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-lg shadow-black/20 max-w-full">
              <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-full w-full bg-red-500" />
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-white/90 truncate">The Ultimate Live Experience Hub</span>
              <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-white/40 shrink-0" />
              <span className="hidden sm:inline-block text-amber-300 font-semibold lowercase shrink-0">
                verified e-tickets
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white tracking-tight leading-[1.1]">
              Discover Your Next <br />
              <span className="bg-gradient-to-r from-red-500 via-rose-500 to-amber-400 bg-clip-text text-transparent drop-shadow-md">
                Experience.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Find concerts, workshops, sports, festivals and unforgettable experiences near you. Verified tickets, instant e-passes, zero hassles.
            </p>

            {/* Multi-Function Smart Command Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="w-full max-w-xl mx-auto lg:mx-0 backdrop-blur-2xl bg-white/10 dark:bg-slate-900/60 border border-white/20 dark:border-white/15 p-2 rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/40 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
            >
              {/* City Selector Dropdown */}
              <div className="flex items-center justify-between sm:justify-start gap-2 px-3 py-2 w-full sm:w-auto border-b sm:border-b-0 sm:border-r border-white/15 text-xs font-semibold text-slate-200 shrink-0">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-1"
                  >
                    {CITIES.map((city) => (
                      <option key={city} value={city} className="bg-slate-900 text-white">
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search Keyword Input */}
              <div className="flex items-center gap-2.5 px-3 py-1 sm:py-0 w-full flex-1">
                <Search className="w-4 h-4 text-red-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search concerts, comedy, tech, cities..."
                  className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none py-1.5"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Primary Explore Button */}
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-red-600/40 hover:shadow-red-600/60 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span>Explore Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Category Chips */}
            <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Popular:
              </span>
              {QUICK_CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <Link
                    key={cat.slug}
                    to={`/events?category=${cat.slug}`}
                    className="group inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 hover:text-white backdrop-blur-md transition-all active:scale-95"
                  >
                    <IconComponent className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform" />
                    <span>{cat.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Social Proof & Trust Stats */}
            <div className="pt-4 grid grid-cols-3 gap-2 sm:gap-4 max-w-md mx-auto lg:mx-0 border-t border-white/15">
              <div className="text-center sm:text-left">
                <span className="text-lg sm:text-2xl font-black text-white block">
                  30+
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
                  Live Events
                </span>
              </div>
              <div className="text-center sm:text-left">
                <span className="text-lg sm:text-2xl font-black text-white block">
                  50K+
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
                  Attendees
                </span>
              </div>
              <div className="text-center sm:text-left">
                <span className="text-lg sm:text-2xl font-black text-emerald-400 block">
                  100%
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
                  Verified Passes
                </span>
              </div>
            </div>
          </motion.div>

          {/* ================= RIGHT COLUMN: Interactive VIP Showcase Stage ================= */}
          {currentEvent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-5 relative w-full max-w-md mx-auto lg:max-w-none"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Event Switcher Mini-Tabs */}
              {spotlightEvents.length > 1 && (
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-1.5">
                    {spotlightEvents.map((evt, idx) => (
                      <button
                        key={evt.id}
                        onClick={() => setActiveIndex(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          idx === activeIndex
                            ? 'w-7 bg-red-500 shadow-xs shadow-red-500/50'
                            : 'w-2 bg-white/30 hover:bg-white/60'
                        }`}
                        title={evt.title}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={handlePrevSpotlight}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                      aria-label="Previous event"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleNextSpotlight}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                      aria-label="Next event"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Main VIP Spotlight Glass Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentEvent.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35 }}
                  className="relative backdrop-blur-2xl bg-slate-900/80 border border-white/20 rounded-3xl overflow-hidden shadow-2xl shadow-black/70 p-4 sm:p-5 space-y-4"
                >
                  {/* Event Stage Image Header */}
                  <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden group">
                    <img
                      src={currentEvent.image}
                      alt={currentEvent.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                    {/* Top Badges: Featured & Live Audio Equalizer */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-bold text-xs shadow-md">
                        <Flame className="w-3.5 h-3.5 fill-slate-950" />
                        <span>Featured Event</span>
                      </div>

                      {/* Equalizer Visualizer */}
                      <button
                        type="button"
                        onClick={() => setIsAudioVisualizerActive((prev) => !prev)}
                        className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold"
                        title="Live Stage Atmosphere"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-red-400" />
                        {isAudioVisualizerActive && (
                          <div className="flex items-end gap-0.5 h-3.5">
                            <span className="w-0.5 bg-red-400 rounded-full animate-eq-1" />
                            <span className="w-0.5 bg-rose-400 rounded-full animate-eq-2" />
                            <span className="w-0.5 bg-amber-400 rounded-full animate-eq-3" />
                            <span className="w-0.5 bg-red-400 rounded-full animate-eq-4" />
                            <span className="w-0.5 bg-rose-400 rounded-full animate-eq-5" />
                          </div>
                        )}
                        <span className="text-[10px] text-slate-300 uppercase tracking-wider">Live</span>
                      </button>
                    </div>

                    {/* Bottom Metadata */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400 block drop-shadow-sm">
                        {currentEvent.category} • {currentEvent.city}
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-white line-clamp-1 drop-shadow-md">
                        {currentEvent.title}
                      </h3>
                    </div>
                  </div>

                  {/* Real-time Glowing Countdown Box */}
                  <div className="p-3 sm:p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center space-y-2 sm:space-y-2.5">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-red-400" /> Event Starts In:
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-semibold text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                        Live Tracking
                      </span>
                    </div>

                    {/* Glowing LED Timer Grid */}
                    <div className="flex items-center justify-center gap-1 sm:gap-2.5">
                      <div className="flex flex-col items-center justify-center bg-slate-950/70 border border-white/15 rounded-xl px-1.5 sm:px-3 py-1.5 sm:py-2 min-w-[42px] sm:min-w-[60px] shadow-inner">
                        <span className="text-base sm:text-2xl font-black text-white tabular-nums">
                          {countdown.days}
                        </span>
                        <span className="text-[8px] sm:text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                          Days
                        </span>
                      </div>

                      <span className="text-red-500 font-bold text-sm sm:text-lg">:</span>

                      <div className="flex flex-col items-center justify-center bg-slate-950/70 border border-white/15 rounded-xl px-1.5 sm:px-3 py-1.5 sm:py-2 min-w-[42px] sm:min-w-[60px] shadow-inner">
                        <span className="text-base sm:text-2xl font-black text-white tabular-nums">
                          {countdown.hours}
                        </span>
                        <span className="text-[8px] sm:text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                          Hours
                        </span>
                      </div>

                      <span className="text-red-500 font-bold text-sm sm:text-lg">:</span>

                      <div className="flex flex-col items-center justify-center bg-slate-950/70 border border-white/15 rounded-xl px-1.5 sm:px-3 py-1.5 sm:py-2 min-w-[42px] sm:min-w-[60px] shadow-inner">
                        <span className="text-base sm:text-2xl font-black text-white tabular-nums">
                          {countdown.minutes}
                        </span>
                        <span className="text-[8px] sm:text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                          Mins
                        </span>
                      </div>

                      <span className="text-red-500 font-bold text-sm sm:text-lg">:</span>

                      <div className="flex flex-col items-center justify-center bg-slate-950/70 border border-red-500/30 rounded-xl px-1.5 sm:px-3 py-1.5 sm:py-2 min-w-[42px] sm:min-w-[60px] shadow-inner shadow-red-500/10">
                        <span className="text-base sm:text-2xl font-black text-red-400 tabular-nums">
                          {countdown.seconds}
                        </span>
                        <span className="text-[8px] sm:text-[9px] uppercase font-bold text-red-400/80 tracking-wider">
                          Secs
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Urgency Progress Bar */}
                  <div className="space-y-1 px-1">
                    <div className="flex justify-between text-[10px] sm:text-[11px] text-slate-300 font-medium">
                      <span className="flex items-center gap-1 text-amber-300 font-semibold">
                        <Zap className="w-3 h-3 fill-amber-300" /> Selling Fast
                      </span>
                      <span className="text-slate-400">88% Passes Booked</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-400 to-red-500 rounded-full w-[88%]" />
                    </div>
                  </div>

                  {/* Price & Book Button Action */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Passes From
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-white">
                        ₹{Number(currentEvent.price).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <Link to={`/events/${currentEvent.id}`}>
                      <button className="px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-red-600/40 hover:shadow-red-600/60 active:scale-95 transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer">
                        <Ticket className="w-4 h-4" />
                        <span>Book Tickets</span>
                      </button>
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Floating Social Proof Chip (Desktop only to prevent viewport overflow) */}
              <div className="absolute -bottom-5 -left-5 hidden lg:flex items-center gap-3 p-3 rounded-2xl bg-slate-900/90 border border-white/20 shadow-2xl backdrop-blur-xl animate-float-gentle">
                <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    4.9 / 5.0 Rating
                  </span>
                  <span className="text-[10px] text-slate-400">
                    From 10,000+ Reviews
                  </span>
                </div>
              </div>

              {/* Floating Verified Guarantee Tag (Desktop only) */}
              <div className="absolute -top-3 -right-3 hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/20 shadow-xl backdrop-blur-xl text-emerald-400 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Official Tickets</span>
              </div>
            </motion.div>
          )}

        </div>

        {/* ================= BOTTOM HERO VALUE STRIP ================= */}
        <div className="mt-10 sm:mt-14 pt-6 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 text-left">
          <div className="flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block truncate">Instant E-Passes</span>
              <span className="text-[10px] text-slate-400 block truncate">Instant QR sent to email</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block truncate">100% Guaranteed</span>
              <span className="text-[10px] text-slate-400 block truncate">Authorized partners</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block truncate">Top Rated</span>
              <span className="text-[10px] text-slate-400 block truncate">Over 50K happy fans</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <Ticket className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block truncate">Zero Hassle</span>
              <span className="text-[10px] text-slate-400 block truncate">Seamless gate entry</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

