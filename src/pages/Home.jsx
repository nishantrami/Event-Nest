import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Flame,
  ShieldCheck,
  Zap,
  Headphones,
  LayoutDashboard,
  HelpCircle,
  PlusCircle,
  Compass
} from 'lucide-react';
import { useEvents } from '../context/EventsContext';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../data/categories';
import { EventCard } from '../components/common/EventCard';
import { CategoryCard } from '../components/common/CategoryCard';
import { Button } from '../components/common/Button';
import { HeroSection } from '../components/home/HeroSection';

export const Home = () => {
  const { events, recentlyViewedEvents = [] } = useEvents();
  const { user } = useAuth();

  const featuredEvents = events.filter((e) => e.featured).slice(0, 4);
  const trendingEvents = events.filter((e) => e.trending).slice(0, 4);

  return (
    <div className="pb-24 overflow-hidden">
      {/* 1. Unique Immersive Editorial Hero Section */}
      <HeroSection events={events} />

      <div className="space-y-16 sm:space-y-20 lg:space-y-24 mt-12 sm:mt-16">

        {/* 2. Popular Categories Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-[11px] font-bold uppercase tracking-widest">
                <Compass className="w-3.5 h-3.5" />
                <span>Explore Categories</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Whatever you love, find it here
              </h2>
            </div>
            <Link
              to="/categories"
              className="text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 inline-flex items-center gap-1 self-start sm:self-auto group"
            >
              <span>All Categories</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {CATEGORIES.slice(0, 8).map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </section>

        {/* 3. Featured Events Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-[11px] font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Handpicked Highlights</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Featured Events
              </h2>
            </div>
            <Link
              to="/events"
              className="text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 inline-flex items-center gap-1 self-start sm:self-auto group"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        </section>

        {/* 4. Trending Near You Section */}
        <section className="bg-slate-100/70 dark:bg-slate-900/40 py-14 sm:py-20 border-y border-slate-200/60 dark:border-white/10 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-amber-500 text-[11px] font-bold uppercase tracking-widest">
                  <Flame className="w-3.5 h-3.5 fill-amber-500" />
                  <span>Selling Out Fast</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  Trending Near You
                </h2>
              </div>
              <Link
                to="/events"
                className="text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 inline-flex items-center gap-1 self-start sm:self-auto group"
              >
                <span>See All Trending</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {trendingEvents.map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          </div>
        </section>

        {/* 5. Recently Viewed Events (Conditional) */}
        {Array.isArray(recentlyViewedEvents) && recentlyViewedEvents.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 sm:mb-8">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 block">
                  Jump back in
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Recently Viewed Events
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {recentlyViewedEvents.slice(0, 4).map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          </section>
        )}

        {/* 6. Why EventNest Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
              The EventNest Difference
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Why Millions Book on EventNest
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Built from the ground up for seamless discovery, bulletproof ticketing security, and unbeatable community experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm hover:shadow-xl hover:border-rose-500/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                100% Guaranteed Official Passes
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Every single ticket is verified directly with event producers. Zero scalpers, zero fake tickets, instant turnstile scan guarantee.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm hover:shadow-xl hover:border-amber-500/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Interactive 3D Seat Selection
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Pick your exact seat, front-row pit, or VIP booth before paying. Real-time availability updates ensure you get the exact perspective you want.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm hover:shadow-xl hover:border-purple-500/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                24/7 Dedicated Concierge
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Have an urgent question before the gates open? Our dedicated live support team is on standby to assist with re-issues, upgrades, and gates info.
              </p>
            </div>
          </div>
        </section>

        {/* 7. Organizer CTA Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-br from-[#060918] via-[#0d1430] to-[#060918] border border-white/20 p-8 sm:p-12 lg:p-16 text-white overflow-hidden shadow-2xl">
            {/* Ambient Background Glows */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl space-y-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider border border-rose-500/30">
                <Sparkles className="w-3.5 h-3.5" /> For Event Curators, Artists & Hosts
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Host Your Event on EventNest
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Reach over 500,000 passionate live experience seekers. Any verified user can organize and publish events with anti-fraud protection for a simple admin fee of only <strong className="text-amber-400 font-black">₹499 (INR)</strong>.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                <Link to="/host-event" className="w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="lg"
                    icon={PlusCircle}
                    className="w-full sm:w-auto justify-center"
                  >
                    Host an Event (₹499 Fee)
                  </Button>
                </Link>
                {user?.role === 'admin' ? (
                  <Link to="/organizer" className="w-full sm:w-auto">
                    <Button
                      variant="purple"
                      size="lg"
                      icon={LayoutDashboard}
                      className="w-full sm:w-auto justify-center font-bold tracking-wide"
                    >
                      Admin Organizer Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link to="/help" className="w-full sm:w-auto">
                    <Button
                      variant="glass"
                      size="lg"
                      icon={HelpCircle}
                      className="w-full sm:w-auto justify-center"
                    >
                      Pricing & Organizer FAQ
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
