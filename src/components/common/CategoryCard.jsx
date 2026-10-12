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
      transition={{ duration: 0.25 }}
      className="group relative rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 aspect-4/3 min-h-[170px]"
    >
      <Link to={`/events?category=${category.slug}`} className="block w-full h-full">
        {/* Background Image */}
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Solid Dark Overlay */}
        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors" />

        {/* Content */}
        <div className="absolute inset-0 p-5 flex flex-col justify-between text-white z-10">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 group-hover:bg-red-600 transition-colors">
              <IconComponent className="w-5 h-5 text-white" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
              {category.featuredTag}
            </span>
          </div>

          <div>
            <h4 className="text-lg font-bold tracking-tight text-white group-hover:text-yellow-400 transition-colors">
              {category.name}
            </h4>
            <p className="text-xs text-slate-300 line-clamp-1 mt-1 opacity-90">
              {category.description}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
