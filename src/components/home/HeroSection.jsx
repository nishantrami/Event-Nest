import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Sparkles,
  ArrowRight,
  MapPin,
  Flame,
  Star,
  ShieldCheck,
  Zap,
  Ticket,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Music,
  Smile,
  Cpu,
  Trophy,
  X,
  Radio,
  ArrowUpRight,
  QrCode,
  Compass
} from 'lucide-react';
import { calculateCountdown } from '../../utils/formatDate';
import heroBg from '../../assets/hero-bg.jpg';

const CITIES = ['All Cities', 'Mumbai', 'Bengaluru', 'Delhi', 'Hyderabad', 'Goa', 'Kolkata'];

const QUICK_CATEGORIES = [
  { slug: 'music', name: 'Concerts', icon: Music },
  { slug: 'comedy', name: 'Standup', icon: Smile },
  { slug: 'technology', name: 'Tech & AI', icon: Cpu },
  { slug: 'sports', name: 'Arenas', icon: Trophy }
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
    <section className="relative min-h-[95vh] flex flex-col justify-between overflow-hidden bg-[#040612] text-white select-none">
      
      {/* ================= 1. ATMOSPHERIC CANVASES & CINEMATIC BEAMS ================= */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Background stage image */}
        <img
          src={heroBg}
          alt="Concert stage atmosphere"
          className="w-full h-full object-cover object-center scale-110 filter brightness-[0.38] contrast-125 saturate-150"
        />

        {/* Multi-angle volumetric light sweeps */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#040612] via-[#040612]/75 to-[#040612]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040612] via-[#040612]/80 to-transparent" />
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-rose-600/20 rounded-full blur-[140px] animate-pulse-slow" />
        <div className="absolute top-1/3 -right-20 w-[550px] h-[550px] bg-indigo-600/25 rounded-full blur-[160px] animate-pulse-slow" />
        <div className="absolute -bottom-20 left-10 w-[450px] h-[450px] bg-amber-500/15 rounded-full blur-[130px]" />

        {/* Subtle grid mesh overlay */}
        <div className="absolute inset-0 bg-noise opacity-25" />
      </div>

      {/* ================= 2. ARCHITECTURAL TELEMETRY MASTHEAD ================= */}
      <div className="relative z-10 w-full border-b border-white/10 backdrop-blur-md bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono">
          {/* Telemetry Coordinates */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-400 font-bold text-[10px] tracking-wider uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
              STAGE TELEMETRY // 2026
            </span>
            <span className="hidden md:inline-block text-slate-400">
              MUMBAI 19.07° N • BENGALURU 12.97° N • DELHI 28.70° N
            </span>
          </div>

          {/* Audio Visualizer & Gate Status */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsAudioVisualizerActive((prev) => !prev)}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Toggle Live Stage Equalizer"
            >
              {isAudioVisualizerActive ? (
                <Volume2 className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              )}
              <span className="text-[10px] tracking-widest uppercase">
                {isAudioVisualizerActive ? '432Hz HARMONIC AUDIO' : 'AUDIO MUTED'}
              </span>
              {isAudioVisualizerActive && (
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 bg-rose-400 rounded-full animate-eq-1" />
                  <span className="w-0.5 bg-amber-400 rounded-full animate-eq-2" />
                  <span className="w-0.5 bg-rose-400 rounded-full animate-eq-3" />
                  <span className="w-0.5 bg-amber-400 rounded-full animate-eq-4" />
                </div>
              )}
            </button>

            <span className="hidden sm:inline-block text-white/20">•</span>

            <span className="hidden sm:flex items-center gap-1 text-emerald-400 font-semibold text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>TURNSTILE SCAN GUARANTEED</span>
            </span>
          </div>
        </div>
      </div>

      {/* ================= 3. AVANT-GARDE EDITORIAL HERO BODY ================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-6 sm:py-10 lg:py-12 space-y-8 lg:space-y-10">
        
        {/* TOP: Oversized Kinetic Editorial Typography Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-slate-200 text-xs font-bold uppercase tracking-widest backdrop-blur-xl">
              <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '16s' }} />
              Curated Arena Passes
            </span>
            <span className="text-xs font-mono text-slate-400">
              // NO SECONDARY MARKUPS • INSTANT E-PASS
            </span>
          </div>

          {/* High-Fashion Typography with Integrated Live Image Pill */}
          <div className="max-w-5xl">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[-0.04em] text-white uppercase leading-[0.95]">
              <span className="inline-flex items-center gap-2 sm:gap-4 flex-wrap">
                <span>WHERE</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-rose-400 to-amber-300">
                  SOUND
                </span>
                <span className="relative inline-block overflow-hidden rounded-2xl sm:rounded-3xl w-14 sm:w-20 md:w-24 h-8 sm:h-12 md:h-14 align-middle border border-white/25 shadow-xl shadow-rose-500/20">
                  <img
                    src={currentEvent?.image}
                    alt=""
                    className="w-full h-full object-cover scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </span>
              </span>
              <br />
              <span className="inline-flex items-center gap-2 sm:gap-4 flex-wrap">
                <span className="italic font-serif font-light text-slate-300 tracking-normal lowercase text-3xl sm:text-5xl md:text-6xl lg:text-7xl mr-1">
                  becomes
                </span>
                <span className="relative">
                  LEGEND.
                  <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-amber-400 rounded-full" />
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs normal-case tracking-normal">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  30+ Headline Shows Live
                </span>
              </span>
            </h1>
          </div>
        </div>

        {/* MIDDLE: Asymmetric Curator Stage & Holographic VIP Lanyard Pass */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* ================= LEFT: Holographic VIP Passbook Stub (5 cols) ================= */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <motion.div
              key={currentEvent?.id}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-3xl bg-slate-900/90 border border-white/20 p-5 sm:p-6 backdrop-blur-2xl shadow-2xl shadow-black/80 flex flex-col justify-between h-full space-y-5 overflow-hidden"
            >
              {/* Holographic Iridescent Foil Strip Header */}
              <div className="relative -mx-5 sm:-mx-6 -mt-5 sm:-mt-6 px-5 sm:px-6 py-3 bg-gradient-to-r from-rose-600 via-amber-400 to-rose-600 bg-[length:200%_auto] animate-shimmer flex items-center justify-between text-slate-950 font-black text-xs uppercase tracking-wider shadow-md">
                <div className="flex items-center gap-1.5">
                  <Ticket className="w-4 h-4 fill-slate-950" />
                  <span>OFFICIAL VIP STAGE PASS</span>
                </div>
                <span className="font-mono text-[10px] bg-slate-950/20 px-2 py-0.5 rounded-md">
                  AUTHENTICATED
                </span>
              </div>

              {/* Event Metadata Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-amber-400 font-bold">
                    {currentEvent?.category} // {currentEvent?.city}
                  </span>
                  <div className="flex items-center gap-1 text-slate-300 font-mono text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span className="truncate max-w-[160px]">{currentEvent?.venue}</span>
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                  {currentEvent?.title}
                </h3>
              </div>

              {/* Real-time Electronic Countdown Display */}
              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  <span className="flex items-center gap-1 text-rose-400">
                    <Radio className="w-3 h-3 animate-pulse" />
                    Turnstile Countdown
                  </span>
                  <span className="text-emerald-400 font-bold">GATES OPEN SOON</span>
                </div>

                <div className="grid grid-cols-4 gap-1.5 text-center">
                  <div className="p-1.5 rounded-xl bg-slate-900 border border-white/10">
                    <span className="block text-base sm:text-lg font-black font-mono text-white">
                      {countdown.days}
                    </span>
                    <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold">
                      DAYS
                    </span>
                  </div>
                  <div className="p-1.5 rounded-xl bg-slate-900 border border-white/10">
                    <span className="block text-base sm:text-lg font-black font-mono text-white">
                      {countdown.hours}
                    </span>
                    <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold">
                      HOURS
                    </span>
                  </div>
                  <div className="p-1.5 rounded-xl bg-slate-900 border border-white/10">
                    <span className="block text-base sm:text-lg font-black font-mono text-white">
                      {countdown.minutes}
                    </span>
                    <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold">
                      MINS
                    </span>
                  </div>
                  <div className="p-1.5 rounded-xl bg-slate-900 border border-rose-500/40 shadow-inner shadow-rose-500/20">
                    <span className="block text-base sm:text-lg font-black font-mono text-rose-400">
                      {countdown.seconds}
                    </span>
                    <span className="block text-[8px] uppercase tracking-wider text-rose-400/90 font-bold">
                      SECS
                    </span>
                  </div>
                </div>
              </div>

              {/* Perforated Tear Notch Line */}
              <div className="relative py-1 flex items-center justify-between">
                <div className="absolute -left-6 sm:-left-7 w-4 h-4 rounded-full bg-[#040612] border-r border-white/20" />
                <div className="w-full border-b border-dashed border-white/20" />
                <div className="absolute -right-6 sm:-right-7 w-4 h-4 rounded-full bg-[#040612] border-l border-white/20" />
              </div>

              {/* Dynamic QR & Scannable Barcode Token */}
              <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shrink-0">
                    <QrCode className="w-full h-full text-slate-950" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block truncate">
                      CRYPTO-SIGNED PASS
                    </span>
                    <span className="text-xs font-bold text-slate-200 block truncate">
                      INSTANT GATE SCAN
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                    PRICE
                  </span>
                  <span className="text-lg sm:text-xl font-black text-white">
                    ₹{Number(currentEvent?.price || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Pass Reservation CTA */}
              <Link to={`/events/${currentEvent?.id}`} className="block w-full">
                <button
                  type="button"
                  className="w-full py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-rose-600/40 hover:shadow-rose-600/60 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Ticket className="w-4 h-4" />
                  <span>CLAIM VIP PASS NOW</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </Link>
            </motion.div>
          </div>

          {/* ================= RIGHT: Main Stage Viewport & Switcher Rail (7 cols) ================= */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            
            {/* Cinematic Stage Screen Viewport */}
            <div
              className="relative aspect-16/10 sm:aspect-16/9 w-full rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-slate-950 group"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentEvent?.id}
                  src={currentEvent?.image}
                  alt={currentEvent?.title}
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.65, ease: 'easeOut' }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Multi-stop cinematic gradient over stage */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-black/30" />

              {/* Top Bar on Stage */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold uppercase tracking-wider shadow-md">
                    <Flame className="w-3.5 h-3.5 fill-white" />
                    <span>FEATURED HEADLINER</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 border border-white/15 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-300" />
                    <span>{currentEvent?.rating || 4.9}</span>
                  </span>
                </div>

                {/* Carousel Controls */}
                <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-xl border border-white/20">
                  <button
                    onClick={handlePrevSpotlight}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-white transition-colors cursor-pointer"
                    aria-label="Previous headliner"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] font-mono font-bold px-2 text-slate-300">
                    0{activeIndex + 1} / 0{spotlightEvents.length}
                  </span>
                  <button
                    onClick={handleNextSpotlight}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-white transition-colors cursor-pointer"
                    aria-label="Next headliner"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bottom Stage Text Overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-white z-10 space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                  <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                  <span>{currentEvent?.date} • {currentEvent?.city}</span>
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white line-clamp-1 drop-shadow-md">
                  {currentEvent?.title}
                </h2>
              </div>
            </div>

            {/* Interactive Headliner Switcher Rail */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {spotlightEvents.map((evt, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={evt.id}
                    onClick={() => setActiveIndex(idx)}
                    className={`relative p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      isActive
                        ? 'bg-white/15 border-rose-500/80 shadow-lg shadow-rose-500/20 ring-1 ring-rose-500/40'
                        : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    <img
                      src={evt.image}
                      alt={evt.title}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-amber-400 font-bold block truncate">
                        {evt.city}
                      </span>
                      <h4 className="text-xs font-bold text-white truncate">
                        {evt.title}
                      </h4>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>
        </div>

        {/* BOTTOM: Integrated Luxury Discovery Command Bar & Chips */}
        <div className="space-y-3 pt-2">
          <form
            onSubmit={handleSearchSubmit}
            className="w-full rounded-2xl sm:rounded-3xl p-2 bg-slate-900/90 backdrop-blur-2xl border border-white/20 shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 focus-within:border-rose-500/60 focus-within:ring-2 focus-within:ring-rose-500/20"
          >
            {/* City Dropdown Selector */}
            <div className="flex items-center gap-2 px-3 py-2 sm:py-1 border-b sm:border-b-0 sm:border-r border-white/15 shrink-0">
              <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent text-white text-xs sm:text-sm font-bold focus:outline-none cursor-pointer pr-1"
              >
                {CITIES.map((city) => (
                  <option key={city} value={city} className="bg-slate-900 text-white">
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Keyword Input */}
            <div className="flex items-center gap-2.5 px-3 py-1 flex-1 min-w-0">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search headliners, standup specials, summits, cities..."
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none py-1.5 font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 hover:bg-white/10 rounded-full text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>EXPLORE ALL EVENTS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Passion Chips */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                QUICK ACCESS:
              </span>
              {QUICK_CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <Link
                    key={cat.slug}
                    to={`/events?category=${cat.slug}`}
                    className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.14] border border-white/10 hover:border-white/25 text-slate-200 hover:text-white text-xs font-semibold backdrop-blur-md transition-all active:scale-95"
                  >
                    <IconComponent className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform" />
                    <span>{cat.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="hidden md:flex items-center gap-4 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1 text-slate-300">
                <Sparkles className="w-3 h-3 text-amber-400" /> 100% Turnstile Guaranteed
              </span>
              <span className="flex items-center gap-1 text-slate-300">
                <Zap className="w-3 h-3 text-rose-400" /> Direct Promoter Allocations
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ================= 4. KINETIC CONTINUOUS MARQUEE TAPE ================= */}
      <div className="relative z-10 w-full border-t border-white/10 bg-black/60 backdrop-blur-md py-3 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-[11px] font-mono font-bold tracking-widest text-slate-300 uppercase">
          <span>✦ LIVE IN MUMBAI: JIO WORLD GARDEN ARENA</span>
          <span className="text-rose-500">⚡ ZERO SERVICE FEES ON EARLY BIRD PASSES</span>
          <span>✦ LIVE IN BENGALURU: ELECTRONIC CITY EXPOCENTRE</span>
          <span className="text-amber-400">★ 4.9/5 RATED BY 50,000+ VERIFIED ATTENDEES</span>
          <span>✦ LIVE IN DELHI: INDIRA GANDHI ARENA</span>
          <span className="text-emerald-400">🛡️ 100% OFFICIAL TURNSTILE QR PASS GUARANTEE</span>
          <span>✦ LIVE IN GOA: HILLTOP VAGATOR ODYSSEY</span>
          <span className="text-rose-500">⚡ DIRECT PROMOTER ALLOCATIONS</span>
          {/* Loop repeat */}
          <span>✦ LIVE IN MUMBAI: JIO WORLD GARDEN ARENA</span>
          <span className="text-rose-500">⚡ ZERO SERVICE FEES ON EARLY BIRD PASSES</span>
          <span>✦ LIVE IN BENGALURU: ELECTRONIC CITY EXPOCENTRE</span>
          <span className="text-amber-400">★ 4.9/5 RATED BY 50,000+ VERIFIED ATTENDEES</span>
          <span>✦ LIVE IN DELHI: INDIRA GANDHI ARENA</span>
          <span className="text-emerald-400">🛡️ 100% OFFICIAL TURNSTILE QR PASS GUARANTEE</span>
          <span>✦ LIVE IN GOA: HILLTOP VAGATOR ODYSSEY</span>
          <span className="text-rose-500">⚡ DIRECT PROMOTER ALLOCATIONS</span>
        </div>
      </div>

    </section>
  );
};
