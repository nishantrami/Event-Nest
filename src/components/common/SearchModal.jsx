import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, ArrowRight, Tag, MapPin, Calendar, Sparkles } from 'lucide-react';
import { useEvents } from '../../context/EventsContext';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '../../utils/storage';
import { formatDate } from '../../utils/formatDate';
import { modalBackdropVariants, modalContentVariants } from '../../animations/variants';

const SUGGESTED_TAGS = ['EDM', 'Standup', 'AI', 'Football', 'Food', 'Bollywood', 'Workshop'];

export const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(() => {
    return getFromStorage(STORAGE_KEYS.SEARCH_HISTORY, ['Electronic Music', 'Standup', 'Bengaluru']);
  });
  const { events } = useEvents();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
  }, [isOpen]);

  const addSearchToHistory = (term) => {
    if (!term || !term.trim()) return;
    const trimmed = term.trim();
    const updated = [trimmed, ...recentSearches.filter(s => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    saveToStorage(STORAGE_KEYS.SEARCH_HISTORY, updated);
  };

  const clearHistory = () => {
    setRecentSearches([]);
    saveToStorage(STORAGE_KEYS.SEARCH_HISTORY, []);
  };

  const removeHistoryItem = (e, item) => {
    e.stopPropagation();
    const updated = recentSearches.filter(s => s !== item);
    setRecentSearches(updated);
    saveToStorage(STORAGE_KEYS.SEARCH_HISTORY, updated);
  };

  const handleSelectEvent = (event) => {
    addSearchToHistory(event.title);
    onClose();
    navigate(`/events/${event.id}`);
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    addSearchToHistory(query);
    onClose();
    navigate(`/events?search=${encodeURIComponent(query.trim())}`);
  };

  const handleTagClick = (tag) => {
    setQuery(tag);
    addSearchToHistory(tag);
  };

  // Filter matching events (max 5 in quick preview)
  const filteredEvents = query.trim()
    ? events.filter(evt => {
        const q = query.toLowerCase();
        return (
          evt.title.toLowerCase().includes(q) ||
          evt.category.toLowerCase().includes(q) ||
          evt.city.toLowerCase().includes(q) ||
          evt.venue.toLowerCase().includes(q) ||
          (evt.organizer?.name && evt.organizer.name.toLowerCase().includes(q)) ||
          evt.tags?.some(tag => tag.toLowerCase().includes(q))
        );
      }).slice(0, 5)
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 sm:pt-20 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            variants={modalBackdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            variants={modalContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center border-b border-slate-100 dark:border-slate-800 px-5 py-4">
              <Search className="w-5 h-5 text-indigo-500 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events, artists, venues, categories, cities..."
                className="w-full bg-transparent px-3 text-base sm:text-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full mr-2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-semibold px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
              >
                ESC
              </button>
            </form>

            {/* Results or Recommendations */}
            <div className="max-h-[60vh] overflow-y-auto p-5 space-y-6">
              {query.trim() ? (
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    <span>Matching Events ({filteredEvents.length})</span>
                    <button
                      onClick={handleSearchSubmit}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 normal-case"
                    >
                      View all results <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {filteredEvents.length > 0 ? (
                    <div className="space-y-2">
                      {filteredEvents.map(evt => (
                        <div
                          key={evt.id}
                          onClick={() => handleSelectEvent(evt)}
                          className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/70 cursor-pointer transition-colors group"
                        >
                          <img
                            src={evt.image}
                            alt={evt.title}
                            className="w-14 h-14 rounded-xl object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                              {evt.title}
                            </h4>
                            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-indigo-400" />
                                {formatDate(evt.date)}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                {evt.city}
                              </span>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-slate-900 dark:text-white shrink-0">
                            ₹{Number(evt.price || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <Sparkles className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                      <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                        No events found for "{query}"
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                        Try searching by category (e.g. Music, Comedy, Tech) or a city (e.g. Mumbai, Bengaluru).
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> Recent Searches
                        </span>
                        <button
                          onClick={clearHistory}
                          className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                        >
                          Clear All
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((item, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setQuery(item);
                              addSearchToHistory(item);
                            }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer transition-colors group"
                          >
                            <span>{item}</span>
                            <button
                              onClick={(e) => removeHistoryItem(e, item)}
                              className="text-slate-400 hover:text-rose-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Suggested Tags */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      <Tag className="w-3.5 h-3.5" /> Trending Searches
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTED_TAGS.map(tag => (
                        <button
                          key={tag}
                          onClick={() => handleTagClick(tag)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-slate-900/50 transition-colors"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
