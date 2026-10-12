import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { useEvents } from '../context/EventsContext';
import * as Icons from 'lucide-react';

export const Categories = () => {
  const { events } = useEvents();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Browse by Passion
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Explore Event Categories
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          From pulsating stadium EDM concerts and tear-inducing standup to high-stakes founder summits and culinary labs.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {CATEGORIES.map((cat) => {
          const IconComponent = Icons[cat.icon] || Icons.Sparkles;
          const count = events.filter((e) => e.category === cat.slug).length;

          return (
            <motion.div
              key={cat.id}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image banner */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                <img
                  src={cat.image}
                  alt={cat.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/60" />

                <div className="absolute top-4 left-4 p-2.5 rounded-2xl bg-white/20 backdrop-blur-md text-white border border-white/20">
                  <IconComponent className="w-5 h-5" />
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
                      {cat.featuredTag}
                    </span>
                    <h3 className="text-xl font-black">{cat.name}</h3>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md">
                    {count} Events
                  </span>
                </div>
              </div>

              {/* Description & Action */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {cat.description}
                </p>

                <Link
                  to={`/events?category=${cat.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500 hover:underline pt-2 border-t border-slate-100 dark:border-slate-800"
                >
                  <span>Explore {cat.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
