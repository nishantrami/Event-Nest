import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-6">
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 blur-xl animate-pulse" />
          <span className="text-7xl font-black text-indigo-600 dark:text-indigo-400">
            404
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            The page you are looking for might have been moved, deleted, or never existed in the first place.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link to="/">
            <Button variant="primary" icon={Home}>
              Back to Home
            </Button>
          </Link>
          <Link to="/events">
            <Button variant="secondary">
              Browse Events
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
