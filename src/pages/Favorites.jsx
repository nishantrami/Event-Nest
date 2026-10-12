import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Trash2 } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useEvents } from '../context/EventsContext';
import { EventCard } from '../components/common/EventCard';
import { Button } from '../components/common/Button';

export const Favorites = () => {
  const { favorites, clearFavorites, favoritesCount } = useFavorites();
  const { events } = useEvents();

  // Find full event objects matching favorite IDs
  const favoritedEvents = events.filter((e) => favorites.includes(e.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-red-600">
            Wishlist & Saved
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1 flex items-center gap-2">
            Saved Experiences
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900">
              {favoritesCount}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Keep track of live events you're excited about.
          </p>
        </div>

        {favoritesCount > 0 && (
          <button
            onClick={clearFavorites}
            className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear All Favorites
          </button>
        )}
      </div>

      {/* Grid or Empty State */}
      {favoritedEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favoritedEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-red-50 dark:bg-red-950 text-red-600 mx-auto flex items-center justify-center">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Your Wishlist is Empty
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the heart icon on any event card to save it here for quick access later.
          </p>
          <Link to="/events">
            <Button variant="primary" icon={Sparkles}>
              Explore Events
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};
