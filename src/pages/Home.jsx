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
  PlusCircle
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
    <div className="pb-20 overflow-hidden">
      {/* 1. Unique Immersive Hero Section */}
      <HeroSection events={events} />

      <div className="space-y-12 sm:space-y-16 lg:space-y-20 mt-10 sm:mt-16">

      {/* 2. Popular Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Categories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Whatever you love, find it here
            </h2>
          </div>
          <Link
            to="/categories"
            className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
          >
            All Categories <ArrowRight className="w-4 h-4" />
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
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handpicked Highlights</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Featured Events
            </h2>
          </div>
          <Link
            to="/events"
            className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      </section>

      {/* 4. Trending Near You Section */}
      <section className="bg-slate-100/60 dark:bg-slate-900/40 py-12 sm:py-16 border-y border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-wider mb-1">
                <Flame className="w-3.5 h-3.5" />
                <span>Selling Out Fast</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Trending Near You
              </h2>
            </div>
            <Link
              to="/events"
              className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
            >
              See All Trending <ArrowRight className="w-4 h-4" />
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
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
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
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            The EventNest Difference
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Why Millions Book on EventNest
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Built from the ground up for seamless discovery, bulletproof ticketing security, and unbeatable community experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              100% Guaranteed Official Passes
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every single ticket is verified directly with event producers. Zero scalpers, zero fake tickets, instant turnstile scan guarantee.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Interactive 3D Seat Selection
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Pick your exact seat, front-row pit, or VIP booth before paying. Real-time availability updates ensure you get the exact perspective you want.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
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
        <div className="relative rounded-3xl bg-slate-900 border-2 border-red-600 p-6 sm:p-10 lg:p-14 text-white overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> For Event Curators, Artists & Hosts
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Host Your Event on EventNest
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Reach over 500,000 passionate live experience seekers. Any verified user can organize and publish events with anti-fraud protection for a simple admin fee of only <strong className="text-yellow-400">₹499 (INR)</strong>.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <Link to="/host-event" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  icon={PlusCircle}
                  className="w-full sm:w-auto justify-center shadow-lg shadow-red-600/30"
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

