import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SlidersHorizontal, Sparkles, X, ArrowUpDown, Compass } from 'lucide-react';
import { useEvents } from '../context/EventsContext';
import { EventCard } from '../components/common/EventCard';
import { FilterPanel } from '../components/events/FilterPanel';
import { Button } from '../components/common/Button';
import { EventCardSkeleton } from '../components/common/Skeleton';

export const Events = () => {
  const { events } = useEvents();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters State
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get('category') || 'all');
  const [selectedCity, setSelectedCity] = useState(() => searchParams.get('city') || 'all');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [maxPrice, setMaxPrice] = useState(1500);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('popularity');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sync URL query params with state
  useEffect(() => {
    const q = searchParams.get('search');
    const cat = searchParams.get('category');
    const city = searchParams.get('city');
    if (q !== null) setSearchQuery(q);
    if (cat !== null) setSelectedCategory(cat);
    if (city !== null) setSelectedCity(city);
  }, [searchParams]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCity('all');
    setSelectedDateRange('all');
    setMaxPrice(1500);
    setMinRating(0);
    setSortBy('popularity');
    setSearchParams({});
  };

  // Filter & Sort Logic
  const filteredEvents = useMemo(() => {
    return events
      .filter((evt) => {
        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = evt.title.toLowerCase().includes(q);
          const matchesCategory = evt.category.toLowerCase().includes(q);
          const matchesCity = evt.city.toLowerCase().includes(q);
          const matchesVenue = evt.venue.toLowerCase().includes(q);
          const matchesOrganizer = evt.organizer?.name?.toLowerCase().includes(q);
          const matchesTags = evt.tags?.some((t) => t.toLowerCase().includes(q));
          if (!matchesTitle && !matchesCategory && !matchesCity && !matchesVenue && !matchesOrganizer && !matchesTags) {
            return false;
          }
        }

        // Category
        if (selectedCategory !== 'all' && evt.category !== selectedCategory) {
          return false;
        }

        // City
        if (selectedCity !== 'all' && evt.city.toLowerCase() !== selectedCity.toLowerCase()) {
          return false;
        }

        // Price
        if (evt.price > maxPrice) {
          return false;
        }

        // Rating
        if (minRating > 0 && (evt.rating || 0) < minRating) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'date') return new Date(a.date) - new Date(b.date);
        // Default: Popularity (Trending & Featured first)
        if (a.trending && !b.trending) return -1;
        if (!a.trending && b.trending) return 1;
        return (b.reviewsCount || 0) - (a.reviewsCount || 0);
      });
  }, [events, searchQuery, selectedCategory, selectedCity, maxPrice, minRating, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
            <Compass className="w-3.5 h-3.5" />
            <span>Event Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Explore All Events
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Showing {filteredEvents.length} authenticated events across concerts, comedy, summits, and arenas.
          </p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="flex items-center gap-3 lg:hidden">
          <Button
            variant="outline"
            size="sm"
            icon={SlidersHorizontal}
            onClick={() => setIsMobileFiltersOpen(true)}
          >
            Filters ({filteredEvents.length})
          </Button>
        </div>
      </div>

      {/* Main Content Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Desktop Left Sidebar: Filters */}
        <div className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-24">
          <FilterPanel
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedCity={selectedCity}
            onCityChange={setSelectedCity}
            selectedDateRange={selectedDateRange}
            onDateRangeChange={setSelectedDateRange}
            maxPrice={maxPrice}
            onMaxPriceChange={setMaxPrice}
            minRating={minRating}
            onMinRatingChange={setMinRating}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            onResetFilters={handleResetFilters}
            totalResults={filteredEvents.length}
          />
        </div>

        {/* Right Area: Event Cards Grid */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          
          {/* Active Filter Chips Bar */}
          {(selectedCategory !== 'all' || selectedCity !== 'all' || searchQuery || minRating > 0) && (
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 text-xs shadow-inner">
              <span className="text-slate-400 font-semibold mr-1">Active:</span>

              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 font-bold capitalize border border-rose-200 dark:border-rose-900/60 shadow-2xs">
                  {selectedCategory}
                  <X className="w-3 h-3 cursor-pointer hover:opacity-75" onClick={() => setSelectedCategory('all')} />
                </span>
              )}

              {selectedCity !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 font-bold border border-amber-200 dark:border-amber-900/60 shadow-2xs">
                  {selectedCity}
                  <X className="w-3 h-3 cursor-pointer hover:opacity-75" onClick={() => setSelectedCity('all')} />
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 font-bold border border-rose-200 dark:border-rose-900/60 shadow-2xs">
                  "{searchQuery}"
                  <X className="w-3 h-3 cursor-pointer hover:opacity-75" onClick={() => setSearchQuery('')} />
                </span>
              )}

              {minRating > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-700 shadow-2xs">
                  {minRating}+ Stars
                  <X className="w-3 h-3 cursor-pointer hover:opacity-75" onClick={() => setMinRating(0)} />
                </span>
              )}

              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline ml-auto cursor-pointer"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Grid of Events */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEvents.map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="py-20 text-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-3xl p-8 space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 mx-auto flex items-center justify-center border border-rose-500/20">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                No events match your criteria
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Try widening your price range, clearing specific filters, or searching for other cities.
              </p>
              <Button variant="primary" onClick={handleResetFilters}>
                Reset All Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFiltersOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-h-[85vh] bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-white/10 p-6 overflow-y-auto z-10 space-y-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Filter Events
                </h3>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <FilterPanel
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedCity={selectedCity}
                onCityChange={setSelectedCity}
                selectedDateRange={selectedDateRange}
                onDateRangeChange={setSelectedDateRange}
                maxPrice={maxPrice}
                onMaxPriceChange={setMaxPrice}
                minRating={minRating}
                onMinRatingChange={setMinRating}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                onResetFilters={handleResetFilters}
                totalResults={filteredEvents.length}
              />

              <Button
                variant="primary"
                className="w-full py-3 rounded-2xl"
                onClick={() => setIsMobileFiltersOpen(false)}
              >
                Apply Filters ({filteredEvents.length} Events)
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
