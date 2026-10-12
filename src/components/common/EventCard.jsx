import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Star, Heart, Flame, ArrowUpRight } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import { formatDate, formatTime } from '../../utils/formatDate';
import { Badge } from './Badge';
import { Button } from './Button';
import { heartPopVariants } from '../../animations/variants';

export const EventCard = ({ event, onQuickBook }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  const favorited = isFavorite(event.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(event.id);
  };

  const handleQuickBook = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickBook) {
      onQuickBook(event);
    } else {
      navigate(`/events/${event.id}?action=book`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col h-full"
    >
      {/* Event Image & Badges */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80';
          }}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Solid Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Category & Trending Badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-2 z-10">
          <Badge variant="glass" size="sm" className="capitalize">
            {event.category}
          </Badge>
          {event.trending && (
            <Badge variant="trending" size="sm" icon={Flame} className="bg-yellow-400 text-slate-950 font-black border-none shadow-sm">
              Trending
            </Badge>
          )}
        </div>

        {/* Favorite Heart Button */}
        <motion.button
          variants={heartPopVariants}
          initial="initial"
          whileTap="tap"
          animate={favorited ? 'active' : 'initial'}
          onClick={handleFavoriteClick}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          className={`absolute top-3.5 right-3.5 z-10 p-2.5 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
            favorited
              ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
              : 'bg-black/60 text-white hover:bg-black/80 hover:text-red-400'
          }`}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-white' : ''}`} />
        </motion.button>

        {/* Date & Time pill bottom left of image */}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs text-white/95 font-medium z-10">
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
            <Calendar className="w-3.5 h-3.5 text-orange-400" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-1 bg-yellow-400 text-slate-950 px-2 py-0.5 rounded-full font-black text-xs shadow-xs">
            <Star className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
            <span>{event.rating || 4.9}</span>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-2">
          {/* Location & Venue */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="truncate">{event.venue}, {event.city}</span>
          </div>

          {/* Event Title */}
          <Link to={`/events/${event.id}`} className="block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white line-clamp-2 leading-snug">
              {event.title}
            </h3>
          </Link>
        </div>

        {/* Card Footer: Price & CTA */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Starts From
            </span>
            <span className="text-lg font-black text-slate-900 dark:text-white">
              ₹{Number(event.price || 0).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link to={`/events/${event.id}`}>
              <Button size="sm" variant="secondary" className="rounded-xl">
                Details
              </Button>
            </Link>
            <Button
              size="sm"
              variant="primary"
              onClick={handleQuickBook}
              icon={ArrowUpRight}
              iconPosition="right"
              className="rounded-xl"
            >
              Book
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
