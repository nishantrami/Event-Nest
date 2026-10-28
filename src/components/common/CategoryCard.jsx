import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

export const CategoryCard = ({ category }) => {
  // Dynamically resolve icon from lucide-react
  const IconComponent = Icons[category.icon] || Icons.Sparkles;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-300 aspect-4/3 min-h-[140px] sm:min-h-[170px] border border-transparent hover:border-white/20"
    >
      <Link to={`/events?category=${category.slug}`} className="block w-full h-full">
        {/* Background Image */}
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Multi-Stop Cinematic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-black/30 group-hover:from-slate-950/95 transition-all duration-300" />

        {/* Content */}
        <div className="absolute inset-0 p-3 sm:p-5 flex flex-col justify-between text-white z-10">
          <div className="flex items-center justify-between gap-1">
            <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 group-hover:bg-gradient-to-tr group-hover:from-rose-600 group-hover:to-amber-500 group-hover:border-rose-400 group-hover:scale-105 transition-all duration-300 shrink-0 shadow-sm">
              <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            {category.featuredTag && (
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 truncate max-w-[90px] sm:max-w-none text-slate-200">
                {category.featuredTag}
              </span>
            )}
          </div>

          <div>
            <h4 className="text-sm sm:text-lg font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors line-clamp-1">
              {category.name}
            </h4>
            <p className="text-[10px] sm:text-xs text-slate-300 line-clamp-1 mt-0.5 sm:mt-1 opacity-80">
              {category.description}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
