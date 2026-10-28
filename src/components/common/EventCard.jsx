import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Star, Heart, Flame, ArrowUpRight } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import { formatDate } from '../../utils/formatDate';
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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 hover:border-rose-500/40 dark:hover:border-rose-500/40 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-rose-500/10 dark:hover:shadow-rose-500/5 transition-all duration-300 flex flex-col h-full"
    >
      {/* Event Image & Badges */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-950">
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80';
          }}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Cinematic Multi-Stop Dark Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-black/30" />

        {/* Category & Trending Badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-2 z-10">
          <Badge variant="glass" size="sm" className="capitalize">
            {event.category}
          </Badge>
          {event.trending && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold text-[10px] uppercase tracking-wider shadow-sm">
              <Flame className="w-3 h-3 fill-white" />
              <span>Trending</span>
            </span>
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
          className={`absolute top-3.5 right-3.5 z-10 p-2.5 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer ${
            favorited
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/40 ring-2 ring-white/30'
              : 'bg-black/50 text-white hover:bg-black/80 hover:text-rose-400 border border-white/15'
          }`}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-white' : ''}`} />
        </motion.button>

        {/* Date & Rating Pill bottom of image */}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs text-white/95 font-medium z-10">
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
            <Calendar className="w-3.5 h-3.5 text-rose-400" />
            <span className="font-semibold text-[11px]">{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-1 bg-amber-400/90 text-slate-950 px-2 py-0.5 rounded-full font-black text-xs shadow-xs">
            <Star className="w-3 h-3 fill-slate-950 text-slate-950" />
            <span>{event.rating || 4.9}</span>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-2">
          {/* Location & Venue */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate font-medium">{event.venue}, {event.city}</span>
          </div>

          {/* Event Title */}
          <Link to={`/events/${event.id}`} className="block group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white line-clamp-2 leading-snug">
              {event.title}
            </h3>
          </Link>
        </div>

        {/* Card Footer: Price & CTA */}
        <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
              Starts From
            </span>
            <span className="text-lg font-black text-slate-900 dark:text-white">
              ₹{Number(event.price || 0).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link to={`/events/${event.id}`}>
              <Button size="sm" variant="secondary" className="rounded-xl font-semibold">
                Details
              </Button>
            </Link>
            <Button
              size="sm"
              variant="primary"
              onClick={handleQuickBook}
              icon={ArrowUpRight}
              iconPosition="right"
              className="rounded-xl font-semibold"
            >
              Book
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
