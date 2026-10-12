import React from 'react';
import { Filter, RotateCcw, Search, Sparkles, MapPin, Calendar, DollarSign, Star } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { Button } from '../common/Button';

const CITIES = ['All Cities', 'Mumbai', 'Bengaluru', 'Delhi', 'Hyderabad', 'Kolkata', 'Goa'];
const DATE_RANGES = [
  { label: 'Any Date', value: 'all' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'This Month', value: 'month' },
];

export const FilterPanel = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedCity,
  onCityChange,
  selectedDateRange,
  onDateRangeChange,
  maxPrice,
  onMaxPriceChange,
  minRating,
  onMinRatingChange,
  sortBy,
  onSortByChange,
  onResetFilters,
  totalResults = 0,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-red-600" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Filters
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
            {totalResults}
          </span>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Search Input Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5" /> Search Event
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Keyword, artist, venue..."
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
        />
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" /> Category
        </label>
        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => onCategoryChange('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* City Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-orange-500" /> City
        </label>
        <select
          value={selectedCity}
          onChange={(e) => onCityChange(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
        >
          {CITIES.map((city) => (
            <option key={city} value={city === 'All Cities' ? 'all' : city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5" /> Max Price
          </span>
          <span className="text-red-600 dark:text-red-400 font-black normal-case text-sm">
            ₹{maxPrice.toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min="550"
          max="1500"
          step="50"
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
          className="w-full accent-red-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>₹550</span>
          <span>₹1,000</span>
          <span>₹1,500</span>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-yellow-500" /> Minimum Rating
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { label: 'All', value: 0 },
            { label: '4.0+', value: 4.0 },
            { label: '4.5+', value: 4.5 },
            { label: '4.8+', value: 4.8 },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => onMinRatingChange(item.value)}
              className={`py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                minRating === item.value
                  ? 'bg-yellow-400 text-slate-950 font-bold shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort By Dropdown */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Sort Events
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
        >
          <option value="popularity">Popularity / Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="date">Date: Earliest First</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>
    </div>
  );
};
